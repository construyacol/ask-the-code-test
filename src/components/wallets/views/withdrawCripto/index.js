import { useState, useEffect, useRef } from "react";
import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { useActions } from "../../../../hooks/useActions";
import useToastMessage from "../../../../hooks/useToastMessage";
import WithOutProvider from "./withOutProvider";
import SkeletonWithdrawView from "./skeleton";
import { history } from "../../../../const/const";
import { useSelector } from "react-redux";
import { selectWithConvertToObjectWithCustomIndex } from 'hooks/useTxState'
import { CAPACITOR_PLATFORM } from 'const/const';
import { checkCameraPermission } from 'utils'
import { isEmpty } from 'lodash'
import { getMinAmount } from 'utils/withdrawProvider'
import withCryptoProvider from 'components/hoc/withCryptoProvider'
import WithdrawConfirmation from './withdrawConfirmation'
import WithdrawFormComponent from './withdrawForm'
import { formatToCurrency } from "utils/convert_currency";
import { CriptoWithdrawForm } from 'components/forms/widgets/sharedStyles'
import StatusPanelComponent from 'components/forms/widgets/statusPanel'
import { StatusHeaderContainer, TitleContainer, StatusContainer, ContentRight } from 'components/forms/widgets/statusPanel/styles'
import { DetailContainer } from './withdrawConfirmation/styles'
import { HandleGas } from './withdrawConfirmation/ethGas'
import DetailTemplateComponent, { ItemContainer, LeftText, MiddleSection, RightText } from 'components/widgets/detailTemplate'
import ControlButton from "components/widgets/buttons/controlButton";
import BigNumber from "bignumber.js"



// thirdparty
import FeeComponent from './withdrawConfirmation/IndicatorFee'
import styled, { keyframes } from 'styled-components'
import { MdSpeed } from 'react-icons/md';
import { AiOutlineThunderbolt } from 'react-icons/ai';


const CriptoSupervisor = (props) => { 
  const { current_wallet, withdrawProvidersByName, withdrawProvider } = props;
  return (
    <>
      {isEmpty(withdrawProvidersByName) ? (
        <SkeletonWithdrawView />
      ) : !withdrawProvider ? (
        <WithOutProvider current_wallet={current_wallet} />
      ) : (
        <CriptoView {...props}/>
      )}
    </>
  );
};

export default withCryptoProvider(CriptoSupervisor)


export const CriptoView = (props) => {

  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
  const {
    current_wallet,
    withdrawProvider,
    withdraw_accounts,
    balance,
    user,
    coinsendaServices,
    active_trade_operation,
  } = props

  const actions = useActions();
  const [toastMessage] = useToastMessage();
  const [addressState, setAddressState] = useState();
  const [addressValue, setAddressValue] = useState();
  const [amountState, setAmountState] = useState();
  const [addressToAdd, setAddressToAdd] = useState();
  const [minAmount, setMinAmount] = useState(0)
  const [tagWithdrawAccount, setTagWithdrawAccount] = useState();
  const isValidForm = useRef(false);
  const [ showModal, setShowModal ] = useState(false)

  const [ orderDetail, setOrderDetail] = useState([["Cantidad", ""], ["Costo", ""], ["Total", ""]])

  const { 
    provider:{ 
      withdrawData, 
      setWithdrawData, 
      getNetworkData 
    }
  } = props

  const { 
    fixedCost, 
    timeLeft, 
    amount,
    isEthereum,
    gas_limit,
    total
  } = withdrawData




  const createWithdraw = () => {
    finish_withdraw({ cost_information:{ cost_id:currentPriority }, gas_limit })
  }

  const handleChangeAmount = (name, newValue) => setWithdrawData(prevState => ({...prevState, amount:newValue}))
  const setTowFaTokenMethod = async (payload) => {
    finish_withdraw(payload);
    actions.renderModal(null);
  };
 
  const finish_withdraw = async (fnProps) => {
      const { twoFaToken = null, cost_information, gas_limit } = fnProps
      const transactionSecurity = await coinsendaServices.userHasTransactionSecurity(user.id);
      if((transactionSecurity && transactionSecurity["2fa"]?.enabled) && !twoFaToken){
      setShowModal(false)
      return actions.renderModal(() => (
          <Withdraw2FaModal isWithdraw2fa callback={setTowFaTokenMethod} {...fnProps} />
        ));
      } 
      actions.isAppLoading(true);
      let withdraw_account = withdraw_accounts[addressValue];
      if (!withdraw_account) { 
        // si la cuenta no existe, se crea una nueva y se consultan
        withdraw_account = await coinsendaServices.addNewWithdrawAccount({ 
            currency: current_wallet.currency,
            provider_type: withdrawProvider?.provider_type,
            label: current_wallet.currency.currency,
            address: addressValue.trim(),
            country: current_wallet.country,
          },
          "cripto"
        );
        await coinsendaServices.fetchWithdrawAccounts();
      }
      sessionStorage.setItem(`withdrawInProcessFrom${current_wallet?.id}`, current_wallet.id );
      let bodyRequest = {
        data: { 
          amount,
          account_id: current_wallet.id,
          withdraw_provider_id:withdrawProvider.id,
          withdraw_account_id: withdraw_account.id,
          cost_information,
          country: user.country,
        }
      }
      if(current_wallet?.currency?.currency?.includes('eth')) {
        const network_data = await getNetworkData()
        bodyRequest.data.network_data = network_data
        bodyRequest.data.cost_information.gas_limit = gas_limit
      }
      const { error, data } = await coinsendaServices.addWithdrawOrder(bodyRequest, twoFaToken);
      // console.log('||||| ===> addWithdrawOrder', error, data)
      // debugger
      await actions.renderModal(null)
      setShowModal(false)
      if (error) {
        actions.isAppLoading(false);
        return toastMessage(error?.message, "error");
      }
      setTimeout(async() => {
        if(sessionStorage.getItem(`withdrawInProcessFrom${current_wallet?.id}`)){
          sessionStorage.removeItem(`withdrawInProcessFrom${current_wallet?.id}`)
          actions.isAppLoading(false);
          await coinsendaServices.addUpdateWithdraw(data?.id, "confirmed");
          await coinsendaServices.get_withdraws(current_wallet?.id)
          await coinsendaServices.updateActivityState(current_wallet?.account_id, "withdraws");
          await coinsendaServices.getWalletsByUser(true);
          history.push(`/wallets/activity/${current_wallet.id}/withdraws`);
        }
      }, 8000)   
  }

  // const handleSubmit = async(e) => {
  //   e && e.preventDefault();
  //   e && e.stopPropagation();
  //   actions.isAppLoading(true);
  //   const Element = await import("components/forms/widgets/layout");
  //   actions.isAppLoading(false);
  //   if(!Element) return; 
  //   const Layout = Element.default
  //   actions.renderModal(() => 
  //     <Layout 
  //         // closeControls={isMovilViewport}
  //         callback={closeModal}
  //         className="_show"
  //     >
  //     </Layout>
  //   );
  //   setShowModal('withdrawConfirmation')
  // };

  const closeModal = () => setShowModal(false)

  const handleMaxAvailable = (e) => {
    // TODO: refactor amountEl to reference DOM with useRef
    let amountEl = document.getElementsByName("amount")[0];
    const finalAmount = current_wallet ? formatToCurrency(balance.available, current_wallet?.currency)?.toFormat() : balance.available
    amountEl.value = finalAmount
    setWithdrawData(prevState => ({...prevState, amount:finalAmount}))
    if (amountEl.value > 0) {
      setAmountState("good");
    }
  };
  

  const showQrScanner = async () => {
    if (CAPACITOR_PLATFORM !== 'web' && await checkCameraPermission()) {
      const { BarcodeScanner } = await import('@awesome-cordova-plugins/barcode-scanner');
      const { text, cancelled } = await BarcodeScanner.scan();
      // console.log('BarcodeScanner', text, cancelled )
      if (!!!cancelled) setAddressValue(text);
    } else if (CAPACITOR_PLATFORM === 'web') {
      actions.renderModal(null);
      const Element = await import("../../../widgets/qr-scanner"); 
      const RenderComponent = Element.default
      actions.renderModal(() => <RenderComponent onScan={setAddressValue} />);
    }
  };

  const handleChangeAddress = (_, value) => {
    setAddressValue(value.replace(/[^@a-zA-Z0-9]/g, ""));
  };

  const deleteTag = () => {
    setTagWithdrawAccount(null);
    setAddressValue("");
  };

  useEffect(() => {
    const condition = !active_trade_operation && amountState === "good" && addressState === "good";
    if (isValidForm.current !== condition) {
      isValidForm.current = condition;
    }
    if (addressState === "good") {
      document.getElementsByName("amount")[0].focus();
    }
  }, [active_trade_operation, amountState, addressState]);


  useEffect(() => {
    // Las cuentas anónimas son aquellas que su label es igual al provider_type de la red monetaria a la que pertenece la cuenta
    setAddressToAdd();
    const provider_type = current_wallet.currency.currency;
    // console.log('addressValue', addressValue, withdraw_accounts)
    if (withdraw_accounts[addressValue] && withdraw_accounts[addressValue] && withdraw_accounts[addressValue].info.label !== provider_type) {
      // Si la cuenta existe y nó es una cuenta anónima muestre el tag en el input
      setTagWithdrawAccount(withdraw_accounts[addressValue]);
    }else{
      setTagWithdrawAccount(null)
    }

    if (addressState === "good") {
      if (!withdraw_accounts[addressValue] || (withdraw_accounts[addressValue] && withdraw_accounts[addressValue].info.label === provider_type)) {
        // Si la cuenta no existe, o si existe pero es una cuenta anónima entonces esta cuenta puede ser agregada
        setAddressToAdd(addressValue);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressState, withdraw_accounts, addressValue]);

  useEffect(() => {
    if(withdrawProvider){
      (async() => {
        let minAmount = await getMinAmount(withdrawProvider)
        // let minAmountWithCost = fixedCost ? minAmount.plus(fixedCost) : minAmount
        // const finalValue = current_wallet ? formatToCurrency(minAmountWithCost, current_wallet?.currency) : minAmountWithCost
        const finalValue = current_wallet ? formatToCurrency(minAmount, current_wallet?.currency) : minAmount
        setMinAmount(finalValue)
      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawProvider, current_wallet, fixedCost])

  const currencySymbol = currencies ? currencies[current_wallet.currency.currency]?.symbol : current_wallet.currency.currency

  const formProps = {
    setAddressState,
    handleChangeAddress,
    addressValue,
    currencySymbol,
    loader:props.loader,
    tagWithdrawAccount,
    addressState,
    showQrScanner,
    setAddressValue,
    addressToAdd,
    deleteTag,
    minAmount,
    timeLeft,
    setAmountState,
    handleChangeAmount,
    amountState,
    handleMaxAvailable,
    balance,
    amountValue:amount,
    // handleSubmit,
    active_trade_operation,
    current_wallet,
    priority:props.priority,
    setShowModal
  }

  const { priorityList, currentPriority, priorityConfig, setPriority } = props.priority

  const closePriorModal = (e, forceClose) => {
    if ((e && e.target?.dataset?.close_modal) || forceClose) {
      setShowModal(false)
    }
  };

  const calculateTotal = () => {
    let totalBalance = BigNumber(balance?.total)
    let _amount = BigNumber(amount)
    let totalAmount = _amount.plus(fixedCost)
    let total = totalAmount.isLessThanOrEqualTo(totalBalance) ? totalAmount : _amount.minus(fixedCost)
    setWithdrawData(prevState => ({...prevState, total })) 
  }

  useEffect(() => {
    calculateTotal()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPriority, fixedCost, amount, timeLeft])

  // let controlValidation = total?.isPositive() && total?.isGreaterThanOrEqualTo(withdrawProvider?.provider?.min_amount)

  const renderOrderDetail = () => {
    
    let _total = current_wallet ? formatToCurrency(total, current_wallet?.currency) : total
    let totalBalance = BigNumber(balance?.total)
    let _amount = BigNumber(amount || 0)

    let finalCopy = _total.isGreaterThan(_amount) ? 'Total retirado' : 'Total Recibido'

    let _fixedCost = current_wallet ? formatToCurrency(fixedCost, current_wallet?.currency) : fixedCost
    console.log('renderOrderDetail total', total)

    setOrderDetail([
      ["Cantidad", `${_amount.toString()}  ${currencySymbol}`],
      ["Costo de red", {Component:() => <FeeComponent currentPriority={currentPriority} value={`${timeLeft >= 0 ? `(${timeLeft})`:''} ${_fixedCost.toFormat()} ${currencySymbol}`}/>}],
      // ["Total a retirar", totaToReceive]
      [finalCopy, `${_total?.toFormat()} ${currencySymbol}`]
    ])
  }

  useEffect(() => {
      renderOrderDetail()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])
  // console.log('fixedCost', fixedCost)
 
  return (
    <CriptoWithdrawForm>
      <WithdrawFormComponent
        {...formProps}
      />
      <StatusPanelComponent className="criptoWithdraw">
        <StatusHeaderContainer className="criptoWithdrawCont">
            <TitleContainer>
              <h1 className="fuente">Velocidad de retiro</h1>
            </TitleContainer>
            
            <PriorityContainer>
              <PriorityItems>
                {
                  Object.keys(props.priority.priorityList).map((priority, index) => {
                    let Icon = priority === 'high' ? AiOutlineThunderbolt : MdSpeed
                    return(
                      <PriorityItem 
                        onClick={() => setPriority(priority)}
                        key={index} 
                        color={priorityConfig[priority].color} 
                        className={`${priority === currentPriority ? 'isActive' : ''} ${priority}`}
                      >
                        <Icon
                          size={35}
                          color={priority === currentPriority ? priorityConfig[priority].color : 'gray'}
                        />
                        <p className="fuente">{priorityConfig[priority].uiName}</p>
                        <div className="speedBar" />
                      </PriorityItem>
                    )
                  })
                }
              </PriorityItems>
              <p className="fuente" style={{fontSize:"13px"}}>{priorityConfig[currentPriority].description}</p>
            </PriorityContainer>

            {
              isEthereum ? <HandleGas withdrawData={withdrawData} setWithdrawData={setWithdrawData}/> : <></>
            }

            <StatusContainer>
              <DetailContainer>
                <DetailTemplateComponent
                    items={orderDetail}
                    skeletonItems={3}
                />
              </DetailContainer>
            </StatusContainer>
          </StatusHeaderContainer>

          <ControlButton
            loader={false}
            handleAction={createWithdraw}
            formValidate={!active_trade_operation && amountState === "good" && addressState === "good"}
            label="Confirmar retiro"
            // formValidate={(amountState === 'good' && addressState === 'good') && true}
          />

      </StatusPanelComponent>
    </CriptoWithdrawForm>
  ); 
};



  



  // <>
  //   <WithdrawFormComponent
  //     {...formProps}
  //   />

  //   {
  //     showModal === 'speedPriority' ?
  //     <ModalSpeedContainer data-close_modal={true} onClick={closePriorModal}>
  //       <ModalSpeedPriority className={`${showModal === 'speedPriority' ? 'show' : ''} `}>

  //         <PriorityContainer>
  //           <p className="fuente bold">Velocidad de retiro</p>
  //           <PriorityItems>
  //             {
  //               Object.keys(props.priority.priorityList).map((priority, index) => {
  //                 return(
  //                   <PriorityItem 
  //                     onClick={() => setPriority(priority)}
  //                     key={index} 
  //                     color={priorityConfig[priority].color} 
  //                     className={`${priority === currentPriority ? 'isActive' : ''} ${priority}`}
  //                   >
  //                     <MdSpeed
  //                       size={35}
  //                       color={priority === currentPriority ? priorityConfig[priority].color : 'gray'}
  //                     />
  //                     <p className="fuente">{priorityConfig[priority].uiName}</p>
  //                     <div className="speedBar" />
  //                   </PriorityItem>
  //                 )
  //               })
  //             }
  //           </PriorityItems>
  //           <p className="fuente" style={{fontSize:"13px"}}>{priorityConfig[currentPriority].description}</p>
  //         </PriorityContainer>

  //       </ModalSpeedPriority>
  //     </ModalSpeedContainer>
  //     : <></>
  //   }

  //   {
  //     showModal === 'withdrawConfirmation' ?
  //       <WithdrawConfirmation 
  //         amount={amount}
  //         currencySymbol={currencySymbol}
  //         addressValue={addressValue}
  //         tagWithdrawAccount={tagWithdrawAccount}
  //         current_wallet={current_wallet}
  //         handleAction={finish_withdraw}
  //         callback={closeModal}
  //         {...props}
  //       /> : <></>
  //   }
  // </>


const PriorityItems = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  column-gap: 15px;
`

const PriorityContainer = styled.div`
  display:grid;
  grid-template-rows: 100px 20px;
  row-gap:30px;
  
  .bold{
    font-weight: bold;
  }

  p{
    margin:0;
    color:var(--paragraph_color);
  }
`

const PriorityItem = styled.div`
    transition:.3s;
    border: 1px solid #d5d5d5;
    max-width: 125px;
    background: #ffffffd6;
    border-radius: 4px;
    display:grid;
    grid-template-rows:1fr auto auto;
    row-gap:10px;
    place-items: center;
    padding: 15px 0;
    height: calc(100% - 30px);
    border: 1px solid transparent;
    transform:scale(.9);
    width: 100%;
    cursor:pointer;
    
    
    &:hover{
      border: 1px solid ${props => props.color ? props.color : ''};
    }

    &.isActive{
      transform:scale(1);
      border: 1px solid ${props => props.color ? props.color : ''};
      .speedBar::after{
        background: ${props => props.color};
      }
    }
    
    &>div{
      height: 45px;
      width: 45px;
      border-radius: 4px;
    }

    p{
      margin:0;
      font-size: 14px;
    }

    &.low .speedBar::after{
      width: 20%;
    }
    &.medium .speedBar::after{
      width: 50%;
    }
    &.high .speedBar::after{
      width: 100%;
    }

    .speedBar{
      height: 5px;
      width: 80%;
      background:#d1d1d1;
      position: relative;
      &::after{
        content:"";
        position: absolute;
        height: 100%;
        width: 20%;
      }
    }

`


const ModalSpeedContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  z-index: 5;
  /* backdrop-filter: blur(1px); */
`

const approve = keyframes`
0% {
    opacity: 0;
    transform: translateY(0vh);
}
100%{
    opacity: 1;
    transform: translateY(-10vh);
}
`;


const ModalSpeedPriority = styled.div`
  width: 100%;
  max-width: 450px;
  height: auto;
  background:white;
  position:absolute;
  bottom:0px;
  left: 0;
  right: 0;
  margin: auto;
  display:grid;
  padding:20px;
  border-radius: 6px;
  backdrop-filter: blur(10px);
  background: #ffffff61;

 
  -webkit-box-shadow: 10px 10px 23px -21px rgba(0,0,0,0.25);
  -moz-box-shadow: 10px 10px 23px -21px rgba(0,0,0,0.25);
  box-shadow: 10px 10px 23px -21px rgba(0,0,0,0.25);
`



