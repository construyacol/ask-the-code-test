import { createSelector } from "reselect";
import { isEmpty } from 'lodash'
import { getIdentityState } from 'utils'
import { UI_NAMES } from 'const/uiNames'
import { convertToObjectWithCustomIndex } from "utils";




export const selectDepositAccountsByNetwork = createSelector(
  ({ modelData: { depositAccounts } }) => depositAccounts,
  (_, currency) => currency,
  (depositAccounts, currency) => {
    let res = {};
    if(!depositAccounts) return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps

    for (const [, depositAccount] of Object.entries(depositAccounts)) {
      if(depositAccount.currency === currency){
        res = {
          ...res, 
          [depositAccount.provider_type]:depositAccount
        }
      }
    }
    return res;
  }
);


export const selectDepositProvsByNetwork = createSelector(
  ({ modelData: { deposit_providers } }) => deposit_providers,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  (_, config) => config,
  (deposit_providers, currency) => {
    let res = {};
    if(!deposit_providers) return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    for (const [, deposit_provider] of Object.entries(deposit_providers)) {
        if(deposit_provider.currency === currency){
          res = {
            ...res,
            [deposit_provider.provider_type]:deposit_provider
          }
        }
    }
    return res;
  }
);


export const selectWithdrawAccounts = createSelector(
  ({ modelData: { withdraw_accounts } }) => withdraw_accounts,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  (_, config) => config,
  (withdraw_accounts, {currency, provider_type}) => {
    let res = [];
    if(!withdraw_accounts) return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    for (const [, withdraw_account] of Object.entries(withdraw_accounts)) {
        (withdraw_account.provider_type === provider_type && withdraw_account.currency === currency) && res.push(withdraw_account);
    }
    return res;
  }
);


export const selectWAccountsByAddressProvType = createSelector(
  (state) => state.modelData.withdraw_accounts,
  (_, accountProvider) => accountProvider,
  (withdraw_accounts, accountProvider) => {
    let result = {};
    for (let w_account_id in withdraw_accounts) {
      let address = withdraw_accounts[w_account_id]?.info?.address
      const byCurrency = withdraw_accounts[w_account_id]?.currency
      if ([byCurrency].includes(accountProvider?.currency) && address && withdraw_accounts[w_account_id]?.provider_type === accountProvider.provider_type) {
        result = {
          ...result,
          [address]: withdraw_accounts[w_account_id]
        };
      }
    }
    return result;
  }
);


export const selectWithdrawAccountsByAddress = createSelector(
  (state) => state.modelData.withdraw_accounts,
  (_, accountProvider) => accountProvider,
  (withdraw_accounts, accountProvider) => {
    let result = {};
    for (let w_account_id in withdraw_accounts) {
      let address = withdraw_accounts[w_account_id]?.info?.address
      const byCurrency = withdraw_accounts[w_account_id]?.currency
      if ([byCurrency].includes(accountProvider?.currency) && address) {
        result = {
          ...result,
          [address]: withdraw_accounts[w_account_id]
        };
      }
    }
    return result;
  }
);



export const wProvsByCurrencyNetwork = createSelector(
  (state) => state.modelData.withdrawProviders,
  (_, currency) => currency,
  (withdrawProviders, currency) => {
    let result = {};
    for (let provider_id in withdrawProviders) {
      if(withdrawProviders[provider_id].currency === currency){
        result = {
          ...result,
          [withdrawProviders[provider_id].provider_type]:withdrawProviders[provider_id]
        };
      }
    }
    return result;
  }
);


export const selectWithdrawProviderByName = createSelector(
  (state) => state.modelData.withdrawProviders,
  (withdrawProviders) => {
    let result = {};
    for (let provider_id in withdrawProviders) {
      result = {
        ...result,
        [withdrawProviders[provider_id].currency]:withdrawProviders[provider_id]
      };
    }
    return result;
  }
);


export const selectDepositProvsByCurrency = createSelector(
  ({ modelData }) => modelData.deposit_providers,
  (depositProviders) => depositProviders && convertToObjectWithCustomIndex(depositProviders, "depositAccount.currency")
);

export const selectWithdrawProvidersByName = createSelector(
    (state) => state.modelData.withdrawProviders,
    (withdrawProviders) => {
      if(!withdrawProviders)return []; 
      
      let _withdrawProviders = {}

      Object.keys(withdrawProviders).forEach(withProvKey => {
        const withdrawProvider = withdrawProviders[withProvKey];
        if(["fiat"].includes(withdrawProvider?.currency_type) && ["bank"].includes(withdrawProvider?.provider_type)){
          _withdrawProviders = {
            ..._withdrawProviders,
            [withdrawProvider?.provider?.name]:{
              ...withdrawProvider,
              uiName:withdrawProvider?.provider?.ui_name,
              value:withdrawProvider?.provider?.name
            }
          }
        }
      })

      return [ _withdrawProviders ];
    }
  );



  export const selectAvailableIdentities = createSelector(
    (state) => state?.modelData?.user?.identities,
    (identities) => {

      if(isEmpty(identities))return [ undefined, false ]; 
      let createNewId = true
      let userIdentities = {}
      identities.forEach(userIdentity => { 
        
        const identityState = getIdentityState(userIdentity)

        if(["pending", "confirmed"].includes(identityState))createNewId = false;
        if(["accepted", "confirmed"].includes(identityState)){
          userIdentities = { 
            ...userIdentities,
            [userIdentity?.document_info?.id_number]:{
              ...userIdentity,
              uiName:`${UI_NAMES?.documents[userIdentity?.id_type]}`,
              icon:"identity",
              enabled:["accepted"].includes(identityState),
              value:userIdentity?.document_info?.id_number,
            }
          }
        }
      })
      return [ userIdentities, createNewId ];
    }
  );


  export const selectAllIdentities = createSelector(
    (state) => state?.modelData?.user?.identities,
    (identities) => {

      if(isEmpty(identities))return [ undefined ]; 

      let userIdentities = {}

      identities.forEach(userIdentity => { 
        // const identityState = getIdentityState(userIdentity)
        // if(["accepted", "confirmed"].includes(identityState)){
          userIdentities = { 
            ...userIdentities,
            [userIdentity?.id]:{
              ...userIdentity,
              uiName:`${UI_NAMES?.documents[userIdentity?.id_type]}`,
              icon:"identity",
              enabled:true,
              // enabled:!["rejected"].includes(identityState),
              value:userIdentity?.document_info?.id_number,
            }
          }
        // }
      })
      return [ userIdentities ];
    }
  );