import {
    parseOnlyLetters,
    validateLabelMsg,
    parseOnlyNumbers,
    addItemTag,
    writeOnLabel,
    parseAlphanumeric,
} from './utils'

import {
  formatMaskDate
} from 'utils/date'

import { LOCATION_TYPES } from './locationComponent/api'

const birthday = (value, data) => {

    const isMaskInput = data.state?.birthday?.includes('/') 
    let parseBirth = isMaskInput ? formatMaskDate(data.state?.birthday) : data.state?.birthday
    let birthYear = new Date(parseBirth)?.getFullYear() || new Date().getFullYear()
    let currentYear = new Date().getFullYear()
    let age = currentYear - birthYear 
    let _value = value ? value : null
    let status = ((age >= 18 && age < 100) && _value) && 'success' 
  
    const datePick = document.querySelector('[name="birthday"]')
    const targetLabel = `.label_text__${data.key}`
    if(status === 'success'){
      setTimeout(()=>{datePick.classList.add('date_success')}, 10)
      writeOnLabel(targetLabel, data.settings.defaultMessage)
    }else{
      if(age < 18){
        writeOnLabel(targetLabel, 'Debes de ser mayor de edad(+18) para continuar', 'error')
      }
      if(age > 100){
        writeOnLabel(targetLabel, 'Has superado los límites de longevidad humana', 'error')
      }
      setTimeout(()=>{datePick.classList.remove('date_success')}, 10)
    }
    return [ _value, status ]
  }
  
  
  
   
  const phone = (value, data) => {
    validateLabelMsg(value, data)
    let _value = parseOnlyNumbers(value)
    // let status = (_value.match(data.settings.successPattern) && data.state['meta_phone']) && 'success'
    let status = _value.match(data.settings.successPattern) && 'success';
    return [ _value, status ]
  }
  
  const meta_phone = (value, data) => {
    validateLabelMsg(value, data)
    //accepts only letters, spaces and underscore
    let _value = value.replace(/[^a-zA-Z _]/g, '')
    // Find and match the value with  select list key value
    let result = Object.keys(data?.selectList).filter(countryItem => countryItem.includes(value.toLowerCase()))
    // If it meets the pattern and matches 1 result from the entire list, the search was successful
    let status = (_value.match(data.settings.successPattern) && result.length === 1) && 'success';
    if(result.length === 1 && value){
      _value = result && result[0]
      addItemTag(data.key, data?.selectList[result[0]]?.uiName, ".prefixInputContainer")
    }
    // console.log('||||||||||| metadata phone ==> ', value, data)
    return [ _value, status ]
  }
    
  
  const textInputValidator = (value, data) => {
    validateLabelMsg(value, data)
    let _value = parseOnlyLetters(value)
    let status = _value.match(data.settings.successPattern) && 'success'
    return [ _value, status ]
  }
  
  const id_number = (value, data) => {
    let _data = JSON.parse(JSON.stringify(data)) //deep object copy
    const { id_type } = _data?.state
    const successPattern = id_type === 'pasaporte' ? data.settings.successPattern[id_type] : data.settings.successPattern.others
    _data.settings.errors = id_type === 'pasaporte' ? data?.settings?.errors[id_type] : data?.settings?.errors?.others
    validateLabelMsg(value, _data)
    let _value = id_type === 'pasaporte' ? parseAlphanumeric(value) : parseOnlyNumbers(value)
    _value = _value.toUpperCase()
    let status = _value.match(successPattern) && 'success'
    return [ _value, status ]
  }


export const selectListValidator = (value, data) => {
    if(!data?.selectList) return generalValidator(value, data);
    validateLabelMsg(value, data)
    //accepts only letters, spaces and underscore by default
    let _value = !data.regex ? value.replace(/[^a-zA-Z _' ']/g, '') : value
  
    let result = []
    Object.keys(data?.selectList).forEach(itemList => {
      if(itemList.includes(value.toLowerCase())){
        result = [...result, itemList ]
      }
    })
  
    result.forEach(itemList => {
      if(itemList === value.toLowerCase()){
        result = [ itemList ]
      }
    })
  
    // If it meets the pattern and matches 1 result from the entire list, the search was successful
    let status = (_value.match(data?.settings?.successPattern) && result.length === 1) && 'success';

    if(result?.length === 1 && value){
      _value = result && result[0]
      addItemTag(data.key, data?.selectList[result[0]]?.uiName)
    }
    return [ _value, status ]
  } 
  
  const generalValidator = (value, data) => {
    const status = value.length > 3 && 'success' 
    return [ value, status ]
  }


  const textNumberInputValidator = (value, data) => {
    validateLabelMsg(value, data)
    // let _value = value.replace(/[^a-zA-Z0-9 _]/g, '')
    let _value = value
    let status = _value.match(data.settings.successPattern) && 'success'
    return [ _value, status ]
  }

  const locationValidation = { 
    location_country:selectListValidator,
    province:selectListValidator,
    address:{
      [LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NAME]:textNumberInputValidator,
      [LOCATION_TYPES?.STAGES?.ADDRESS?.STREET_NUMBER]:textNumberInputValidator,
      [LOCATION_TYPES?.STAGES?.ADDRESS?.DISTRICT]:textInputValidator,
      [LOCATION_TYPES?.STAGES?.ADDRESS?.ZIP_CODE]:phone,
    },
    city:selectListValidator
  }

  const contactValidation = {
    phone,
    meta_phone
  }

  const identityValidation = {
    nationality:selectListValidator,
    id_type:selectListValidator,
    name:textInputValidator,
    surname:textInputValidator,
    birthday,
    id_number
  }

  const kycValidation = {
    ...locationValidation,
    ...contactValidation,
    ...identityValidation
  }

export default kycValidation