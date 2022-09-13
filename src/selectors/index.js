import { createSelector } from "reselect";
import { isEmpty } from 'lodash'
import { getIdentityState } from 'utils'
import { UI_NAMES } from 'const/uiNames'


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