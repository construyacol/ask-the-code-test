import { 
  ONBOARDING_COMPONENTS,
  ONBOARDING_STAGES
} from './widgets/onBoardingComponent/api'


let stages = {
  personal:{},
  biometric:{},
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
  personal:{
    defaultErrorMessage:"Hubo un error en la toma de datos...",
    errors:{
      name:""
    }
  }
}


const successStage = {
  biometric:{
    component:"biometricKycSuccess"
  },
  personal:{
    component:"personalKycSuccess"
  },
  ...ONBOARDING_COMPONENTS['successStage']
}


const wrapperComponent = {
  biometric:"biometricKycComponent",
  personal:"personalKycComponent",
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
