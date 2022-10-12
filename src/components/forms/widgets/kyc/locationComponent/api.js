import { mainService } from "../../../../../services/MainService";

const LOCATION_INFO_NEEDED = {
  "location_country":{
    ui_name:"País",
    ui_type:"select",
  },
  "province":{
    ui_name:"Provincia",
    ui_type:"text",
  },
  "city":{
    ui_name:"Ciudad",
    ui_type:"text",
  },
  "address":{
    ui_name:"Dirección",
    ui_type:"text",
  }
}

const STAGES = {
  "province":{
    uiName:"Departamento:",
    key:"province",
    uiType:"select",
    "settings":{
      defaultMessage:"Selecciona el departamento de residencia actual",
      successPattern:/[a-zA-Z _]{1,40}/g,
      errors:[
        { pattern:/[^a-zA-Z _]{1,30}/g, message:'Solo se permiten letras...'}
      ],
      // label:"Nacionalidad del documento:",
      // placeholder:"Ej: Antioquia",
      queryParams:{
        form:'province'
      }
    }
  },
    "location_country":{
      uiName:"País de residencia:",
      key:"location_country",
      uiType:"select",
      "settings":{
        defaultMessage:"Selecciona el país de residencia actual",
        successPattern:/[a-zA-Z _]{1,40}/g,
        errors:[
          { pattern:/[^a-zA-Z _]{1,30}/g, message:'Solo se permiten letras...'}
        ],
        // label:"Nacionalidad del documento:",
        // placeholder:"Ej: pasaporte",
        queryParams:{
          form:'location_country'
        }
      }
    },
    "address":{
      // uiName:"Dirección de residencia:",
      key:"address",
      uiType:"text",
      "settings":{
        defaultMessage:"Escribe de forma completa tu dirección actual de residencia",
        successPattern:/[a-zA-Z ]{3,40}/g,
        // label:"Dirección de residencia:",
        // placeholder:"Escribe la dirección",
        queryParams:{
          form:'personal_address'
        },
        errors:[
          { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
        ],
      }
    },
}

export const ApiGetLocationStages = async(config) => {
    return LOCATION_INFO_NEEDED
}


export const ApiPostLocation = async(payload) => {
  const res = await mainService.createLocation({data:payload})
  if(!res)return ;
  await mainService.fetchCompleteUserData()
  const reqData = await mainService.getLevelRequirement()
  if(reqData){
    const { pendingRequirements } = reqData
    return pendingRequirements[0]
  }
  return res
}







// typeof date.getMonth === 'function'

export const LOCATION_DEFAULT_STATE = {
  location:{}
}

// const handleError = {
//   identity:{},
//   financial:{},
//   personal:{
//     // errors:{
//     //   country:"Ingresa un país de operación válido...",
//     //   name:"Solo ingresa nombres sin apellidos..."
//     // }
//   }
// }
  
export const LOCATION_COMPONENTS = {
    wrapperComponent:{
        location:'kyc/locationComponent'
    }
}

export const LOCATION_STAGES = {
    location:STAGES
}


  