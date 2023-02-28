import { useState, useEffect } from 'react'
import useStage from '../../hooks/useStage'
import { ButtonContainers } from '../sharedStyles'
import loadable from "@loadable/component";
import ControlButton from "../../../widgets/buttons/controlButton";
import StageManagerComponent from '../stageManager'
import StatusPanelComponent from '../statusPanel'
import useViewport from '../../../../hooks/useWindowSize'
import { FIAT_DEPOSIT_TYPES } from './api'
import useToastMessage from "../../../../hooks/useToastMessage"; 
import { useActions } from '../../../../hooks/useActions'
import styled from 'styled-components'
import { useSelector } from "react-redux";
import { useWalletInfo } from '../../../../hooks/useWalletInfo'
import { getCost } from './validations'
import { ItemContainer, LeftText, MiddleSection, RightText } from '../../../widgets/detailTemplate'
import { StageSkeleton } from '../stageManager'
import { formatToCurrency } from '../../../../utils/convert_currency'
import { ApiPostCreateBankDeposit, ApiPostCreatePseDeposit, selectProviderData, createNextStages, ApiGetOnFiatDepositStages } from './api'
import RenderSwitchComponent from 'components/renderSwitchComponent'
import { selectDepositProvsByNetwork } from 'selectors'
import useBreadCumb from 'hooks/useBreadCumb'
// import DepositCostComponent from './depositCostStage'
// import PersonTypeComponent from './personType'
// import BankNameListComponent from './bankName'
// import ProviderComponent from './depositProviderStage' 

const ProviderComponent = loadable(() => import("./depositProviderStage"), {fallback:<StageSkeleton/>});
const DepositCostComponent = loadable(() => import("./depositCostStage"), {fallback:<StageSkeleton/>});
const PersonTypeComponent = loadable(() => import("./personType"), {fallback:<StageSkeleton/>});
const BankNameListComponent = loadable(() => import("./bankName"), {fallback:<StageSkeleton/>});
const AmountComponent = loadable(() => import("./depositAmountStage"), {fallback:<StageSkeleton/>});
const CriptoSupervisor = loadable(() => import("components/wallets/views/depositCripto"), {fallback:<StageSkeleton/>});


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
  // console.log('depositProviders', depositProviders)
  
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
  parentLabel:'Depositar',
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
    // console.log('renderSuccessComponent', data)
    // debugger
    actions.renderModal(() => 
    <FiatDepositSuccess 
      actions={actions}
      orderData={data}
      depositAccount={depositAccount}
    />);
  }

  const createFiatDeposit = async() => {
    const depositMethods = {
      pse:ApiPostCreatePseDeposit,
      bank:ApiPostCreateBankDeposit
    }
    setLoading(true) 
    const depositProvider = depositProviders[depositAccount?.provider_type]
    const { error, data } = await depositMethods[depositAccount?.provider_type]({ state, currentWallet, depositProvider })
    if(error){
      setLoading(false)
      return toastMessage(error?.message, "error");
    }
    await renderSuccessComponent(data)
    setLoading(false)
    return 
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
    [FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]:BankNameListComponent,
    [FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO]:CriptoSupervisor
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
            <StatusPanelComponent>
              <StatusHeaderContainer>
                <TitleContainer>
                  <h1 className="fuente">Resumen del depósito</h1>
                </TitleContainer>
                <StatusContent
                  state={state}
                  stageManager={stageManager}
                  depositAccount={depositAccount}
                  dataForm={dataForm}
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
        }

        
    </>                 
  )
}
 

export default NewFiatDepositComponent


const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

const StatusContent = ({ state, stageManager, depositAccount, dataForm }) => {

  // const STAGE_COMPONENTS = {
  //   pse:PseResumeComponent,
  //   bank:BankResumeComponent
  // }

  return null

  // return(
  //   <StatusContainer>
  //     <ItemContainer>
  //         <LeftText className="fuente">Origen:</LeftText>
  //         <MiddleSection />
  //         <ContentRight>
  //           <RightText className={`${depositAccount ? 'fuente' : 'skeleton'}`}>
  //               {state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER]?.uiName?.toLowerCase() || 'skeleton --------'} 
  //             </RightText>
  //           {
  //             (state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER] && !["other_bank"].includes(state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER].value)) &&
  //               <IconSwitch
  //                   icon={state[FIAT_DEPOSIT_TYPES.STAGES.PROVIDER]?.value}
  //                   size={20}
  //                 />
  //           }
  //         </ContentRight>
  //     </ItemContainer>
      
  //     {
  //       depositAccount &&
  //       <RenderSwitchComponent
  //           STAGE_COMPONENTS={STAGE_COMPONENTS}
  //           component={depositAccount?.provider_type}
  //           stageManager={stageManager}
  //           state={state}
  //           depositAccount={depositAccount}
  //           dataForm={dataForm}
  //       />
        
  //     }

  //   </StatusContainer>
  // )
}


const PseResumeComponent = ({
  stageManager,
  state,
  depositAccount,
  dataForm
}) =>{


  // console.log('PseResumeComponent', state)

  return(
    <>
       {
        stageManager?.currentStage > 0 &&
        <>
          <p className="fuente" style={{marginBottom:"5px"}}>
            <strong>{state?.person_type?.uiName}</strong>
          </p>
          {
            state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME] &&
            <ItemContainer>
              <LeftText className="fuente">Banco:</LeftText>
              <MiddleSection />
              <ContentRight>
                <RightText className={`fiatDeposit ${state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME] ? 'fuente' : 'skeleton'}`}>
                    {dataForm?.stages[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]?.selectList[state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]]?.uiName || 'skeleton --------'} 
                </RightText>
                  {
                    state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME] &&
                    <IconSwitch
                        icon={state[FIAT_DEPOSIT_TYPES?.STAGES?.BANK_NAME]}
                        size={20}
                      />
                  }
              </ContentRight>
            </ItemContainer>
          }
          {
            state?.depositAmount &&
            <ItemContainer>
                <LeftText className="fuente">Cantidad:</LeftText>
                <MiddleSection />
                <RightText className={`${state?.depositAmount ? 'fuente2' : 'skeleton'}`}>
                  {`$ ${state?.depositAmount} COP` || 'skeleton --------'} 
                </RightText>
            </ItemContainer>
          }
        </>
      }
    </>
  )
}


const BankResumeComponent = ({ 
  stageManager,
  state,
  depositAccount
}) => {

  const { depositCost, depositAmount } = state
  const [ cost, setCost ] = useState()
  const [ total, setTotal ] = useState()

  useEffect(() => {
    if(depositAccount && depositCost){
      let costs = depositAccount?.costs
      let { currency } = depositAccount
      let _cost = getCost({ costs, currency, depositCost })  
      if(!_cost)return;
      setCost(_cost.toFormat())
      let _depositAmount = depositAmount && formatToCurrency(depositAmount.toString().replace(/,/g, ""), currency);
      _depositAmount && setTotal(_depositAmount?.plus(_cost)?.toFormat())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAccount, depositCost, depositAmount])

  return(
    <>
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
    </>
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


// const StatusContainer = styled.div`
//   width:100%;
//   height:auto;
//   padding-top:15px;
//   display: flex;
//   flex-direction: column;
//   row-gap: 25px;

//   p{
//     color:var(--paragraph_color);
//   }

//   ${LeftText}{
//     font-weight: normal;
//   }
// `

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


// const ProofComponent = ({ children, nextStage }) => {
//   return(
//     <StageContainer>
//       {children}
//     </StageContainer>
//   )
// }





