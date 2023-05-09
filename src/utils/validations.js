

export const emailValidation = (value) => {
   const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   return pattern.test(value) ? 'success' : false
}

export const parseToOnlyNumbers = (value) => {
   return value.replace(/[^0-9.]/g, '')
}


export const amountValidation = (value, data) => {
   const { provider:{ max_amount } } = data
   const successValidation = value.isGreaterThan(0) && value.isLessThanOrEqualTo(max_amount)
   const maxAmountValidation = value.isGreaterThan(max_amount)
   const insufficientValidation = max_amount.isEqualTo(0)
   let state = null
   if(maxAmountValidation || insufficientValidation)state = 'insufficient';
   if(successValidation)state = 'success';
   return [ value, state ]
 }