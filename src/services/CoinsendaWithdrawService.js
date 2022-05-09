import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import {
  loadLabels,
  GET_WITHDRAW_BY_USER_URL,
  WITHDRAW_PROVIDERS_URL,
  UPDATE_WITHDRAW_URL,
  NEW_WITHDRAW_URL,
  NEW_WITHDRAW_ACCOUNT_URL,
  GET_WITHDRAWS_BY_ACCOUNT_ID,
  DELETE_WITHDRAW_ACCOUNT_URL,
} from "../const/const";
import {
  updateNormalizedDataAction,
  resetModelData,
} from "../actions/dataModelActions";
import normalizeUser from "../schemas";
import { SentryCaptureException } from '../utils'

import { normalized_list } from "../utils";

export class WithdrawService extends WebService {

  async fetchWithdrawAccounts(query = '{"where":{"visible":true}}') {

    const { user } = this.globalState.modelData;
    await this.dispatch(
      appLoadLabelAction(loadLabels.OBTENIENDO_CUENTAS_DE_RETIRO)
    );
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
    const aux = providersServed[account.provider_type];
    let providerData = {}

      if (aux.currency_type === "fiat") {

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

        // if(['efecty_network'].includes(aux.provider_type)){
        //   console.log('aux', aux)
        //   console.log('providerData', providerData)
        // }


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
          currency_type: aux && aux.currency_type,
          withdraw_provider: aux.id,
          ...providerData,
          ...account,
        };
      } else {
        return {
          //crypto case
          id: account.id,
          account_name: {
            ui_name: aux.info_needed.label.ui_name,
            value: account.info.label,
          },
          account_address: {
            ui_name: aux.info_needed.address.ui_name,
            value: account.info.address,
          },
          used_counter: account.used_counter,
          inscribed: account.used_counter > 0 ? true : false,
          visible: account.visible,
          provider_type: account.provider_type,
          provider_max_amount: aux.provider.max_amount,
          provider_min_amount: aux.provider.min_amount,
          currency_type: aux && aux.currency_type,
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

    const deleteAccount = await this.Post(
      DELETE_WITHDRAW_ACCOUNT_URL,
      body
    );

    return deleteAccount;
  }

  get withdrawProvidersByType() {
    return (
      this.withdrawProviders &&
      this.withdrawProviders.reduce((result, provider) => {
        return {
          ...result,
          [provider.provider_type]: provider,
        };
      }, {})
    );
  }

  async fetchWithdrawProviders() {
    await this.dispatch(
      appLoadLabelAction(loadLabels.OBTENIENDO_PROVEEDORES_DE_RETIRO)
    );
    const user = this.user;
    if(user.verification_level === 'level_0') return ;

    const finalUrl = `${WITHDRAW_PROVIDERS_URL}?country=${user.country}`;

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
    const response = await this.Post(NEW_WITHDRAW_URL, body);
    if (!response || response === 465) {
      if(!body.data.twofa_token){
        SentryCaptureException({message:"Dont send twofa_token"}, body)
      }
      return false;
    }
    return response;
  }

  // async deleteWithdrawOrder(orderId) {
  //   return this.Delete(`${DELETE_WITHDRAW_URL}/${orderId}`);
  // }

  async addNewWithdrawAccount(payload, type) {
    const user = this.user;
    const {
      provider_type,
      name,
      surname,
      id_number, 
      short_name,
      account_number,
      account_type,
      currency,
      idTypes,
      id_type
    } = payload;

    let identity_id = id_type && idTypes[id_type]?.enabled && idTypes[id_type]?.id

    let body =
      type === "cripto"
        ? {
            data: {
              currency,
              info_needed:{
                ...payload,
                country:"colombia"
              },
              "country": user.country,
              provider_type
            },
          }
        :
          {
            "data": {
              "currency": currency,
              "info_needed":{
                "label":short_name,
                name,
                surname,
                id_type:user.id_type,
                id_number: id_number || user.id_number,
                bank_name:short_name,
                account_number,
                account_type,
                "country":"colombia",
                "email":user.email || "default@coinsendaDepositApiUrl.com",
              },
              "country": user.country,
              identity_id,
              provider_type
            } 
          };
    
    if(payload.bank_name === 'efecty'){
      body.data.info_needed = payload.info_needed
      body.data.identity_id = user?.identity.id
    }

    
    const response = await this.Post(
      NEW_WITHDRAW_ACCOUNT_URL,
      body
    );

    if (!response || response === 465) {
      return false;
    } 

    const { data } = response;

    return data;
  } 
  
   // async get_deposits(account_id, limit = 20, skip = 0) {
  //   // @params:
  //   // account_id
  //   const user = this.user;
  //   let filter = `{"where":{"account_id":"${account_id}"}, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
  //   const finalUrl = `${DEPOSITS_URL}users/${user.id}/deposits?country=${user.country}&filter=${filter}`;

  //   let deposits = await this.processDepositList(finalUrl)
  //   if(!deposits){return false}

  //   deposits = this.parseActivty(deposits, "deposits", account_id);
  //   await this.dispatch(normalized_list(deposits, "deposits"));
  //   await this.updateActivityState(account_id, "deposits", deposits);

  //   return deposits;
  // }


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
      if (withdraw.currency_type === "fiat") {
        state =
          withdraw.state === "accepted" && !withdraw.sent
            ? "confirmed"
            : withdraw.state;
      }
      if (withdraw.currency_type === "crypto") {
        state =
          withdraw.state === "accepted" && !withdraw.proof
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
    const response = await this.Post(UPDATE_WITHDRAW_URL, body);
    return response;
  }

  // async fetchActivityByAccount(accountId, page = 0, type = "withdraws") {
  //     const skip = page * 10
  //
  //     const _withdrawsQuery = `{"where":{"withdraw_account_id":"${accountId}"}, "limit": 10, "order":"id DESC", "skip": ${skip}}`
  //
  //     const query = _withdrawsQuery
  //
  //     const url = `${GET_WITHDRAWS_BY_ACCOUNT_ID}/${this.user.id}/${type}?country=${this.user.country}&filter=${query}`
  //
  //     let res = await this.Get(url)
  //
  //     let finalResult
  //     res = res ? res : []
  //
  //     finalResult = res.filter(item => item.state === 'accepted').map(withdraw => {
  //         // let state
  //         // if (withdraw.currency_type === 'fiat') {
  //         //     state = !withdraw.sent ? 'confirmed' : withdraw.state
  //         // }
  //         // if (withdraw.currency_type === 'crypto') {
  //         //     state = !withdraw.proof ? 'confirmed' : withdraw.state
  //         // }
  //
  //         return {
  //             ...withdraw,
  //             // state
  //             // comment: "",
  //             // deposit_provider_id: "",
  //             // expiration_date: new Date(),
  //             // // state,
  //             // unique_id: withdraw.id,
  //             // withdraw_account: withdraw.withdraw_account_id,
  //             // withdraw_provider: withdraw.withdraw_provider_id,
  //             // type_order: "withdraw",
  //             // withdraw_proof: withdraw.proof,
  //         }
  //     })
  //
  //     if(await this.isCached(type, res)) {
  //         return finalResult
  //     }
  //
  //     if (finalResult.length > 0) {
  //         await this.dispatch(normalized_list(finalResult, type))
  //     }
  //
  //     return finalResult
  // }
}
 