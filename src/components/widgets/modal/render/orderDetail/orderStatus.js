import React, { useEffect, useState } from 'react'
import UseTxState from '../../../../hooks/useTxState'
import { deposits } from './rest.json'
import { OnlySkeletonAnimation } from '../../../loaders/skeleton'
import styled from 'styled-components'

import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')



const OrderStatus = ({ order }) => {

  const [ orderState, setOrderState ] = useState()
  const { currentOrder } = UseTxState()

  const skeletons = new Array(4).fill(["created"])

   useEffect(()=>{

     let orders = {}
     for (let prop in deposits) {
       orders = {
         ...orders,
         [prop]:{
           ...deposits[prop],
           completed:currentOrder.state === prop
         }
       }
     }
     // console.log(orders, deposits)
     setOrderState(Object.entries(orders))
   }, [currentOrder.state])


  return(
    <OrderStatusContainer>
      <TopSectionStatus>
        <Text>Orden pendiente de confirmación</Text>
        <SubTitle>Sube una fotografía o captura del compbrante de pago para continuar...</SubTitle>
      </TopSectionStatus>
      <StatusContainer>
        {
          orderState ? orderState.map((state, index) => {
            return <StatusItem
              state={state}
              order={currentOrder}
              key={index}
              active={state[1].completed}
              className={`
                ${orderState.length === (index + 1) ? 'statusStep finalStep' : 'statusStep'}
                ${state[1].completed ? 'activeStep' : ''}
                `} />
          })
          :
          skeletons.map((state, index)=>{
            return <StatusItem
              state={state}
              key={index}
              className={`${skeletons.length === (index + 1) ? 'statusStep finalStep' : 'statusStep'} skeleton`}
              skeleton
            />
          })
        }
      </StatusContainer>
    </OrderStatusContainer>
  )
}

const StatusItem = ({ className, state, order, active, skeleton }) => {

  const activated = active && active.toString()
  // console.log((state[0] === "confirmed" && (order.state === 'pending' || order.state === 'confirmed')), state )

  return(
    <Status className={`status ${className}`}>
      <Indicator className={className}/>
      <Description>
        {
          skeleton ?
          <Skeleton/>
          :
          <>
          <StatusTitle active={activated}>{state[1].ui_text[order.currency_type] || state[1].ui_text}</StatusTitle>
          <DateStatusText active={activated}>
            {
              active && order.state === 'pending' ? 'Pendiente' :
              active ? 'En proceso...' :
              state[0] === "created" ? moment(order.created_at).format("LL") :
              state[0] === "pending" ? moment(order.updated_at).format("LL") :
              (state[0] === "confirmed" && order.state === 'confirmed') ? moment(order.updated_at).format("LL") : ''
            }
          </DateStatusText>
        </>
        }
      </Description>
    </Status>
  )

}


export default OrderStatus


























export const Text = styled.p`
  margin: 0;
`

const OrderStatusContainer = styled.div`
  background: #f5f5f5;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.05);
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap:25px;
  padding: 30px 40px;
`
const TopSectionStatus = styled.div`
  display: grid;
  row-gap:10px;
  height: auto;
`

const SubTitle = styled(Text)`
  font-size: 12px;
  color: gray;
`



const StatusContainer = styled.div`
  padding: 45px 0;
  display: grid;
  grid-template-rows: repeat(auto-fill, 70px);
  row-gap:10px;
`



const Status = styled.div`
  height: 70px;
  padding: 0 20px;
  display: grid;
  align-items: center;
  grid-template-columns: 20px 1fr;


  &.activeStep ~ .status .statusStep{
    background: #dadada;
    ::after{
      background: #dadada;
    }
  }

  &.activeStep .statusStep{
    ::after{
      background: #dadada;
    }
  }
`




const Indicator = styled.div`
  justify-self:center;
  width: 14px;
  height: 14px;
  background: #0198FF;
  border-radius: 50%;
  position: relative;
  z-index:2;
  display: grid;
  align-items: center;
  justify-items:center;
  border: 2px solid #f5f5f5;



  &.activeStep{
    width: 14px;
    height: 14px;
    border: 2px solid #0198FF;
    background: transparent !important;
    position: relative;
    ::after{
      top: 16px !important;
    }
    ::before{
      content:'';
      width: 6px;
      height: 6px;
      background: #0198FF;
      border-radius: 50%;
    }
  }

  &.statusStep::after{
    content: '';
    width: 2px;
    height: 64px;
    background: #0198FF;
    position: absolute;
    -webkit-align-self: center;
    align-self: start;
    top: 14px;
    z-index: 1;
  }

  &.statusStep.finalStep::after{
    display: none;
  }

  &.skeleton{
    background: #c1c1c1;
    ::after{
      background: #c1c1c1;
    }
  }
`
const Description = styled.div`
  padding-left: 20px;
  display: grid;
  row-gap:5px;
  p{
    margin: 0;
  }
`


const Skeleton = styled.div`
  width: 100%;
  height: 16px;
  background: #c1c1c1;
  border-radius: 3px;
  ${OnlySkeletonAnimation}
`





const StatusTitle = styled(Text)`
  font-size: 14px;
  color: ${props => props.active === 'true' ? '#0198FF' : 'gray'};
`

const DateStatusText = styled(Text)`
  font-size: 12px;
  color: ${props => props.active === 'true' ? '#0198FF' : '#adadad'};
`



















//
