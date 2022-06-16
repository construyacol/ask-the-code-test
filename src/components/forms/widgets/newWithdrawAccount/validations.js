import {
    parseOnlyLetters,
    validateLabelMsg,
    parseOnlyNumbers,
    // addItemTag,
    // writeOnLabel,
    // parseAlphanumeric,
    // formatMaskDate
} from '../kyc/utils'

import { selectListValidator } from '../kyc/validations'


  const numberValidation = (value, data) => {
    let _data = structuredClone(data) //deep object copy
    validateLabelMsg(value, _data)
    let _value = parseOnlyNumbers(value)
    let status = _value.match(data.settings.successPattern) && 'success'
    return [ _value, status ]
  }

  const wAccountValidations = {
    withdrawProviderBank:selectListValidator,
    accountNumber:numberValidation,
  }

export default wAccountValidations