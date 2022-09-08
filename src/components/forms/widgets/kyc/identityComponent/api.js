import { mainService } from "../../../../../services/MainService";
import { 
  formatMaskDate, 
  parseDateToTimeStamp,
} from 'utils/date'
import ungapStructuredClone from '@ungap/structured-clone';
import { identityInfo } from './identityUtils'
import { createStage } from '../../../utils'
import { toast } from 'utils'
import { getUiError } from 'const/uiErrors'



export const INFO_DOCUMENT_NEEDED = {
  "name":{
    ui_name:"Nombres completos",
    ui_type:"text",
  },
  "surname":{
    ui_name:"Apellidos completos",
    ui_type:"text",
  }, 
  "birthday":{
    ui_name:"Fecha de nacimiento",
    ui_type:"date",
  },
  "id_number":{
    ui_name: "Número de documento",
    ui_type: "text"
  }
}


const INFO_NEEDED = {
  "nationality":{
    ui_name:"País",
    ui_type:"select",
  },
  "id_type":{
    "ui_name": "Tipo de documento",
    "ui_type": "select",
    "cedula_ciudadania":{
        "ui_name": "Cedula de ciudadanía"
    },
    "cedula_extranjeria":{
        "ui_name": "Cedula de extranjería"
    },
    "pasaporte":{
        "ui_name": "Pasaporte"
    },
    "pep":{
        "ui_name": "Permiso especial de permanencia"
    }
  }
}

const FILES_NEEDED = {
  "selfie":{
    ui_name:"Selfie",
    ui_type:"attach"
  },
  "id_front":{
    ui_name:"Frente del documento",
    ui_type:"attach"
  },
  "id_back":{
    ui_name:"reverso del documento",
    ui_type:"attach"
  }
}


const STAGES = {
    "nationality":{
      uiName:"País emisor del documento:",
      key:"nationality",
      uiType:"select",
      "settings":{
        defaultMessage:"Selecciona la nacionalidad de tu documento de identidad",
        successPattern:/[a-zA-Z _]{1,40}/g,
        errors:[
          { pattern:/[^a-zA-Z _()]{1,30}/g, message:'Solo se permiten letras...'}
        ],
        // label:"Nacionalidad del documento:",
        // placeholder:"Colombia",
        queryParams:{
          form:'personal_country'
        }
      }
    },
    "id_type":{
      // uiName:"Tipo de documento:",
      key:"id_type",
      uiType:"text",
      "settings":{
        defaultMessage:"Elige el documento de identidad con el que verificarás tu cuenta.",
        successPattern:/[a-zA-Z ]{3,40}/g,
        // label:"Tipo de documento:",
        // placeholder:"Elije tu documento de identidad",
        selectList:{},
        queryParams:{
          form:'personal_id_type'
        },
        errors:[
          // { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
        ],
      }
    },
    "birthday":{
      // uiName:"Fecha de nacimiento",
      key:"birthday",
      uiType:"date",
      "settings":{
        defaultMessage:"Ingresa tú fecha de nacimiento (Día / Mes / Año)",
        placeholder:"31/10/2008",
        props:{
          min:"1930-01-01",
          max:"2003-12-31",
          pattern:"[0-9]{2}-[0-9]{2}-[0-9]{4}"
        },
        queryParams:{
          form:'personal_birthday'
        },
        // errors:[
        //   { pattern:/1[0-7]/g, message:'Debes de ser mayor de edad(+17) para continuar'}
        // ],
      }
    },
    "id_number":{
      // uiName:"Número de documento",
      key:"id_number",
      uiType:"text",
      "settings":{
        defaultMessage:"Digíta tu número de documento",
        successPattern:{
         pasaporte:/[0-9A-Z]{5,15}/g,
         others:/[0-9]{5,15}/g
        },
        // label:"Número de documento",
        // placeholder:"Dígita el número del documento que elegíste",
        queryParams:{
          form:'personal_number_id'
        },
        errors:{
          pasaporte:[ 
            { pattern:/[^0-9A-Z]/g, message:'Solo se permiten valores alfanuméricos...' }
          ],
          others:[
            { pattern:/[^0-9]/g, message:'Solo se permiten valores númericos...' }
          ]
        },
        mainComponent:null
      }
    },
    "surname":{
      // uiName:"Apellidos completos",
      key:"surname",
      uiType:"text",
      "settings":{
        defaultMessage:"Tus apellidos deben coincidir con los de tu documento de identidad.",
        successPattern:/[a-zA-Z\u00f1\u00d1 ]{3,40}/g,
        label:"Apellidos completos:",
        // placeholder:"Nakamoto",
        queryParams:{
          form:'personal_surnames'
        },
        errors:[
          { pattern:/[^a-zA-Z\u00f1\u00d1 ]{1,30}/g, message:'Solo se permiten letras...'}
        ],
      }
    },
    "name":{
      // uiName:"Nombres completos",
      key:"name",
      uiType:"text",
      "settings":{
        defaultMessage:"Los nombres deben coincidir con los de tu documento de identidad",
        successPattern:/[a-zA-Z\u00f1\u00d1 ]{3,40}/g,
        label:"Nombres completos (Sin apellidos):",
        // placeholder:"Satoshi",
        queryParams:{
          form:'personal_names'
        },
        errors:[
          { pattern:/[^a-zA-Z\u00f1\u00d1 ]{1,30}/g, message:'Solo se permiten letras...'}
        ],
        AuxComponent:null,
        MainComponent:null
      }
    }
}

export const ApiGetIdentityStages = async(config) => {

  // const user = mainService?.user
  const { 
    pendingOrRejectedIdentity
  } = identityInfo()
  // const user = mainService?.user
  // const userIdentity = user?.identity

   if(!pendingOrRejectedIdentity || ["pending", "rejected"].includes(pendingOrRejectedIdentity?.info_state)){
      return INFO_NEEDED;
   }else{
    const { id_type, nationality } = pendingOrRejectedIdentity
    const _document = await mainService.getOneDocument({ id_type, nationality })
    if(!_document)return FILES_NEEDED;
    let filesNeeded = {}
    _document?.file_needed.forEach(fileKey => {
      if(FILES_NEEDED[fileKey]){ 
        filesNeeded = {
          ...filesNeeded,
          [fileKey]:FILES_NEEDED[fileKey]
        }
      }
    })
    return filesNeeded
   }

  //  if(pendingIdentityFile && ["accepted", "confirmed"].includes(userIdentity?.info_state)){
  //   const { id_type, nationality } = pendingIdentityFile
  //   const _document = await mainService.getOneDocument({ id_type, nationality })
  //   if(!_document)return FILES_NEEDED;
  //   let filesNeeded = {}
  //   _document?.file_needed.forEach(fileKey => {
  //     if(FILES_NEEDED[fileKey]){ 
  //       filesNeeded = {
  //         ...filesNeeded,
  //         [fileKey]:FILES_NEEDED[fileKey]
  //       }
  //     }
  //   })
  //   return filesNeeded
  //  }else{
  //   return INFO_NEEDED;
  //  }
    



}



export const ApiPostIdentityInfo = async(payload) => {

  const config = ungapStructuredClone(payload);
  const { pendingOrRejectedIdentity } = identityInfo()
  let res

  const isMaskBirthday = config.birthday.includes('/') 
  if(isMaskBirthday){
    config.birthday = formatMaskDate(config.birthday) 
  }
  const timeStampDate = parseDateToTimeStamp(config.birthday) 
  config.birthday = timeStampDate

  let info_needed = {}
  config?.document?.info_needed?.forEach(documentId => {
    if(config[documentId]){
      info_needed = {
        ...info_needed,
        [documentId]:config[documentId]
      }
    }
  })
  

  if(pendingOrRejectedIdentity){
    res = await mainService.updateInfoIdentity({
      ...config, 
      identity_id:pendingOrRejectedIdentity?.id, 
      info_needed
    }) 
  }else{
    res = await mainService.createIdentity({
      ...config, 
      document_id:config?.document?.id, 
      info_needed
    })
  }

  const { error } = res

  if(error){
    return toast(getUiError(error?.message), "error");
  }
  return await mainService.fetchCompleteUserData()
}


export const ApiPostIdentityFiles = async(payload) => {
  const config = ungapStructuredClone(payload);
  const user = mainService?.user

  const { pendingIdentityFile } = identityInfo()
  const mainIdentity = user?.user?.identity 

  const currentIdentity = pendingIdentityFile ? pendingIdentityFile : mainIdentity
  const { id_type, nationality, id } = currentIdentity

  const _document = await mainService.getOneDocument({ id_type, nationality })
  if(!_document)return;

  let files_needed = {}
  _document?.file_needed?.forEach(fileId => {
    if(config?.state[fileId]){
      files_needed = {
        ...files_needed,
        [fileId]:config?.state[fileId]?.img
      }
    }
  })

  // console.log('document', _document)
  const res = await mainService.addFilesToIdentity({
    ...config, 
    identity_id:id, 
    files_needed
  })
  if(!res)return ;
  return await mainService.fetchCompleteUserData()
}


export const createInfoStages = async({
  stageData,
  dataForm,
  setDataForm,
  state
}) => {
  const stageKey = stageData?.key
  if(!dataForm?.stages[stageKey]?.selectList)return ;
  const documentData = dataForm?.stages[stageKey]?.selectList[state[stageKey]]
  if(!documentData || !documentData?.info_needed?.length)return ;

    let apiStages = {}
    documentData?.info_needed?.forEach( documentKey => {
      if(INFO_DOCUMENT_NEEDED[documentKey]){
        apiStages = {
          ...apiStages,
          [documentKey]:INFO_DOCUMENT_NEEDED[documentKey]
        }
      }
    });

    let stages = {} 

    for (const stage of Object.keys(apiStages)) { 
      stages = {
        ...stages,
        [stage]:await createStage(apiStages[stage], IDENTITY_STAGES?.identity[stage], stage)
      }
    } 

    setDataForm(prevState => {
      return { 
        ...prevState,
        stages:{
          ...prevState.stages,
          ...stages
        } 
      }
    })

}






// typeof date.getMonth === 'function'

export const IDENTITY_DEFAULT_STATE = {
  identity:{}
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
  
export const IDENTITY_COMPONENTS = {
    wrapperComponent:{
        identity:'kyc/identityComponent'
    }
}

export const IDENTITY_STAGES = {
    identity:STAGES
}


  