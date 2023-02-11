import { useState, useEffect } from 'react'
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
// import { UI_ERRORS } from '../../../../const/uiErrors'
import useToastMessage from "../../../../hooks/useToastMessage"; 
// import WAccountCreatedSuccess from './success'
import { useActions } from '../../../../hooks/useActions'
import styled from 'styled-components'
import ProviderComponent from './depositProviderStage' 
import { useSelector } from "react-redux";
// import { createSelector } from "reselect";
// import { ApiPostCreateFiatWithdraw, ApiGetTwoFactorIsEnabled } from './api'
import { useWalletInfo } from '../../../../hooks/useWalletInfo'
// import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { getCost } from './validations'
import { ItemContainer, LeftText, MiddleSection, RightText } from '../../../widgets/detailTemplate'
// import { TotalAmount } from '../../../widgets/shared-styles'
import { StageSkeleton } from '../stageManager'
import { formatToCurrency } from '../../../../utils/convert_currency'
import { ApiPostCreateDeposit, selectProviderData, createNextStages, ApiGetOnFiatDepositStages } from './api'
import DepositCostComponent from './depositCostStage'
import RenderSwitchComponent from 'components/renderSwitchComponent'
import { selectDepositProvsByNetwork } from 'selectors'
import PersonTypeComponent from './personType'
import BankNameListComponent from './bankName'


const AmountComponent = loadable(() => import("./depositAmountStage"), {fallback:<StageSkeleton/>});

const NewFiatDepositComponent = ({ handleState, handleDataForm, ...props }) => {

  const { isMovilViewport } = useViewport();
  const { dataForm, setDataForm } = handleDataForm
  const [ loading, setLoading ] = useState(false)
  const [ toastMessage ] = useToastMessage();
  const actions = useActions()
  const { state } = handleState
  
  const walletInfo = useWalletInfo()
  const { currentWallet } = walletInfo
  const [ costList, depositAccount ] = useSelector(() => selectProviderData(state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER]));
  const depositProviders = useSelector((_state) => selectDepositProvsByNetwork(_state, currentWallet?.currency));

  
  
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
    const initialStages = await ApiGetOnFiatDepositStages()
    if(currentStage <= (Object.keys(initialStages).length - 1)){
      await createNextStages({stageData, state, setDataForm})
    }
    // if(currentStage<1){
    //   setLoading(true)
    //   setLoading(false)
    // } 
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
      depositOrder={data}
    />);
  }

  const createFiatDeposit = async() => {
    setLoading(true) 
    const depositProvider = depositProviders[depositAccount?.provider_type]
    const { error, data } = await ApiPostCreateDeposit({ state, currentWallet, depositProvider  })
    if(error){
      setLoading(false)
      return toastMessage(error?.message, "error");
    }
    await renderSuccessComponent(data)
    setLoading(false)
  }

  const ButtonComponent = () => (
    <ButtonContainers>
      <ControlButton
        loader={loading}
        formValidate={(currentStage <= stageController.length) && stageStatus === 'success'}
        label={`${lastStage ? "Crear depósito" : "Siguiente"}`}
        handleAction={lastStage ? () => createFiatDeposit() : nextStep}
      />
    </ButtonContainers>
  )

  const STAGE_COMPONENTS = {
    [FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE]:DepositCostComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:ProviderComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:AmountComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.PERSON_TYPE]:PersonTypeComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]:BankNameListComponent
    
  }
  
  
  // console.log('dataForm', dataForm, stageData?.key)

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
        
        <StatusPanelComponent>
          <StatusHeaderContainer>
            <TitleContainer>
              <h1 className="fuente">Resumen del depósito</h1>
            </TitleContainer>
            <StatusContent
              state={state}
              stageManager={stageManager}
              depositProvider={depositAccount}
            />
          </StatusHeaderContainer>
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
 

export default NewFiatDepositComponent


const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

const StatusContent = ({ state, stageManager, depositProvider }) => {

  const { depositCost, depositAmount } = state
  const [ cost, setCost ] = useState()
  const [ total, setTotal ] = useState()

  useEffect(() => {
    if(depositProvider && depositCost){
      let costs = depositProvider?.costs
      let { currency } = depositProvider
      let cost = getCost({ costs, currency, depositCost })  
      if(!cost)return;
      setCost(cost.toFormat())
      let _depositAmount = depositAmount && formatToCurrency(depositAmount.toString().replace(/,/g, ""), currency);
      _depositAmount && setTotal(_depositAmount?.plus(cost)?.toFormat())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositProvider, depositCost, depositAmount])


  return(
    <StatusContainer>
      <ItemContainer>
          <LeftText className="fuente">Origen:</LeftText>
          <MiddleSection />

          <ContentRight>
            <RightText className={`${depositProvider ? 'fuente' : 'skeleton'}`}>
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
                  {`$ ${cost} COP` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }
          {
            depositAmount &&
            <ItemContainer>
                <LeftText className="fuente">Cantidad:</LeftText>
                <MiddleSection />
                <RightText className={`${depositAmount ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${depositAmount} COP` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }
          {
            (depositCost && depositAmount) &&
            <ItemContainer>
                <LeftText className="fuente">Total:</LeftText>
                <MiddleSection />
                <RightText className={`${total ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${total} COP` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }
        </>
      }
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

  p{
    color:var(--paragraph_color);
  }

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





