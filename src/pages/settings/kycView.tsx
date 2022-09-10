import { 
    KycLayout
} from './styles'
import SettingElement from './settingElement'
import { itemElement } from 'components/settings/types'
import { useSettingValidation } from 'hooks/useSettingValidation'
import KycComponent from 'components/settings/kycComponent'

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
 
const KycView = (props:any) => {
 
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