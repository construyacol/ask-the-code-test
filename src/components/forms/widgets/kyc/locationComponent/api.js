import { mainService } from "../../../../../services/MainService";
import { ONLY_TEXT, IS_NOT_TEXT, ONLY_NUMBERS, IS_NOT_NUMBER } from 'core/const/regex'



export const LOCATION_TYPES = {
  FORM:"location",
  STAGES:{
    ADDRESS:{
      STREET_NAME:"streetName",
      STREET_NUMBER:"streetNumber",
      DISTRICT:"district",
      ZIP_CODE:"zipCode",
    },
  }
}


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
    ui_name:"Dirección de residencia",
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
    // "address":{
    //   // uiName:"Dirección de residencia:",
    //   key:"address",
    //   uiType:"text",
    //   "settings":{
    //     defaultMessage:"Escribe de forma completa tu dirección actual de residencia",
    //     successPattern:/[a-zA-Z ]{3,40}/g,
    //     // label:"Dirección de residencia:",
    //     // placeholder:"Escribe la dirección",
    //     queryParams:{
    //       form:'residence_address'
    //     },
    //     errors:[
    //       { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
    //     ],
    //   }
    // },
    "address":{
      key:"address",
      uiType:"recursiveLevel",
      renderComponent:"kyc/locationComponent/inputAddress",
      settings:{
        queryParams:{
          form:'createWithdrawAccount',
          stage:"address"
        }
      },
      "streetName":{
        key:"streetName",
        uiType:"select",
        uiName:"",
        autopista:{value:"autopista", ui_name:"Autopista"},
        // avenida:{value:"avenida", ui_name:"Avenida"},
        // calle:{value:"calle", ui_name:"Calle"},
        // carrera:{value:"carrera", ui_name:"Carrera"},
        // transversal:{value:"transversal", ui_name:"Transversal"},
        // bulevar:{value:"bulevar", ui_name:"Bulevar"},
        // carretera:{value:"carretera", ui_name:"Carretera"},
        // circunvalar:{value:"circunvalar", ui_name:"Circunvalar"},
        // diagonal:{value:"diagonal", ui_name:"Diagonal"},
        // glorieta:{value:"glorieta", ui_name:"Glorieta"},
        // kilometro:{value:"kilometro", ui_name:"Kilometro"},
        // variante:{value:"variante", ui_name:"Variante"},
        // via:{value:"via", ui_name:"Vía"},
        "settings":{
          successPattern:ONLY_TEXT,
          errors:[ 
            { pattern:IS_NOT_TEXT, message:'Solo se permiten letras...'}
          ],
          defaultMessage:"Elige el tipo de calle",
          placeholder:"Calle, carrera...",
        }
      },
      "streetNumber":{
        key:"streetNumber",
        uiType:"text",
        uiName:"",
        "settings":{
          successPattern:ONLY_NUMBERS,
          errors:[ 
            { pattern:IS_NOT_NUMBER, message:'Solo se permiten Números...'}
          ],
          defaultMessage:"Escribe el número de tu calle",
          placeholder:"Número de calle",
        }
      },
      "district":{
        key:"district",
        uiType:"text",
        uiName:"",
        "settings":{
          successPattern:ONLY_TEXT,
          errors:[ 
            { pattern:IS_NOT_TEXT, message:'Solo se permiten letras...'}
          ],
          defaultMessage:"Escribe el nombre del barrio donde resides",
          placeholder:"Barrio",
        }
      },
      "zipCode":{
        key:"zipCode",
        uiType:"text",
        uiName:"",
        "settings":{ 
          successPattern:ONLY_NUMBERS,
          errors:[ 
            { pattern:IS_NOT_NUMBER, message:'Solo se permiten Números...'}
          ],
          defaultMessage:"Escribe el código postal de tu ubicación",
          placeholder:"Código postal",
        }
      }
    }
}



export const ApiGetLocationStages = async(config) => {
    return LOCATION_INFO_NEEDED
}


export const ApiPostLocation = async(payload) => { 

  const env = process.env.REACT_APP_BUILD_CONFIG || process.env.NODE_ENV 
  let body = {data:{}}
  body.data = payload

  if(env !== 'production'){
    body.data = {
      type:"residence",
      aditional_info:"", //optional
      country:"international",
      info_needed:{
        location_country:payload.location_country,
        province:payload.province,
        city:payload.city,
        district:"alamos", //optional
        street_name:"cra 4",
        street_number:"23 - 44",
        floor:"", //optional
        apartment:"", //optional
        zip_code:"66660001"
      }
    }
  }

  console.log('payload', payload)
  
  const res = await mainService.createLocation(body)
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


  