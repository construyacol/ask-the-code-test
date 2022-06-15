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


  //structuredClone(source) 

  const textInputValidator = (value, data) => {
    validateLabelMsg(value, data)
    let _value = parseOnlyLetters(value)
    let status = _value.match(data.settings.successPattern) && 'success'
    return [ _value, status ]
  }
  
  const id_number = (value, data) => {
    let _data = structuredClone(data) //deep object copy
    validateLabelMsg(value, _data)
    let _value = parseOnlyNumbers(value)
    _value = _value.toUpperCase()
    let status = _value.match(data.settings.successPattern) && 'success'
    return [ _value, status ]
  }

  const wAccountValidations = {
    withdrawProviderBank:selectListValidator,
    // surname:id_number,
  }

export default wAccountValidations