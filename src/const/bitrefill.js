const BITREFILL_REF_CODE = 'wtto2HuC'
const UTM_SOURCE = 'Coinsenda'
export const BITREFILL_BASE_URL = 'https://embed.bitrefill.com'
export const BITREFILL_PARAMS_DEFAULT = {
    showPaymentInfo:false,
    hl:'es' ,
    ref:BITREFILL_REF_CODE,
    utm_source:UTM_SOURCE,
    email:'',
    endUserToken:'',
    paymentMethods:[],
    refundAddress:'TKtTQX9PSeaRWrnhThttSREMpu4XLnVMv6'
}

export const PENDING_FUNDS = 'pending_funds'
export const INSUFFICIENT_FUNDS = 'insufficient_funds'
export const TRANSFERRING_FUNDS = 'transferring_funds'
export const DETECTING_PAYMENT = 'detecting_payment'
export const PAYMENT_DETECTED = 'payment_detected'

export const BITREFILL_STATE = {
   pending_funds:{
      status:PENDING_FUNDS,
      title:'Procede con la compra',
      message:''
   },
   insufficient_funds:{
      status:INSUFFICIENT_FUNDS,
      title:'Fondos insuficientes',
      message:'Recarga tu cuenta para proceder con la compra'
   },
   transferring_funds:{
      status:TRANSFERRING_FUNDS,
      title:'Transferiendo fondos a Bitrefill',
      message:''
   },
   detecting_payment:{
      status:DETECTING_PAYMENT,
      title:'Esperando detección del pago por Bitrefill',
      message:'esto puede tomar un momento'
   },
   payment_detected:{
      status:PAYMENT_DETECTED,
      title:'Pago detectado por Bitrefill',
      message:'Alcanzando confirmaciones necesarias en la red. Esto puede tomar algunos minutos'
   }
}



const usdc = {
   'currency':'usdc',
   'method':{
      'usdc_erc20':{
         'name':'usdc_erc20',
         'provider':'ethereum',
         'visible':false
      },
      'usdc_polygon':{
         'name':'usdc_polygon',
         'provider':'polygon',
         'visible':false
      }
   }
}

const ethereum = {
   'currency':'ethereum',
   'method':{
      'ethereum':{
         'name':'ethereum',
         'provider':'ethereum',
         'visible':true
      }
   }
}

const dogecoin = {
   'currency':'dogecoin',
   'method':{
      'dogecoin':{
         'name':'dogecoin',
         'provider':'dogecoin',
         'visible':true
      }
   }
}

const usdt = {
   'currency':'usdt',
   'method':{
      'usdt_trc20':{
         'name':'usdt_trc20',
         'provider':'tron',
         'visible':true
      },
      'usdt_erc20':{
         'name':'usdt_erc20',
         'provider':'ethereum',
         'visible':false
      },
      'usdt_polygon':{
         'name':'usdt_polygon',
         'provider':'polygon',
         'visible':false
      }
   }
}

const bitcoin = {
   'currency':'bitcoin',
   'method':{
      'bitcoin':{
         'name':'bitcoin',
         'provider':'bitcoin',
         'visible':true
      },
      'lightning':{
         'name':'lightning',
         'provider':'bitcoin',
         'visible':false
      }
   }
}

const litecoin = {
   'currency':'litecoin',
   'method':{
      'litecoin':{
         'name':'litecoin',
         'provider':'litecoin',
         'visible':true
      }
   }
}

export const PAYMENT_METHODS = {
   usdt,
   bitcoin,
   litecoin,
   usdc,
   ethereum,
   dogecoin
}

export const INVOICE_PAYMENT_CURRENCY = {
   USDT:usdt,
   USDC:usdc,
   DOGE:dogecoin,
   BTC:bitcoin,
   ETH:ethereum,
   LTC:litecoin
 }

// let uri = `https://embed.bitrefill.com/?showPaymentInfo=true&email=${email}&hl=${lang}&ref=${refCode}&paymentMethods=${paymentMethod}`
// const binance_pay = {
//    'currency':'binance_pay',
//    'method':{
//       'binance_pay':{
//          'name':'binance_pay',
//          'provider':'binance_pay',
//          'visible':false
//       }
//    }
// }