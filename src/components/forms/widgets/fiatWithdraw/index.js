import { useEffect, useState } from 'react'
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
import RenderSwitchComponent from 'components/renderSwitchComponent' 
import StatusPanelStates from './statusPanelStates'
import { selectFiatWithdrawAccounts, selectFiatWithdrawProviders } from 'selectors'
import { selectWithdrawProvidersByName } from 'selectors'
import useBreadCumb from 'hooks/useBreadCumb'


const DEFAULT_PROVIDER_TYPE = 'bank'
// const IdentityComponent = loadable(() => import("./identityStage"));
const AmountComponent = loadable(() => import("./amountComponent"), {fallback:<StageSkeleton/>});
const TargetPersonStage = loadable(() => import("./internals/targetPersonStage"), {fallback:<StageSkeleton/>});
const CriptoSupervisor = loadable(() => import("components/wallets/views/withdrawCripto"), {fallback:<StageSkeleton/>});


const FiatWithdraw = ({ handleState, handleDataForm, ...props }) => {

  const { isMovilViewport } = useViewport();
  const { dataForm, setDataForm } = handleDataForm
  const [ loading, setLoading ] = useState(false)
  const [ toastMessage ] = useToastMessage();    
  const [ withdrawAccounts ] = useSelector((state) => selectFiatWithdrawAccounts(state));
  const wProvidersByProvType = useSelector(({ modelData:{ withdrawProviders } }) => selectFiatWithdrawProviders(withdrawProviders, 'provider_type'));
  const [ withdrawProvidersByName ] = useSelector((state) => selectWithdrawProvidersByName(state));
  const actions = useActions()
  const walletInfo = useWalletInfo()
  const { state } = handleState
  const { currentWallet } = walletInfo
  const providerType = state[FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT]?.provider_type || state[FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT]?.value 
  const withdrawProvider = wProvidersByProvType[providerType] || wProvidersByProvType[DEFAULT_PROVIDER_TYPE]
  
  // console.log('FiatWithdrawWithdrawAccounts', withdrawAccounts)
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
    lastStage,
    goToStage
  } = stageManager


  const { insertBreadCumb, isActiveBreadCumb } = useBreadCumb({
    parentLabel:'Enviar',
    childLabel:stageData?.settings?.breadCumbConfig?.childLabel,
    titleSelector:".accountDetailTitle h1>span",
    ctaBackSelector:"#withdraw-menu-button",
    unMountCondition:currentStage === 0,
    callback:() => goToStage(0)
  }) 

  useEffect(() => {
    if(stageData?.settings?.breadCumbConfig?.active){
      !isActiveBreadCumb && insertBreadCumb()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageData])

  const nextStep = async() => {
    if(stageStatus !== 'success'){return}
    setStageStatus(null)
    if(currentStage<1){
      setLoading(true)
      setLoading(false)
    }
    const initialStages = await ApiGetFiatWithdrawStages()
    if(currentStage <= (Object.keys(initialStages).length - 1)) await createNextStages({stageData, state, setDataForm, ...props});
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
    const { error, data } = await ApiPostCreateFiatWithdraw({
      ...state, 
      currentWallet, 
      withdrawProvider,
      twoFaToken 
    }) 
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
    [FIAT_WITHDRAW_TYPES?.STAGES?.CRYPTO]:CriptoSupervisor,
  }

  const ButtonComponent = () => (
    <ButtonContainers>
      <ControlButton
        loader={loading}
        formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
        label={`${lastStage ? "Envíar" : "Siguiente"}`}
        handleAction={lastStage ? createFiatWithdraw : nextStep}
      />
    </ButtonContainers>
  )

  // console.log('withdrawAccounts', withdrawAccounts)
  // console.log('handleState', handleState)

  return(
    <>
        <RenderSwitchComponent
          STAGE_COMPONENTS={STAGE_COMPONENTS}
          component={stageData?.key}
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
          withdrawProviders={withdrawProvidersByName}
          withdrawAccounts={withdrawAccounts}
          wProvidersByProvType={wProvidersByProvType}
          providerType={providerType}
          withdrawProvider={withdrawProvider}
          currentWallet={currentWallet}
          actions={actions}
          {...props}
          {...walletInfo}
        >
          <StageManagerComponent stageManager={stageManager} {...props}/>
        </RenderSwitchComponent>
        {
          !stageData?.settings?.config?.hideStatusPanel &&
          <>
            <StatusPanelStates
              handleState={handleState}
              stageManager={stageManager}
              withdrawAccounts={withdrawAccounts}
              withdrawProvider={withdrawProvider}
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
        }
    </>                 
  )
}

export default FiatWithdraw