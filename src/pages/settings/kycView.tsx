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
    EditButton
} from './styles'
import SettingElement from './settingElement'
import { itemElement, levelData } from './types'
import { useSettingValidation, useSettingsActions } from 'hooks/useSettingValidation'
import { isEmpty, merge } from 'lodash'
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


// import ControlButton from "components/widgets/buttons/controlButton";


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
    // const [ loader, setLoader ] = useState(true)
 
    // const settingActions = useSettingsActions()

    const initSections = async() => {
        const _levelRequirements = await coinsendaServices.createRequirementLevel(currentLevelView)
        setLevelRequirements(_levelRequirements)
        const { pendingRequirements, requirements } =_levelRequirements
        const requirementList = isEmpty(pendingRequirements) ? requirements : pendingRequirements
        const _currentSection = ["location", "contact"].includes(requirementList[0]) ? "location" : requirementList
        setCurrentSection(_currentSection)
        //     setLoader(false)
        //     await coinsendaServices.proofEndpoints()
        //     debugger
        //     // if(res){
        //         // setLoading(true)
        //         // const { requirements } = res
        //         // const currentRequirement = requirements[0]
        //         // const Element = await import(`../kyc/${currentRequirement}Component/init`)
        //         // eslint-disable-next-line react/jsx-pascal-case
        //         // actions.renderModal(() => <Element.default/>)
        //     // }
    }

    useEffect(() => {
        initSections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    
    return(
        <IdentityContainer>
            <IdentityContent className="_identityContent">
                <LevelsContainer>
                    {
                       !levelRequirements ?
                        <p>Cargando...</p>
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
                    <p>Cargando...</p>
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
                        levelRequirements && currentSection &&
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


const ContactLocationComponent = (props:any) => {

    // const currentPendingRequirement = props?.levelRequirements?.pendingRequirements[0]
    const { user  } = useSelector(({ modelData }:any) => modelData);
    const contactLocationData = merge(user?.contact, user?.location)

    return(
        <>
            <h3 className="fuente">
                Datos de contácto y residencia 
            </h3>
            <ContactLocationContent>
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
                    const isDisabled = !isActive && !isEmpty(pendingRequirements)

                    return(
                        <ItemRequirementMenu 
                            key={index} 
                            className={`${menuKey} ${isActive ? 'isActive' : ''} ${isDisabled ? 'disabled' : ''}`} 
                            data-id={menuKey}
                            onClick={isEmpty(pendingRequirements) ? toogleSection : null}
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
