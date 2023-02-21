import { useActions } from "hooks/useActions";
import { 
    EmptyStateLayout,
} from './styles'
import { getCdnPath } from 'environment'
import ControlButton from "components/widgets/buttons/controlButton";
import { isEmpty } from 'lodash'
import { emptyStatePropTypes } from 'interfaces/settings/kyc'


const EmptyOrInProcessState = (props:emptyStatePropTypes) => {

    const actions = useActions()
    const currentPendingRequirement = props?.levelRequirements?.pendingRequirements[0]
    const { identityState, user } = props

    const ctaUiLabel = ["contact"].includes(currentPendingRequirement) ? "ctaInitial":
    ["location"].includes(currentPendingRequirement) ? "ctaContinue" :
    ["rejected"].includes(identityState) && ["identity"].includes(currentPendingRequirement) ? "ctaTry" : "ctaDefault"

    const imgName =  identityState && (["confirmed"].includes(identityState) ? "fingerprint.gif" : "error_animation.gif");
 
    const handleAction = async() => {
        const currentIdentity = !isEmpty(user.identities) && user.identities[0]
        const Element = await import(`components/forms/widgets/kyc/${currentPendingRequirement}Component/init`)
        
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <Element.default 
            currentIdentity={currentIdentity}
            // levelRequirements={props?.levelRequirements}
        />)
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
                   <p className="fuente emptyStateCopy_p">Completa tus datos de {`${currentPendingRequirement ? getUiCopy(currentPendingRequirement) : "__"}`}  para continuar con el proceso de verificación de tu cuenta</p>  
            }

            {
                (!["confirmed"].includes(identityState)) &&
                    <ControlButton 
                    label={getUiCopy(ctaUiLabel)}
                    handleAction={handleAction} 
                    // type={isCompleted ? "secundary" : "primary"}
                    // loader={undefined} 
                    formValidate={true}
                    className="settingButton"
                    />
            }
        </EmptyStateLayout>
    )
}


export default EmptyOrInProcessState


const getUiCopy = (copyKey:string) => {
    let copys = {
        contact:"contacto y residencia",
        location:"contacto y residencia",
        identity:"identidad",
        rejected:"Tu cuenta NO fue aprobada, vuelve a enviar tus datos de identidad.",
        confirmed:"Estamos verificando tu identidad, este proceso puede tardar hasta 72 horas hábiles.",
        ctaInitial:"Verifica tu cuenta",
        ctaContinue:"Continuar la verificación",
        ctaTry:"Reintentar verificación",
        ctaDefault:"Continuar la verificación"
    }

    return copys[copyKey as keyof typeof copys]
}