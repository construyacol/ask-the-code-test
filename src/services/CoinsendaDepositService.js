import { WebService } from "../actions/API/WebService";
import {
  UPDATE_DEPOSIT_URL,
  NEW_DEPOSIT_URL,
  loadLabels,
  DEPOSITS_URL,
  GET_DEPOSIT_BY_USERS_URL,
  SUBSCRIBE_TO_DEPOSITS_URL,
} from "../const/const";
import { appLoadLabelAction } from "../actions/loader";
import normalizeUser from "../schemas";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import { success_sound } from "../actions/soundActions";
import actions from "../actions";
import { normalized_list } from "../utils";
import sleep from 'utils/sleep'
import { isEmpty } from 'lodash'
// import { checkIfFiat } from 'core/config/currencies';


const { update_item_state } = actions;

export class DepositService extends WebService { 

  async fetchDepositProviders() {

    this.dispatch(
      appLoadLabelAction(loadLabels.OBTENIENDO_PROVEEDORES_DE_DEPOSITO)
    );
    const finalUrl = `${DEPOSITS_URL}users/${this.user.id}/depositProviders?country=${this.user.country}`;
    const response = await this.Get(finalUrl);
    if (!response) return;
    let updateState = true;
    const result = response
    const finalData = {
      id: this.user.id,
      deposit_providers: [...result],
    };
    const normalizedData = await normalizeUser(finalData);
    updateState && this.dispatch(updateNormalizedDataAction(normalizedData));
    document.querySelector('#home-container')?.classList?.add('dP')
    return normalizedData.entities.deposit_providers;
  }



  async createDeposit(body) {
    return await this._Post(NEW_DEPOSIT_URL, body);
  }

  


  async confirmDepositOrder(order_id, base64image) {
    const user = this.user;
    const body = {
      data: {
        country: user.country,
        deposit_id: order_id,
        state: "confirmed",
        // "account_id": account_id,
        proof_of_payment: {
          type: "image",
          proof: base64image,
        },
      },
    };
    return await this.Post(UPDATE_DEPOSIT_URL, body);
  }

  async addUpdateDeposit(deposit_id, state) {
    const user = this.user;
    const body = {
      data: { 
        country: user.country,
        deposit_id,
        state,
      },
    };
    return this._Post(UPDATE_DEPOSIT_URL, body);
  }


  async validateAddress(address) {
    const user = this.user;

    const finalUrl = `${GET_DEPOSIT_BY_USERS_URL}/${user.id}/depositProviders?country=${user.country}&filter={"where":{"account.account_id.account_id":"${address}" }}`;
    const res = await this.Get(finalUrl);
    if (isEmpty(res)) return;
    let Raddress = res[0] && res[0]?.account?.account_id?.account_id
    if (address === Raddress) {
      return true;
    }
    return false;
  }
  
  async getDepositAccounts() {
    const finalUrl = `${DEPOSITS_URL}depositAccounts?country=${this.user.country}&filter={"where": {"visible": true}}`;
    // const finalUrl = `${DEPOSITS_URL}depositAccounts?country=${this.user.country}`;
    const depositAccounts = await this.Get(finalUrl);
    if(isEmpty(depositAccounts))return;
    const normalizedData = await normalizeUser({
      id: this.user.id,
      depositAccounts: [...depositAccounts],
    });
    this.dispatch(updateNormalizedDataAction(normalizedData))
    return depositAccounts;
  }

  async getDepositById(id) {
    const finalUrl = `${GET_DEPOSIT_BY_USERS_URL}/${this.user.id}/deposits?country=${this.user.country}&filter={"where": {"id":"${id}"}, "include":{"relation":"paymentProof"}}`;
    const deposit = await this.Get(finalUrl);
    return deposit[0];
  }
 
  async createDepositProvider(account_id, country, depositAccountId ) {
    let body = {
      data: {
        account_id,
        country,
      },
    };
    if(depositAccountId){
      body.data.deposit_account_id = depositAccountId
    }
    const finalUrl = `${DEPOSITS_URL}depositProviders/create-deposit-provider-by-account-id`;
    const deposit_prov = await this.Post(finalUrl, body);
    if (deposit_prov === 465 || !deposit_prov) {
      return;
    }
    const { data } = deposit_prov;
    this.dispatch(success_sound());
    return data[0];
  }
 
  async createAndInsertDepositProvider(account, depositAccountId) {
    if (!account) return;
    const depProvider = await this.createDepositProvider(
      account.id,
      account.country,
      depositAccountId
    );
    const deposit_providers = await this.fetchDepositProviders();
    if (!depProvider) {
      return;
    }

    const update_wallet = {
      [account.id]: {
        ...account,
        dep_prov:Array.from(new Set([...account.dep_prov, depProvider?.id])),
        deposit_provider: deposit_providers[depProvider?.id],
      },
    };
    await this.dispatch(update_item_state(update_wallet, "wallets"));
    return depProvider;
  }

  async getDepositByAccountId(accountId, filter) {
    const finalUrl = `${GET_DEPOSIT_BY_USERS_URL}/${this.user.id}/deposits?country=${this.user.country}&filter={"where":{"account_id":"${accountId}"${filter ? `, ${filter}` : ""}}}`;
    const deposit = await this.Get(finalUrl);
    return deposit;
  }


   
  async subscribeToAllNewDeposits() {
    const { deposit_providers } = this.globalState?.modelData
    const { INITIAL_DEPOSIT_SUBSCRIBE_CURRENCY_LIST, EXCLUDED_NETWORK_COLLECTION } = await import('core/config/currencies')
    if(!deposit_providers)return ;
    for (const depProv in deposit_providers) {
      if(INITIAL_DEPOSIT_SUBSCRIBE_CURRENCY_LIST[deposit_providers[depProv]?.currency] && !EXCLUDED_NETWORK_COLLECTION[deposit_providers[depProv]?.provider_type]){
        await this.subscribeToNewDeposits(depProv)
        await sleep(2000)
      }
    }
  }

  async subscribeToNewDeposits(provider_id, account_id) {
    const user = this.user;
    const body = {
      data: {
        country: user.country,
        deposit_provider_id: provider_id,
        account_id
      },
    };
    return await this._Post(SUBSCRIBE_TO_DEPOSITS_URL, body);
  }

  async get_deposits(account_id, limit = 20, skip = 0) {
    // @params:
    // account_id
    const user = this.user;
    let filter = `{"where":{"account_id":"${account_id}"}, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
    const finalUrl = `${DEPOSITS_URL}users/${user.id}/deposits?country=${user.country}&filter=${filter}`;

    let deposits = await this.processDepositList(finalUrl)
    if(!deposits){return false}

    deposits = this.parseActivty(deposits, "deposits", account_id);
    await this.dispatch(normalized_list(deposits, "deposits"));
    await this.updateActivityState(account_id, "deposits", deposits);

    return deposits;
  }

  async get_referral_deposits(account_id, limit = 11, skip = 0) {
    // @params:
    const user = this.user;
    let filter = `{"where":{"info.is_referral":true}, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
    // const finalUrl = `${DEPOSITS_URL}users/${user.id}/deposits?country=${user.country}&filter={"limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
    const finalUrl = `${DEPOSITS_URL}users/${user.id}/deposits?country=${user.country}&filter=${filter}`;
    console.log('finalUrl', finalUrl)
    let deposits = await this.processDepositList(finalUrl)
    if(!deposits){return false}
    await this.dispatch(normalized_list(deposits, "deposits"));
    return deposits
  }



  async processDepositList(url){

    const deposits = await this.Get(url);
    if ((!deposits || deposits === 465) || (deposits && !deposits.length)) {
      return false;
    }

    let remodeled_deposits = await deposits.map((item, index) => {
      let new_item = {
        ...item,
        type_order: "deposit",
        // info:{
        //   is_referral:true
        // }
      };
      return new_item;
    });

    return remodeled_deposits

  }

}
