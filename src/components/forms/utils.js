import { 
  // COUNTRY_URL_API,
  API_FETCH_SELECT_LIST,
  INFO_URL_API
} from './const'

import { mainService } from '../../services/MainService'
import formStructure from './config.js'
import { ApiGetOnBoardingStages } from './widgets/onBoardingComponent/api'
import { ApiGetPersonalStages } from './widgets/personalKycComponent/api'
import { ApiGetLocationStages } from './widgets/kyc/locationComponent/api'
import { ApiGetContactStages } from './widgets/kyc/contactComponent/api'
import { ApiGetIdentityStages } from './widgets/kyc/identityComponent/api'
import { ApiGetBiometricStages } from './widgets/biometricKycComponent/api'
import { ApiGetOnFiatDepositStages } from './widgets/fiatDeposit/api'
import { ApiGetNewWalletStages } from './widgets/newWallet/api'


// import countryValidators from './apiRes'


export const getQuery = (queryParams) => {
  let result = Object.entries(queryParams).map((param, index) => {
    let concat = `${index < 1 ? '?' : '&'}`
    let query = `${concat}${param[0]}=${param[1]}`
    return query
  })
  return result.join('')
}


export const getInitialState = (payload) => {
  let initialState = {}
  const iterableSource = { ...payload.stages, ...payload?.defaultState }
  // eslint-disable-next-line array-callback-return
  Object.keys(iterableSource).map(stageKey => {
  initialState[stageKey] = payload?.defaultState ? payload?.defaultState[stageKey] : ""
    if(payload?.handleError?.errors && payload?.handleError?.errors[stageKey]){
      return initialState[stageKey] = ""
    }
  })
  return initialState
}


export const setMessageError = (selector, message) => {
  const labelElement = document.querySelector(selector)
  if(!labelElement){return false}
  labelElement.innerHTML = message
  labelElement.style.color = 'red'
}

// manage tags system events




export const onSubmit = async(callback, TimeOut = 100) => {
  callback(true)
  setTimeout(() => { 
    callback(false)
  }, TimeOut);
}



export const generateSelectList = (objectList) => {
  let selectList = {...objectList}
  delete selectList.ui_name
  delete selectList.ui_type
  // eslint-disable-next-line array-callback-return
  Object.keys(selectList).forEach(key => {
    selectList[key].uiName = selectList[key]?.ui_name || selectList[key]?.name
    selectList[key].value = key
    delete selectList[key]?.ui_name
    delete selectList[key]?.name
    // delete selectList[key]?.id
    delete selectList[key]?.code
  })
  return selectList
}

export const getSelectList = async(listKey, payload) => {
  let list 
  let res = await mainService[API_FETCH_SELECT_LIST[listKey]] && await mainService[API_FETCH_SELECT_LIST[listKey]](payload)
  if(!res){return}
  list = await createSelectList(res)
  return generateSelectList(list)
}

export const createStage = async(source, modelated, index) => {
  let _source = typeof source === 'object' ? structuredClone(source) : {...source};
  let stage = {}

  _source.uiName = _source.ui_name
  _source.uiType = _source.ui_type
  delete _source.ui_name
  delete _source.ui_type
  
  Object.keys(_source).forEach(key => {
    // TODO: refactor to for -- in
      stage = {
        key:index,
        ...stage,
        ...modelated,
        [key]:_source[key]
      }
  })

  if(_source?.uiType === 'select'){
    stage.selectList = await getSelectList(stage?.key)
  }
  return stage
}

 
export const createSelectList = async(list) => {
  let selectList = {}
  for (const item of list) {
    // item.code = item.code.split(" ").join("_")
    item.currencySymbol = item.currency_symbol
    delete item.currency_symbol
    let itemUiName = item?.name
    if(item?.code){
      selectList = {
        ...selectList,
        [item?.code]:{
          ...item,
          name:itemUiName
        }
      }
      if(item.flag){
        selectList[item?.code].flag = `${INFO_URL_API?.replace("/api/", "")}${item.flag}` 
      }
      
    } 
  }
  return {...selectList}
}

 
const dataService = {
  biometric:ApiGetBiometricStages,
  onBoarding:ApiGetOnBoardingStages,
  personal:ApiGetPersonalStages,
  identity:ApiGetIdentityStages, 
  fiatDeposit:ApiGetOnFiatDepositStages,
  newWallet:ApiGetNewWalletStages,
  location:ApiGetLocationStages,
  contact:ApiGetContactStages
}


export const initStages = async(config) => {

  const apiStages = await dataService[config.formName](config)

  if(!apiStages) return;
  const sourceStages = Object.keys(apiStages)
  
  let stages = {} 

  for (const stage of sourceStages) { 
    stages = {
      ...stages,
      [stage]:await createStage(apiStages[stage], formStructure(config.formName)?.stages[stage], stage)
    }
  } 

  
  return {
    ...formStructure(config.formName),
    stages
  }
}
