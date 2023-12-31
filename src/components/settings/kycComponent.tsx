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
import { levelRequirements } from 'interfaces/settings/kyc'
import RequirementMenuComponent from "./requirementMenu"
import EmptyOrInProcessState from 'components/settings/emptyOrInProcessState'
import RenderSwitchComponent from 'components/renderSwitchComponent'
import BenefitsComponent from './benefits'
import LevelListComponent from './levelList'
import loadable from "@loadable/component";

const ContactLocationComponent = loadable(() => import(/* webpackPrefetch: true */ './contactLocation'), { fallback: <div>Cargando kyc...</div> });
const IdentityListComponent = loadable(() => import(/* webpackPrefetch: true */ './identityList'), { fallback: <div>Cargando Security...</div> });

const STAGE_COMPONENTS = {
  location:ContactLocationComponent,
  identity:IdentityListComponent,
}

const KycComponent = () => {

    const [ currentLevelView ] = useState("level_1")
    const [ currentSection, setCurrentSection ] = useState<string>()
    const [ levelRequirements, setLevelRequirements ] = useState<levelRequirements>()
    const [ coinsendaServices ] = useCoinsendaServices(); 
    const { user  } = useSelector(({ modelData }:any) => modelData);
    const identityState = getIdentityState(user?.identity)
 
    const initSections = async() => {
        const _levelRequirements = await coinsendaServices.createRequirementLevel(currentLevelView, user?.level !== currentLevelView)
        setLevelRequirements(_levelRequirements)
        const { pendingRequirements, requirements } =_levelRequirements
        const requirementList = isEmpty(pendingRequirements) ? requirements : pendingRequirements
        const _currentSection = ["accepted"].includes(identityState) ? "identity" : ["location", "contact"].includes(requirementList[0]) ? "location" : requirementList
        setCurrentSection(_currentSection)
    }

    useEffect(() => {
        initSections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.location, user?.contact, user?.identity])

    const inProgressKyc = (["rejected", "confirmed"].includes(identityState) || levelRequirements?.pendingRequirements[0]) ? true : false

    return(
        <IdentityContainer>
             
            <IdentityContent className="_identityContent">

                <LevelListComponent
                    levelRequirements={levelRequirements}
                    currentLevelView={currentLevelView}
                    user={user}
                />

                <KycContentLayout  
                    className={`_layout ${currentSection || ''}  ${!levelRequirements || !currentSection ? "loading" : ""}`}
                >
  
                    <RequirementMenuComponent
                        levelRequirements={levelRequirements}
                        currentSection={currentSection}
                        setCurrentSection={setCurrentSection}
                        inProgressKyc={inProgressKyc}
                    /> 

                    {
                        (inProgressKyc && levelRequirements) &&
                            <FloatContainer>
                                <EmptyOrInProcessState 
                                    levelRequirements={levelRequirements}
                                    identityState={identityState}
                                    user={user}
                                />
                            </FloatContainer>
                    }

                    {
                        (levelRequirements && currentSection) &&
                            <RenderSwitchComponent 
                                STAGE_COMPONENTS={STAGE_COMPONENTS}
                                component={currentSection}
                                currentSection={currentSection}
                                levelRequirements={levelRequirements}
                            />
                    }

                </KycContentLayout>

            </IdentityContent>
            
            {
                ["accepted"].includes(identityState) &&
                    <BenefitsComponent user={user}/>
            }

        </IdentityContainer>
    )
}



  
  

export default KycComponent

