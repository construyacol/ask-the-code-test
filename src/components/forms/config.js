import { 
  ONBOARDING_COMPONENTS,
  ONBOARDING_STAGES
} from './widgets/onBoardingComponent/api'

import { 
  PERSONAL_COMPONENTS,
  PERSONAL_STAGES,
  PERSONAL_DEFAULT_STATE
} from './widgets/personalKycComponent/api'

let stages = {
  biometric:{},
  ...PERSONAL_STAGES,
  ...ONBOARDING_STAGES
} 

const defaultState = {
  ...PERSONAL_DEFAULT_STATE
  // biometric:{
  //   smile:"",
  //   surprised:""
  // },
}

const handleError = {
  // personal:{
  //   defaultErrorMessage:"Hubo un error en la toma de datos...",
  //   errors:{
  //     name:""
  //   }
  // }
}


const successStage = {
  biometric:{
    component:"biometricKycSuccess"
  },
  ...ONBOARDING_COMPONENTS['successStage']
}


const wrapperComponent = {
  biometric:"biometricKycComponent",
  ...PERSONAL_COMPONENTS['wrapperComponent'],
  ...ONBOARDING_COMPONENTS['wrapperComponent']
}

const formStructure = formName => {
  return {
    wrapperComponent:wrapperComponent[formName],
    handleError:handleError[formName],
    successStage:successStage[formName],
    defaultState:defaultState[formName],
    stages:stages[formName]
  }
}

export default formStructure
