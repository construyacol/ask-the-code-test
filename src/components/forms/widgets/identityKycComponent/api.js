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


export const ApiGetIdentityStages = async(config) => {
  const { personType, level, formName } = config
  let countryValidators = await mainService.countryValidators()
  if(!countryValidators) return;
  return countryValidators?.res?.levels[level][formName][personType]
}



