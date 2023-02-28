import { mainService } from "../../../../services/MainService";
// import { recursiveAddList } from '../../utils'
// import { isEmpty } from 'lodash'
import {
  parseOnlyNumbers,
} from '../kyc/utils'
// import { initStages } from '../../utils'
import { 
  createStage, 
  // recursiveAddList
} from 'components/forms/utils'
import ungapStructuredClone from '@ungap/structured-clone';

export const DEFAULT_IDENTIFIER_TYPE = "email"


export const FIAT_WITHDRAW_TYPES = {
  FORM:"fiatWithdraw",
  TYPES:{
    INTERNAL:"internal_network",
    ETHEREUM_TESTNET:'ethereum_testnet',
    ETHEREUM:'ethereum',
  },
  STAGES:{
    WITHDRAW_ACCOUNT:"withdrawAccount",
    AMOUNT:"withdrawAmount",
    TARGET_PERSON:"targetPerson",
    CRYPTO:"withdrawCrypto"
  }
}

const STAGES = {
  [FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT]:{
      uiName:"¿En que cuenta quieres recibir tu retiro?",
      key:FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT,
      uiType:"select",
      "settings":{
        defaultMessage:"",
      }
  }
} 

const BANK_WITHDRAW = {
  [FIAT_WITHDRAW_TYPES?.STAGES?.AMOUNT]:{
    uiName:"¿Cuanto quieres retirar?",
    key:FIAT_WITHDRAW_TYPES?.STAGES?.AMOUNT,
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

const INTERNAL_NETWORK = {
  [FIAT_WITHDRAW_TYPES?.STAGES?.TARGET_PERSON]:{
    uiName:"Escribe el correo electrónico de la persona que le enviarás DCOP",
    key:FIAT_WITHDRAW_TYPES?.STAGES?.TARGET_PERSON,
    uiType:"select",
    "settings":{
      defaultMessage:"",
      successPattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errors:[  
          // { pattern:/[^0-9.,]/g, message:'Solo se permiten valores númericos...' }
      ],
      // label:"Nacionalidad del documento:",
      placeholder:"satoshi_nakamoto@bitcoin.com",
      breadCumbConfig:{
        childLabel:"A otra persona",
        active:true
      }
    }
  },
  ...BANK_WITHDRAW
}


const WITHDRAW_CRYPTO = {
  [FIAT_WITHDRAW_TYPES?.STAGES?.CRYPTO]:{
    uiName:"",
    key:FIAT_WITHDRAW_TYPES?.STAGES?.CRYPTO,
    uiType:"text",
    "settings":{
      defaultMessage:"",
      // successPattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      // errors:[  
          // { pattern:/[^0-9.,]/g, message:'Solo se permiten valores númericos...' }
      // ],
      // label:"Nacionalidad del documento:",
      // placeholder:"satoshi_nakamoto@bitcoin.com",
      breadCumbConfig:{
        childLabel:"A una billetera DCOP",
        active:true
      },
      config:{
        hideStatusPanel:true
      },
      queryParams:{
        form:'withdraw_crypto'
      }
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


const getNextStages= (targetStage) => {
  const nextStages = {
    [FIAT_WITHDRAW_TYPES.TYPES.INTERNAL]:INTERNAL_NETWORK,
    [FIAT_WITHDRAW_TYPES.STAGES.CRYPTO]:WITHDRAW_CRYPTO
  } 
  return nextStages[targetStage] || BANK_WITHDRAW
}


export const createNextStages = async({ 
  stageData, 
  state,
  setDataForm,
  ...props
}) => {


  if(!state[stageData?.key])return;
  // if(state[stageData?.key]?.value === "newBankAccount") return props?.setCreateAccount(true);
  const apiStages = getNextStages(state[stageData?.key]?.value)
  let stages = {} 
  for(const stage of Object.keys(apiStages)) { 
    stages = {
      ...stages,
      [stage]:await createStage(apiStages[stage], {}, stage)
    }
  } 
  // stages = await recursiveAddList(stages, apiStages)
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


export const createWithdrawAccount = async({ withdrawAccount, currentWallet, withdrawProvider, labelAccount }) => {
  const body = {
    data:{
      country:currentWallet?.country,
      currency: currentWallet?.currency,
      provider_type:withdrawProvider?.provider_type,
      internal:withdrawProvider?.internal,
      info_needed:{
        identifier:withdrawAccount?.identifier,
        type:withdrawAccount?.id_type,
        label:labelAccount || withdrawAccount?.uiName
      }
    }
  }
  // coinsendaServices.resolveIdentifier(state[stageData?.key])
  const { data, error } = await mainService.createWithdrawAccount(body);
  if(error){
    alert('No ha sido posible crear la cuenta') 
    return { error }
  }
  await mainService.fetchWithdrawAccounts();
  return data
}

 
export const ApiPostCreateFiatWithdraw = async(payload, tools) => {
  // const { withdraw_accounts } = mainService?.globalState?.modelData;
  const { 
    withdrawProvider,
    currentWallet,
    withdrawAmount,
    twoFaToken
  } = payload

  let withdrawAccount = ungapStructuredClone(payload?.withdrawAccount)
  if(!withdrawAccount?.id) withdrawAccount = await createWithdrawAccount(payload)

  let body = {
    data:{ 
      country:"international",
      account_id:currentWallet?.id,
      amount:parseOnlyNumbers(withdrawAmount), 
      withdraw_account_id:withdrawAccount?.id,
      withdraw_provider_id:withdrawProvider?.id,
    }
  }  

  if(withdrawAccount?.provider_type === FIAT_WITHDRAW_TYPES.TYPES.INTERNAL){
    body.data.cost_information = { cost_id:"none" }
  }

  const res = await mainService.addWithdrawOrder(body, twoFaToken);
  return res
}


