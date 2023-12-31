import { 
    SecurityLayout,
} from './styles'

import { itemElement } from 'interfaces/settings/'

import ControlButton from "components/widgets/buttons/controlButton";
import { useSettingValidation, useSettingsActions } from 'hooks/useSettingValidation'
import SettingElement from './settingElement'
import useViewport from 'hooks/useWindowSize'
import { BiRightArrowAlt } from 'react-icons/bi';
                                        
// type securityElement = { itemElement:itemElement }

const SECURITY_ELEMENTS = {
    "email":{
        value:"email",
        uiName:"Correo electrónico",
        uiDescription:"Cuenta verificada vía correo electrónico.",
        states:{
            uiEnabled:"Verificado",
            uiDisabled:"Sin verificar"
        }
    },
    "twofa":{
        value:"twofa",
        uiName:window?.innerWidth < 768 ? "Segundo factor 2FA" : "Segundo factor de seguridad",
        uiDescription:"Protege tu cuenta agregando una capa de seguridad adicional con tu dispositivo móvil.",
        cta:{
            uiEnabled:"Deshabilitar",
            uiDisabled:"Habilitar"
        },
        states:{
            uiEnabled:"Habilitado",
            uiDisabled:"Deshabilitado"
        }
    }
}


const SecurityView = () => {

    const validations = useSettingValidation()
    const settingActions = useSettingsActions()
    const { isMovilViewport } = useViewport();

    return(
        <SecurityLayout> 
            {
                Object.keys(SECURITY_ELEMENTS).map((element, index) => {

                    const itemElement:itemElement = SECURITY_ELEMENTS[element as keyof typeof SECURITY_ELEMENTS]
                    const isCompleted = validations[element as keyof typeof validations]() || false
                    // const isCompleted = true

                    return <SettingElement
                        handleAction={isMovilViewport ? settingActions[element as keyof typeof settingActions] : null}
                        key={index}
                        itemElement={itemElement}
                        isCompleted={isCompleted}
                        isLastElement={(Object.keys(SECURITY_ELEMENTS)?.length - 1) === index}
                        AuxComponent={itemElement.cta && [
                            isMovilViewport ?  
                            () => <BiRightArrowAlt 
                                size={30} 
                                color="var(--paragraph_color)" 
                                className={'anim-flow movilcta__i'} 
                            />
                            :
                            () => <ControlButton
                                label={`${isCompleted ? itemElement.cta?.uiEnabled : itemElement.cta?.uiDisabled}`}
                                handleAction={settingActions[element as keyof typeof settingActions]} 
                                type={isCompleted ? "secundary" : "primary"}
                                formValidate={true}
                                className="settingButton"
                            />
                        ]}
                    />
                })
            }
        </SecurityLayout>
    )
}

export default SecurityView








