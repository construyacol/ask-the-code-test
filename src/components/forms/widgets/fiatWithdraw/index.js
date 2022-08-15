import { useEffect, useState } from 'react'
import useStage from '../../hooks/useStage'
import { StageContainer } from '../sharedStyles'
import { ButtonContainers } from '../sharedStyles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager'
import StatusPanelComponent from '../statusPanel'
// import { createInfoNeededStages } from './api'
// import BankNameListComponent from './bankNameStage'
import useViewport from '../../../../hooks/useWindowSize'
// import { useSelector } from "react-redux";
// import { createSelector } from "reselect";
import { FIAT_WITHDRAW_TYPES } from './api'
import { UI_ERRORS } from '../../../../const/uiErrors'
import useToastMessage from "../../../../hooks/useToastMessage"; 
// import WAccountCreatedSuccess from './success'
import { useActions } from '../../../../hooks/useActions'
import styled from 'styled-components'
import WithdrawAccountsComponent from './withdrawAccountStage' 
import { ApiPostCreateFiatWithdraw, ApiGetTwoFactorIsEnabled } from './api'
import { useWalletInfo } from '../../../../hooks/useWalletInfo'
import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { getCost } from './validations'
import { ItemContainer, LeftText, MiddleSection, RightText } from '../../../widgets/detailTemplate'
// import { TotalAmount } from '../../../widgets/shared-styles'
import { StageSkeleton } from '../stageManager'

import { selectWithdrawProvider } from './amountComponent'
import { useSelector } from "react-redux";
import { formatToCurrency } from '../../../../utils/convert_currency'

// import { 
//   LabelContainer,
//   AccountLabel,
//   IconAccount
// } from '../../../widgets/headerAccount/styles'

// const IdentityComponent = loadable(() => import("./identityStage"));
const AmountComponent = loadable(() => import("./amountComponent"), {fallback:<StageSkeleton/>});



const NewWAccountComponent = ({ handleState, handleDataForm, ...props }) => {

  const { isMovilViewport } = useViewport();
  const { dataForm } = handleDataForm
  const [ loading, setLoading ] = useState(false)
  const [ toastMessage ] = useToastMessage();
  const actions = useActions()

  const walletInfo = useWalletInfo()
  
  const { currentWallet } = walletInfo
  
  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )

const {
  nextStage,
  stageData,
  currentStage,
  stageStatus,
  setStageStatus,
  stageController,
  lastStage
} = stageManager

// setCreateAccount

  const nextStep = async() => {
    if(stageStatus !== 'success'){return}
    setStageStatus(null)
    if(currentStage<1){
      setLoading(true)
      setLoading(false)
    }
    nextStage()
  }

  const renderSuccessComponent = async(withdrawData) => {
    const Element = await import(`./success`)
    if(!Element) return;
    const WithdrawCreatedSuccess = Element.default
    actions.success_sound();
    actions.renderModal(() => <WithdrawCreatedSuccess withdrawData={withdrawData} />);
  }

  const createFiatWithdraw = async(twoFactorCode) => {
    const { state } = handleState
    setLoading(true)

    const twoFactorIsEnabled = await ApiGetTwoFactorIsEnabled()
    // console.log('twoFactorIsEnabled', twoFactorIsEnabled)
    // debugger
    if(twoFactorIsEnabled && !twoFactorCode){
      setLoading(false);
      return actions.renderModal(() => (
          <Withdraw2FaModal
          cancelAction={() => actions.renderModal(null)}
          isWithdraw2fa
          callback={(_twoFactorCode) => createFiatWithdraw(_twoFactorCode)}
        />
      ));
    }

    if(twoFactorCode) actions.renderModal(null);

    const { error, data } = await ApiPostCreateFiatWithdraw({...state, currentWallet, twoFactorCode}) 
    if(error){
      console.log('||||||||||  ApiPostCreateWAccount ===> ERROR', error)
    setLoading(false)
    return toastMessage(UI_ERRORS[error?.code] || error?.message, "error");
    }

    await renderSuccessComponent(data)
    return setLoading(false)
  }

  // if(finalStage){
  //   return <p>finalStage</p>
  // }
  
  const stageComponents = {
    [FIAT_WITHDRAW_TYPES?.WITHDRAW_ACCOUNT]:WithdrawAccountsComponent,
    [FIAT_WITHDRAW_TYPES?.AMOUNT]:AmountComponent
  }
 
  const RenderStageComponent = stageComponents[stageData?.key] || ProofComponent 
  
  const ButtonComponent = () => (
    <ButtonContainers>
      <ControlButton
        loader={loading}
        formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
        label={`${lastStage ? "Crear retiro" : "Siguiente"}`}
        handleAction={lastStage ? () => createFiatWithdraw() : nextStep}
      />
    </ButtonContainers>
  )


  return(
    <>
        <RenderStageComponent
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
          {...props}
          {...walletInfo}
        >
          <StageManagerComponent stageManager={stageManager} {...props}/>
        </RenderStageComponent>
        
        <StatusPanelComponent>
          <StatusHeaderContainer>
            <TitleContainer>
              <h1 className="fuente">Resumen del retiro</h1>
            </TitleContainer>
            <StatusContent
              state={handleState?.state}
              stageManager={stageManager}
            />
          </StatusHeaderContainer>
          <StatusDisclaimer
              state={handleState?.state?.withdrawAccount?.state}
          />
          {
            !isMovilViewport &&
              <ButtonComponent/>
          }
        </StatusPanelComponent>

        {
          isMovilViewport &&
            <ButtonComponent/>
        }
    </>                 
  )
}
 


export default NewWAccountComponent


const Disclaimer = styled.div`

  padding: 10px 20px;
  height:auto;
  min-height:80px;
  border-radius:6px;
  display:none;

  p{
    font-size: 13px;
    color: green;
    line-height:20px;
  }

  &.pending,
  &.in_progress{
    background:#ffa5002b;;
    display:initial;
    p{
      color: var(--paragraph_color);
    }
  }

  &.complete{
    background:#0080000f;
    display:initial;
  }

`

const inProgress = "Los retiros hacia cuentas en proceso de inscripción pueden tardar hasta tantas horas"
const complete = "Los retiros hacia cuentas inscritas pueden tardar hasta tantas horas"

const MESSAGES = {
  pending:inProgress,
  complete
}


const StatusDisclaimer = ({ state }) => {

  console.log('StatusDisclaimer', state)

  return(
    <Disclaimer className={`${state}`}>
      {
        MESSAGES[state] &&
        <p className='fuente'>{MESSAGES[state]}</p>
      }
    </Disclaimer>
  )
}

const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

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

  // console.log('StatusContent stageManager', cost)
  // getCost

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


const TitleContainer = styled.div`
  h1{
    font-size: 22px;
    font-size: 20px;
    color: var(--paragraph_color);
  }
  border-bottom: 1px solid var(--skeleton_color);
`

const StatusHeaderContainer = styled.div`
    position: sticky;
    top: 190px;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 15px;
    grid-template-rows: auto 1fr;
    height: auto;
    max-height: 300px;
`


const ProofComponent = ({ children, nextStage }) => {
  return(
    <StageContainer>
      {children}
    </StageContainer>
  )
}





