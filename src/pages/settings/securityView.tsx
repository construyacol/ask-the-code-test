import { 
    SecurityLayout,
} from './styles'

import {
    itemElement
} from './types'

import ControlButton from "components/widgets/buttons/controlButton";
import { useSettingValidation, useSettingsActions } from 'hooks/useSettingValidation'
import SettingElement from './settingElement'




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
        uiName:"Segundo factor de seguridad",
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

    return(
        <SecurityLayout>
            {
                Object.keys(SECURITY_ELEMENTS).map((element, index) => {

                    const itemElement:itemElement = SECURITY_ELEMENTS[element as keyof typeof SECURITY_ELEMENTS]
                    const isCompleted = validations[element as keyof typeof validations]() || false
                    // const isCompleted = true

                    return <SettingElement
                        key={index}
                        itemElement={itemElement}
                        isCompleted={isCompleted}
                        isLastElement={(Object.keys(SECURITY_ELEMENTS)?.length - 1) === index}
                        AuxComponent={itemElement.cta && [
                            () => <ControlButton
                                label={`${isCompleted ? itemElement.cta?.uiEnabled : itemElement.cta?.uiDisabled}`}
                                handleAction={settingActions[element as keyof typeof settingActions]} 
                                type={isCompleted ? "secundary" : "primary"}
                                // loader={undefined} 
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







