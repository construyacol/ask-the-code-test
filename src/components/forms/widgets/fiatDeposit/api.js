import { mainService } from "../../../../services/MainService";


const STAGES = {
  "amount":"",
  "costId":""
} 

export const FIAT_DEPOSIT_COMPONENTS = {
  wrapperComponent:{
      fiatDeposit:'fiatDeposit'
  }
}

export const FIAT_DEPOSIT_STAGES = {
  fiatDeposit:STAGES
}

export const ApiGetOnFiatDepositStages = async() => {
    return STAGES
}

export const FIAT_DEPOSIT_DEFAULT_STATE = {
  // fiatDeposit:{
  //   costId:"bankaccount"
  // }
}

export const ApiPostCreateDeposit = async(body, tools) => {

  const { setLoader, nextStage } = tools
  setLoader(true)
  let res = await mainService.createDeposit(body);
  setLoader(false)
  if(!res) return;
  nextStage()
  return res

}

