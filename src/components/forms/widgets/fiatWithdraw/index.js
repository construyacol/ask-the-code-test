import { useState } from 'react'
import useStage from '../../hooks/useStage'
import { ButtonContainers } from '../sharedStyles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager'
import useViewport from '../../../../hooks/useWindowSize'
import { FIAT_WITHDRAW_TYPES, ApiGetFiatWithdrawStages, createNextStages } from './api'
import { UI_ERRORS } from '../../../../const/uiErrors'
import useToastMessage from "../../../../hooks/useToastMessage"; 
import { useActions } from '../../../../hooks/useActions'
import WithdrawAccountsComponent from './withdrawAccountStage' 
import { ApiPostCreateFiatWithdraw, ApiGetTwoFactorIsEnabled } from './api'
import { useWalletInfo } from '../../../../hooks/useWalletInfo'
import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { StageSkeleton } from '../stageManager'
import { useSelector } from "react-redux";
import { selectWithdrawProvidersByName } from 'selectors'
import RenderSwitchComponent from 'components/renderSwitchComponent' 
import StatusPanelStates from './statusPanelStates'
import { selectFiatWithdrawAccounts, selectFiatWithdrawProviders } from 'selectors'

// import { 
//   LabelContainer,
//   AccountLabel,
//   IconAccount
// } from '../../../widgets/headerAccount/styles'

// const IdentityComponent = loadable(() => import("./identityStage"));
const AmountComponent = loadable(() => import("./amountComponent"), {fallback:<StageSkeleton/>});
const TargetPersonStage = loadable(() => import("./internals/targetPersonStage"), {fallback:<StageSkeleton/>});
// setCreateAccount


const FiatWithdraw = ({ handleState, handleDataForm, ...props }) => {

  const { isMovilViewport } = useViewport();
  const { dataForm, setDataForm } = handleDataForm
  const [ loading, setLoading ] = useState(false)
  const [ withdrawProviders ] = useSelector((state) => selectWithdrawProvidersByName(state));
  const [ toastMessage ] = useToastMessage();
  const [ withdrawAccounts ] = useSelector((state) => selectFiatWithdrawAccounts(state));
  const fiatWithdrawProviders = useSelector(({ modelData:{ withdrawProviders } }) => selectFiatWithdrawProviders(withdrawProviders, 'provider_type'));
  const actions = useActions()
  const walletInfo = useWalletInfo()
  const { state } = handleState
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

  const nextStep = async() => {
    if(stageStatus !== 'success'){return}
    setStageStatus(null)
    if(currentStage<1){
      setLoading(true)
      setLoading(false)
    }
    const initialStages = await ApiGetFiatWithdrawStages()
    if(currentStage <= (Object.keys(initialStages).length - 1)){
      await createNextStages({stageData, state, setDataForm, ...props})
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

  const createFiatWithdraw = async({ twoFaToken }) => {
    setLoading(true)
    const twoFactorIsEnabled = await ApiGetTwoFactorIsEnabled()
    if(twoFactorIsEnabled && !twoFaToken){
      setLoading(false);
      return actions.renderModal(() => (
          <Withdraw2FaModal
          cancelAction={() => actions.renderModal(null)}
          isWithdraw2fa
          callback={createFiatWithdraw}
        />
      ));
    }
    if(twoFaToken) actions.renderModal(null);
    const { error, data } = await ApiPostCreateFiatWithdraw({...state, currentWallet, twoFaToken }) 
    if(error){
      setLoading(false)
      return toastMessage(UI_ERRORS[error?.code] || error?.message, "error");
    }
    await renderSuccessComponent(data)
    return setLoading(false)
  }

  const STAGE_COMPONENTS = {
    [FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT]:WithdrawAccountsComponent,
    [FIAT_WITHDRAW_TYPES?.STAGES?.AMOUNT]:AmountComponent,
    [FIAT_WITHDRAW_TYPES?.STAGES?.TARGET_PERSON]:TargetPersonStage,
  }

  const ButtonComponent = () => (
    <ButtonContainers>
      <ControlButton
        loader={loading}
        formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
        label={`${lastStage ? "Crear retiro" : "Siguiente"}`}
        handleAction={lastStage ? createFiatWithdraw : nextStep}
      />
    </ButtonContainers>
  )
  // console.log('stageData', state[stageData?.key])
  return(
    <>
        <RenderSwitchComponent
          STAGE_COMPONENTS={STAGE_COMPONENTS}
          component={stageData?.key}
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
          withdrawProviders={withdrawProviders}
          withdrawAccounts={withdrawAccounts}
          fiatWithdrawProviders={fiatWithdrawProviders}
          {...props}
          {...walletInfo}
        >
          <StageManagerComponent stageManager={stageManager} {...props}/>
        </RenderSwitchComponent>

        
        <StatusPanelStates
          handleState={handleState}
          stageManager={stageManager}
          withdrawAccounts={withdrawAccounts}
        >
          <>
            {
              !isMovilViewport &&
                <ButtonComponent/>
            }
          </>
        </StatusPanelStates>

          
        {
          isMovilViewport &&
            <ButtonComponent/>
        }
    </>                 
  )
}

export default FiatWithdraw








// const ProofComponent = ({ children, nextStage }) => {
//   return(
//     <StageContainer>
//       {children}
//     </StageContainer>
//   )
// }





