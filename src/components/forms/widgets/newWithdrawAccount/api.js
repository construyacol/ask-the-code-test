import { mainService } from "../../../../services/MainService";
import { recursiveAddList } from '../../utils'
// import { get } from 'lodash'

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

// export const ApiPostCreateDeposit = async(body, tools) => {

//   const { setLoader, nextStage } = tools
//   setLoader(true)
//   let res = await mainService.createDeposit(body);
//   setLoader(false)
//   if(!res) return;
//   nextStage()
//   return res

// }

