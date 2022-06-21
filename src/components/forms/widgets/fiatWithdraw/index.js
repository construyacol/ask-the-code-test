import { useState } from 'react'
import useStage from '../../hooks/useStage'
import { StageContainer, ButtonContainers } from './styles'
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

// import { 
//   LabelContainer,
//   AccountLabel,
//   IconAccount
// } from '../../../widgets/headerAccount/styles'


// const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));
// const IdentityComponent = loadable(() => import("./identityStage"));
const AmountComponent = loadable(() => import("./amountComponent"));




const NewWAccountComponent = ({ handleState, handleDataForm, ...props }) => {

  const { isMovilViewport } = useViewport();
  const { dataForm, setDataForm } = handleDataForm
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
  finalStage,
  stageController,
  lastStage
} = stageManager

// setCreateAccount

  const nextStep = async() => {
    if(stageStatus !== 'success'){return}
    setStageStatus(null)
    if(currentStage<1){
      setLoading(true)
      // await createInfoNeededStages({
      //   stageData,
      //   dataForm,
      //   setDataForm,
      //   state:handleState?.state
      // })
      setLoading(false)
    }
    nextStage()
  }

  const renderSuccessComponent = async(withdrawData) => {
    const Element = await import(`./success`)
    if(!Element) return;
    const WithdrawCreatedSuccess = Element.default
    actions.renderModal(() => <WithdrawCreatedSuccess withdrawData={withdrawData} />);
  }

  const createFiatWithdraw = async(twoFactorCode) => {
    const { state } = handleState
    setLoading(true)

    const twoFactorIsEnabled = await ApiGetTwoFactorIsEnabled()
    // console.log('twoFactorIsEnabled', twoFactorIsEnabled)
    // debugger
    if(twoFactorIsEnabled && !twoFactorCode){
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
        label={`${lastStage ? "Retirar" : "Siguiente"}`}
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
          {
            isMovilViewport &&
              <ButtonComponent/>
          }
        </RenderStageComponent>
        
          {
            !isMovilViewport &&
              <StatusPanelComponent>
                <StatusHeaderContainer>
                  <TitleContainer>
                    <h1 className="fuente">Resumen del retiro</h1>
                  </TitleContainer>
                  
                </StatusHeaderContainer>
                <ButtonComponent/>
              </StatusPanelComponent>
          }
    </>                 
  )
}
 

export default NewWAccountComponent



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





