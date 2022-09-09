import { useState, useEffect } from 'react'
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { useSelector } from "react-redux";
import { getIdentityState } from 'utils'
import { isEmpty } from 'lodash'
import { 
    IdentityContainer,
    IdentityContent,
    KycContentLayout,
    FloatContainer,
} from './styles'
import { levelRequirements } from './types'
import RequirementMenuComponent from "./requirementMenu"
import EmptyOrInProcessState from 'components/settings/emptyOrInProcessState'
import RenderComponent from './renderSwitch'
import BenefitsComponent from './benefits'
import LevelListComponent from './levelList'


const KycComponent = (props:any) => {

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

                <LevelListComponent
                    levelRequirements={levelRequirements}
                    currentLevelView={currentLevelView}
                    user={user}
                />

                <KycContentLayout className={`_layout ${currentSection || ''}`}>

                    <RequirementMenuComponent
                        levelRequirements={levelRequirements}
                        currentSection={currentSection}
                        setCurrentSection={setCurrentSection}
                        inProgressKyc={(["rejected", "confirmed"].includes(identityState) || levelRequirements?.pendingRequirements[0]) ? true : false}
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

