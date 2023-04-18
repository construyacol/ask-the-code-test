

import { useEffect } from 'react'
import {
    TitleContainer,
    StatusHeaderContainer
} from '../../onBoarding/styles'
import { ContentRight, StatusContainer } from '../statusPanelStates/styles'
import { ItemContainer, LeftText, MiddleSection, RightText } from 'components/widgets/detailTemplate'
import { parseSymbolCurrency } from 'core/config/currencies'
import IconSwitch from "components/widgets/icons/iconSwitch";
import QrGenerator from './qrGenerator'


const InternalDepositResume = ({
  handleState:{ state },
  stageManager:{ setStageStatus },
  children,
  depositAccount,
  // dataForm,
  title
}:any) => {

   useEffect(() => {
      setStageStatus('success')
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [state])

  return(
      <>
        <StatusHeaderContainer className="StatusHeaderContainer withOutMaxHeight">
          <TitleContainer>
            <h1 className="fuente">{title || 'Resumen de pago'}</h1>
          </TitleContainer>

          <StatusContainer>
            <ItemContainer>
              <LeftText className="fuente">Moneda:</LeftText>
              <MiddleSection />
              <ContentRight>
                <RightText className={`${depositAccount?.currency ? 'fuente' : 'skeleton'}`}>
                  {parseSymbolCurrency(depositAccount?.currency)}
                </RightText>
                <IconSwitch
                  icon={depositAccount?.currency}
                  size={20}
                />
              </ContentRight>
            </ItemContainer>
            <ItemContainer>
              <LeftText className="fuente">Cantidad:</LeftText>
              <MiddleSection />
              <RightText className={`${state?.internalAmount ? 'fuente2' : 'skeleton'}`}>
                {`$ ${state?.internalAmount} - ${parseSymbolCurrency(depositAccount?.currency)}` || 'skeleton --------'} 
              </RightText>
            </ItemContainer>

            <p className="fuente" style={{marginBottom:"5px"}}>
              <strong>Código QR</strong>
            </p>

            <QrGenerator
              currency={depositAccount?.currency}
              amount={state?.internalAmount}
            />
          </StatusContainer>
          
        </StatusHeaderContainer>
        {children}
      </>
  )
}


export default InternalDepositResume

