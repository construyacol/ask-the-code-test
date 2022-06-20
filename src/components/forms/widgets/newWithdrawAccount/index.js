import { useState } from 'react'
import useStage from '../../hooks/useStage'
import { StageContainer, ButtonContainers } from './styles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager'
import StatusPanelComponent from '../statusPanel'
import { createInfoNeededStages } from './api'
import BankNameListComponent from './bankNameStage'
import useViewport from '../../../../hooks/useWindowSize'
// import SelectListComponent from '../selectListComponent'
import { ApiPostCreateWAccount } from './api'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { KEY_TYPE } from './api'
import { UI_ERRORS } from '../../../../const/uiErrors'
import useToastMessage from "../../../../hooks/useToastMessage";
// import WAccountCreatedSuccess from './success'
import { useActions } from '../../../../hooks/useActions'
import styled from 'styled-components'
import { 
  LabelContainer,
  AccountLabel,
  IconAccount
} from '../../../widgets/headerAccount/styles'


const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));
const IdentityComponent = loadable(() => import("./identityStage"));
const InfoAccountComponent = loadable(() => import("./infoAccountStage"));


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
    actions.renderModal(() => <WAccountCreatedSuccess withdrawAccount={withdrawAccount} />);
  }

  const createWithdrawAccount = async() => {
    const { state } = handleState
    setLoading(true)
    const { error, data } = await ApiPostCreateWAccount({...state, withdrawProvider}) 
    setLoading(false)
    if(error){
    console.log('||||||||||  ApiPostCreateWAccount ===> ERROR', error)
    return toastMessage(UI_ERRORS[error?.code] || error?.message, "error");
    }
    await renderSuccessComponent(data)
    return props.backToWithdraw()
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
        // label={"Siguiente"}
        // handleAction={nextStep}
        label={`${lastStage ? "Crear cuenta" : "Siguiente"}`}
        handleAction={lastStage ? createWithdrawAccount : nextStep}
      />
    </ButtonContainers>
  )


  const { state } = handleState
  const {
    infoAccount,
    identity
  } = state
  let { bankName } = dataForm?.stages
  let uiBankName = bankName?.selectList[state?.bankName]?.uiName
  // let idTypes = withdrawProvider?.info_needed?.id_type
  let accountTypes = withdrawProvider?.info_needed?.account_type
  let uiAccountType = accountTypes &&  accountTypes[infoAccount?.accountType]?.ui_name
  let uiIdentityNames = identity?.document_info && `${identity?.document_info?.name} ${identity?.document_info?.surname}`

  return(
    <>
        <RenderStageComponent
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
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
                    <h1 className="fuente">Cuenta de retiro</h1>
                  </TitleContainer>
                  <CardInfo className={`${uiBankName?.toLowerCase()}`}>

                    <InfonContainer className="_headerInfo">
                      <LabelContainer>
                        <AccountLabel className={`${uiBankName ? '' : 'skeleton' }`}>{uiBankName?.toLowerCase() || 'Awesome bank name...'}</AccountLabel>
                        {
                          !["efecty"].includes(uiBankName) &&
                            <AccountLabel className={`_aux ${uiAccountType ? '' : 'skeleton' }`}>{uiAccountType || 'Cuenta de ahorros'}</AccountLabel>
                        }
                      </LabelContainer>
                      <IconAccount className={`${uiBankName ? '' : '_iconSkeleton' }`}>
                        {
                          uiBankName &&
                          <IconSwitch
                              icon={state?.bankName}
                              size={35}
                          />
                        }
                      </IconAccount>
                    </InfonContainer>

                    <InfonContainer>
                      <LabelContainer>
                        {
                          !["efecty"].includes(uiBankName) &&
                          <AccountLabel className={`numberFont ${infoAccount?.accountNumber ? '' : 'skeleton' }`}>{infoAccount?.accountNumber || '------------'}</AccountLabel>
                        }
                        <AccountLabel className={`_aux ${uiIdentityNames ? '' : 'skeleton' }`}>{uiIdentityNames || 'Satoshi nakamoto motonaka'}</AccountLabel>
                      </LabelContainer>
                    </InfonContainer>

                  </CardInfo>
                </StatusHeaderContainer>
                <ButtonComponent/>
              </StatusPanelComponent>
          }
    </>                 
  )
}
 

export default NewWAccountComponent


const InfonContainer = styled.div`
  ${LabelContainer}{
    row-gap: 6px;
  }
  p{
    margin:0
  }
  ${IconAccount}{
    &._iconSkeleton{
      background:var(--skeleton_color);
    }
  }
  &._headerInfo{
    display: grid;
    grid-template-columns: 1fr auto;
  }
  ${AccountLabel}{
    &.skeleton{
      text-transform: lowercase;
    }
      text-transform: capitalize;
    &.numberFont{
      font-weight: 500;
      letter-spacing: 6px;
    }
  }
`

const CardInfo = styled.div`
  width:calc(100% - 40px);
  height:calc(150px - 40px);
  border: 1px solid var(--skeleton_color);
  border-radius: 6px;
  padding:20px;
  max-width: 250px;
  justify-self: center;
  display: grid;
  align-content: space-between;
  border-right: 4px solid var(--primary);
  background: #f5f5f5;
  -webkit-box-shadow: 2px 9px 19px -7px rgba(0,0,0,0.15);
  -moz-box-shadow: 2px 9px 19px -7px rgba(0,0,0,0.15);
  box-shadow: 2px 9px 19px -7px rgba(0,0,0,0.15);
  &.efecty{
    align-content: flex-start;
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





