import {
    validateLabelMsg,
    writeOnLabel,
    parseOnlyCurrencyAmount
} from '../kyc/utils'
import { formatToCurrency } from "../../../../utils/convert_currency";
import ungapStructuredClone from '@ungap/structured-clone';
import { FIAT_WITHDRAW_TYPES } from './api' 
import { selectListValidator } from 'components/forms/widgets/kyc/validations'
import { calculateCost } from '../sharedValidations'
import { parseSymbolCurrency } from 'core/config/currencies';
import BigNumber from "bignumber.js"

  export const getTotalToReceive = (_cost, _amount) => {
    let cost = BigNumber.isBigNumber(_cost) ? _cost : new BigNumber(_cost) 
    let amount = BigNumber.isBigNumber(_amount) ? _amount : new BigNumber(_amount.replace(/,/g, "")) 
    return amount.minus(cost)
  }

  // TODO: Falta calcular los precios de efecty con reduce method
  export const getCost = ({ withdrawProvider, withdrawAccount, amount }) => {
    const { provider:{ costs }, currency } = withdrawProvider
    const { bank_name, provider_type } = withdrawAccount
    let costKey = ''
    if(provider_type === 'internal_network'){
      costKey = 'none'
    }else if(provider_type === 'efecty_network'){
      return calculateCost(amount, costs)
    }else{
      costKey = [bank_name?.value].includes(withdrawProvider?.name) ? 'same_bank' : 'pp';
    }
    return costs[costKey]?.fixed && formatToCurrency(costs[costKey]?.fixed.toString().replace(/,/g, ""), currency);
  }

  const getMinAmount = (minAmount, { withdrawProvider, state:{ withdrawAccount } }) => {
    const { currency } = withdrawProvider
    // const costAmount = getCost({withdrawProvider, withdrawAccount, amount:minAmount.toString()})
    const costAmount = 0
    let _minAmount = formatToCurrency(minAmount.toString().replace(/,/g, ""), currency);
    const withdrawAmount = _minAmount.plus(costAmount || 0)
    return withdrawAmount
  }

  const amountValidation = async(value, data = {}) => {
    let _data = ungapStructuredClone(data) //deep object copy    
    const { currency } = data?.withdrawProvider
    let _value = value
    _value = parseOnlyCurrencyAmount(_value)
    _value = formatToCurrency(_value.toString().replace(/,/g, ""), currency);
    validateLabelMsg(value, _data)
    if (isNaN(_value.toNumber()) || _value.toNumber() === "NaN") return [ null, null ];
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
        writeOnLabel(`.label_text__${data.key}`, `El monto mínimo es $ ${minAmount.toFormat()} ${parseSymbolCurrency(currency)?.toUpperCase()}`, 'error')
      }else if(maxAmountValidation){
        writeOnLabel(`.label_text__${data.key}`, `El monto máximo es $ ${maxAmount.toFormat()} ${parseSymbolCurrency(currency)?.toUpperCase()}`, 'error')
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


  const emailValidation = (emailVal, data = {}) => {
    let value = emailVal?.toLowerCase()?.trim()
    const patron = data?.settings?.successPattern
    let status = patron.test(value) ? 'success' : false
    const [ _value ] = selectListValidator(value, {...data, regex:patron})
    return [ _value, status ]
  }

  const fiatWithdrawValidations = {
    [FIAT_WITHDRAW_TYPES?.STAGES?.AMOUNT]:amountValidation,
    [FIAT_WITHDRAW_TYPES?.STAGES?.TARGET_PERSON]:emailValidation,
  }

export default fiatWithdrawValidations