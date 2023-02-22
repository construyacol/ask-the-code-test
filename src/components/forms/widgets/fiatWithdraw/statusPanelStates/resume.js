import styled from 'styled-components'
import { useSelector } from "react-redux";
import { selectWithdrawProvider } from 'selectors'
import { useEffect, useState } from 'react'
import { getCost } from '../validations'
import { formatToCurrency } from 'utils/convert_currency'
import { ItemContainer, LeftText, MiddleSection, RightText } from 'components/widgets/detailTemplate'
import loadable from "@loadable/component";
import {
    TitleContainer,
    StatusHeaderContainer
} from './styles'

const IconSwitch = loadable(() => import("components/widgets/icons/iconSwitch"));

const ResumeComponent = ({
    handleState,
    stageManager,
    children
  }) => {
    return(
        <>
          <StatusHeaderContainer>
            <TitleContainer>
              <h1 className="fuente">Resumen del retiro</h1>
            </TitleContainer>
            <StatusContent
              state={handleState?.state}
              stageManager={stageManager}
            />
          </StatusHeaderContainer>
          {children}
        </>
    )
}

export default ResumeComponent


const StatusContent = ({ state, stageManager }) => {

    const { withdrawAccount, withdrawAmount } = state
    const bankName = withdrawAccount?.bank_name
    const [ withdrawProvider ] = useSelector((state) => selectWithdrawProvider(state, withdrawAccount?.withdraw_provider));
    const [ cost, setCost ] = useState()
  
    useEffect(() => {
      if(withdrawProvider && withdrawAccount){
        let cost = getCost({withdrawProvider, withdrawAccount})
        let parsed = formatToCurrency(cost, withdrawProvider?.currency)
        setCost(parsed.toFormat())
      }
    }, [withdrawProvider, withdrawAccount])
  
    return(
      <StatusContainer>
        <ItemContainer>
            <LeftText className="fuente">Cuenta destino:</LeftText>
            <MiddleSection />
  
            <ContentRight>
              <RightText className={`${bankName ? 'fuente' : 'skeleton'}`}>
                  {bankName?.ui_name?.toLowerCase() || 'skeleton --------'} 
                </RightText>
              {
                bankName &&
                  <IconSwitch
                      icon={bankName?.value}
                      size={20}
                    />
              }
            </ContentRight>
        </ItemContainer>
        {
          stageManager?.currentStage === 1 &&
          <>
            <ItemContainer>
                <LeftText className="fuente">Cantidad:</LeftText>
                <MiddleSection />
                <RightText className={`${withdrawAmount ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${withdrawAmount} COP` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
            {
              (bankName?.value !== 'efecty' && withdrawAmount) &&
              <ItemContainer>
                  <LeftText className="fuente">Costo:</LeftText>
                  <MiddleSection />
                  <RightText className={`${withdrawAmount ? 'fuente2' : 'skeleton'}`}>
                    {`$ ${cost} COP` || 'skeleton --------'} 
                  </RightText>
              </ItemContainer>
            }
          </>
        }
        
        {/* <TotalAmount color="var(--paragraph_color)">
            <p className="fuente saldo">Cantidad a recibir</p>
            <p className="fuente2 amount">
                    $ {amount} <span className="fuente">{currencySimbol?.toUpperCase()}</span>
            </p>
        </TotalAmount> */}
  
      </StatusContainer>
    )
  }



const ContentRight = styled.div`
display:flex;
align-items: center;
column-gap: 6px;
${RightText}{
  text-transform:capitalize;
}
`


const StatusContainer = styled.div`
width:100%;
height:auto;
padding-top:15px;
display: flex;
flex-direction: column;
row-gap: 25px;

${LeftText}{
  font-weight: normal;
}
`


