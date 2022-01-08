import { 
  ONBOARDING_COMPONENTS,
  ONBOARDING_STAGES
} from './widgets/onBoardingComponent/api'

import { 
  PERSONAL_COMPONENTS,
  PERSONAL_STAGES
} from './widgets/personalKycComponent/api'


let stages = {
  biometric:{},
  ...PERSONAL_STAGES,
  ...ONBOARDING_STAGES
} 

const defaultState = {
  // biometric:{
  //   smile:"",
  //   surprised:""
  // },
  // personal:{
  //   name:"Andres"
  // }
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
  ...PERSONAL_COMPONENTS['successStage'],
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
