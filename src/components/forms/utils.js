import { 
  INFO_URL_API  
} from './const'

import formStructure from './config.js'
import { ApiGetOnBoardingStages } from './widgets/onBoardingComponent/api'
import { ApiGetPersonalStages } from './widgets/personalKycComponent/api'
import { ApiGetBiometricStages } from './widgets/biometricKycComponent/api'
import { ApiGetOnFiatDepositStages } from './widgets/fiatDeposit/api'


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



const generateSelectList = (objectList) => {
  let selectList = {...objectList}
  delete selectList.ui_name
  delete selectList.ui_type
  // eslint-disable-next-line array-callback-return
  Object.keys(selectList).map(key => {
    selectList[key].uiName = selectList[key]?.ui_name || selectList[key]?.name
    selectList[key].value = key
    delete selectList[key]?.ui_name
    delete selectList[key]?.name
    delete selectList[key]?.id
    delete selectList[key]?.code
  })
  return selectList
}

const createStage = (source, modelated, index) => {
  
  let _source = {...source}
  let stage = {}

  _source.uiName = _source.ui_name
  _source.uiType = _source.ui_type
  delete _source.ui_name
  delete _source.ui_type
  
  Object.keys(_source).map(async key => {
    // TODO: refactor to for -- in
    // if(key.match("uiName") || key.match("uiType")){
      stage = {
        key:index,
        ...stage,
        ...modelated,
        [key]:_source[key]
      }
    // }
    if(stage[key] === 'select'){
      let selectSource = source
      if(['nationality', 'country'].includes(stage.key)){
        selectSource = await getNationalityList()
      }
      stage.selectList = generateSelectList(selectSource)
    }
  })
  
  return stage
}


const getNationalityList = async() => {
  // TODO : fix compatibility of country lists 
  const response = await fetch(`${INFO_URL_API}/api/countrys`);
  const res  = await response.json()
  if(!res){return}
  let countrySource = {}
  for (const country of res) {
    // console.log('country', country)
    country.code = country.code.split(" ").join("_")
    country.currencySymbol = country.currency_symbol
    delete country.currency_symbol
    countrySource = {
      ...countrySource,
      [country.code]:{
        ...country,
        flag:`${INFO_URL_API}${country.flag}` 
      }
    }
  }
  return countrySource
}

 
const dataService = {
  biometric:ApiGetBiometricStages,
  onBoarding:ApiGetOnBoardingStages,
  personal:ApiGetPersonalStages,
  fiatDeposit:ApiGetOnFiatDepositStages
}


export const initStages = async(config) => {

  const apiStages = await dataService[config.formName](config)
  if(!apiStages) return;
  const sourceStages = Object.keys(apiStages)
  
  let stages = {} 

  for (const stage of sourceStages) { 
    stages = {
      ...stages,
      [stage]:createStage(apiStages[stage], formStructure(config.formName)?.stages[stage], stage)
    }
  } 

  
  return {
    ...formStructure(config.formName),
    stages
  }
}