import { mainService } from "../../../../services/MainService";
// import { recursiveAddList } from '../../utils'
// import { isEmpty } from 'lodash'
import { AiFillBank } from "react-icons/ai";
import { BsCash } from "react-icons/bs";
import { createSelector } from "reselect";
import {
  parseOnlyNumbers,
} from '../kyc/utils'
import ungapStructuredClone from '@ungap/structured-clone';

import { 
  createStage, 
  recursiveAddList
} from 'components/forms/utils'

export const FIAT_DEPOSIT_TYPES = {
  FORM:"fiatDeposit",
  STAGES:{
    SOURCE:"depositCost",
    BANK_NAME:"bank_name",
    AMOUNT:"depositAmount", 
    PROVIDER:"depositAccount",
    PERSON_TYPE:"person_type",
    CRYPTO:"depositCripto"
  }
}

const DEFAULT_DEPOSIT_AMOUNT = {
  uiName:"¿Cuanto quieres depositar?",
  key:FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT,
  uiType:"text",
  "settings":{
    defaultMessage:"",
    successPattern:/[0-9]/g,
    errors:[ 
        { pattern:/[^0-9.,]/g, message:'Solo se permiten valores númericos...' }
    ],
    placeholder:"Escribe la cantidad",
  }
}


const PSE_STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]:{
    uiName:"Elije el banco por el cual harás el pago",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME,
    uiType:"select",
    "settings":{
      defaultMessage:"",
      placeholder:"Escribe el nombre de tu banco"
    }
  },
  [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:DEFAULT_DEPOSIT_AMOUNT
}


const BANK_DEFAULT_STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE]:{
    ui_type:"select"
  },
  [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:{
    ui_type:"text"
  }
}


const BANK_STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE]:{
    uiName:"¿Cómo quieres depositar?",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE,
    uiType:"select",
    "settings":{
      defaultMessage:"",
    }
  },
  [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:DEFAULT_DEPOSIT_AMOUNT
}



const STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:{
    uiName:"¿Qué banco ó servicio utilizarás para depositar?",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER,
    uiType:"select",
    "settings":{
      defaultMessage:"",
    }
  }  
} 

const CRYPTO_STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO]:{
    // uiName:"",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO,
    uiType:"text",
    value:FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO,
    "settings":{
      defaultMessage:"",
      breadCumbConfig:{
        childLabel:"A billetera DCOP",
        active:true
      },
      config:{
        hideStatusPanel:true
      },
      queryParams:{
        form:'deposit_crypto'
      }
    }
  }
}


const DEPOSIT_TYPE_STAGES = {
  pse:PSE_STAGES,
  bank:BANK_STAGES,
  ethereum_testnet:CRYPTO_STAGES,
  ethereum:CRYPTO_STAGES
}

const CRYPTO_API_STAGE = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO]:{
    ui_type:"text"
  }
}

const depositApiStages = (_depositAccount) => {  
  const depositAccount = _depositAccount?.info_needed ? ungapStructuredClone(_depositAccount?.info_needed) : _depositAccount
  const providerTypes = {
    pse:{
      ...depositAccount,
      [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:{
        ui_type:"text"
      }
    },
    ethereum_testnet:CRYPTO_API_STAGE,
    ethereum:CRYPTO_API_STAGE,
    bank:BANK_DEFAULT_STAGES
  }

  return providerTypes[_depositAccount?.provider_type] || BANK_DEFAULT_STAGES
}

export const createNextStages = async({ 
  stageData, 
  state,
  setDataForm 
}) => {
 
  if(!state[stageData?.key])return;
  const providerType = state[stageData?.key]?.provider_type || 'bank'
  const apiStages = depositApiStages(state[stageData?.key])
  let stages = {} 
  for (const stage of Object.keys(apiStages)) { 
    stages = {
      ...stages,
      [stage]:await createStage(apiStages[stage], DEPOSIT_TYPE_STAGES[providerType][stage], stage)
    }
  } 
  stages = await recursiveAddList(stages, apiStages)

  setDataForm(prevState => {
    return { 
      ...prevState,
      stages:{
        ...STAGES,
        ...stages
      } 
    }
  })
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

export const ApiPostCreateBankDeposit = async({ 
  state:{
    depositAmount,
    depositCost
  }, 
  currentWallet, 
  depositProvider 
}) => { 
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
  return await mainService.createDeposit(body);
}


export const ApiPostCreatePseDeposit = async({ 
  state:{
    depositAmount,
    person_type,
    bank_name
  }, 
  currentWallet,
  depositProvider
}) => { 
  let body = {
    data:{
      account_id:currentWallet?.id,
      amount:parseOnlyNumbers(depositAmount),
      comment:"",
      person_type:person_type?.value,
      bank_name,
      // cost_id:depositCost?.value,
      country:currentWallet?.country,
      currency:currentWallet?.currency,
      deposit_provider_id:depositProvider?.id
    }
  }
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
  (depositAccount) => depositAccount,
  (depositAccount) => {
    // console.log('selectProviderData', depositAccount)
    // debugger
    if(!depositAccount)return [ null, null ];
    const _depositAccount = ["other_bank"].includes(depositAccount?.value) ? depositAccount?.defaultProv : depositAccount;
    if(!_depositAccount)return [ null, null ];
    const costs =  _depositAccount?.costs
    let costList = {}
    Object.keys(costs).forEach(cost => {
      costList = {
        ...costList,
        [cost]:DEPOSIT_COSTS[cost] || costs[cost]
      }
    })
    return [ costList, _depositAccount ];
  }
);
 