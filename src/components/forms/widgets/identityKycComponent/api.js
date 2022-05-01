import { mainService } from "../../../../services/MainService";


const STAGES = {
  chamber_of_commerce:{
    settings:{
      label:"Sube documento de cámara de comercio actual"
    }
  },
  selfie:{
    settings:{
      label:"Sube una selfie"
    }
  }
} 

export const IDENTITY_COMPONENTS = {
  wrapperComponent:{
    identity:'identityKycComponent'
  }
}

export const IDENTITY_STAGES = {
  identity:STAGES
}

const IDENTITY_INFO_NEEDED = {
  "rut":{
    ui_name:"RUT",
    ui_type:"attach",
  },
  "commerce":{
    ui_name:"Cámara de comercio",
    ui_type:"attach",
  },
  "document_front":{
    ui_name:"Frente del documento",
    ui_type:"attach",
  }
}


export const ApiGetIdentityStages = async(config) => {

  // const { personType, level, formName } = config
  // let countryValidators = await mainService.countryValidators()
  // if(!countryValidators) return;
  // return countryValidators?.res?.levels[level][formName][personType]
  return IDENTITY_INFO_NEEDED
}



