import { 
  FIAT_DEPOSIT_COMPONENTS,
  FIAT_DEPOSIT_STAGES,
  FIAT_DEPOSIT_DEFAULT_STATE
} from './widgets/fiatDeposit/api'

import { 
  ONBOARDING_COMPONENTS,
  ONBOARDING_STAGES
} from './widgets/onBoardingComponent/api'

import { 
  NEW_WALLET_COMPONENTS,
  NEW_WALLET_STAGES
} from './widgets/newWallet/api'

import { 
  PERSONAL_COMPONENTS,
  PERSONAL_STAGES,
  PERSONAL_DEFAULT_STATE
} from './widgets/personalKycComponent/api'

import { 
  LOCATION_DEFAULT_STATE,
  LOCATION_COMPONENTS,
  LOCATION_STAGES
} from './widgets/kyc/locationComponent/api'

import { 
  IDENTITY_DEFAULT_STATE,
  IDENTITY_COMPONENTS,
  IDENTITY_STAGES
} from './widgets/kyc/identityComponent/api'

// import { 
//   IDENTITY_COMPONENTS,
//   IDENTITY_STAGES
// } from './widgets/identityKycComponent/api'

import { 
  CONTACT_DEFAULT_STATE,
  CONTACT_COMPONENTS,
  CONTACT_STAGES
} from './widgets/kyc/contactComponent/api'

import { 
  BIOMETRIC_COMPONENTS,
  BIOMETRIC_STAGES
} from './widgets/biometricKycComponent/api'

let stages = {
  ...BIOMETRIC_STAGES,
  ...PERSONAL_STAGES,
  ...ONBOARDING_STAGES,
  ...FIAT_DEPOSIT_STAGES,
  ...NEW_WALLET_STAGES,
  ...IDENTITY_STAGES,
  ...LOCATION_STAGES,
  ...CONTACT_STAGES
} 

const defaultState = {
  ...PERSONAL_DEFAULT_STATE,
  ...FIAT_DEPOSIT_DEFAULT_STATE,
  ...IDENTITY_DEFAULT_STATE,
  ...LOCATION_DEFAULT_STATE,
  ...CONTACT_DEFAULT_STATE
}

const handleError = {
  // personal:{
  //   defaultErrorMessage:"Hubo un error en la toma de datos...",
  //   errors:{
  //     name:""
  //   }
  // }
}


const wrapperComponent = {
  ...BIOMETRIC_COMPONENTS['wrapperComponent'],
  ...PERSONAL_COMPONENTS['wrapperComponent'],
  ...ONBOARDING_COMPONENTS['wrapperComponent'],
  ...FIAT_DEPOSIT_COMPONENTS['wrapperComponent'],
  ...NEW_WALLET_COMPONENTS['wrapperComponent'],
  ...IDENTITY_COMPONENTS['wrapperComponent'],
  ...LOCATION_COMPONENTS['wrapperComponent'],
  ...CONTACT_COMPONENTS['wrapperComponent']
}

const formStructure = formName => {
  return {
    wrapperComponent:wrapperComponent[formName],
    handleError:handleError[formName],
    successStage:null,
    defaultState:defaultState[formName],
    stages:stages[formName]
  }
}

export default formStructure
