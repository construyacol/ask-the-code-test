// import { mainService } from "../../../../services/MainService";


const STAGES = {
  "withdrawProviderBank":{
    uiName:"¿Cuál es la entidad financiera vinculada a tu cuenta?",
    key:"withdrawProviderBank",
    uiType:"select",
    "settings":{
      successPattern:/[a-zA-Z _]{1,40}/g,
      errors:[
        { pattern:/[^a-zA-Z _()]{1,30}/g, message:'Solo se permiten letras...'}
      ],
      placeholder:"Escribe el nombre del servicio/entidad",
      queryParams:{
        form:'withdrawProvider'
      }
    }
  },
  "infoNeeded":{
    key:"infoNeeded",
    "accountType":"",
    "accountNumber":{
      uiName:"Número de cuenta:",
      key:"accountNumber",
      uiType:"select",
      "settings":{
        defaultMessage:"default message",
        successPattern:/[0-9]{4,15}/g,
        errors:[ 
            { pattern:/[^0-9]/g, message:'Solo se permiten valores númericos...' }
        ],
        // label:"Nacionalidad del documento:",
        placeholder:"Ej: Antioquia",
        queryParams:{
          form:'province'
        }
      }
    }
  },
  "identity":{
    key:"identity"
  }
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

