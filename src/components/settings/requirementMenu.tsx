

import { 
    RequirementMenu,
    ItemRequirementMenu,
} from './styles'
import { requirementMenuTypes } from './types'
import { zipObject } from 'lodash'

const RequirementMenuComponent = (props:requirementMenuTypes) => {
  
    const {
        // currentLevelView,
        currentSection,
        levelRequirements,
        setCurrentSection,
        inProgressKyc
    } = props
    
    const toogleSection = (e:any) => {
        setCurrentSection(e?.target?.dataset?.id)
    }


    if(!levelRequirements || !currentSection){
        return(
            <RequirementMenu className="skeleton"> 
                {
                    ["1", "2"].map((item, index) => {
                        return(
                            <ItemRequirementMenu key={index}>
                                <p>-----  Skeleton  -----</p>
                            </ItemRequirementMenu>
                        )
                    })
                }
            </RequirementMenu>
        )
    }
                        
    let { itemsMenu, pendingRequirements, requirements } = levelRequirements

    return( 
        <RequirementMenu className={`${inProgressKyc ? "inProgressKyc" : ""}`}>
            { 
                requirements && Object.entries(requirements).map((itemMenu, index) => {
                    let menuKey = itemMenu[1]
                    if(["contact"].includes(menuKey))return null
                    const isActive = currentSection?.includes(menuKey) && true
                    const isDisabled = pendingRequirements.length <= 1 ? false : (!isActive && zipObject(pendingRequirements)?.hasOwnProperty(menuKey))

                    return(
                        <ItemRequirementMenu 
                            key={index} 
                            className={`${menuKey} ${isActive ? 'isActive' : ''} ${isDisabled ? 'disabled' : ''}`} 
                            data-id={menuKey}
                            onClick={isDisabled ? null : toogleSection}
                        >
                            <p className="fuente">{itemsMenu[menuKey]?.uiName}</p>
                        </ItemRequirementMenu>
                    )
                })
            }
        </RequirementMenu>
    )
}


export default RequirementMenuComponent