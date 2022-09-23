
export type levelRequirements = {
    name:string,
    uiName?:string,
    value?:string,
    requirements:string[],
    pendingRequirements:string[],
    itemsMenu?:any
}

export type requirementMenuTypes = {
    levelRequirements?:levelRequirements,
    currentSection?:string,
    setCurrentSection: React.Dispatch<React.SetStateAction<string | undefined>>,
    inProgressKyc?:boolean
}

export type levelListProps = {
    levelRequirements?:levelRequirements,
    currentLevelView:string,
    user?:any,
} 

export type emptyStatePropTypes = {
    levelRequirements:levelRequirements,
    identityState:string,
    user?:any
}

export type levelData = {
    name?:string,
    uiName?:string,
    requirements?:string[]
}

export type handleIdentity = {
    isNewId?:boolean
    currentIdentity?:any,
    identityState?:string
}

export interface stateInterface {
    [id: string]: boolean;
}