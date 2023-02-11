import {
    validateLabelMsg,
    writeOnLabel,
    parseOnlyCurrencyAmount
} from '../kyc/utils'
import { formatToCurrency } from "../../../../utils/convert_currency";
import { FIAT_DEPOSIT_TYPES } from './api' 

  export const getCost = ({ costs, currency, depositCost }) => {
    let cost = costs[depositCost?.value]?.fixed;
    return cost ? formatToCurrency(cost.toString().replace(/,/g, ""), currency) : 0
  }

  export const getMinAmount = (minAmount, data) => {
    // const costAmount = getCost(data)
    // console.log('||||||  getMinAmount ==> minAmount', minAmount)
    // let _minAmount = formatToCurrency(minAmount?.toString()?.replace(/,/g, ""), data?.currency);
    // const depositAmount = _minAmount.plus(costAmount || 0)
    // return depositAmount
    return formatToCurrency(minAmount?.toString()?.replace(/,/g, ""), data?.currency);
  }

  const amountValidation = async(value, data) => {
    // let _data = JSON.parse(JSON.stringify(data))
    const _data = data
    const { 
      // state:{ depositCost }, 
      depositAccount } = 
    _data
    const { currency } = depositAccount
    let _value = value
    _value = parseOnlyCurrencyAmount(_value)
    _value = currency ? formatToCurrency(_value.toString().replace(/,/g, ""), currency) : _value;
    validateLabelMsg(value, _data)
    if (isNaN(_value.toNumber()) || _value.toNumber() === "NaN") {
      return [ null, null ]
    }
    let status
    if(depositAccount){
      const { min_amount, max_amount } = depositAccount
      // const { min_amount } = provider
      // const { max_amount } = provider
      // const { costs } = provider
      let minAmount = getMinAmount(min_amount, { currency });
      let maxAmount = formatToCurrency(max_amount.toString().replace(/,/g, ""), currency);
      let minAmountValidation = _value.isGreaterThanOrEqualTo(minAmount)
      let maxAmountValidation = _value.isGreaterThanOrEqualTo(maxAmount)
      if(!minAmountValidation){
        writeOnLabel(`.label_text__${data.key}`, `El monto mínimo es $ ${minAmount.toFormat()} ${currency?.toUpperCase()}`, 'error')
      }else if(maxAmountValidation){
        writeOnLabel(`.label_text__${data.key}`, `El monto máximo es $ ${maxAmount.toFormat()} ${currency?.toUpperCase()}`, 'error')
      }else if(minAmountValidation && !maxAmountValidation){
        status = "success"
      }else{
        writeOnLabel(`.label_text__${data.key}`, `No hay proveedores de retiro disponibles`, 'error')
      }
    }
    return [ _value.toFormat(), status ]
  }

  const fiatWithdrawValidations = {
    [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:amountValidation,
  }

export default fiatWithdrawValidations