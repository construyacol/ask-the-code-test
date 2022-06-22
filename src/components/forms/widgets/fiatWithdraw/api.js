import { mainService } from "../../../../services/MainService";
// import { recursiveAddList } from '../../utils'
// import { isEmpty } from 'lodash'
import {
  parseOnlyNumbers,
} from '../kyc/utils'


export const FIAT_WITHDRAW_TYPES = {
  FORM:"fiatWithdraw",
  WITHDRAW_ACCOUNT:"withdrawAccount",
  AMOUNT:"withdrawAmount",
}



const STAGES = {
  [FIAT_WITHDRAW_TYPES?.WITHDRAW_ACCOUNT]:{
      uiName:"¿En que cuenta quieres recibir tu retiro?",
      key:FIAT_WITHDRAW_TYPES?.WITHDRAW_ACCOUNT,
      uiType:"select",
      "settings":{
        defaultMessage:"",
      }
  },
  [FIAT_WITHDRAW_TYPES.AMOUNT]:{
    uiName:"¿Cuanto quieres retirar?",
    key:FIAT_WITHDRAW_TYPES.AMOUNT,
    uiType:"text",
    "settings":{
      defaultMessage:"",
      successPattern:/[0-9]/g,
      errors:[ 
          { pattern:/[^0-9.,]/g, message:'Solo se permiten valores númericos...' }
      ],
      // label:"Nacionalidad del documento:",
      placeholder:"Escribe la cantidad",
    }
  }  
} 


export const FIAT_WITHDRAW_COMPONENTS = {
  wrapperComponent:{
    [FIAT_WITHDRAW_TYPES.FORM]:FIAT_WITHDRAW_TYPES.FORM
  }
}

export const FIAT_WITHDRAW_STAGES = {
  [FIAT_WITHDRAW_TYPES.FORM]:STAGES
}

export const ApiGetFiatWithdrawStages = async() => {
    return STAGES
}

export const FIAT_WITHDRAW_DEFAULT_STATE = {
  // newWallet:{
  //   currency:{}
  // }
}

export const ApiGetTwoFactorIsEnabled = async() => {
  const txSecurity = await mainService.userHasTransactionSecurity();
  return txSecurity["2fa"]?.enabled
}

export const ApiPostWithdrawConfirm = async(_withdrawData) => {
  let withdrawData = await mainService.getWithdrawById(_withdrawData.id)
  if(!['pending'].includes(withdrawData?.state))return { error:{ message: "El retiro no se puede confirmar porque no está pendiente" } };
  let { error, data } = await mainService.addUpdateWithdraw(withdrawData.id, "confirmed");
  if(error)return {error};
  mainService.manageBalance(data.account_id, "reduce", data.amount);
  return { data }
}

 
export const ApiPostCreateFiatWithdraw = async(payload, tools) => {
  // const { withdraw_accounts } = mainService?.globalState?.modelData;
  const { 
    // withdrawProvider,
    currentWallet,
    withdrawAccount,
    withdrawAmount,
    twoFactorCode
  } = payload

  let body = {
    data:{
      country:"international",
      account_id:currentWallet?.id,
      amount:parseOnlyNumbers(withdrawAmount), 
      withdraw_account_id:withdrawAccount?.id,
      withdraw_provider_id:withdrawAccount?.withdraw_provider,
    }
  } 

  const res = await mainService.addWithdrawOrder(body, twoFactorCode);
  return res
  // if(res.data) await mainService.fetchWithdrawAccounts();
  // return res
}


