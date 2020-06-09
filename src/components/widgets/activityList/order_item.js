import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import UseTxState from '../../hooks/useTxState'
import { PaymentConfirButton } from '../buttons/buttons'
import { useFormatCurrency } from '../../hooks/useFormatCurrency'
import IconSwitch from '../icons/iconSwitch'
import { ObserverHook } from '../../hooks/observerCustomHook'

import { gotoTx, containerDepositAnim, newOrderStyleAnim, deletedOrderAnim } from '../animations'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')


const OrderItem = ({ order }) => {

  const { tx_path, new_order_style } = UseTxState(order.id)
  const [ show,  element ] = ObserverHook()
  const [ orderState, setOrderState ] = useState()


  // useEffect(()=>{
  //   if(orderState){
  //     alert(orderState)
  //   }
  // }, [orderState])

  return(
        <OrderContainer ref={element} className={`${show && 'shower'} ${new_order_style ? 'newOrderContainer' : ''} ${orderState}`}>
          {
            show &&
            tx_path === 'deposits' &&
            <DepositOrder order={{...order, orderState, setOrderState}} />
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

const getState = state => {
  return state === 'pending' ? 'Pendiente' :
         state === 'confirmed' ? 'Confirmado' :
         state === 'accepted' ? 'Aceptado' :
         state === 'canceled' ? 'Cancelado' :
         state === 'rejected' && 'Rechazado'
}


const DepositOrder = ({ order }) => {

  const { new_order_style } = UseTxState(order.id)

  const {
    state,
    created_at,
    currency,
    id,
    setOrderState,
    orderState
  } = order

  const [ amount ] = useFormatCurrency(order.amount, currency)

  return (
      <Order className={`${state} ${new_order_style ? 'newOrderStyle' : ''} ${orderState}`}>

        <DataContainer className={`align_first ${state}`}>
          <DeleteButton {...order} setOrderState={setOrderState}/>
          <DateCont>
            <Day className="fuente2">{moment(created_at).format("DD")}</Day>
            <Month className="fuente">{moment(created_at).format("MMM").toUpperCase()}</Month>
          </DateCont>
          <OrderIcon className="fas fa-arrow-down" />
          <TypeOrderText className="fuente">Deposito</TypeOrderText>
        </DataContainer>

        <DataContainer className="align_middle">
          <OrderStatusCont>
            <OrderStatus className="fuente">
              <StatusIcon className={getIcon(state)} />
              {getState(state)}
            </OrderStatus>
          </OrderStatusCont>
        </DataContainer>

        <DataContainer className="align_last">
          <DepositPanelRight {...order}/>
        </DataContainer>

      </Order>
  )

}


const DepositPanelRight = ({ state, id, currency_type, amount, currency }) => {

  const { lastPendingOrderId } = UseTxState(id)

  return(
    <>
    {
      state === 'pending' ?
      <PaymentConfirButton
        id="ALconfirmButton"
        clases={` ${lastPendingOrderId ? 'ALbuttonActive' : 'confirmButton' }`}
        active={true}
        type="primary"
        // siguiente={detail_payment}
        label="Confirmar"
      />
      :
      state === 'confirmed' ?
      <p className="fuente" id="ALrevised">En revisión<i className="far fa-clock"></i></p>
      :
      <>
      <AmountText className="fuente2">+ {currency_type === 'fiat' && '$'} {amount}</AmountText>
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
        <div className="tooltip" onClick={deleteDeposit}>
          <div id="Aldelete">
            <i className="far fa-times-circle "></i>
          </div>
          <span className="tooltipDelete fuente">Cancelar</span>
        </div>
      }
    </>
  )
}

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
`

const AmountText = styled(Text)`
  font-size: 16px !important;
  margin-right: 7px;
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

  :hover{
    box-shadow: 0px 1px 14px 3px rgba(0,0,0,0.07);
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

  &.accepted{
    ${Day}, ${Month}, ${OrderIcon}, ${Text}, ${AmountIcon}{
      color: rgb(28, 177, 121);
    }
    ${OrderStatusCont}{
      background: rgb(28, 177, 121);
      color: white;
    }

  }
`

export const LoaderItem = (props) => {

  const loaderItems = new Array(props.arrayLength || 3).fill({})

  return(
    <ActivityLayout>
      {!props.arrayLength && <p className="titleActivity"></p>}
      <LayoutList>
        {
          loaderItems.map((e, key) =>{
            return(
              <OrderContainer key={key} className="shower">
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
          })
        }
      </LayoutList>
    </ActivityLayout>
  )
}




export const DataContainer = styled.div`

  width: auto;
  position: absolute;
  align-self: center;
  display: flex;
  align-items: center;



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
  transform: scale(.98);
  transform: scale(1) translateY(-3px);
  opacity: 0;

  &.shower{
    transform: scale(1) translateY(0px);
    opacity: 1 !important;
  }

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
