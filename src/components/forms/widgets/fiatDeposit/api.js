import { mainService } from "../../../../services/MainService";
// import { recursiveAddList } from '../../utils'
// import { isEmpty } from 'lodash'
import { AiFillBank } from "react-icons/ai";
import { BsCash } from "react-icons/bs";
import { createSelector } from "reselect";
import {
  parseOnlyNumbers,
} from '../kyc/utils'

export const FIAT_DEPOSIT_TYPES = {
  FORM:"fiatDeposit",
  STAGES:{
    SOURCE:"depositCost",
    AMOUNT:"depositAmount",
    PROVIDER:"depositProvider"
  }
}

const STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:{
    uiName:"¿Qué servicio utilizarás para depositar?",
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
  // [FIAT_DEPOSIT_TYPES.FORM]:{
  //   currency:{}
  // }
}

export const ApiPostCreateDeposit = async({ 
  state:{
    depositAmount,
    depositCost
  }, 
  currentWallet, 
  depositProvider }) => {

  let body = {
    data:{
      account_id:currentWallet?.id,
      amount:parseOnlyNumbers(depositAmount),
      comment:"",
      cost_id:depositCost?.value,
      country:currentWallet?.country,
      currency:depositProvider?.currency,
      deposit_provider_id:depositProvider?.id
    }
  }

  // console.log('|||||||||||||  ApiPostCreateDeposit ===> ', body)
  return await mainService.createDeposit(body);
}


export const DEPOSIT_COSTS = {
  otros_medios:{
    value:"otros_medios",
    Icon:AiFillBank,
    uiName:"Transferencia bancaria",
    metaData:[
      "Sucursal Virtual O APP",
      "Cajero Automático",
      "Sucursal Física"
    ]
  },
  en_efectivo:{
    value:"en_efectivo",
    Icon:BsCash,
    uiName:"En efectivo",
    metaData:[
      "Corresponsal Bancario",
      "Cajero Multifuncional",
      "Sucursal Física (Solo Efectivo)"
    ]
  } 
}


export const selectProviderData = createSelector(
  (depositProvider) => depositProvider,
  (depositProvider) => {
    if(!depositProvider)return [ null, null ];
    const _depositProvider = ["other_bank"].includes(depositProvider?.value) ? depositProvider?.defaultProv : depositProvider;
    const costs =  _depositProvider?.provider?.costs
    let costList = {}
    Object.keys(costs).forEach(cost => {
      costList = {
        ...costList,
        [cost]:DEPOSIT_COSTS[cost]
      }
    })
    return [ costList, _depositProvider ];
  }
);
