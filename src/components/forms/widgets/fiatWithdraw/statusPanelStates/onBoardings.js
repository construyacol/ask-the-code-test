import {
    TitleContainer,
    StatusHeaderContainer
} from './styles'
import { P } from 'core/components/atoms'



export const InternalOnBoarding = ({
    handleState,
    stageManager,
    children
  }) => {
    return(
        <>
          <StatusHeaderContainer>
            <TitleContainer>
              <h1 className="fuente">Envío a personas</h1>
            </TitleContainer>
            <P size={14} lineHeight={21}>Ahora puedes envíar dinero de forma instantanea y gratuita a cualquier persona vinculada o no a Coinsenda por medio de su <strong>correo electrónico</strong></P>
          </StatusHeaderContainer>
          {children}
        </>
    )
}
