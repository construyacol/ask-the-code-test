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
   //  refundAddress:''
}


export const AVAILABLE_USER_EMAILS = [
   "erickospinapuertas@gmail.com",
   "construyacol+bitrefill@gmail.com",
   "construyacol@gmail.com"
]

export const PENDING_FUNDS = 'pending_funds'
export const INSUFFICIENT_FUNDS = 'insufficient_funds'
export const TRANSFERRING_FUNDS = 'transferring_funds'
export const DETECTING_PAYMENT = 'detecting_payment'
export const PAYMENT_DETECTED = 'payment_detected'

export const BITREFILL_STATE = {
   [PENDING_FUNDS]:{
      status:PENDING_FUNDS,
      title:'Procede con la compra',
      message:''
   },
   [INSUFFICIENT_FUNDS]:{
      status:INSUFFICIENT_FUNDS,
      title:'Fondos insuficientes',
      message:'Recarga tu cuenta para proceder con la compra'
   },
   [TRANSFERRING_FUNDS]:{
      status:TRANSFERRING_FUNDS,
      title:'Transfiriendo fondos a Bitrefill',
      successTitle:'Fondos transferidos a Bitrefill con éxito',
      message:''
   },
   [DETECTING_PAYMENT]:{
      status:DETECTING_PAYMENT,
      title:'Bitrefill está detectando tu pago',
      successTitle:'Pago detectado por Bitrefill',
      message:'Esto puede tomar un momento'
   },
   [PAYMENT_DETECTED]:{
      status:PAYMENT_DETECTED,
      title:'Bitrefill está confirmando tu pago',
      successTitle:'Pago detectado por Bitrefill',
      // message:'Estamos esperando las confirmaciones necesarias en la red. Esto puede tomar algunos minutos'
      message:'Estamos esperando las confirmaciones necesarias en la red. Te pedimos paciencia, ya que en ocasiones este proceso puede llevar algunos minutos.'
   }
}


// Hemos detectado tu pago de 0.02030416 LTC y estamos esperando que se confirme en la red. Puedes continuar navegando y comprando. Te enviaremos un correo electrónico una vez confirmado el pago.


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
         'visible':false
      }
   }
}

const dogecoin = {
   'currency':'dogecoin',
   'method':{
      'dogecoin':{
         'name':'dogecoin',
         'provider':'dogecoin',
         'visible':false
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
         'visible':false
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