import { 
  LABEL_COLOR
} from './const'

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


const generateItemTag = (itemKey, uiTagName) => {
  const itemTagContainer = document.createElement("div")
  itemTagContainer.className = `fuente selectedItemTag _${itemKey}`
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