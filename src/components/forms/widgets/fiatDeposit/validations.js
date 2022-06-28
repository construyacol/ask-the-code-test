import {
    // parseOnlyLetters,
    validateLabelMsg,
    writeOnLabel,
    // parseOnlyNumbers,
    parseOnlyCurrencyAmount
    // addItemTag,
    // writeOnLabel,
    // parseAlphanumeric,
    // formatMaskDate
} from '../kyc/utils'
import { formatToCurrency } from "../../../../utils/convert_currency";

import { FIAT_DEPOSIT_TYPES } from './api' 
// import { selectListValidator } from '../kyc/validations'

  // let currency = {
  //   currency: "cop",
  //   is_token: false
  // }

  // TODO: Falta calcular los precios de efecty con reduce method
  export const getCost = ({ withdrawProvider, withdrawAccount }) => {
    const { provider:{ costs }, currency } = withdrawProvider
    const { bank_name } = withdrawAccount
    let costKey = [bank_name?.value].includes(withdrawProvider?.name) ? 'same_bank' : 'pp';
    return costs[costKey]?.fixed && formatToCurrency(costs[costKey]?.fixed.toString().replace(/,/g, ""), currency);
  }

  const getMinAmount = (minAmount, { withdrawProvider, state:{ withdrawAccount } }) => {
    const { currency } = withdrawProvider
    const costAmount = getCost({withdrawProvider, withdrawAccount})
    let _minAmount = formatToCurrency(minAmount.toString().replace(/,/g, ""), currency);
    const withdrawAmount = _minAmount.plus(costAmount || 0)
    return withdrawAmount
  }

  const amountValidation = async(value, data) => {
    let _data = structuredClone(data) //deep object copy    
    const { currency } = data?.withdrawProvider
    let _value = value
    _value = parseOnlyCurrencyAmount(_value)
    _value = formatToCurrency(_value.toString().replace(/,/g, ""), currency);
    validateLabelMsg(value, _data)
    if (isNaN(_value.toNumber()) || _value.toNumber() === "NaN") {
      return [ null, null ]
    }
    let status
    if(data?.withdrawProvider){
      const { withdrawProvider:{ provider } } = data
      const { min_amount } = provider
      const { max_amount } = provider
  
      let minAmount = getMinAmount(min_amount, data);
      let maxAmount = formatToCurrency(max_amount.toString().replace(/,/g, ""), currency);
      let availableBalance = formatToCurrency(data?.availableBalance?.toString().replace(/,/g, ""), currency);
  
      let minAmountValidation = _value.isGreaterThanOrEqualTo(minAmount)
      let availableAmountValidation = _value.isLessThanOrEqualTo(availableBalance)
      let maxAmountValidation = _value.isGreaterThanOrEqualTo(maxAmount)
  
      if(!minAmountValidation){
        writeOnLabel(`.label_text__${data.key}`, `El monto mínimo es $ ${minAmount.toFormat()} ${currency?.currency?.toUpperCase()}`, 'error')
      }else if(maxAmountValidation){
        writeOnLabel(`.label_text__${data.key}`, `El monto máximo es $ ${maxAmount.toFormat()} ${currency?.currency?.toUpperCase()}`, 'error')
      }else if(!availableAmountValidation){
        writeOnLabel(`.label_text__${data.key}`, `El monto supera el valor disponible en la cuenta`, 'error')
      }else if(minAmountValidation && availableAmountValidation){
        status = "success"
      }
    }else{
      writeOnLabel(`.label_text__${data.key}`, `No hay proveedores de retiro disponibles`, 'error')
    }

    return [ _value.toFormat(), status ]
  }

  const fiatWithdrawValidations = {
    [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:amountValidation,
  }

export default fiatWithdrawValidations