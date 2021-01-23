import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import {
  loadLabels,
  GET_WITHDRAW_BY_USER_URL,
  WITHDRAW_PROVIDERS_URL,
  UPDATE_WITHDRAW_URL,
  NEW_WITHDRAW_URL,
  DELETE_WITHDRAW_URL,
  NEW_WITHDRAW_ACCOUNT_URL,
  GET_WITHDRAWS_BY_ACCOUNT_ID,
  DELETE_WITHDRAW_ACCOUNT_URL,
} from "../const/const";
import {
  updateNormalizedDataAction,
  resetModelData,
} from "../actions/dataModelActions";
import normalizeUser from "../schemas";

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
      return this.dispatch(resetModelData({ withdraw_accounts: [] }));
    }
    if (!result || result === 465 || !this.withdrawProviders) {
      return false;
    }
    const providersServed = await this.withdrawProvidersByType;





    const withdrawAccounts = await result.map((account) => {
      const aux = providersServed[account.provider_type];
      if (aux.currency_type === "fiat") {
        return {
          id: account.id,
          account_number: {
            ui_name: aux.info_needed.account_number.ui_name,
            value: account.info.info_needed.account_number,
          },
          account_type: {
            ui_name:
              aux.info_needed.account_type[account.info.info_needed.account_type].ui_name,
            value: account.info.info_needed.account_type,
          },
          bank_name: {
            ui_name: aux.info_needed.bank_name[account.info.info_needed.bank_name].ui_name,
            value: account.info.info_needed.bank_name,
          },
          provider_name: account.info.info_needed.bank_name,
          used_counter: account.used_counter,
          email: account.info.info_needed.email,
          id_number: account.info.info_needed.id_number,
          name: account.info.info_needed.name,
          surname: account.info.info_needed.surname,
          inscribed: account.used_counter > 0 ? true : false,
          visible: account.visible,
          provider_type: account.provider_type,
          provider_max_amount: aux.provider.max_amount,
          provider_min_amount: aux.provider.min_amount,
          currency_type: aux && aux.currency_type,
          withdraw_provider: aux.id,
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

    if (await this.isCached("withdraw_accounts", result)) {
      return withdrawAccounts;
    }

    const normalizedUser = await normalizeUser(updatedUser);
    await this.dispatch(updateNormalizedDataAction(normalizedUser));
    return withdrawAccounts;
  }

  async deleteAccount(accountId) {
    const { withdraw_accounts } = this.globalState.modelData;
    const user = this.user;
    const body = {
      data: {
        withdraw_account_id: `${accountId}`,
        country:
          withdraw_accounts[accountId] &&
          withdraw_accounts[accountId].info.country,
        visible: false,
      },
    };

    const deleteAccount = await this.Post(
      DELETE_WITHDRAW_ACCOUNT_URL,
      body,
      user.userToken
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
    if (twoFaToken) {
      body.data.twofa_token = twoFaToken;
    }
    // console.log(body)

    const response = await this.Post(NEW_WITHDRAW_URL, body);
    if (!response || response === 465) {
      return false;
    }

    return response;
  }

  async deleteWithdrawOrder(orderId) {
    return this.Delete(`${DELETE_WITHDRAW_URL}/${orderId}`);
  }

  async addNewWithdrawAccount(payload, type) {
    const user = this.user;
    const {
      provider_type,
      name,
      surname,
      id_number,
      id_type,
      short_name,
      account_number,
      account_type,
      city,
      currency,
    } = payload;

    const body =
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
                id_type,
                id_number: id_number || user.id_number,
                bank_name:short_name,
                account_number,
                account_type,
                "country":"colombia",
                "email":user.email || "default@coinsendaDepositApiUrl.com",
              },
              "country": user.country,
              provider_type
            }
          };

          console.log('|||||||||||||||||||||||||| addNewWithdrawAccount: ', body)

    const response = await this.Post(
      NEW_WITHDRAW_ACCOUNT_URL,
      body,
      user.userToken
    );

    if (!response || response === 465) {
      return false;
    }

    const { data } = response;

    return data;
  }

  async get_withdraws(account_id, limit = 20, skip = 0) {
    const user = this.user;
    let filter = `{"where":{"account_id":"${account_id}"}, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
    const url_withdraw = `${GET_WITHDRAWS_BY_ACCOUNT_ID}/${user.id}/withdraws?country=${user.country}&filter=${filter}`;
    return this.processListWithdraw(url_withdraw, account_id);
  }

  async get_withdraws_by_withdraw_account(account_id, limit = 20, skip = 0) {
    const user = this.user;
    let filter = `{"where":{"withdraw_account_id":"${account_id}"}, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
    const url_withdraw = `${GET_WITHDRAWS_BY_ACCOUNT_ID}/${user.id}/withdraws?country=${user.country}&filter=${filter}`;
    return this.processListWithdraw(url_withdraw, account_id);
  }

  async processListWithdraw(url_withdraw, account_id) {
    const withdraws = await this.Get(url_withdraw);
    if (withdraws && withdraws.length < 1) {
      return false;
    }
    if (await this.isCached("withdraws", withdraws)) {
      return withdraws;
    }
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
    // debugger
    await this.dispatch(normalized_list(withdraws_remodeled, "withdraws"));
    await this.updateActivityState(
      account_id,
      "withdraws",
      withdraws_remodeled
    );
    return withdraws_remodeled;
  }

  async addUpdateWithdraw(withdrawId, state) {
    const body = {
      data: {
        withdraw_id: withdrawId,
        state: state,
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
