import {
    TitleContainer,
    StatusHeaderContainer
} from './styles'
import { P } from 'core/components/atoms'



export const CryptoOnBoarding = ({
    // handleState,
    // stageManager,
    children
  }) => {
    return(
        <>
          <StatusHeaderContainer>
            <TitleContainer>
              <h1 className="fuente">Envío a billetera cripto</h1>
            </TitleContainer>
            <P size={14} lineHeight={21}>
              Ahora es posible transferir <strong>DCOP</strong> a través de la red <strong>Ethereum</strong> mediante el estándar <strong className="fuente2">ERC20</strong>.
            </P>
          </StatusHeaderContainer>
          {children}
        </>
    )
}
