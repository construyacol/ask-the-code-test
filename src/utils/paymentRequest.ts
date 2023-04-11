
type paymentRequestParams = {
   amount:string | number, 
   currency:string
}

export const DEFAULT_PARAMS = {
   currency:"cop",
   amount:"",
   main:"paymentRequest"
}
 
const createNewPaymentRequest = async({ currency = DEFAULT_PARAMS.currency, amount = DEFAULT_PARAMS.amount }:paymentRequestParams) => {
   const { PaymentRequestInstance } = await import('core/models/paymentRequest')
   const { mainService } = await import('services/MainService')
   return new PaymentRequestInstance({
      amount,
      currency,
      recipient:mainService?.user?.email,
      metaData:{
         userName:mainService?.user?.name
      }
   })
}

export const createPaymentRequestLink = async({ currency = DEFAULT_PARAMS.currency, amount = DEFAULT_PARAMS.amount }:paymentRequestParams) => {
   const { getHostName } = await import('environment')
   const paymentRequest = await createNewPaymentRequest({ currency, amount })
   // return `https://app.${getHostName()}.com?${DEFAULT_PARAMS?.main}=${encodeURIComponent(JSON.stringify(paymentRequest))}` 
   return `http://localhost:2998/?${DEFAULT_PARAMS?.main}=${encodeURIComponent(JSON.stringify(paymentRequest))}` 
}

export default createNewPaymentRequest