// import BigNumber from "bignumber.js";
import { PAYMENT_METHODS } from 'const/bitrefill'
import { isEmpty } from "lodash";


// Creo una lista con los metodos de pago en función a 
// 1. si tienen balance 
// 2. si están visibles
const getPaymentMethodsAvailable = async(balancesByCurrency) => new Promise((resolve) => {
    let paymentMethods = []
    for (const paymentCurrency in PAYMENT_METHODS) {
        // const walletCurrencyBalance = balancesByCurrency[paymentCurrency]
        const paymentMethod = PAYMENT_METHODS[paymentCurrency]
        // const availableBalance = new BigNumber(walletCurrencyBalance?.available || 0)
        // if(availableBalance.isGreaterThan(0) && paymentMethod.method){
        if(paymentMethod.method){
          for (const methodKey in paymentMethod.method) {
            paymentMethod.method[methodKey].visible && paymentMethods.push(methodKey)
          }
        }
    }
    resolve(paymentMethods);
});

// Si ninguna de las billeteras tiene saldo entonces enliste solo los metodos visibles
const getAllPaymentMethods = async() => new Promise((resolve) => {
  let paymentMethods = []
  for (const paymentCurrency in PAYMENT_METHODS) {
      const paymentMethod = PAYMENT_METHODS[paymentCurrency]
      for (const methodKey in paymentMethod.method) {
        paymentMethod.method[methodKey].visible && paymentMethods.push(methodKey)
      }
  }
  resolve(paymentMethods);
});



export const getPaymentData = async(balancesByCurrency) => {
  let paymentMethodsAvailable = await getPaymentMethodsAvailable(balancesByCurrency)
  const paymentMethods = isEmpty(paymentMethodsAvailable) ? await getAllPaymentMethods() : paymentMethodsAvailable
  return {
    paymentMethods,
    // showPaymentInfo:isEmpty(paymentMethodsAvailable) ? true : false
  }
}