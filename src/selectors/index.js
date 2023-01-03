import { createSelector } from "reselect";
import { isEmpty } from 'lodash'
import { getIdentityState } from 'utils'
import { UI_NAMES } from 'const/uiNames'
import { convertToObjectWithCustomIndex } from "utils";


export const selectWithdrawAccountsByCurrency = createSelector(
  ({ modelData: { withdraw_accounts } }) => withdraw_accounts,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  (_, currency) => currency,
  (withdraw_accounts, currency) => {
    let res = [];
    if(!withdraw_accounts) return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    for (const [, withdraw_account] of Object.entries(withdraw_accounts)) {
      withdraw_account.currency === currency && res.push(withdraw_account);
    }
    return res;
  }
);


export const selectWithdrawAccountsByAddress = createSelector(
  (state) => state.modelData.withdraw_accounts,
  (_, current_wallet) => current_wallet,
  (withdraw_accounts, current_wallet) => {
    let result = {};
    for (let w_account_id in withdraw_accounts) {
      let address = withdraw_accounts[w_account_id]?.info?.address
      const byCurrency = withdraw_accounts[w_account_id]?.currency
      // const byProviderType = withdraw_accounts[w_account_id]?.provider_type
      if ([byCurrency].includes(current_wallet?.currency) && address) {
        result = {
          ...result,
          [address]: withdraw_accounts[w_account_id]
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
  (depositProviders) => depositProviders && convertToObjectWithCustomIndex(depositProviders, "depositAccount.name")
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