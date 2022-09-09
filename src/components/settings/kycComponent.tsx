import { useState, useEffect } from 'react'
import { GoLocation } from "react-icons/go";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { useSelector } from "react-redux";
import { getIdentityState } from 'utils'
import { isEmpty } from 'lodash'

import { 
    IdentityContainer,
    IdentityContent,
    LevelsContainer,
    LevelContent,
    LevelDescriptionContent,
    KycContentLayout,
    FloatContainer,
} from './styles'

import { LEVELS_DATA } from 'const/levels'
import { levelData, levelRequirements } from './types'
import RequirementMenuComponent from "./requirementMenu"
import EmptyOrInProcessState from 'components/settings/emptyOrInProcessState'
import RenderComponent from './renderSwitch'
import BenefitsComponent from './benefits'


const KycComponent = (props:any) => {

    const icons = {
        "level_1":GoLocation
    }
    const [ currentLevelView ] = useState("level_1")
    const [ currentSection, setCurrentSection ] = useState<string>()
    const [ levelRequirements, setLevelRequirements ] = useState<levelRequirements>()
    const [ coinsendaServices ] = useCoinsendaServices();
    const { user  } = useSelector(({ modelData }:any) => modelData);
    const identityState = getIdentityState(user?.identity)


    const initSections = async() => {
        const _levelRequirements = await coinsendaServices.createRequirementLevel(currentLevelView)
        setLevelRequirements(_levelRequirements)
        const { pendingRequirements, requirements } =_levelRequirements
        const requirementList = isEmpty(pendingRequirements) ? requirements : pendingRequirements
        const _currentSection = ["location", "contact"].includes(requirementList[0]) ? "location" : requirementList
        setCurrentSection(_currentSection)
    }

    useEffect(() => {
        initSections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.location, user?.contact, user?.identity])

    
    return(
        <IdentityContainer>
            <IdentityContent className="_identityContent">

                <LevelsContainer>
                    {
                       !levelRequirements ?
                        ["1", "2"].map((levelSkeleton, index) => {
                            return(
                                <LevelContent
                                    key={index}
                                    className="skeleton"
                                />
                            )
                        })
                       :
                       Object.entries(LEVELS_DATA).map((level, index) => {

                            const levelKey = level[0]
                            const levelData:levelData = level[1]
                            const requirements = [levelKey].includes(levelRequirements?.name) ? levelRequirements.requirements : levelData.requeriments
                            const disabled = !requirements || isEmpty(requirements)
                            const LevelIcon = icons[levelKey as keyof typeof icons]
                            const isActive = currentLevelView === levelKey

                            return( 
                                <LevelContent 
                                key={index}
                                className={`${disabled ? 'disabled' : 'enabled'} ${isActive ? "isActived" : ""} `}
                                >   
                                    {
                                        LevelIcon &&
                                        <LevelIcon
                                            className="_levelIcon"
                                            size={27}
                                            color="var(--primary)"
                                        />
                                    }
                                    <LevelDescriptionContent>
                                        <p className={`_title ${disabled ? "disabled" : ""} `}>{levelData.uiName}</p>
                                        <p className={`_description ${disabled ? "disabled" : ""} `}>0% completado</p>
                                    </LevelDescriptionContent>
                                </LevelContent>
                            )
                        })
                    }
                </LevelsContainer>

                <KycContentLayout className={`_layout ${currentSection || ''}`}>

                        <RequirementMenuComponent
                            levelRequirements={levelRequirements}
                            currentSection={currentSection}
                            setCurrentSection={setCurrentSection}
                        />



                    {
                        (["rejected", "confirmed"].includes(identityState) || levelRequirements?.pendingRequirements[0]) &&
                            <FloatContainer>
                                <EmptyOrInProcessState 
                                    levelRequirements={levelRequirements}
                                    identityState={identityState}
                                />
                            </FloatContainer>
                    }
                    {
                        (levelRequirements && currentSection) &&
                            <RenderComponent 
                                component={currentSection}
                                currentSection={currentSection}
                                levelRequirements={levelRequirements}
                            />
                    }
                </KycContentLayout>

            </IdentityContent>

            <BenefitsComponent/>

        </IdentityContainer>
    )
}

export default KycComponent

