import styled from 'styled-components'
// import { useSelector } from "react-redux";
// import { selectWithdrawProvider } from 'selectors'
import { useEffect, useState } from 'react'
import { getCost } from '../validations'
import { formatToCurrency } from 'utils/convert_currency'
import { ItemContainer, LeftText, MiddleSection, RightText } from 'components/widgets/detailTemplate'
import loadable from "@loadable/component";
import RenderSwitchComponent from 'components/renderSwitchComponent' 
import {
    TitleContainer,
    StatusHeaderContainer
} from '../../onBoarding/styles'
import { FIAT_DEPOSIT_TYPES } from '../api'
import { calculateCost } from '../../sharedValidations'
import { parseSymbolCurrency } from 'core/config/currencies'


const IconSwitch = loadable(() => import("components/widgets/icons/iconSwitch"));

const ResumeComponent = ({
    handleState:{state},
    stageManager,
    children,
    depositAccount,
    dataForm,
    ...props
  }) => {


    return(
        <>
          <StatusHeaderContainer>
            <TitleContainer>
               <h1 className="fuente">Resumen del depósito</h1>
            </TitleContainer>
            <StatusContent
              state={state}
              stageManager={stageManager}
              depositAccount={depositAccount}
              dataForm={dataForm}
            />
          </StatusHeaderContainer>
          {children}
        </>
    )
}

export default ResumeComponent



const StatusContent = ({ state, stageManager, depositAccount, dataForm }) => {

  const STAGE_COMPONENTS = {
    pse:PseResumeComponent,
    bank:BankResumeComponent
  }

  return(
    <StatusContainer>
      <ItemContainer>
          <LeftText className="fuente">Origen:</LeftText>
          <MiddleSection />
          <ContentRight>
            <RightText className={`${depositAccount ? 'fuente' : 'skeleton'}`}>
                {state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER]?.uiName?.toLowerCase() || 'skeleton --------'} 
              </RightText>
            {
              (state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER] && !["other_bank"].includes(state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER].value)) &&
                <IconSwitch
                    icon={state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER]?.value}
                    size={20}
                  />
            }
          </ContentRight>
      </ItemContainer>
      
      {
        depositAccount &&
        <RenderSwitchComponent
            STAGE_COMPONENTS={STAGE_COMPONENTS}
            component={depositAccount?.provider_type}
            stageManager={stageManager}
            state={state}
            depositAccount={depositAccount}
            dataForm={dataForm}
        />
        
      }

    </StatusContainer>
  )
}



const PseResumeComponent = ({
  stageManager,
  state,
  depositAccount,
  dataForm,
  ...props
}) =>{

  const [ cost, setCost ] = useState()

  useEffect(() => {
    if(state?.depositAmount) {
      const _cost = calculateCost(state?.depositAmount, depositAccount?.costs)
      setCost(formatToCurrency(_cost, depositAccount?.currency).toFormat())
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  console.log('cost', cost)

  return(
    <>
       {
        stageManager?.currentStage > 0 &&
        <>
          <p className="fuente" style={{marginBottom:"5px"}}>
            <strong>{state?.person_type?.uiName}</strong>
          </p>
          {
            state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME] &&
            <ItemContainer>
              <LeftText className="fuente">Banco:</LeftText>
              <MiddleSection />
              <ContentRight>
                <RightText className={`fiatDeposit ${state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME] ? 'fuente' : 'skeleton'}`}>
                    {dataForm?.stages[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]?.selectList[state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]]?.uiName || 'skeleton --------'} 
                </RightText>
                  {
                    state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME] &&
                    <IconSwitch
                        icon={state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]}
                        size={20}
                      />
                  }
              </ContentRight>
            </ItemContainer>
          }
          {
            state?.depositAmount &&
            <ItemContainer>
                <LeftText className="fuente">Cantidad:</LeftText>
                <MiddleSection />
                <RightText className={`${state?.depositAmount ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${state?.depositAmount} - ${parseSymbolCurrency(depositAccount?.currency)}` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }

          {
            (cost && state?.depositAmount) &&
            <ItemContainer>
                <LeftText className="fuente">Costo:</LeftText>
                <MiddleSection />
                <RightText className={`${cost ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${cost} - ${parseSymbolCurrency(depositAccount?.currency)}` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }
        </>
      }
    </>
  )
}



const BankResumeComponent = ({ 
  stageManager,
  state,
  depositAccount
}) => { 

  const { depositCost, depositAmount } = state
  const [ cost, setCost ] = useState()
  const [ total, setTotal ] = useState()

  // console.log('depositAccount', )

  useEffect(() => {
    if(depositAccount && depositCost){
      let costs = depositAccount?.costs
      let { currency } = depositAccount
      let _cost = getCost({ costs, currency, depositCost })  
      if(!_cost)return;
      setCost(_cost.toFormat())
      let _depositAmount = depositAmount && formatToCurrency(depositAmount.toString().replace(/,/g, ""), currency);
      _depositAmount && setTotal(_depositAmount?.plus(_cost)?.toFormat())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAccount, depositCost, depositAmount])

  return(
    <>
       {
        stageManager?.currentStage > 0 &&
        <>
          <p className="fuente" style={{marginBottom:"5px"}}>
            <strong>{depositCost?.uiName}</strong>
          </p>
          {
            depositCost &&
            <ItemContainer>
                <LeftText className="fuente">Costo:</LeftText>
                <MiddleSection />
                <RightText className={`${depositCost ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${cost} - ${parseSymbolCurrency(depositAccount?.currency)}` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }
          {
            depositAmount &&
            <ItemContainer>
                <LeftText className="fuente">Cantidad:</LeftText>
                <MiddleSection />
                <RightText className={`${depositAmount ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${depositAmount} - ${parseSymbolCurrency(depositAccount?.currency)}` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }
          {
            (depositCost && depositAmount) &&
            <ItemContainer>
                <LeftText className="fuente">Total:</LeftText>
                <MiddleSection />
                <RightText className={`${total ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${total} - ${parseSymbolCurrency(depositAccount?.currency)}` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }
        </>
      }
    </>
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

  p{
    color:var(--paragraph_color);
  }

  ${LeftText}{
    font-weight: normal;
  }
`