import { mainService } from "../../../../services/MainService";
import { recursiveAddList } from '../../utils'
import { isEmpty } from 'lodash'

export const KEY_TYPE = {
  IDENTITY:"identity",
  PROV_SERVICE:"bankName",
}


const INFO_IDENTITY_NEEDED = {
  [KEY_TYPE?.IDENTITY]:{
    uiName:"Elije el documento vinculado a tu cuenta de retiro",
    key:KEY_TYPE?.IDENTITY,
    uiType:"select",
    "settings":{
      defaultMessage:"",
      successPattern:/[a-zA-Z _]{1,40}/g,
      errors:[
        { pattern:/[^a-zA-Z _()]{1,30}/g, message:'Solo se permiten letras...'}
      ],
      placeholder:"Escribe el nombre del servicio/entidad",
      queryParams:{
        form:'createWithdrawAccount',
        stage:KEY_TYPE?.IDENTITY
      }
    }
  }
}

const INFO_NEEDED_STAGE = {
  "bank":{
    "infoAccount":{
      key:"infoAccount",
      uiType:"recursiveLevel",
      settings:{
        queryParams:{
          form:'createWithdrawAccount',
          stage:"infoAccount"
        }
      },
      "accountType":{
        uiName:"¿Cuál es el tipo de cuenta?",
        key:"accountType",
        uiType:"select",
        "settings":{
          defaultMessage:"",
          placeholder:"Escribe el número de tu cuenta",
        }
      },
      "accountNumber":{
        uiName:"¿Cuál es el número de tu cuenta?",
        key:"accountNumber",
        uiType:"text",
        "settings":{
          defaultMessage:"",
          successPattern:/[0-9]{4,15}/g,
          errors:[ 
              { pattern:/[^0-9]/g, message:'Solo se permiten valores númericos...' }
          ],
          // label:"Nacionalidad del documento:",
          placeholder:"Escribe el número de tu cuenta",
        }
      }
    },
    ...INFO_IDENTITY_NEEDED
  },
  "efecty":INFO_IDENTITY_NEEDED
}

const STAGES = {
  [KEY_TYPE?.PROV_SERVICE]:{
    uiName:"¿Cuál es la entidad financiera vinculada a tu cuenta?",
    key:KEY_TYPE?.PROV_SERVICE,
    uiType:"select",
    "settings":{
      defaultMessage:"",
      successPattern:/[a-zA-Z _]{1,40}/g,
      errors:[
        { pattern:/[^a-zA-Z _()]{1,30}/g, message:'Solo se permiten letras...'}
      ],
      placeholder:"Escribe el nombre del servicio/entidad",
      queryParams:{
        form:'createWithdrawAccount',
        stage:"providerService"
      }
    }
  }
} 

export const createInfoNeededStages = async({
  stageData,
  dataForm,
  setDataForm,
  state
}) => {
    const { withdrawProviders } = mainService?.globalState?.modelData;
    const providerType = ["efecty"].includes(state[KEY_TYPE.PROV_SERVICE]) ? state[KEY_TYPE.PROV_SERVICE] : 'bank'
    let wProviderBanKey = Object.keys(withdrawProviders).find(wAKey => withdrawProviders[wAKey]?.provider_type?.includes(providerType))
    
    let stages = {
      ...STAGES,
      ...INFO_NEEDED_STAGE[providerType]
    } 

    stages = await recursiveAddList(stages, {...withdrawProviders[wProviderBanKey], ...state})

    setDataForm(prevState => {
      return { 
        ...prevState,
        stages
      }
    })
}


export const NEW_WACCOUNT_COMPONENTS = {
  wrapperComponent:{
    newWithdrawAccount:'newWithdrawAccount'
  }
}

export const NEW_WACCOUNT_STAGES = {
  newWithdrawAccount:STAGES
}

export const ApiGetNewWAccountStages = async() => {
    return STAGES
}

export const NEW_WACCOUNT_DEFAULT_STATE = {
  // newWallet:{
  //   currency:{}
  // }
}

const getInfoNeeded = state => {
  const { user } = mainService?.globalState?.modelData;
  const { withdrawProvider } = state
  const infoNeeded = {
    bank:{
      account_number:state?.infoAccount?.accountNumber,
      account_type:state?.infoAccount?.accountType,
      bank_name:state?.bankName,
      country:withdrawProvider?.country,
      email:user?.email,
      id_number:state?.identity?.document_info?.id_number,
      label:state?.bankName,
      name:state?.identity?.document_info?.name,
      surname:state?.identity?.document_info?.surname,
      id_type:state?.identity?.id_type
    },
    efecty_network:{
      id_number:state?.identity?.document_info?.id_number,
      id_type:state?.identity?.id_type,
      name:state?.identity?.document_info?.name,
      surname:state?.identity?.document_info?.surname
    }
  }
  return infoNeeded[withdrawProvider?.provider_type]
}

export const ApiPostCreateWAccount = async(state, tools) => {

  const { withdraw_accounts } = mainService?.globalState?.modelData;

  if(withdraw_accounts){
    // validate if withdraw account already exist 
    const result = Object.values(withdraw_accounts).filter(WAccount => WAccount.info.bank_name === state?.bankName && WAccount.info.account_number === state?.infoAccount?.accountNumber)
    if(!isEmpty(result)){
      return {
        error:{
          message:"La cuenta de retiro ya existe"
        }
      }
    }
  }
 

  const { withdrawProvider } = state
  const body = {
    data:{
      country:"international",
      currency:withdrawProvider?.currency,
      identity_id:state?.identity?.id,
      provider_type:withdrawProvider?.provider_type,
      info_needed:getInfoNeeded(state)
    }
  }
  const res = await mainService.createWithdrawAccount(body);
  if(res.data) await mainService.fetchWithdrawAccounts();
  return res
}

