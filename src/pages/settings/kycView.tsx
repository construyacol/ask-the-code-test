import { 
    KycLayout,
    IdentityContainer,
    BenefitsContainer,
    ItemBenefit,
    IdentityContent,
    LevelsContainer,
    LevelContent,
    LevelDescriptionContent,
    RequirementMenu,
    ItemRequirementMenu,
    KycContentLayout,
    ContactLocationItem,
    ContactLocationContent,
    EditButton,
    EmptyStateLayout,
    FloatContainer,
    // InProcessRejectMessageCont
} from './styles'
import SettingElement from './settingElement'
import { 
    itemElement, 
    // levelData 
} from './types'
import { 
    useSettingValidation, 
    // useSettingsActions 
} from 'hooks/useSettingValidation'
import { isEmpty, merge, zipObject } from 'lodash'
import { useSelector } from "react-redux";
import { 
    FiCheckCircle, 
    // FiAlertCircle 
} from "react-icons/fi";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { useEffect, useState } from 'react';
// import { IoLocationOutline } from "react-icons/io5";
import { GoLocation } from "react-icons/go";
import { LEVELS_DATA } from 'const/levels'
import { BiEdit } from "react-icons/bi";
import { SelectListContainer, ItemListComponent } from 'components/forms/widgets/selectListComponent'
import { selectAvailableIdentities } from 'selectors'
import { useActions } from "hooks/useActions";
import ControlButton from "components/widgets/buttons/controlButton";
import { getIdentityState } from 'utils'
import { getCdnPath } from 'environment'



const IDENTITY_ELEMENTS = {
    "identity":{
        value:"identity",
        uiName:"Verificación de cuenta",
        uiDescription:"La verificación de cuenta es obligatoria para cumplir con las normativas vigentes.",
        cta:{
            uiEnabled:"Verificado",
            uiDisabled:"Verificar mi cuenta"
        },
        states:{
            uiEnabled:"Verificado",
            uiDisabled:"Sin verificar"
        }
    }
}

type requirementMenuTypes = {
    // currentLevelView:string,
    levelRequirements:levelRequirements,
    currentSection:string,
    setCurrentSection: React.Dispatch<React.SetStateAction<string | undefined>>
}

type levelRequirements = {
    name:string,
    uiName?:string,
    value?:string,
    requirements:string[],
    pendingRequirements:string[],
    itemsMenu?:any
}

// type IdentityComponentTypes = {
//     currentLevelView:string,
//     levelRequirements?:levelRequirements,
//     currentSection?:string
// }

const KycView = (props:any) => {
 
    const validations = useSettingValidation()

    return(
        <KycLayout>
            {
                Object.keys(IDENTITY_ELEMENTS).map((element, index) => {
                    const itemElement:itemElement = IDENTITY_ELEMENTS[element as keyof typeof IDENTITY_ELEMENTS]
                    const isCompleted = validations[element as keyof typeof validations] ? validations[element as keyof typeof validations]() : false
                    // const isCompleted = true
                    return <SettingElement
                        key={index}
                        itemElement={itemElement}
                        isCompleted={isCompleted}
                        isLastElement={(Object.keys(IDENTITY_ELEMENTS)?.length - 1) === index}
                        // isLastElement={false}
                        // AuxComponent={itemElement.cta && [
                        //     () => <ControlButton
                        //         label={`${isCompleted ? itemElement.cta?.uiEnabled : itemElement.cta?.uiDisabled}`}
                        //         handleAction={settingActions[element as keyof typeof settingActions]} 
                        //         type={isCompleted ? "secundary" : "primary"}
                        //         // loader={undefined} 
                        //         formValidate={true}
                        //         className="settingButton"
                        //         />
                        // ]}
                    />
                })
            }
            <IdentityComponent/>
        </KycLayout>
    )
}

export default KycView



 
const IdentityComponent = () => {

    const icons = {
        "level_1":GoLocation
    }
    const [ currentLevelView ] = useState("level_1")
    const [ currentSection, setCurrentSection ] = useState<string>()
    const [ levelRequirements, setLevelRequirements ] = useState<levelRequirements>()
    const [ coinsendaServices ] = useCoinsendaServices();
    const { user  } = useSelector(({ modelData }:any) => modelData);
    const identityState = getIdentityState(user?.identity)

    // console.log('identityState', identityState)
    // const currentPendingRequirement = props?.levelRequirements?.pendingRequirements[0]
    
    // const [ loader, setLoader ] = useState(true)
    // const settingActions = useSettingsActions()

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
    }, [])

    // console.log('pendingRequirements', levelRequirements?.pendingRequirements[0])
    
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

                {
                    !levelRequirements || !currentSection ?
                    <RequirementMenu>
                        {
                            ["1", "2"].map((item, index) => {
                                return(
                                    <ItemRequirementMenu className="skeleton">
                                        <p>-----  Skeleton  -----</p>
                                    </ItemRequirementMenu>
                                )
                            })

                        }
                    </RequirementMenu>
                   :
                    <RequirementMenuComponent
                        // currentLevelView={currentLevelView}
                        levelRequirements={levelRequirements}
                        currentSection={currentSection}
                        setCurrentSection={setCurrentSection}
                    />
                }

                <KycContentLayout className={`_layout ${currentSection || ''}`}>
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




const getUiCopy = (copyKey:string) => {
    let copys = {
        contact:"contacto y residencia",
        location:"contacto y residencia",
        identity:"identidad",
        rejected:"Tu cuenta NO fue aprobada, vuelve a enviar tus datos de identidad...",
        confirmed:"Estamos verificando tu identidad, este proceso puede tardar hasta 72 horas hábiles.",
        ctaInitial:"Verifica tu cuenta",
        ctaContinue:"Continuar la verificación",
        ctaTry:"Continuar la verificación",
        ctaDefault:"Continuar la verificación"
    }

    return copys[copyKey as keyof typeof copys]
}


const EmptyOrInProcessState = (props:any) => {

    const actions = useActions()
    const currentPendingRequirement = props?.levelRequirements?.pendingRequirements[0]
    const { identityState } = props

    const ctaUiLabel = ["contact"].includes(currentPendingRequirement) ? "ctaInitial":
    ["location"].includes(currentPendingRequirement) ? "ctaContinue" :
    ["rejected"].includes(identityState) && ["identity"].includes(currentPendingRequirement) ? "ctaTry" : "ctaDefault"

    const imgName =  identityState && (["confirmed"].includes(identityState) ? "fingerprint.gif" : "error.gif");

    const handleAction = async() => {
        const Element = await import(`components/forms/widgets/kyc/${currentPendingRequirement}Component/init`)
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <Element.default/>)
    }


    return(
        <EmptyStateLayout>
            {
                (identityState && ["rejected", "confirmed"].includes(identityState)) ?
                <>
                    <img src={`${getCdnPath('assets')}${imgName}`}  alt="" width={75} height={75} />
                    <p className="fuente">{getUiCopy(identityState)}</p>
                </>
                :
                <>
                    <p className="fuente emptyStateCopy_p">Completa tus datos de {`${currentPendingRequirement ? getUiCopy(currentPendingRequirement) : "__"}`}  para continuar con el proceso de verificación de tu cuenta</p>
                    <ControlButton
                        label={getUiCopy(ctaUiLabel)}
                        handleAction={handleAction} 
                        // type={isCompleted ? "secundary" : "primary"}
                        // loader={undefined} 
                        formValidate={true}
                        className="settingButton"
                    />
                </>
            }
        </EmptyStateLayout>
    )
}




const ContactLocationComponent = (props:any) => {

    // const currentPendingRequirement = props?.levelRequirements?.pendingRequirements[0]
    const { user  } = useSelector(({ modelData }:any) => modelData);
    const contactLocationData = merge(user?.contact, user?.location)

    // console.log('||||||||| ContactLocationComponent ==> ', props?.levelRequirements?.pendingRequirements[0])

    // FloatContainer

    return(
        <>
            <h3 className="fuente">
                Datos de contácto y residencia 
            </h3>

            <ContactLocationContent> 

                {/* {
                    currentPendingRequirement &&
                        <FloatContainer>
                            <EmptyState {...props}/>
                        </FloatContainer>
                } */}

                {   
                    contactLocationData &&
                        Object.entries(contactLocationData).map((item, index) => {
                            const itemKey = item[0];
                            const itemData:string = item[1] as string;

                            if(![
                                "phone", 
                                "email",
                                "country", 
                                "province",
                                "city",
                                "address"
                            ].includes(itemKey))return null;

                            const isEditable = ["phone", "email"].includes(itemKey)

                            return(
                                <ContactLocationItem key={index} className={`${isEditable ? 'isEditable' : ''}`}>
                                    <EditButton className="_editButton">
                                        <p className="fuente edit_p">Editar</p>
                                        <BiEdit 
                                            size={20}
                                            color="var(--paragraph_color)"
                                        />
                                    </EditButton>
                                    <p className="fuente contactLocationKey">{itemKey}</p>
                                    <p className="fuente2 contactLocationData">{itemData}</p>
                                </ContactLocationItem>
                            )
                        })
                }
            </ContactLocationContent>
        </>
    )
}



const IdentityListComponent = (props:any) => {

    // const currentPendingRequirement = props?.levelRequirements?.pendingRequirements[0]
    // const { user  } = useSelector(({ modelData }:any) => modelData);
    // const contactLocationData = merge(user?.contact, user?.location)
    const [ userIdentities, createNewId ] = useSelector((state) => selectAvailableIdentities(state));
    // console.log('||||||||||| userIdentities', userIdentities, createNewId)

    return(
        <>
            <h3 className="fuente">
                Documentos de identidad
            </h3>

            
            <SelectListContainer>

                <ItemListComponent 
                  className="createButton"
                  itemList={{
                    value:"createId",
                    icon:"add",
                    uiName:"Agregar nueva identidad"
                  }}
                  firstIndex={true}
                //   handleAction={createNewIdAction}
                />

                {
                    userIdentities && Object.keys(userIdentities).map((key, index) => {
                        // const isSelected = [userIdentities[key]?.value].includes(state?.identity?.value)
                        const isDisabled = !userIdentities[key]?.enabled
                        return <ItemListComponent 
                        key={index} 
                        className={`${isDisabled ? 'disabled' : ''}`}
                        itemList={userIdentities[key]}
                        firstIndex={index === 0 && !createNewId}
                        lastIndex={(Object.keys(userIdentities)?.length - 1) === index}
                        // isSelectedItem={isSelected}
                        // isMovilViewport={isMovilViewport}
                        // handleAction={selectIdentity}
                        auxUiName={userIdentities[key]?.nationality}
                        // AuxComponent={[
                        //     isMovilViewport ? () => null :
                        //     () => <IdNumberPanel
                        //     item={userIdentities[key]}
                        //     />
                        // ]}
                        />
                    })
                }
                
                
          </SelectListContainer>
        </>
    )
}




const RenderComponent = (props:any) => {
    const { component } = props
    let View = component as Element
    const Views = {
      location: <ContactLocationComponent {...props}/>, 
      identity: <IdentityListComponent {...props} />
    };
    return Views[View] || <div>No hay vista disponible</div>;
};



 
const RequirementMenuComponent = (props:requirementMenuTypes) => {

    const {
        // currentLevelView,
        currentSection,
        levelRequirements,
        setCurrentSection
    } = props
    
    let { itemsMenu, pendingRequirements, requirements } = levelRequirements

    const toogleSection = (e:any) => {
        setCurrentSection(e?.target?.dataset?.id)
    }

    console.log("------------------------------------------------------------------------------")
    
    return(
        <RequirementMenu>
            { 
                requirements && Object.entries(requirements).map((itemMenu, index) => {
                    let menuKey = itemMenu[1]
                    if(["contact"].includes(menuKey))return null
                    const isActive = currentSection?.includes(menuKey) && true
                    const isDisabled = pendingRequirements.length <= 1 ? false : (!isActive && zipObject(pendingRequirements)?.hasOwnProperty(menuKey))

                    // console.log("---- pendingRequirements", menuKey, isActive, isDisabled)
                    // console.log("---- pendingRequirements", pendingRequirements.length)

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



const BenefitsComponent = () => {

    // const IconVerified = isCompleted ? FiCheckCircle : FiAlertCircle;
    const IconVerified = FiCheckCircle;

    return(
        <BenefitsContainer>
            <h4 className="fuente">
                Beneficios actuales
            </h4>
            <ul>
                <ItemBenefit>
                    <IconVerified
                        size={18}
                        color="var(--green_color)"
                    />
                    <p className="fuente">Operaciones superiores a 40 millones</p>
                </ItemBenefit>
                <ItemBenefit>
                    <IconVerified
                        size={18}
                        color="var(--green_color)"
                    />
                    <p className="fuente">Operaciones superiores a 40 millones</p>
                </ItemBenefit>
            </ul>

        </BenefitsContainer>
    )
}
