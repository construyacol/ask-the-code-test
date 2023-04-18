import { mainService } from "services/MainService";
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
    CRYPTO:"depositCripto",
    COP_INTERNAL:"cop_internal",
    COP_INTERNAL_AMOUNT:"internalAmount"
  }
}

export const CTA_UI_NAME = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.COP_INTERNAL_AMOUNT]: "Compartir enlace de pago",
  default: "Crear depósito"
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

const DEFAULT_INTERNAL_AMOUNT = {
  uiName:"Ingresa la cantidad a cobrar (opcional)",
  key:FIAT_DEPOSIT_TYPES?.STAGES?.COP_INTERNAL_AMOUNT,
  uiType:"text",
  "settings":{
    defaultMessage:"",
    successPattern:/[0-9]/g,
    errors:[ 
        { pattern:/[^0-9.,]/g, message:'Solo se permiten valores númericos...' }
    ],
    placeholder:"Escribe la cantidad (opcional)",
    breadCumbConfig:{
      childLabel:"Con QR de pago",
      active:true
    }
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
  [FIAT_DEPOSIT_TYPES?.STAGES?.PERSON_TYPE]:{
    uiName:"Elije el banco por el cual harás el pago",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.PERSON_TYPE,
    uiType:"select",
    "settings":{
      defaultMessage:"",
      placeholder:"Escribe el nombre de tu banco",
      breadCumbConfig:{
        childLabel:"Con PSE",
        active:true
      }
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


const INTERNAL_DEFAULT_STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.COP_INTERNAL_AMOUNT]:{
    ui_type:"text"
  }
}


const INTERNAL_NETWORK_STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.COP_INTERNAL_AMOUNT]:DEFAULT_INTERNAL_AMOUNT
}



const STAGES = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:{
    uiName:"Ó elije un banco o servicio para depositar",
    key:FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER,
    uiType:"select",
    "settings":{
      defaultMessage:"",
    }
  }  
} 

const CRYPTO_STAGE = {
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

const CRYPTO_API_STAGE = {
  [FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO]:{
    ui_type:"text"
  }
}

const CRYPTO_API_STAGES = {
  ethereum_testnet:CRYPTO_API_STAGE,
  ethereum:CRYPTO_API_STAGE,
  bsc:CRYPTO_API_STAGE,
}

const CRYPTO_STAGES = {
  ethereum_testnet:CRYPTO_STAGE,
  ethereum:CRYPTO_STAGE,
  bsc:CRYPTO_STAGE,
}


const DEPOSIT_TYPE_STAGES = {
  pse:PSE_STAGES,
  bank:BANK_STAGES,
  internal_network:INTERNAL_NETWORK_STAGES,
  ...CRYPTO_STAGES
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
    bank:BANK_DEFAULT_STAGES,
    internal_network:INTERNAL_DEFAULT_STAGES,
    ...CRYPTO_API_STAGES
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
      currency:currentWallet?.currency,
      deposit_provider_id:depositProvider?.id
    }
  }
  return await mainService.createDeposit(body);
}




export const ApiPostCreateInternalDeposit = async({ state }) => {
  //  const paymentRequest = await createNewPaymentRequest()
  //  console.log(paymentRequest)
   return { error:true }
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
      deposit_provider_id:depositProvider?.id,
      callback_url:"https://app.coinsenda.com/wallets"
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
 