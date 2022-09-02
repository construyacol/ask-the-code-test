

export type itemState = {
    uiEnabled:string,
    uiDisabled:string,
}

export type itemElement = {
    value:string,
    uiName:string,
    uiDescription?:string,
    states?:itemState,
    cta?:itemState
}

export type settingType = {
    itemElement:itemElement,
    isCompleted:boolean,
    isLastElement:boolean,
    AuxComponent?:any
}


export type levelData = {
    value?:string,
    uiName?:string,
    requeriments?:Object
}