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
import { FIAT_DEPOSIT_TYPES } from './api'
import { UI_ERRORS } from '../../../../const/uiErrors'
import useToastMessage from "../../../../hooks/useToastMessage"; 
// import WAccountCreatedSuccess from './success'
import { useActions } from '../../../../hooks/useActions'
import styled from 'styled-components'
import DepositSourceComponent from './depositSourceStage' 
import DepositProviderComponent from './depositProviderStage' 

// import { ApiPostCreateFiatWithdraw, ApiGetTwoFactorIsEnabled } from './api'
import { useWalletInfo } from '../../../../hooks/useWalletInfo'
// import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { getCost } from './validations'
import { ItemContainer, LeftText, MiddleSection, RightText } from '../../../widgets/detailTemplate'
// import { TotalAmount } from '../../../widgets/shared-styles'
import { StageSkeleton } from '../stageManager'

import { selectWithdrawProvider } from './depositAmountStage'
import { useSelector } from "react-redux";
import { formatToCurrency } from '../../../../utils/convert_currency'

// import { 
//   LabelContainer,
//   AccountLabel,
//   IconAccount
// } from '../../../widgets/headerAccount/styles'

// const IdentityComponent = loadable(() => import("./identityStage"));
const AmountComponent = loadable(() => import("./depositAmountStage"), {fallback:<StageSkeleton/>});



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
    // const Element = await import(`./success`)
    // if(!Element) return;
    // const WithdrawCreatedSuccess = Element.default
    // actions.success_sound();
    // actions.renderModal(() => <WithdrawCreatedSuccess withdrawData={withdrawData} />);
  }

  const createFiatWithdraw = async(twoFactorCode) => {
    // const { state } = handleState
    // setLoading(true)

    // const twoFactorIsEnabled = await ApiGetTwoFactorIsEnabled()
    // // console.log('twoFactorIsEnabled', twoFactorIsEnabled)
    // // debugger
    // if(twoFactorIsEnabled && !twoFactorCode){
    //   setLoading(false);
    //   return actions.renderModal(() => (
    //       <Withdraw2FaModal
    //       cancelAction={() => actions.renderModal(null)}
    //       isWithdraw2fa
    //       callback={(_twoFactorCode) => createFiatWithdraw(_twoFactorCode)}
    //     />
    //   ));
    // }

    // if(twoFactorCode) actions.renderModal(null);

    // const { error, data } = await ApiPostCreateFiatWithdraw({...state, currentWallet, twoFactorCode}) 
    // if(error){
    //   console.log('||||||||||  ApiPostCreateWAccount ===> ERROR', error)
    // setLoading(false)
    // return toastMessage(UI_ERRORS[error?.code] || error?.message, "error");
    // }

    // await renderSuccessComponent(data)
    // return setLoading(false)
  }

  const stageComponents = {
    [FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE]:DepositSourceComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:DepositProviderComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:AmountComponent
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
        {
          isMovilViewport &&
            <ButtonComponent/>
        }
        
          {
            !isMovilViewport &&
              <StatusPanelComponent>
                <StatusHeaderContainer>
                  <TitleContainer>
                    <h1 className="fuente">Resumen del depósito</h1>
                  </TitleContainer>
                  <StatusContent
                    state={handleState?.state}
                    stageManager={stageManager}
                  />
                </StatusHeaderContainer>
                <ButtonComponent/>
              </StatusPanelComponent>
          }
    </>                 
  )
}
 

export default NewWAccountComponent


const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

const StatusContent = ({ state, stageManager }) => {

  // const { withdrawAccount, withdrawAmount } = state
  // const bankName = withdrawAccount?.bank_name
  const bankName = "data"
  const withdrawAmount = "data"
  // const [ withdrawProvider ] = useSelector((state) => selectWithdrawProvider(state, withdrawAccount?.withdraw_provider));
  const [ cost, setCost ] = useState()



  // console.log('StatusContent stageManager', cost)
  // getCost

  return(
    <StatusContainer>
      {/* <ItemContainer>
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
      </ItemContainer> */}
      {/* {
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
      } */}
      
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





