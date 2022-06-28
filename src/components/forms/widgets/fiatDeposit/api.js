import { mainService } from "../../../../services/MainService";
// import { recursiveAddList } from '../../utils'
// import { isEmpty } from 'lodash'
// import {
//   parseOnlyNumbers,
// } from '../kyc/utils'

export const FIAT_DEPOSIT_TYPES = {
  FORM:"fiatDeposit",
  STAGES:{
    SOURCE:"depositSource",
    AMOUNT:"depositAmount",
    PROVIDER:"depositProvider"
  }
}

const STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:{
    uiName:"¿Qué servicio utilizarás para hacer el depósito?",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER,
    uiType:"select",
    "settings":{
      defaultMessage:"",
    }
  },
  [FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE]:{
    uiName:"¿Cómo quieres depositar?",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE,
    uiType:"select",
    "settings":{
      defaultMessage:"",
    }
  },
  [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:{
    uiName:"¿Cuanto quieres depositar?",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT,
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


export const FIAT_DEPOSIT_COMPONENTS = {
  wrapperComponent:{
    [FIAT_DEPOSIT_TYPES.FORM]:FIAT_DEPOSIT_TYPES.FORM
  }
}

export const FIAT_DEPOSIT_STAGES = {
  [FIAT_DEPOSIT_TYPES.FORM]:STAGES
}

export const ApiGetOnFiatDepositStages = async() => {
  return STAGES
}

export const FIAT_DEPOSIT_DEFAULT_STATE = {
  // newWallet:{
  //   currency:{}
  // }
}

export const ApiPostCreateDeposit = async(body, tools) => {

  const { setLoader, nextStage } = tools
  setLoader(true)
  let res = await mainService.createDeposit(body);
  setLoader(false)
  if(!res) return;
  nextStage()
  return res

}


