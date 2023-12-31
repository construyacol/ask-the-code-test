import {
    TitleContainer,
    StatusHeaderContainer
} from './styles'
import { P } from 'core/components/atoms'
import { parseSymbolCurrency } from 'core/config/currencies'



export const CryptoOnBoarding = ({
    // handleState,
    // stageManager,
    children,
    withdrawProvider,
    title
  }) => {
    return(
        <>
          <StatusHeaderContainer>
            <TitleContainer> 
              <h1 className="fuente">{title || "Billetera cripto"}</h1>
            </TitleContainer>
            <P size={14} lineHeight={21}>
              Ahora es posible transferir <strong>{withdrawProvider?.currency ? parseSymbolCurrency(withdrawProvider?.currency) : 'DCOP'}</strong> a través de la red <strong>Binance Smart Chain</strong> mediante el estándar <strong className="fuente2">BEP20</strong>.
            </P>
          </StatusHeaderContainer>
          {children}
        </>
    )
}
