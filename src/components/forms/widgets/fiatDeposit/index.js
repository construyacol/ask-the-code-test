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
import DepositProviderComponent from './depositProviderStage' 
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
import { ApiPostCreateDeposit, selectProviderData } from './api'
import DepositCostComponent from './depositCostStage'

const AmountComponent = loadable(() => import("./depositAmountStage"), {fallback:<StageSkeleton/>});

const NewWAccountComponent = ({ handleState, handleDataForm, ...props }) => {

  const { isMovilViewport } = useViewport();
  const { dataForm } = handleDataForm
  const [ loading, setLoading ] = useState(false)
  const [ toastMessage ] = useToastMessage();
  const actions = useActions()
  // const params = useParams()

  const [ costList, depositProvider ] = useSelector(() => selectProviderData(handleState?.state?.depositProvider));

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
    const { state } = handleState
    const { error, data } = await ApiPostCreateDeposit({ state, currentWallet, depositProvider })
    if(error){
      setLoading(false)
      return toastMessage(error?.message, "error");
    }
    await renderSuccessComponent(data)
    setLoading(false)
  }

  const stageComponents = {
    [FIAT_DEPOSIT_TYPES?.STAGES?.SOURCE]:DepositCostComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.PROVIDER]:DepositProviderComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.AMOUNT]:AmountComponent
  }
 
  const RenderStageComponent = stageComponents[stageData?.key] || ProofComponent 
  
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


  return(
    <>
    
        <RenderStageComponent
          stageManager={stageManager}
          handleState={handleState}
          handleDataForm={handleDataForm}
          costList={costList}
          depositProvider={depositProvider}
          {...props}
          {...walletInfo}
        >
          <StageManagerComponent stageManager={stageManager} {...props}/>
        </RenderStageComponent>
        
        <StatusPanelComponent>
          <StatusHeaderContainer>
            <TitleContainer>
              <h1 className="fuente">Resumen del depósito</h1>
            </TitleContainer>
            <StatusContent
              state={handleState?.state}
              stageManager={stageManager}
              depositProvider={depositProvider}
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
 

export default NewWAccountComponent


const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

const StatusContent = ({ state, stageManager, depositProvider }) => {

  const { depositCost, depositAmount } = state
  const [ cost, setCost ] = useState()
  const [ total, setTotal ] = useState()

  useEffect(() => {
    if(depositProvider && depositCost){
      let costs = depositProvider?.provider?.costs
      let { currency } = depositProvider
      let cost = getCost({ costs, currency, depositCost })  
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
                {state?.depositProvider?.uiName?.toLowerCase() || 'skeleton --------'} 
              </RightText>
            {
              (state?.depositProvider && !["other_bank"].includes(state?.depositProvider?.value)) &&
                <IconSwitch
                    icon={state?.depositProvider?.value}
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





