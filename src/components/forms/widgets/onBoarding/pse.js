import {
    TitleContainer,
    StatusHeaderContainer
} from './styles'
import { P } from 'core/components/atoms'



export const PseOnBoarding = ({
    // handleState,
    // stageManager,
    children
  }) => {
    return(
        <>
          <StatusHeaderContainer>
            <TitleContainer>
              <h1 className="fuente">Deposita por PSE</h1>
            </TitleContainer>
            <P size={14} lineHeight={21}>
              Disfruta de una experiencia bancaria sin complicaciones, realiza tus depósitos de manera rápida y segura a través de <strong>PSE</strong>.
            </P>
          </StatusHeaderContainer>
          {children}
        </>
    )
}




