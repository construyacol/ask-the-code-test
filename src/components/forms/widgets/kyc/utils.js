import BigNumber from "bignumber.js";
// import moment from 'moment'
// import 'moment/locale/es'
import { 
  LABEL_COLOR
} from './locationComponent/const'
import {
  NEXT_SELECT_LIST
} from '../../const'

import {
  // createSelectList,
  getSelectList
} from '../../utils'

const isIsoDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g
const isMaskDate = /[0-9]{2}[/][0-9]{2}[/][0-9]{4}/g

export const parseTimeStampToDate = (timeStamp) => {
  if(timeStamp.includes("-")) return timeStamp;
  let date = new Date(new BigNumber(timeStamp).multipliedBy(1000).toNumber()).toISOString()
  const isoDate = date.match(isIsoDate)
  return isoDate && isoDate[0]
}

export const parseDateToTimeStamp = date => {
  const { year, month, day } = formatJsonUTFDate(date)
  const timeStamp = new Date(year, month, day).getTime()
  return BigNumber(timeStamp).div(1000).toString()
}

const checkMaskDate = date => {
  if(!date)return;
  return date.match(isMaskDate)
}
  
export const formatJsonUTFDate = date => {
  if(!date?.match(isIsoDate))return date
  let _date = date.split("-")
  const year = _date[0]
  const month = (parseInt(_date[1]) - 1)
  const day = _date[2]
  return {
    day,
    month,
    year
  }
}

export const formatMaskDate = date => {
  if(!checkMaskDate(date))return date;
  let _date = date.split("/")
  const day = _date[0]
  const month = _date[1]
  const year = _date[2]
  return `${year}-${month}-${day}`
}


export const removeItemTag = (e, itemKey, callback) => {

    if(!e?.target?.className?.includes){return}
    if(e.target?.className?.includes("selectedItemTag__closeButton")){
      e.stopPropagation()
      if(itemKey){
        document.querySelector(`[name="${itemKey}"]`).value = ""
        document.querySelector(`[name="${itemKey}"]`).focus()
      }
      if(callback){
        callback({target:{value:""}});
      }
      return document.querySelector("#selectedItemTag").remove();
    }
}
  
export const debugItemTag = itemKey => { 
    const anyTagExist = document.querySelector(`.selectedItemTag`)
    const currentItemTag = document.querySelector(`.selectedItemTag._${itemKey}`)
    if(anyTagExist && !currentItemTag){
        return anyTagExist.remove()
    }
}


export const getBody = (body, { stages: { nationality } }) => {
    console.log('|||||||||||||||||  select List =====> ', nationality?.selectList, body?.meta_phone)
    const prefix = nationality?.selectList[body?.meta_phone]?.prefix ? nationality?.selectList[body?.meta_phone]?.prefix[0] : ''
    const _body = {...body}
    delete _body.meta_phone
    _body.phone = `${prefix} ${body.phone}`
    return _body
}


export const parseOnlyLetters = (value) => {
  return value.replace(/[^a-zA-Z\u00f1\u00d1 ]/g, '')
}

export const parseOnlyNumbers = (value) => {
  return value.replace(/[^0-9]/g, '')
}

export const parseOnlyCurrencyAmount = (value) => {
  return value.replace(/[^0-9.,]/g, '')
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
  // console.log('validateLabelMsg', value)
  for (let error of data.settings.errors) {
    if(value.match(error.pattern)){
      writeOnLabel(targetElement, error.message, 'error')
    }else{
      writeOnLabel(targetElement, data.settings.defaultMessage)
    }
  }
}

export const addItemTag = (itemKey, uiTagName, inpuTarget) => {
  if(!document.querySelector(`.selectedItemTag._${itemKey}`)){
    const target = inpuTarget || ".inputContainer__"
    const inputContainer = document.querySelector(target)
    const itemTag = generateItemTag(itemKey, uiTagName)
    inputContainer.appendChild(itemTag)
    document.querySelector(`[name="${itemKey}"]`)?.blur()
  }
}


const generateItemTag = (itemKey, uiTagName) => {
  const itemTagContainer = document.createElement("div")
  itemTagContainer.className = `fuente selectedItemTag _${itemKey}`
  itemTagContainer.id = `selectedItemTag`
  const itemTag = document.createElement("div")
  itemTag.className = `selectedItemTag__title`
  const uiNameElement = document.createElement("p")
  uiNameElement.innerHTML = uiTagName?.toLowerCase()
  const closeButtom = document.createElement("p")
  closeButtom.innerHTML = "x"
  closeButtom.className = "selectedItemTag__closeButton"

  itemTag.appendChild(uiNameElement)
  itemTag.appendChild(closeButtom)
  itemTagContainer.appendChild(itemTag)
  return itemTagContainer
}

export const getNextSelectList = async ({
  state,
  stageData,
  setDataForm
}) => {
  const currentList = stageData?.key
  if(!NEXT_SELECT_LIST[currentList])return;
  const nextStageName = NEXT_SELECT_LIST[currentList]
  const selectList = await getSelectList(nextStageName, state[stageData?.key])
  if(!selectList || (selectList && !Object.keys(selectList)?.length)){
    return setDataForm(prevState => {
      return { 
        ...prevState,
        stages:{
          ...prevState.stages,
          [nextStageName]:{
            ...prevState.stages[nextStageName],
            uiType:'text',
            selectList:null
          }
        } 
      }
    })
  }
  setDataForm(prevState => {
    return { 
      ...prevState,
      stages:{
        ...prevState.stages,
        [nextStageName]:{
          ...prevState.stages[nextStageName],
          uiType:'select',
          selectList
        }
      } 
    }
  })
  return selectList
}