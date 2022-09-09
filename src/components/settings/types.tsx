

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
    AuxComponent?:any,
    skeleton?:boolean,
    handleAction?:any
}


export type levelData = {
    name?:string,
    uiName?:string,
    requeriments?:Object
}


export type levelRequirements = {
    name:string,
    uiName?:string,
    value?:string,
    requirements:string[],
    pendingRequirements:string[],
    itemsMenu?:any
}


export type requirementMenuTypes = {
    // currentLevelView:string,
    levelRequirements?:levelRequirements,
    currentSection?:string,
    setCurrentSection: React.Dispatch<React.SetStateAction<string | undefined>>,
    inProgressKyc?:boolean
}