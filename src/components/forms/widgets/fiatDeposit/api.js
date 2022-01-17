const STAGES = {
  "amount":{},
  "costId":{},
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



