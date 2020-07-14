import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import UseTxState from '../../hooks/useTxState'
import { PaymentConfirButton } from '../buttons/buttons'
import { useFormatCurrency } from '../../hooks/useFormatCurrency'
import IconSwitch from '../icons/iconSwitch'
// import { ObserverHook } from '../../hooks/observerCustomHook'
import { device } from '../../../const/const'
import PopNotification from '../notifications'
import SwapAnimation from '../swapAnimation/swapAnimation'
import SimpleLoader from '../loaders'
import useViewport from '../../../hooks/useWindowSize'

import { gotoTx, containerDepositAnim, newOrderStyleAnim, deletedOrderAnim } from '../animations'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')


const confirmPayment = async() => {
    const TFileUpload = document.getElementById("TFileUpload")
    TFileUpload && TFileUpload.click()
}

const OrderItem = ({ order, handleAction }) => {

  const txState = UseTxState(order.id)
  const { tx_path, new_order_style, actions, history } = txState
  // const [ show,  element ] = ObserverHook()
  const [ orderState, setOrderState ] = useState()


  const orderDetail = async(e) => {
    if(!order){return}
    const target = e.target
    if(target.dataset && target.dataset.is_deletion_action){return}

    const { tx_path, account_id, primary_path, path, isModalOpen } = txState

    history.push(`/${primary_path}/${path}/${account_id}/${tx_path}/${order.id}`)
    actions.cleanNotificationItem('wallets', 'order_id')

    const OrderDetail = await import('../modal/render/orderDetail/index.js')
    await actions.renderModal(()=><OrderDetail.default/>)
    if(target.dataset && target.dataset.is_confirm_deposit){confirmPayment()}
  }



  return(
        <OrderContainer
          className={`${new_order_style ? 'newOrderContainer' : ''} ${orderState}`}
          onClick={orderState ? null : orderDetail}
          >
          {
            tx_path === 'deposits' ?
            <DepositOrder order={{...order, orderState, setOrderState}} />
            :
            tx_path === 'withdraws' ?
            <WithdrawOrder order={{...order}} />
            :
            tx_path === 'swaps' ?
            <SwapOrder order={{...order}} setOrderState={setOrderState}/>
            :
            <LoaderView/>
          }
        </OrderContainer>
  )

}


export default OrderItem

const getIcon = state => {
  return state === 'pending' ? 'far fa-clock':
         (state === 'canceled' || state === 'rejected') ? 'far fas fa-times' :
         // state === 'accepted' ? 'far fas fa-check' :
         state === 'accepted' ? '' :
         state === 'confirmed' && 'far fa-clock'
  // deposit = 'fas fa-arrow-down'
  // withdraw = 'fas fa-arrow-up'
  // swap = 'fas fa-arrow-down'
    }

const getState = ({ state, currency_type, id }) => {

  const { tx_path } = UseTxState(id)

  return tx_path === 'swaps' && (state === 'pending' || state === 'confirmed') ? 'Procesando' :
         state === 'pending' ? 'Pendiente' :
         state === 'confirmed' && tx_path === 'withdraws' ? 'Procesando' :
         (state === 'confirmed' && currency_type === 'fiat') ? 'Confirmado' :
         state === 'confirmed' ? 'Confirmando' :
         state === 'accepted' ? 'Aceptado' :
         state === 'canceled' ? 'Cancelado' :
         state === 'rejected' && 'Rechazado'
}


const DepositOrder = ({ order }) => {

  const { new_order_style, tx_path } = UseTxState(order.id)

  const {
    state,
    created_at,
    currency,
    id,
    setOrderState,
    orderState,
    currency_type
  } = order




  return (
      <Order className={`${state} ${currency_type} ${new_order_style ? 'newOrderStyle' : ''} ${orderState}`}>

        <DataContainer className={`align_first ${state} ${currency_type} ${tx_path}`}>
          <DeleteButton {...order} setOrderState={setOrderState}/>
          <PanelLeft {...order} />
          <OrderIcon className="fas fa-arrow-down" />
          <TypeOrderText className="fuente">{getTypeOrder(order)}</TypeOrderText>
          <MobileDate className="fuente2">{moment(created_at).format("l")}</MobileDate>
          <PopNotification notifier="wallets" item_type="order_id" id={id} type="new"/>
        </DataContainer>

        <DataContainer className="align_middle">
          <OrderStatusCont>
            <OrderStatus className="fuente">
              <StatusIcon className={getIcon(state)} />
              {getState(order)}
            </OrderStatus>
          </OrderStatusCont>
        </DataContainer>

        <DataContainer className="align_last">
          <PanelRight order={order}/>
        </DataContainer>

      </Order>
  )

}



const BarraSwap = styled.div`
  width: 100% !important;
  height: 1px;
  background: #00000012;
  position: absolute;
  top: 1px;
  right: 0;
  opacity: 0.6;
`

const SwapOrder = ({ order, setOrderState }) => {

  const { new_order_style, tx_path, currentOrder } = UseTxState(order.id)
  const { isMovilViewport } = useViewport()

  useEffect(()=>{
    if(currentOrder.state === 'pending' || currentOrder.state === 'confirmed'){
      setOrderState('inProcess')
    }else{
      setOrderState()
    }
  }, [currentOrder])

  const {
    created_at,
    currency,
    id,
    currency_type
  } = order

  const {
    state
  } = currentOrder

  const colorState = state === 'accepted' ? '#1cb179' : state === 'confirmed' ? '#77b59d' : state === 'pending' && '#ff8660'
  // let tradeActive = state === 'pending' || state === 'confirmed' || null

  return (
      <Order className={`${state} ${currency_type || ''} ${new_order_style ? 'newOrderStyle' : ''} ${tx_path} ${currentOrder.activeTrade ? 'inProcess' : '' }`}>

        {
          currentOrder.activeTrade &&
          <BarraSwap className="barraSwap">
            <div className={`relleno ${(state === 'pending') ? 'swaPending' :
              (state === 'confirmed') ? 'swaProcessing' :
              (state === 'accepted') ? 'swapDone' : ''
            }`}>
            </div>
          </BarraSwap>
        }



        <DataContainer className={`align_first ${state} ${currency_type || ''}`}>
          {
            currentOrder.activeTrade && state !== 'accepted' ?
            <>
              <div className="loaderViewItem" >
                <SimpleLoader loader={2} color={colorState}/>
              </div>
              <SwapAnimation
                from={order.to_spend_currency.currency}
                to={order.to_buy_currency.currency}
                colorIcon={colorState}
              />
            </>
            :
            <>
              {
                !isMovilViewport && currentOrder.activeTrade && state === 'accepted' ?
                <div className="loaderViewItem" >
                  <div className="successIcon">
                    <IconSwitch size={80} icon="success" color="#1cb179"/>
                  </div>
                </div>
                :
                <PanelLeft {...order} />
              }
              <OrderIcon className="fas fa-retweet swap" />
              <TypeOrderText className="fuente swap">Intercambio</TypeOrderText>
              <MobileDate className="fuente2">{moment(created_at).format("l")}</MobileDate>
            </>
          }
          <PopNotification notifier="wallets" item_type="order_id" id={id} type="new"/>
        </DataContainer>

        <DataContainer className="align_middle">
          <OrderStatusCont>
            <OrderStatus className="fuente">
              <StatusIcon className={getIcon(state)} />
              {getState(currentOrder)}
            </OrderStatus>
          </OrderStatusCont>
        </DataContainer>

        <DataContainer className={`align_last ${tx_path}`}>
          <PanelRight order={currentOrder}/>
        </DataContainer>

      </Order>
  )

}



const WithdrawOrder = ({ order }) => {

  const { new_order_style } = UseTxState(order.id)

  const {
    state,
    created_at,
    currency,
    id,
    currency_type
  } = order


  return (
      <Order className={`${state} ${currency_type} ${new_order_style ? 'newOrderStyle' : ''}`}>

        <DataContainer className={`align_first ${state} ${currency_type}`}>
          <PanelLeft {...order} />
          <OrderIcon className="fas fa-arrow-up" />
          <TypeOrderText className="fuente">{getTypeOrder(order)}</TypeOrderText>
          <MobileDate className="fuente2">{moment(created_at).format("l")}</MobileDate>
          <PopNotification notifier="wallets" item_type="order_id" id={id} type="new"/>
        </DataContainer>

        <DataContainer className="align_middle">
          <OrderStatusCont>
            <OrderStatus className="fuente">
              <StatusIcon className={getIcon(state)} />
              {getState(order)}
            </OrderStatus>
          </OrderStatusCont>
        </DataContainer>

        <DataContainer className="align_last">
          <PanelRight order={order}/>
        </DataContainer>

      </Order>
  )

}



const PanelLeft = (order) => {

  const { currencies, tx_path } = UseTxState(order.id)

  return(
    <>
    {
      ((order.currency_type === 'crypto' && order.state === 'confirmed') && tx_path === 'deposits') ?
      <Confrimations className="fuente2">
        <p>
          {order.confirmations}<span>/{currencies[order.currency.currency].confirmations}</span>
        </p>
      </Confrimations>
      :
      <DateCont>
        <Day className="fuente2">{moment(order.created_at).format("DD")}</Day>
        <Month className="fuente">{moment(order.created_at).format("MMM").toUpperCase()}</Month>
      </DateCont>
    }
    </>
  )
}

const getTypeOrder = (order) => {
  const { tx_path } = UseTxState(order.id)
  return tx_path === 'deposits' ? 'Deposito' : tx_path === 'withdraws' ? 'Retiro' : tx_path === 'swaps' && 'Intercambio'
}



const PanelRight = ({ order }) => {

  const { state, id, currency_type, amount, currency } = order
  const { lastPendingOrderId, tx_path } = UseTxState(id)
  const [ amountC ] = useFormatCurrency(amount, currency)


  return(
    <>
    {
      tx_path === 'swaps' ?
      <>
      <AmountText className={`fuente2 amount swaps`}>
        + {order.bought || '--'}
      </AmountText>
      <IconSwitch className={`currency_bought`} icon={order.to_buy_currency.currency} size={16} />
      <AmountText className={`fuente2 amount_spent`}>
        - {order.spent || '--'}
      </AmountText>
      <IconSwitch className={`currency_spent`} icon={order.to_spend_currency.currency} size={16} />
      <AmountIcon className={`fas fa-angle-right arrow_right`} />
      </>
      :
      state === 'pending' ?
      <PaymentConfirButton
        id="ALconfirmButton"
        clases={` ${lastPendingOrderId ? 'ALbuttonActive' : 'confirmButton' }`}
        active={true}
        type="primary"
        label="Confirmar"
      />
      :
      (state === 'confirmed' && currency_type ==='fiat') ?
      <p className="fuente" id="ALrevised">En revisión<i className="far fa-clock"></i></p>
      :
      <>
      <AmountText className={`fuente2 ${tx_path} ${order.state}`}>
        {tx_path === 'deposits' ? '+' : tx_path === 'withdraws' ? '- ' : ''}
        {currency_type === 'fiat' && '$'}
        {amountC}
      </AmountText>
      <IconSwitch icon={currency.currency} size={16} />
      <AmountIcon className="fas fa-angle-right" />
      </>
    }
    </>
  )
}

const DeleteButton = ({ state, id, setOrderState }) => {

  const { actions, coinsendaServices } = UseTxState(id)


  const deleteDeposit = () => {
    actions.confirmationModalToggle()
    actions.confirmationModalPayload({
      title:"Esto es importante, estas a punto de...",
      description:"Cancelar esta orden, ¿Estas seguro de hacer esto?",
      txtPrimary:"Continuar",
      txtSecondary:"Cancelar",
      payload:id,
      action:delete_order,
      img:"deleteticket"
    })
    // setTimeout(()=>{setOrderState('deleted')}, 1000)
  }

  const delete_order = async(id) =>{
    setOrderState('deleting')

    let deleted = await coinsendaServices.deleteDeposit(id)
    // let deleted = await actions.delete_deposit_order(id)
    if(!deleted){
      return false
    }
    setOrderState('deleted')
  }

  return(
    <>
      {
        state === 'pending' &&
        <div className="tooltip deleteOrder" onClick={deleteDeposit} data-is_deletion_action={true}>
          <div id="Aldelete" data-is_deletion_action={true}>
            <i className="far fa-times-circle " data-is_deletion_action={true}></i>
          </div>
          <span className="tooltipDelete fuente" data-is_deletion_action={true}>Cancelar</span>
        </div>
      }
    </>
  )
}



const Confrimations = styled.div`
  grid-area: confirmations;
  p{
    margin: 0 20px 0 0;
    color: #1cb179;
    font-size: 25px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 35px;
  }
`

const Icon = styled.i`
  margin-right: 10px;
`
const StatusIcon = styled(Icon)`
  margin-right: 5px;
`
const AmountIcon = styled(Icon)`
  margin-left: 10px;
`

const OrderIcon = styled(Icon)`
  font-size: 22px;
  grid-area: orderIcon;
`

const OrderStatus = styled.p`
  margin:0;
  display: flex;
  font-size: 12px;
  align-items: center;
`

const OrderStatusCont = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
  width: auto;
  max-width: 110px;
  border-radius: 4px;
  height: 25px;
  padding: 2px 10px;
`



const Text = styled.p`
`

const TypeOrderText = styled(Text)`
  grid-area: typeOrderText
`

const AmountText = styled(Text)`

  font-size: 16px !important;
  margin-right: 7px;


  @media ${device.tablet} {
    white-space: nowrap;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.withdraws{
    color: #f44336 !important;
  }
  &.rejected, &.canceled{
    text-decoration: line-through;
  }
`

const DateCont = styled.div`
  margin-right: 20px;
  justify-items: center;
  display: grid;
    p{
      margin: 0;
    }


`

const Month = styled.p`
  font-size: 14px;
`

const Day = styled.p`
  font-size: 30px;
`

const MobileDate = styled.div`
  font-size: 12px;
  color: gray;
  min-width: 90px !important;
  display: none;
`

export const Order = styled.div`
  border: 1px solid #8080808f;
  border-radius: 6px;
  height: 73px;
  cursor: pointer;
  display: grid;
  align-items: center;
  padding: 0 25px;
  position: relative;
  transition: .3s;
  transform-origin: top;
  box-shadow: 0px 5px 14px 3px rgba(0,0,0,0);


  @media ${device.tablet} {
    .align_middle, ${DateCont}{
      display: none;
    }

    ${MobileDate}{
      display: initial;
    }
    ${TypeOrderText}{
      margin: 3px 0;
    }
  }


  :hover #ALconfirmButton>div{
    border: 2px solid #1cb179 !important;
    .ALbuttonTextSpan{
      color: #1cb179 !important;
    }
  }

  &.newOrderStyle{
    animation-name: ${newOrderStyleAnim};
    animation-duration: .7s;
    animation-timing-function: cubic-bezier(1,1,1,1);
    animation-fill-mode: forwards;
  }

  &.deleted{
    animation-name: ${deletedOrderAnim};
    animation-duration: .3s;
    animation-timing-function: cubic-bezier(1,1,1,1);
    animation-fill-mode: forwards;
    ${'' /* animation-direction: reverse; */}
  }

  :hover, &.swaps.pending, &.swaps.confirmed, &.swaps.accepted.inProcess{
    box-shadow: 0px 1px 14px 3px rgba(0,0,0,0.1);
    transform: scale(1.01);
    background: rgba(255, 255, 255, 0.6);
    #Aldelete{
      width: 40px !important;
    }
    ${AmountIcon}{
      animation-name:${gotoTx};
      animation-duration: .5s;
      animation-iteration-count: infinite;
      transform: scale(.5);
    }


  }

  &.pending{
    ${OrderStatusCont}{
      background: #ff8660;
    }
  }

  &.confirmed{
    ${OrderStatusCont}{
      background: rgb(28,177,121);
    }
  }

  &.pending, &.confirmed {
    border: 1px solid #ff8660 !important;
    ${Day}, ${Month}, ${OrderIcon}, ${Text}, ${AmountIcon}{
      color: #ff8660 ;
    }
    ${StatusIcon}{
      color: white !important;
    }
    ${OrderStatus}{
      color: white !important;
    }
  }

  &.confirmed.swaps{
    border: 1px solid #a9c2b9 !important;
    .confirmed p, .confirmed i{
      color: #a9c2b9 !important;
    }
    ${OrderStatusCont}{
      background: #5fc79f !important;
    }
  }

  &.canceled, &.rejected{
      border: 1px solid #f44336 !important;
      opacity: 0.3;
      transition: .3s;
      :hover{
        opacity: 0.8;
      }
      :hover .canceled{
        opacity: 0.8 !important;
      }
      ${Day}, ${Month}, ${OrderIcon}, ${Text}, ${AmountIcon}{
        color: #f44336;
      }
      ${OrderStatus}{
        color: red !important;
      }
  }

   &.confirmed.crypto{
     border: 1px solid rgb(28, 177, 121) !important;
   }

  &.accepted, &.confirmed.crypto{
    ${Day}, ${Month}, ${OrderIcon}, ${Text}, ${AmountIcon}{
      color: rgb(28, 177, 121);
    }
    ${OrderStatusCont}{
      background: rgb(28, 177, 121);
      color: white;
    }
  }
`
// LoaderItem
export const LoaderView = (props) => {

  const loaderItems = new Array(props.arrayLength || 3).fill({})

  return(
    <ActivityLayout>
      {!props.arrayLength && <p className="titleActivity"></p>}
      <LayoutList>
        {
          loaderItems.map((e, key) =>{
            return <LoaderItem key={key}/>
          })
        }
      </LayoutList>
    </ActivityLayout>
  )
}

export const LoaderItem = () => (
  <OrderContainer className="shower">
    <Order>
      <DataContainer className="align_first loader">
        <div className="loaderImg"></div>
        <div className="loaderElement"></div>
      </DataContainer>

      <DataContainer className="align_middle loader">
        <div className="loaderElement"></div>
      </DataContainer>

      <DataContainer className="align_last loader">
        <div className="loaderElement"></div>
      </DataContainer>
    </Order>
  </OrderContainer>
)


export const DataContainer = styled.div`

  width: auto;
  position: absolute;
  align-self: center;
  display: flex;
  align-items: center;

  .acceptedIcon{
    transform: scale(.4);
  }

  &.swaps{
    row-gap: 7px;
    column-gap: 5px;
    display: grid !important;
    grid-template-areas:
    "amount currency_bought arrow_right"
    "amount_spent currency_spent arrow_right"
  }

  &.swaps p{
    margin: 0;
  }

  .amount{
    font-size: 15px !important;
    grid-area: amount;
  }
  .currency_bought{
    grid-area: currency_bought;
  }
  .arrow_right{
    grid-area: arrow_right;
  }
  .amount_spent{
    color: red !important;
    text-align: right;
    font-size: 13px !important;
    grid-area: amount_spent;
  }
  .currency_spent{
    grid-area: currency_spent;
  }

  .deleteOrder{
    grid-area:
  }


  @media ${device.tablet} {
    &.align_first{
      display: grid !important;
      grid-template-areas:
      "orderIcon typeOrderText"
      "orderIcon action_date";
    }

    &.align_first.pending.fiat{
      display: grid !important;
      grid-template-areas:
      "deleteOrder orderIcon typeOrderText"
      "deleteOrder orderIcon action_date";
    }

    &.align_first.confirmed.crypto.deposits{
      display: grid !important;
      grid-template-areas:
      "orderIcon confirmations typeOrderText"
      "orderIcon action_date action_date";
      grid-template-columns: auto 45px;
    }

    ${Confrimations} p{
      font-size: 20px !important;
    }
  }



  #Aldelete i{
    color: #ff8660 ;
  }

  #ALrevised i {
    margin-left: 8px;
  }

  &.pending{
    ${'' /* overflow: hidden; */}
  }

  &.align_first{
    justify-self: start;
    margin-left: 20px;
  }
  &.align_middle{
    justify-self: center;
  }
  &.align_last{
    justify-self: end;
    margin-right: 20px;
  }

  &.align_first.loader{
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 10px;
    align-items: center;
  }

  .loaderImg{
    height: 35px;
    width: 35px;
    background: #cacaca;
    border-radius: 50%;
  }

  .loaderElement{
    width: 100px;
    height: 13px;
    background: #cacaca;
    border-radius: 4px;
  }

  &.loader{
    animation-name: orderLoader;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    opacity: .5;
  }

  @keyframes orderLoader{
    0%{
      opacity: .5;
    }
    70%{
      opacity: 1;
    }
    100%{
      opacity: .5;
    }
  }


`

export const OrderContainer = styled.div`
  transition: .1s;
  perspective: 2000px;
  ${'' /* transform: scale(.98); */}
  ${'' /* transform: scale(1) translateY(-3px); */}
  opacity: 1;
  width: 100%;
  max-width: 800px;

  ${'' /* &.shower{
    transform: scale(1) translateY(0px);
    opacity: 1 !important;
  } */}

  &.newOrderContainer{
    animation-name: ${containerDepositAnim};
    perspective: 1000px;
    perspective-origin: center top;
    position: relative;
    animation-duration: .4s;
    animation-timing-function: cubic-bezier(1,1,1,1);
    animation-fill-mode: forwards;
  }

  &.deleting{
    transition: .3s;
    transform: scale(0.96);
    opacity: 0.5 !important;
  }

`


export const ActivityLayout = styled.section`
  width: 100%;
  height: auto;
  position: relative;

  .titleActivity{
    margin-bottom: 15px;
    height: 16px;
    width: 115px;
    background: #cacaca;
    border-radius: 4px;
  }
`


export const LayoutList = styled.section`
  display: grid;
  grid-template-rows: repeat(auto-fill, 80px);
  height: auto;
  grid-auto-flow: row dense;
  min-height: 100%;
  grid-row-gap: 20px;
  transform-style: preserve-3d;
`