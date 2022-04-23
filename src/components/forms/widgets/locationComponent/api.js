// import { mainService } from "../../../../services/MainService";
// import { 
//   formatMaskDate, 
//   parseDateToTimeStamp,
//   // parseTimeStampToDate
// } from './utils'

const LOCATION_INFO_NEEDED = {
  "location_country":{
    ui_name:"País",
    ui_type:"text",
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
    "nationality":{
      // uiName:"Nacionalidad del documento:",
      key:"nationality",
      uiType:"select",
      "settings":{
        defaultMessage:"Selecciona la nacionalidad de tu documento de identidad",
        successPattern:/[a-zA-Z _]{1,40}/g,
        errors:[
          { pattern:/[^a-zA-Z _]{1,30}/g, message:'Solo se permiten letras...'}
        ],
        // label:"Nacionalidad del documento:",
        placeholder:"Ej: pasaporte",
        queryParams:{
          form:'personal_country'
        }
      }
    }
}

export const ApiGetLocationStages = async(config) => {
    return LOCATION_INFO_NEEDED
}

export const ApiPostLocation = async(body, tools) => {}

// typeof date.getMonth === 'function'

export const LOCATION_DEFAULT_STATE = {
  location:{}
}

// const handleError = {
//   identity:{},
//   financial:{},
//   personal:{
//     defaultErrorMessage:"Tu verificación ha sido rechazada, corríge los campos indicados.",
//     // errors:{
//     //   country:"Ingresa un país de operación válido...",
//     //   name:"Solo ingresa nombres sin apellidos..."
//     // }
//   }
// }
  
export const LOCATION_COMPONENTS = {
    wrapperComponent:{
        location:'locationComponent'
    }
}

export const LOCATION_STAGES = {
    location:STAGES
}


  