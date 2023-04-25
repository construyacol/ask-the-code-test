import { useState, useEffect } from 'react'
import useStage from '../../hooks/useStage'
import { ButtonContainers } from '../sharedStyles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager' 
// import StatusPanelComponent from '../statusPanel'
import useViewport from 'hooks/useViewport'
import useToastMessage from "../../../../hooks/useToastMessage"; 
import { useActions } from '../../../../hooks/useActions'
// import styled from 'styled-components'
import { useSelector } from "react-redux";
import { useWalletInfo } from '../../../../hooks/useWalletInfo'
// import { getCost } from './validations'
// import { ItemContainer, LeftText, MiddleSection, RightText } from '../../../widgets/detailTemplate'
import { StageSkeleton } from '../stageManager'
// import { formatToCurrency } from '../../../../utils/convert_currency'
import { ApiPostCreateBankDeposit, ApiPostCreatePseDeposit, selectProviderData, createNextStages, ApiGetOnFiatDepositStages } from './api'
import RenderSwitchComponent from 'components/renderSwitchComponent'
import { selectDepositProvsByNetwork } from 'selectors'
import useBreadCumb from 'hooks/useBreadCumb'
import StatusPanelStates from './statusPanelStates'
import { FIAT_DEPOSIT_TYPES, CTA_UI_NAME } from './api' 
import { createPaymentRequestLink } from 'utils/paymentRequest'
import { MENU_LABELS } from 'api/ui/menuItems'


const ProviderComponent = loadable(() => import("./depositProviderStage"), {fallback:<StageSkeleton/>});
const DepositCostComponent = loadable(() => import("./depositCostStage"), {fallback:<StageSkeleton/>});
const PersonTypeComponent = loadable(() => import("./personType"), {fallback:<StageSkeleton/>});
const BankNameListComponent = loadable(() => import("./bankName"), {fallback:<StageSkeleton/>});
const AmountComponent = loadable(() => import("./depositAmountStage"), {fallback:<StageSkeleton/>});
const CriptoSupervisor = loadable(() => import("components/wallets/views/depositCripto"), {fallback:<StageSkeleton/>});

const NewFiatDepositComponent = ({ handleState, handleDataForm, ...props }) => {
  const { isMobile } = useViewport();
  const { dataForm, setDataForm } = handleDataForm
  const [ loading, setLoading ] = useState(false)
  const [ toastMessage ] = useToastMessage();
  const actions = useActions()
  const { state } = handleState
  
  const walletInfo = useWalletInfo()
  const { currentWallet } = walletInfo
  const [ costList, depositAccount ] = useSelector(() => selectProviderData(state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER]));
  const depositProviders = useSelector((_state) => selectDepositProvsByNetwork(_state, currentWallet?.id));
  
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
  parentLabel:MENU_LABELS.deposit,
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
    const initialStages = await ApiGetOnFiatDepositStages()
    if(currentStage <= (Object.keys(initialStages).length - 1)){
      await createNextStages({stageData, state, setDataForm})
    }
    nextStage()
  }

  const renderSuccessComponent = async(data) => {
    const Element = await import(`./success`)
    if(!Element) return;
    const FiatDepositSuccess = Element.default
    actions.success_sound();
    actions.renderModal(() => 
    <FiatDepositSuccess 
      actions={actions}
      orderData={data}
      depositAccount={depositAccount}
    />);
  }


  const sharePaymentRequest = async(props) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Título del contenido compartido',
          text: 'Descripción del contenido compartido',
          url: await createPaymentRequestLink({ currency:depositAccount?.currency, amount:state?.internalAmount })
        });
      } catch (error) {
        console.log('Error al compartir:', error);
      }
    }else{
      const modules = await import('./internals')
      const ModalSharePaymentRequest = modules.default
      actions.renderModal(() => <ModalSharePaymentRequest {...props?.state}/>); 
    }
    return {data:false}
  }
  

  const createFiatDeposit = async() => {
    const depositMethods = {
      pse:ApiPostCreatePseDeposit,
      bank:ApiPostCreateBankDeposit,
      internal_network:sharePaymentRequest
    }
    setLoading(true) 
    const depositProvider = depositProviders[depositAccount?.provider_type]
    const { error, data } = await depositMethods[depositAccount?.provider_type]({ state, currentWallet, depositProvider, depositAccount })
    if(error){
      setLoading(false)
      return toastMessage(error?.message, "error");
    }
    if(!data)return setLoading(false);
    await renderSuccessComponent(data)
    setLoading(false)
  }

  const ButtonComponent = () => (
    <ButtonContainers>
      <ControlButton
        loader={loading}
        formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
        label={`${lastStage ? (CTA_UI_NAME[stageData?.key] || CTA_UI_NAME?.default) : "Siguiente"}`}
        handleAction={lastStage ? () => createFiatDeposit() : nextStep}
      />
    </ButtonContainers>
  )

 
  const STAGE_COMPONENTS = { 
    [FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE]:DepositCostComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:ProviderComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:AmountComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.PERSON_TYPE]:PersonTypeComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]:BankNameListComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO]:CriptoSupervisor,
    [FIAT_DEPOSIT_TYPES?.STAGES?.COP_INTERNAL_AMOUNT]:AmountComponent
  }
 
  return(
    <>  
        <RenderSwitchComponent
          STAGE_COMPONENTS={STAGE_COMPONENTS}
          component={stageData?.key}
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
          costList={costList}
          depositAccount={depositAccount}
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
              depositAccount={depositAccount}
              dataForm={dataForm}
            >
              <>
                {
                  !isMobile &&
                    <ButtonComponent/>
                }
              </>
            </StatusPanelStates>
            {
              isMobile &&
                <ButtonComponent/>
            }
          </>
        }
    </>                 
  )
}


export default NewFiatDepositComponent

