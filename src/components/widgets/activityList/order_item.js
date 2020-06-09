import React from 'react'
import styled from 'styled-components'
import UseTxState from '../../hooks/useTxState'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')



const OrderItem = props => {

  const { tx_path } = UseTxState()

  return(
    <>
      {
        tx_path === 'deposits' &&
        <DepositOrder order={props.order} />
      }
    </>
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

  console.log('|||||||||||||||||||||||||| DEPOSIT ORDER ::', order)

  const {
    state,
    created_at
  } = order

  return (
    <OrderContainer>
      <Order className={`${state}`}>

        <DataContainer className="align_first">
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

      </Order>
     </OrderContainer>
  )

}




const Icon = styled.i`
  margin-right: 10px;
`
const StatusIcon = styled(Icon)`
  margin-right: 5px;
`

const OrderIcon = styled(Icon)`
  font-size: 22px;
`

const OrderStatus = styled.p`
  margin:0;
  display: flex;
  font-size: 13px;
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

const TypeOrderText = styled.p`

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
  overflow: hidden;
  transition: .3s;
  transform-origin: top;

  &.pending, &.confirmed {
    border: 1px solid #ff8660 !important;
    ${Day}, ${Month}, ${OrderIcon}, ${TypeOrderText}{
      color: #ff8660;
    }
    ${StatusIcon}{
      color: white !important;
    }
    ${OrderStatusCont}{
      background: #ff8660;
    }
    ${OrderStatus}{
      color: white !important;
    }
  }

  &.canceled{
      border: 1px solid #f44336 !important;
      opacity: 0.3;
      transition: .3s;
      :hover{
        opacity: 0.8;
      }
      ${Day}, ${Month}, ${OrderIcon}, ${TypeOrderText}{
        color: #f44336;
      }
  }

  &.accepted{
    ${Day}, ${Month}, ${OrderIcon}, ${TypeOrderText}{
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
              <OrderContainer key={key}>
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
  transition: .3s;
  perspective: 2000px;
  transform: scale(.98);
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
