import { mainService } from "../../../../services/MainService";



const STAGES = {
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



