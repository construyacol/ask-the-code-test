// import { mainService } from "../../../../services/MainService";


const STAGES = {
  "currency":""
} 

export const NEW_WALLET_COMPONENTS = {
  wrapperComponent:{
      newWallet:'newWallet'
  }
}

export const NEW_WALLET_STAGES = {
  newWallet:STAGES
}

export const ApiGetNewWalletStages = async() => {
    return STAGES
}

export const NEW_WALLET_DEFAULT_STATE = {
  // newWallet:{
  //   currency:{}
  // }
}

// export const ApiPostCreateDeposit = async(body, tools) => {

//   const { setLoader, nextStage } = tools
//   setLoader(true)
//   let res = await mainService.createDeposit(body);
//   setLoader(false)
//   if(!res) return;
//   nextStage()
//   return res

// }

