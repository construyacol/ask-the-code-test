

export const setMetaPhoneData = (setState, dataForm) => {
    setState(prevState => {
        return {
            ...prevState,
            selectList:dataForm?.stages?.nationality?.selectList,
            uiType:"select",
            key:"meta_phone",
            uiName:"Define el prefijo",
            settings:{
                ...prevState.settings,
                defaultMessage:"Elíge el país para asignar un prefijo",
                errors:[
                    { pattern:/[^a-zA-Z _]{1,30}/g, message:'Solo se permiten letras...'}
                ]
            }
        }
    })
}

const addStyleColorToInputWithItem = () => {
    const prefixInput = document.querySelector('.prefixInputContainer>input')
    if(!prefixInput){return}
    prefixInput.style.color = 'transparent'
    setTimeout(() => prefixInput.style.color = 'gray', 500)
}


export const colapseContainer = () => {
    const prefixContainer = document.querySelector(`.prefixContainer_`)
    prefixContainer.style.width = '75px'
    prefixContainer.style.borderRight = '1px solid gray'
    addStyleColorToInputWithItem()
}

export const inputFocus = (inputName, time = 0) => {
    setTimeout(() => document.querySelector(`[name="${inputName}"]`)?.focus(), time)
}

export const extendContainer = () => {
    const prefixContainer = document.querySelector(`.prefixContainer_`)
    prefixContainer.style.width = 'calc(100% - 32px)'
    prefixContainer.style.borderRight = '1px solid transparent'
      // const inputElement = prefixContainer?.childNodes[2]?.childNodes[0]
    // setTimeout(() => inputElement?.focus(), 250)
}

export const setParentConfig = () => {
    // set initial width status to parent container
    let inputContainer = document.querySelector(`.inputContainer__`)
    let prefixContainerWidth = document.querySelector(`.prefixContainer_`)?.clientWidth || 150
    inputContainer.style.paddingLeft = `${prefixContainerWidth}px`
    inputContainer.style.width = `calc(100% - ${prefixContainerWidth}px)`
}

export const removeParentConfig = () => {
    let inputContainer = document.querySelector(`.inputContainer__`)
    if(!inputContainer){return}
    inputContainer.style.paddingLeft = `0px`
    inputContainer.style.width = `100%`
}
