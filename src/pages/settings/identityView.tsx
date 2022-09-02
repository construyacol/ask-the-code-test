import { 
    IdentityLayout,
    IdentityContainer,
    BenefitsContainer,
    ItemBenefit,
    IdentityContent,
    LevelsContainer,
    LevelContent,
    LevelDescriptionContent
} from './styles'
import SettingElement from './settingElement'
import { itemElement, levelData } from './types'
import { useSettingValidation, useSettingsActions } from 'hooks/useSettingValidation'
// import { isEmpty } from 'lodash'
import ControlButton from "components/widgets/buttons/controlButton";
import { 
    FiCheckCircle, 
    // FiAlertCircle 
} from "react-icons/fi";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { useEffect } from 'react';
import { IoLocationOutline } from "react-icons/io5";
import { GoLocation } from "react-icons/go";


import { LEVELS_DATA } from 'const/levels'


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


const IdentityView = (props:any) => {

    const validations = useSettingValidation()
    const settingActions = useSettingsActions()
    // const [ coinsendaServices ] = useCoinsendaServices();

    // const init = async() => {

    //     await coinsendaServices.proofEndpoints()
    //     const res = await coinsendaServices.createRequirementLevel()
    //     console.log(res)
    //     debugger
    //     // if(res){
    //         // setLoading(true)
    //         // const { requirements } = res
    //         // const currentRequirement = requirements[0]
    //         // const Element = await import(`../kyc/${currentRequirement}Component/init`)
    //         // eslint-disable-next-line react/jsx-pascal-case
    //         // actions.renderModal(() => <Element.default/>)
    //     // }

    // }

    // useEffect(() => {
    //     init()
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    return(
        <IdentityLayout>
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
            
        </IdentityLayout>
    )
}

export default IdentityView

 
const IdentityComponent = () => {

    const icons = {
        "level_1":GoLocation,
        // "level_1":IoLocationOutline,
    }
    
    return(
        <IdentityContainer>
            <IdentityContent className="_identityContent">
                <LevelsContainer>
                    {
                        Object.entries(LEVELS_DATA).map((level, index) => {

                            const levelKey = level[0]
                            const levelData:levelData = level[1]
                            const disabled = !levelData.requeriments
                            const LevelIcon = icons[levelKey as keyof typeof icons]
                            const isActive = levelKey === 'level_1' && true

                            return(
                                <LevelContent 
                                key={index}
                                className={`${disabled ? 'disabled' : 'enabled'} ${isActive ? "isActived" : ""} `}
                                >   {
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
            </IdentityContent>
            <BenefitsComponent/>
        </IdentityContainer>
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
            </ul>

        </BenefitsContainer>
    )
}
