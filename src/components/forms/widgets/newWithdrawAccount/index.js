import { useState, useEffect } from 'react'
import useStage from '../../hooks/useStage'
import { ButtonContainers, StageContainer } from '../sharedStyles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager'
import StatusPanelComponent from '../statusPanel'
import { createInfoNeededStages } from './api'
import BankNameListComponent from './bankNameStage'
import useViewport from '../../../../hooks/useWindowSize'
import { ApiPostCreateWAccount } from './api'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { KEY_TYPE } from './api'
import { UI_ERRORS } from '../../../../const/uiErrors'
import useToastMessage from "../../../../hooks/useToastMessage";
import { useActions } from '../../../../hooks/useActions'
import StatusPanelContent from './statusPanel'
import { StageSkeleton } from '../stageManager'
import useBreadCumb from 'hooks/useBreadCumb'
import { MENU_LABELS } from 'api/ui/menuItems' 

const IdentityComponent = loadable(() => import("./identityStage"), {fallback:<StageSkeleton/>});
const InfoAccountComponent = loadable(() => import("./infoAccountStage"), {fallback:<StageSkeleton/>});

const selectWithdrawProvider = createSelector(
  (state) => state.modelData.withdrawProviders,
  (_, localState) => localState,
  (withdrawProviders, localState) => {
    let withdrawProv = null
    if(!withdrawProviders)return [ withdrawProv ];
    let queryParam = localState.includes('efecty') ? 'efecty_network' : 'bank'
    withdrawProv = Object.keys(withdrawProviders).find(wKey => {
      let wProvType = withdrawProviders[wKey]?.provider_type
      return [ queryParam ].includes(wProvType)
    })
    return [ withdrawProviders[withdrawProv] ];
  }
);



const NewWAccountComponent = ({ handleState, handleDataForm, ...props }) => {

  const { isMovilViewport } = useViewport();
  const { dataForm, setDataForm } = handleDataForm
  const [ loading, setLoading ] = useState(false)
  const [ withdrawProvider ] = useSelector((globalState) => selectWithdrawProvider(globalState, handleState?.state[KEY_TYPE?.PROV_SERVICE]));
  const [ toastMessage ] = useToastMessage();
  const actions = useActions()
  
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

const backToWithdraw = () =>  props?.setView('defaultWithdraw')
const { insertBreadCumb, isActiveBreadCumb } = useBreadCumb({
  parentLabel:MENU_LABELS?.withdraw,
  childLabel:"Agregando cuenta bancaria",
  titleSelector:".accountDetailTitle h1>span",
  ctaBackSelector:"#withdraw-menu-button",
  callback:backToWithdraw
})

useEffect(() => {
    !isActiveBreadCumb && insertBreadCumb()
// eslint-disable-next-line react-hooks/exhaustive-deps
})

  const nextStep = async() => {
    if(stageStatus !== 'success'){return}
    setStageStatus(null)
    if(currentStage<1){
      setLoading(true)
      await createInfoNeededStages({
        stageData,
        dataForm,
        setDataForm,
        state:handleState?.state
      })
      setLoading(false)
    }
    nextStage()
  }

  const renderSuccessComponent = async(withdrawAccount) => {
    const Element = await import(`./success`)
    if(!Element) return;
    const WAccountCreatedSuccess = Element.default
    actions.success_sound();
    actions.renderModal(() => <WAccountCreatedSuccess withdrawAccountData={withdrawAccount} />);
  }

  const createWithdrawAccount = async() => {
    const { state } = handleState
    setLoading(true)
    const { error, data } = await ApiPostCreateWAccount({...state, withdrawProvider}) 
    setLoading(false)
    if(error){
    console.log('||||||||||  ApiPostCreateWAccount ===> ERROR', error)
    return toastMessage(error?.message || UI_ERRORS[error?.code],  "error");
    }
    await renderSuccessComponent(data)
    return backToWithdraw()
  }

  if(finalStage){
    return <p>finalStage</p>
  }

  const stageComponents = {
    bankName:BankNameListComponent,
    infoAccount:InfoAccountComponent,
    identity:IdentityComponent
  }

  const RenderStageComponent = stageComponents[stageData?.key] || ProofComponent 
  
  const ButtonComponent = () => (
    <ButtonContainers>
      <ControlButton
        loader={loading}
        formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
        label={`${lastStage ? "Crear cuenta" : "Siguiente"}`}
        handleAction={lastStage ? createWithdrawAccount : nextStep}
      />
    </ButtonContainers>
  )

  const { state } = handleState

  return(
    <>
        <RenderStageComponent
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
        >
          <StageManagerComponent 
            stageManager={stageManager} 
            callback={backToWithdraw}
            closeStage 
            {...props}
          />

        </RenderStageComponent>
        
        {
          isMovilViewport &&
            <ButtonComponent/>
        }
        
          {
            !isMovilViewport &&
              <StatusPanelComponent>
              <StatusPanelContent
                bankName={dataForm?.stages?.bankName}
                accountTypes={withdrawProvider?.info_needed?.account_type}
                state={state}
                ButtonComponent={ButtonComponent}
              />
              </StatusPanelComponent>
          }
    </>                 
  )
}
 

export default NewWAccountComponent


const ProofComponent = ({ children, nextStage }) => {
  return(
    <StageContainer>
      {children}
    </StageContainer>
  )
}





