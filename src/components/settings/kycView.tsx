import { 
    KycLayout
} from './styles'
import SettingElement from 'components/settings/settingElement'
import { itemElement } from 'interfaces/settings/'
import { useSettingValidation } from 'hooks/useSettingValidation'
import KycComponent from 'components/settings/kycComponent'

const IDENTITY_ELEMENTS = {
    "identity":{
        value:"identity",
        uiName:"Identidad",
        uiDescription:"La verificación de identidad es obligatoria para cumplir con las normativas vigentes.",
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

 
const KycView = () => {
 
    const validations = useSettingValidation()

    return( 
        <KycLayout>
            {
                Object.keys(IDENTITY_ELEMENTS).map((element, index) => {
                    const itemElement:itemElement = IDENTITY_ELEMENTS[element as keyof typeof IDENTITY_ELEMENTS]
                    const isCompleted = validations[element as keyof typeof validations] ? validations[element as keyof typeof validations]() : false
                    return <SettingElement
                        key={index}
                        itemElement={itemElement}
                        isCompleted={isCompleted}
                        isLastElement={(Object.keys(IDENTITY_ELEMENTS)?.length - 1) === index}
                    />
                })
            }

            <KycComponent/>

        </KycLayout>
    )
}

export default KycView
