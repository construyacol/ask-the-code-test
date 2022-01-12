
import { mainService } from "../../../../services/MainService";


const STAGES = {} 

export const ApiGetBiometricStages = async() => {
    let stages = {}
    const res = await mainService.getUserBiometric()
    if(!res) return;
    for (const keyChallenge in res.challenge) { 
      stages = {
        ...stages,
        [keyChallenge]:{
          key:keyChallenge,
          solved:res.solved,
          biometricId:res.id,
          ui_type: "img",
          ui_name: keyChallenge === "smile" ? "Sonríe" : "Abre la boca y levanta las cejas"
        }
      }
    }
    return stages
  }


  export const BIOMETRIC_COMPONENTS = {
    wrapperComponent:{
        biometric:"biometricKycComponent"
    }
  }

  export const BIOMETRIC_STAGES = {
    biometric:STAGES
  }

  