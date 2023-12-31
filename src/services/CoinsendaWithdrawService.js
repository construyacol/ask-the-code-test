import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import ungapStructuredClone from '@ungap/structured-clone';
import {
  loadLabels,
  GET_WITHDRAW_BY_USER_URL,
  WITHDRAW_PROVIDERS_URL,
  UPDATE_WITHDRAW_URL,
  NEW_WITHDRAW_URL,
  NEW_WITHDRAW_ACCOUNT_URL,
  GET_WITHDRAWS_BY_ACCOUNT_ID,
  DELETE_WITHDRAW_ACCOUNT_URL,
  PRIORITY_ENTITIES
} from "../const/const";
import {
  updateNormalizedDataAction,
  resetModelData,
} from "../actions/dataModelActions";
import normalizeUser from "../schemas";
import { 
  SentryCaptureException, 
  normalized_list  
} from '../utils'
import { isArray } from "lodash"; 
import { checkIfFiat } from 'core/config/currencies';

export class WithdrawService extends WebService {

  async fetchWithdrawAccounts(query = '{"where":{"visible":true, "state":{"inq":["in_progress", "complete", "pending"]} }}') {
    const { user } = this.globalState.modelData;
    await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_CUENTAS_DE_RETIRO));
    const finalUrl = `${GET_WITHDRAW_BY_USER_URL}/${user.id}/withdrawAccounts?country=${user.country}&filter=${query}`;
    const result = await this.Get(finalUrl);
    if (!result.length) {
      let userWithOutWA = {
        id: user.id,
        withdraw_accounts: [],
      };
      // TODO: create function to normalize user
      const toNormalize = await normalizeUser(userWithOutWA);
      await this.dispatch(updateNormalizedDataAction(toNormalize));
      document.querySelector('#home-container')?.classList?.add('wA')
      return this.dispatch(resetModelData({ withdraw_accounts: [] }));
    }
    if (!result || result === 465 || !this.withdrawProviders) {
      return false;
    }

    const providersServed = await this.withdrawProvidersByType;
    const withdrawAccounts = await result.map((account) => {
    
    const aux = providersServed[account?.currency][account?.provider_type];
    let providerData = {}
    const currencyType = checkIfFiat(aux?.currency) ? 'fiat' : 'crypto'
      if (checkIfFiat(aux?.currency)) {
        if(aux.provider_type === 'bank'){
          providerData = {
            account_number:{
              ui_name:aux.info_needed?.account_number?.ui_name,
              value:account.info.account_number
            },
            account_type:{
              ui_name:aux.info_needed?.account_type[account.info.account_type]?.ui_name,
              value:account.info.account_type
            },
            bank_name:{
              ui_name:aux.info_needed.bank_name[account.info.bank_name].ui_name,
              value:account.info.bank_name
            }
          }

        }else if(aux.provider_type === 'efecty_network'){
          providerData = {
            account_number:{
              ui_name:aux.info_needed?.id_number?.ui_name,
              value:account.info.id_number
            },
            account_type:{
              ui_name:account.info.id_type === 'cedula_ciudadania' ? 'Cédula de ciudadanía' : account.info.id_type,
              value:account.info.id_type
            },
            bank_name:{
              ui_name:aux.provider.ui_name,
              value:aux?.name
            }
          }
        }


        return {
          id: account.id,
          provider_name: account.info.bank_name || aux?.name,
          used_counter: account.used_counter,
          email: account.info.email,
          id_number: account.info.id_number,
          name: account.info.name,
          surname: account.info.surname,
          inscribed: account.used_counter > 0 ? true : false,
          visible: account.visible,
          provider_type: account.provider_type,
          provider_max_amount: aux.provider.max_amount,
          provider_min_amount: aux.provider.min_amount,
          currency_type: aux && currencyType,
          withdraw_provider: aux.id,
          ...providerData,
          ...account,
        };
      } else {

        // console.log('providersServed', providersServed)
        // console.log('data', account)
        // debugger
        //crypto case
        return {
          id: account.id,
          account_name: {
            ui_name: aux?.info_needed?.label?.ui_name,
            value: account?.info?.label,
          },
          account_address: {
            ui_name: aux?.info_needed?.address?.ui_name || aux?.info_needed?.identifier?.ui_name,
            value: account?.info?.address || account?.info?.identifier,
          },
          used_counter: account.used_counter,
          inscribed: account.used_counter > 0 ? true : false,
          visible: account.visible,
          provider_type: account.provider_type,
          provider_max_amount: aux.provider.max_amount,
          provider_min_amount: aux.provider.min_amount,
          currency_type: aux && currencyType,
          withdraw_provider: aux.id,
          ...account,
        };
      }
    });
    withdrawAccounts.reverse();
    const updatedUser = {
      id: user.id,
      withdraw_accounts: [...withdrawAccounts],
    };
    // if (await this.isCached("withdraw_accounts", result)) {
    //   return withdrawAccounts;
    // }

    // console.log('selectFiatWithdrawAccounts', withdrawAccounts)
    const normalizedUser = await normalizeUser(updatedUser);
    await this.dispatch(updateNormalizedDataAction(normalizedUser));
    document.querySelector('#home-container')?.classList?.add('wA')
    return withdrawAccounts;
  }

  async deleteAccount(accountId) {
    // const { withdraw_accounts } = this.globalState.modelData;
    const user = this.user;
    const body = {
      data: {
        withdraw_account_id: `${accountId}`,
        country:user.country,
        visible: false,
      },
    };

    // const deleteAccount = await this.Post(
    //   DELETE_WITHDRAW_ACCOUNT_URL,
    //   body 
    // );
    // return deleteAccount;
    
    return this._Post(DELETE_WITHDRAW_ACCOUNT_URL, body);
  }

  get withdrawProvidersByType() {
    let res = {}
    for (const [, withdrawProvider] of Object.entries(this.withdrawProviders)) {
      let itemsByCurrency = res[withdrawProvider?.currency] || {};
      res = {
        ...res,
        [withdrawProvider?.currency]:{
          ...itemsByCurrency,
          [withdrawProvider?.provider_type]:withdrawProvider
        }
      }
    }
    return res
  }
 

  async fetchNetworkData(withdraw_provider_id) {
    const { country } = this.user;
    const body = {
      data:{
        withdraw_provider_id,
        country
      }
    }
    const url = `${WITHDRAW_PROVIDERS_URL}/get-network-data?country=${country}`;
    return await this._Post(url, body);
  }


  // let filter = `{"where":{"withdraw_account_id":"${account_id}", "state":{"inq":["confirmed", "accepted", "rejected"]}}, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
  // const url_withdraw = `${GET_WITHDRAWS_BY_ACCOUNT_ID}/${user.id}/withdraws?country=${user.country}&filter=${filter}`;

  async fetchWithdrawProviders() {
    await this.dispatch(
      appLoadLabelAction(loadLabels.OBTENIENDO_PROVEEDORES_DE_RETIRO)
    );
    const user = this.user;
    if(user.level === 'level_0') return ;
    
    const finalUrl = `${WITHDRAW_PROVIDERS_URL}?country=${user.country}`;
    // const finalUrl = `${WITHDRAW_PROVIDERS_URL}?country=${user.country}&filter={"where": {"enabled": true}`;

    const withdrawProviders = await this.Get(finalUrl);
    if (!withdrawProviders) return;

    if (await this.isCached("withdrawProviders", withdrawProviders)) {
      return withdrawProviders;
    }

    const updatedUser = {
      id: user.id,
      withdrawProviders: [...withdrawProviders],
    };
    const normalizedUser = await normalizeUser(updatedUser);
    await this.dispatch(updateNormalizedDataAction(normalizedUser));
    this.withdrawProviders = withdrawProviders;
    return withdrawProviders;
  }
  
  async addWithdrawOrder(body, twoFaToken) {
    if(twoFaToken){
      body.data.twofa_token = twoFaToken;
    }
    const response = await this._Post(NEW_WITHDRAW_URL, body);
    if (response?.error){
      let errorMessage = !body.data.twofa_token ? "Dont send twofa_token" : response?.error?.message
        SentryCaptureException({message:errorMessage}, body)
    }
    return response;
  }


  createEfectyProv(_withdrawProviders) {
    let efectyProviderKey = Object.keys(_withdrawProviders).find(wAKey => ["efecty_network"].includes(_withdrawProviders[wAKey]?.provider_type))
    return {
      ..._withdrawProviders[efectyProviderKey],
      uiName:_withdrawProviders[efectyProviderKey]?.provider?.ui_name,
      value:_withdrawProviders[efectyProviderKey]?.provider?.name
    }
  } 

  async getBankList() {
    const { withdrawProviders } = this.globalState.modelData;
    let _withdrawProviders = typeof withdrawProviders === 'object' ? ungapStructuredClone(withdrawProviders) : {...withdrawProviders};
 
    let wProviderBanKey = Object.keys(_withdrawProviders).find(wAKey => ["bank"].includes(_withdrawProviders[wAKey]?.provider_type))
    let efectyProvider = this.createEfectyProv(_withdrawProviders)
    let bankList = _withdrawProviders[wProviderBanKey]?.info_needed?.bank_name
    Object.keys(bankList).forEach(bankKey => {
      if(PRIORITY_ENTITIES.includes(bankKey)){
        bankList = {
          [bankKey]:bankList[bankKey],
          ...bankList
        }
      }
    })
    if(efectyProvider){
      bankList = {
        [efectyProvider?.value]:{
          ...efectyProvider,
          name:efectyProvider?.provider?.ui_name
        },
        ...bankList
      }
    }

    return bankList
  }


  async getAccountTypeList(props) {

    const {
      info_needed,
      bankName
    } = props

    let infoNeeded = ungapStructuredClone(info_needed)
    const { 
      bank_name,
      account_type
    } = infoNeeded

    if(!bankName || !bank_name)return ;
    let list = bank_name[bankName]?.compatible_account_types
    let accountList = {}
    if(isArray(list)){
      list.forEach(accountKey => {
        accountList = {
          ...accountList,
          [accountKey]:account_type[accountKey]
        }
      })
    }
    return accountList
  }

  // async deleteWithdrawOrder(orderId) {
  //   return this.Delete(`${DELETE_WITHDRAW_URL}/${orderId}`);
  // }
 
  async createWithdrawAccount(body) {
    return await this._Post(
      NEW_WITHDRAW_ACCOUNT_URL,
      body 
    );
  } 
 

  async get_withdraws_by_withdraw_account(account_id, limit = 20, skip = 0) {
    const user = this.user;
    let filter = `{"where":{"withdraw_account_id":"${account_id}", "state":{"inq":["confirmed", "accepted", "rejected"]}}, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
    const url_withdraw = `${GET_WITHDRAWS_BY_ACCOUNT_ID}/${user.id}/withdraws?country=${user.country}&filter=${filter}`;
    return this.processListWithdraw(url_withdraw, account_id);
  }


  
  async get_withdraws(account_id, limit = 20, skip = 0) {
    const user = this.user;
    let filter = `{"where":{"account_id":"${account_id}", "state":{"inq":["confirmed", "accepted", "rejected"]} }, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
    const url_withdraw = `${GET_WITHDRAWS_BY_ACCOUNT_ID}/${user.id}/withdraws?country=${user.country}&filter=${filter}`;
    return this.processListWithdraw(url_withdraw, account_id);
  }


  async processListWithdraw(url_withdraw, account_id) {
    const withdraws = await this.Get(url_withdraw);
    if (!withdraws || (withdraws && withdraws.length < 1)) {
      return false;
    }
    // if (await this.isCached("withdraws", withdraws)) {
    //   return withdraws;
    // }

    let withdraws_remodeled = [];
    for (let withdraw of withdraws) {
      let state;
      
      if (checkIfFiat(withdraw?.currency)) {
        state = withdraw.state === "accepted" && !withdraw.sent
            ? "confirmed"
            : withdraw.state;
      }
      if (withdraw.currency_type === "crypto") {
        state = withdraw.state === "accepted" && (!withdraw.proof && !withdraw?.metadata?.is_internal)
            ? "confirmed"
            : withdraw.state;
      }

      let new_withdraw = {
        ...withdraw,
        state,
      };

      if (new_withdraw.state !== "pending") {
        withdraws_remodeled.push(new_withdraw);
      } 
    }

    withdraws_remodeled = this.parseActivty(
      withdraws_remodeled,
      "withdraws",
      account_id
    );
    await this.dispatch(normalized_list(withdraws_remodeled, "withdraws"));
    await this.updateActivityState(
      account_id,
      "withdraws",
      withdraws_remodeled
    );
    return withdraws_remodeled;
  }


  async getWithdrawById(id) {
    let withdraw
    let finalUrl = `${GET_WITHDRAW_BY_USER_URL}/${this.user.id}/withdraws?country=${this.user.country}&filter={"where": {"id":"${id}"} }`;
    try {
      withdraw = await this.Get(finalUrl);
    } catch (error) {
      return false
    }
    return withdraw[0];
  }
 
 
  async addUpdateWithdraw(withdraw_id, state) {
    const body = {
      data: {
        withdraw_id:withdraw_id, 
        state,
        country: this.user.country,
      },
    };
    return await this._Post(UPDATE_WITHDRAW_URL, body);
  }
}
 