import { 
  LABEL_COLOR, 
  INFO_URL_API 
} from './const'
import formStructure from './config.js'
import { mainService } from "../../services/MainService";

// import countryValidators from './apiRes'

export const getBody = (body, { stages: { nationality } }) => {
  const prefix = nationality?.selectList[body?.meta_phone].prefix[0]
  const _body = {...body}
  delete _body.meta_phone
  _body.phone = `${prefix} ${body.phone}`
  return _body
}

export const parseOnlyLetters = (value) => {
  return value.replace(/[^a-zA-Z ]/g, '')
}

export const parseOnlyNumbers = (value) => {
  return value.replace(/[^0-9]/g, '')
}

export const parseAlphanumeric = (value) => {
  return value.replace(/[^0-9a-zA-Z]/g, '') 
}


export const writeOnLabel = (target, message, typeMessage = 'default') => {
  let labelElement = document.querySelector(target)
  if(!labelElement){return}
  labelElement.style.color = LABEL_COLOR[typeMessage]
  labelElement.innerHTML = message 
 }

export const validateLabelMsg = (value, data) => {
  const targetElement = `.label_text__${data.key}`
  if(!data?.settings?.errors){return}
  for (let error of data.settings.errors) {
    if(value.match(error.pattern)){
      writeOnLabel(targetElement, error.message, 'error')
    }else{
      writeOnLabel(targetElement, data.settings.defaultMessage)
    }
  }
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

export const addItemTag = (itemKey, uiTagName, inpuTarget) => {
  if(!document.querySelector(`.selectedItemTag._${itemKey}`)){
    // console.log('||||| addItemTag ==> ', itemKey)
    const target = inpuTarget || ".inputContainer__"
    const inputContainer = document.querySelector(target)
    const itemTag = generateItemTag(itemKey, uiTagName)
    inputContainer.appendChild(itemTag)
    document.querySelector(`[name="${itemKey}"]`)?.blur()
  }
}

export const removeItemTag = (e, itemKey, callback) => {
  if(!e?.target?.className?.includes){return}
  if(e.target?.className?.includes("selectedItemTag__closeButton")){
    e.stopPropagation()
    document.querySelector(".selectedItemTag").remove()
    if(itemKey){
      document.querySelector(`[name="${itemKey}"]`).value = ""
      document.querySelector(`[name="${itemKey}"]`).focus()
    }
    callback && callback({target:{value:""}});
  }
}

export const debugItemTag = itemKey => {
  const anyTagExist = document.querySelector(`.selectedItemTag`)
  const currentItemTag = document.querySelector(`.selectedItemTag._${itemKey}`)
  if(anyTagExist && !currentItemTag){
    return anyTagExist.remove()
  }
}

const generateItemTag = (itemKey, uiTagName) => {
  const itemTagContainer = document.createElement("div")
  itemTagContainer.className = `selectedItemTag _${itemKey}`
  itemTagContainer.id = `selectedItemTag`
  const itemTag = document.createElement("div")
  itemTag.className = `selectedItemTag__title`
  const uiNameElement = document.createElement("p")
  uiNameElement.innerHTML = uiTagName
  const closeButtom = document.createElement("p")
  closeButtom.innerHTML = "x"
  closeButtom.className = "selectedItemTag__closeButton"

  itemTag.appendChild(uiNameElement)
  itemTag.appendChild(closeButtom)
  itemTagContainer.appendChild(itemTag)
  return itemTagContainer
}


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
      if(stage.key === 'nationality'){
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


const getBiometricStages = async() => {
  let stages = {}
  const res = await mainService.getUserBiometric()
  if(!res) return;
  for (const keyChallenge in res.challenge) { 
    stages = {
      ...stages,
      [keyChallenge]:{
        key:keyChallenge,
        solved:res.solved,
        biometricId:res.id,
        ui_type: "img",
        ui_name: keyChallenge === "smile" ? "Sonríe" : "Abre la boca y levanta las cejas"
      }
    }
  }
  return stages
}

const dataService = {
  biometric:getBiometricStages
}


export const initStages = async(config) => {

  const apiStages = await dataService[config.formName]()
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
