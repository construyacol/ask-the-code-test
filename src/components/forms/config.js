

let stages = {
  personal:{
    "name":{
      uiName:"Nombres completos",
      key:"name",
      uiType:"text",
      "settings":{
        defaultMessage:"Los nombres deben coincidir con los de tu documento de identidad",
        successPattern:/[a-zA-Z ]{3,40}/g,
        label:"Nombres completos (sin apellidos):",
        placeholder:"Ej: Juan josé ",
        queryParams:{
          form:'personal_names'
        },
        errors:[
          { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
        ],
        AuxComponent:null,
        MainComponent:null
      }
    }
  },
  biometric:{},
  onBoarding:{
    "welcome":{
      key:"welcome"
    }
  }

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
  onBoarding:{
    component:"biometricKycSuccess"
  },
}

const wrapperComponent = {
  biometric:"biometricKycComponent",
  personal:"personalKycComponent",
  onBoarding:"onBoardingComponent"
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
