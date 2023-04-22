import { 
  // COUNTRY_URL_API,
  API_FETCH_SELECT_LIST,
  INFO_URL_API
} from './const'
import { isArray } from 'lodash'
import ungapStructuredClone from '@ungap/structured-clone';
import { mainService } from '../../services/MainService'
import formStructure from './config.js'
import { ApiGetOnBoardingStages } from './widgets/onBoardingComponent/api'
// import { ApiGetPersonalStages } from './widgets/personalKycComponent/oldApi'
import { ApiGetLocationStages } from './widgets/kyc/locationComponent/api'
import { ApiGetContactStages, getDefaultContactState } from './widgets/kyc/contactComponent/api'
import { 
  ApiGetIdentityStages, 
  ApiGetIdentityErrors,
  ApiGetIdentityState
} from './widgets/kyc/identityComponent/api'
import { ApiGetBiometricStages } from './widgets/biometricKycComponent/api'
import { ApiGetNewWalletStages } from './widgets/newWallet/api'
import { ApiGetNewWAccountStages } from './widgets/newWithdrawAccount/api'
import { FIAT_DEPOSIT_TYPES, ApiGetOnFiatDepositStages } from './widgets/fiatDeposit/api'
import { FIAT_WITHDRAW_TYPES, ApiGetFiatWithdrawStages } from './widgets/fiatWithdraw/api'

// import countryValidators from './apiRes'

export const filterElement = (list, query, isExact) => {


  let result = {}
  Object.keys(list).forEach(itemList => {
    let condition = isExact ? itemList.includes(query?.toLowerCase()) : query?.toLowerCase()?.includes(itemList)
    // if(query?.toLowerCase()?.includes(itemList)){
    //   console.log('|||||| filterElement ==> ', itemList, `${query}_`)
    // }
    if(condition){
      return result = { ...result, [itemList]:list[itemList] }
    }
  })

  Object.keys(result).forEach(itemList => {
    if(itemList === query?.toLowerCase()){
      result = { [itemList]:list[itemList] }
    }
    // if(itemList === query?.toLowerCase()){
    //   result = { itemList }
    // }
  })
  return Object.keys(result).length ? result : list
}


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

export const depurateSelectList = (objectList) => {
  let selectList = typeof objectList === 'object' ? ungapStructuredClone(objectList) : {...objectList};
  delete selectList.ui_name
  delete selectList.ui_type
  delete selectList.settings
  // eslint-disable-next-line array-callback-return
  Object.keys(selectList).forEach(key => {
    if(typeof selectList[key] !== 'object') return;
    selectList[key].uiName = selectList[key]?.ui_name || selectList[key]?.name || selectList[key]?.uiName
    selectList[key].value = key
    delete selectList[key]?.ui_name
    delete selectList[key]?.name
    delete selectList[key]?.code
  })
  return selectList
} 
 


const clearSourceData = async(data) => {
  let clearSource = {}
  for(const key in data){ 
    if(["ui_name", "ui_type"].includes(key)){
      clearSource = {
        ...clearSource,
        [key]:data[key]
      }
    }
  }
  return clearSource
}

export const createStage = async(source, modelated = {}, index) => {
  let _source = typeof source === 'object' ? ungapStructuredClone(source) : {...source};
  if(_source?.ui_type === 'select')_source = await clearSourceData(_source)
  let stage = {}
  _source.uiName = _source.ui_name || _source.uiName || modelated?.ui_name || modelated?.uiName
  _source.uiType = _source.ui_type || _source.uiType || modelated?.ui_type || modelated?.uiType
  delete _source.ui_name
  delete _source.ui_type

  for(const key of Object.keys(_source)){ 
    stage = {
      key:index, 
      ...stage,
      ...modelated,
      [key]:_source[key]
    } 
  }

  return stage
}

 
export const convertArrayToObjectList = async(list) => {
  if(!isArray(list))return list;
  let selectList = {}
  for (const item of list) {
    // item.code = item.code.split(" ").join("_")
    item.currencySymbol = item.currency_symbol
    delete item.currency_symbol
    let itemUiName = item?.name || item?.uiName
    if(item?.code){
      selectList = {
        ...selectList,
        [item?.code]:{
          ...item,
          name:itemUiName
        }
      }
      if(item.flag) selectList[item?.code].flag = `${INFO_URL_API?.replace("/api/", "")}${item.flag}`;
    } 
  }
  return {...selectList}
}


export const getSelectList = async(listKey, payload) => {
  let list  
  let res = await mainService[API_FETCH_SELECT_LIST[listKey]] ? await mainService[API_FETCH_SELECT_LIST[listKey]](payload) : (payload && payload[listKey])
  if(!res){return}
  list = await convertArrayToObjectList(res) //convert array list to object list
  return depurateSelectList(list)
}


export const recursiveAddList = async(mapObject, payload) => {
  let apiStages = ungapStructuredClone(mapObject)
  let stages = {} 
  
  for(const stage of Object.keys(apiStages)){ 
    stages = {
      ...stages,
      [stage]:apiStages[stage]
    }
    if(["select"].includes(stages[stage]?.uiType)){
      stages[stage].selectList = await getSelectList(stage, payload)
    }  
    if(["recursiveLevel"].includes(stages[stage]?.uiType)){
      stages[stage] = await recursiveAddList(stages[stage], payload || apiStages[stage])
    }
  }
  
  return stages
}


 
const dataService = {
  biometric:ApiGetBiometricStages,
  onBoarding:ApiGetOnBoardingStages,
  // personal:ApiGetPersonalStages,
  identity:ApiGetIdentityStages, 
  newWallet:ApiGetNewWalletStages,
  location:ApiGetLocationStages,
  contact:ApiGetContactStages,
  newWithdrawAccount:ApiGetNewWAccountStages,
  [FIAT_DEPOSIT_TYPES.FORM]:ApiGetOnFiatDepositStages,
  [FIAT_WITHDRAW_TYPES.FORM]:ApiGetFiatWithdrawStages
}

const getErrors = (config) => {
  const ERRORS = {
    identity:ApiGetIdentityErrors
  }
  return ERRORS[config.formName] && ERRORS[config.formName](config)
}

 
const getDefaultState = (config) => {
  const STATES = {
    identity:ApiGetIdentityState,
    contact:getDefaultContactState
  }
  return STATES[config.formName] && STATES[config.formName](config)
}
 
export const initStages = async(_config, API_STAGES) => {
  let config = {..._config}
  config.handleError = getErrors(config)
  config.defaultState = getDefaultState(config)
  const apiStages = API_STAGES || await dataService[config.formName](config)
  if(!apiStages) return;

  const sourceStages = Object.keys(apiStages)
  let stages = {} 
  for (const stage of sourceStages) { 
    stages = {
      ...stages, 
      [stage]:await createStage(apiStages[stage], formStructure(config.formName)?.stages[stage], stage)
    }
  } 

  stages = await recursiveAddList(stages)

  return {
    ...formStructure(config.formName),
    handleError:config.handleError,
    defaultState:config.defaultState,
    stages,
    formName:config?.formName
  }
}
  