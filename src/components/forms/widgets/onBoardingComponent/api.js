const STAGES = {
  "firstStage":{},
  "secondStage":{},
  "thirdStage":{}
} 

export const ONBOARDING_COMPONENTS = {
  successStage:{
    onBoarding:{
      component:"biometricKycSuccess",
    }
  },
  wrapperComponent:{
    onBoarding:'onBoardingComponent'
  }
}

export const ONBOARDING_STAGES = {
  onBoarding:STAGES
}


export const ApiGetOnBoardingStages = async() => {
    return STAGES
}



