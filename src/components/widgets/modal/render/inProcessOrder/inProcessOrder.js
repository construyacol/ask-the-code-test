import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { deposits } from './rest.json'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')

const orderModel = {
  "created_at":new Date(),
  "updated_at":new Date(),
  "state":"pending",
  "currency_type":"fiat"
}

const InProcessOrder = ({order = orderModel}) => {



  return(
    <Container>
      <InProcessOrderContainer>


        <OrderContainer>
          <TopSection>
            <Icon/>
            <TitleContainer>
              <Text>Deposito</Text>
              <Currency>
                COP
              </Currency>
            </TitleContainer>
            <DateIdContainter>
                <Text>#21312321321321231232</Text>
                <DateText>{moment(order.updated_at).format("LL")}</DateText>
            </DateIdContainter>
          </TopSection>
          <MiddleSection>

          </MiddleSection>

          <BottomSection>
            <UploadComponent/>
          </BottomSection>

        </OrderContainer>



        <OrderStatus/>


      </InProcessOrderContainer>
    </Container>
  )

}

export default InProcessOrder

const UploadComponent = props => {

  return(
    <UploadContainer>
      <UploadText>*</UploadText>
        <UploadText>Arrastra el archivo que quieres subir</UploadText>
        <UploadMiddle>
          <UploadTextMiddle>o selecciona un archivo</UploadTextMiddle>
          <hr/>
        </UploadMiddle>
        <Buttom></Buttom>

    </UploadContainer>
  )

}

const Buttom = styled.span`
  width: 320px;
  height: 45px;
  border-radius: 6px;
  border: 2px solid gray;
`

const Text = styled.p`
  margin: 0;
`

const UploadTextMiddle = styled(Text)`
  z-index: 2;
  font-size: 12px;
  width: 150px;
  background: #eeeeee;
  text-align: center;
`

const UploadMiddle = styled.div`
  font-size: 14px;
  position: relative;
  display: grid;
  width: 100%;
  justify-items: center;
  max-width: 320px;
  hr{
    position: absolute;
    width: 100%;
    align-self: center;
  }
}
`

const UploadText = styled(Text)`
  font-size: 16px;
`

const UploadContainer = styled.section`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns:1fr;
  justify-items:center;
  row-gap:12px;
  width: 100%;
  max-width: 400px;
`


const OrderStatus = ({ order = orderModel }) => {

  const [ orderState, setOrderState ] = useState()

   useEffect(()=>{
     deposits[order.state].completed = true
     setOrderState(Object.entries(deposits))
   }, [])

   // console.log(orderState)

  return(
    <OrderStatusContainer>
      <TopSectionStatus>
        <Text>Orden pendiente de confirmación</Text>
        <SubTitle>Sube una fotografía o captura del compbrante de pago para continuar...</SubTitle>
      </TopSectionStatus>
      <StatusContainer>
        {
          orderState && orderState.map((state, index) => {
            return <StatusItem
              state={state}
              order={order}
              key={index}
              active={state[1].completed}
              className={`
                ${orderState.length === (index + 1) ? 'statusStep finalStep' : 'statusStep'}
                ${state[1].completed ? 'activeStep' : ''}
                `} />
          })
        }
      </StatusContainer>
    </OrderStatusContainer>
  )
}

const StatusItem = ({ className, state, order, active }) => {

  const activated = active && active.toString()
  console.log((state[0] === "confirmed" && (order.state === 'pending' || order.state === 'confirmed')), state )

  return(
    <Status className={`status ${className}`}>
      <Indicator className={className}/>
      <Description>
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
      </Description>
    </Status>
  )

}


const Section = styled.div``


const BottomSection = styled(Section)`
  height: 160px;
  display: grid;
  justify-items:center;
  align-items: center;
`


const Description = styled.div`
  padding-left: 20px;
  display: grid;
  row-gap:5px;
  p{
    margin: 0;
  }
`

const StatusTitle = styled(Text)`
  font-size: 14px;
  color: ${props => props.active === 'true' ? '#0198FF' : 'gray'};
`

const DateStatusText = styled(Text)`
  font-size: 12px;
  color: ${props => props.active === 'true' ? '#0198FF' : '#adadad'};
`

const Indicator = styled.div`
  justify-self:center;
  width: 12px;
  height: 12px;
  background: #0198FF;
  border-radius: 50%;
  position: relative;
  z-index:2;
  display: grid;
  align-items: center;
  justify-items:center;

  &.activeStep{
    width: 14px;
    height: 14px;
    border: 2px solid #0198FF;
    background: transparent !important;
    position: relative;
    ::after{
      top: 18px !important;
      height: 60px !important;
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
    height: 60px;
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





const StatusContainer = styled(Section)`
  padding: 45px 0;
  display: grid;
  grid-template-rows: repeat(auto-fill, 70px);
  row-gap:10px;
`

const OrderStatusContainer = styled.div`
  background: #f5f5f5;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.05);
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap:25px;
`

const TopSectionStatus = styled(Section)`
  display: grid;
  row-gap:10px;
  height: auto;
`


const SubTitle = styled(Text)`
  font-size: 12px;
  color: gray;
`

const DateIdContainter = styled.div`
  display: flex;
  grid-area: dateIdContainter;
  ${Text}{
    font-size: 12px;
    color: gray
  }
`

const DateText = styled(Text)`
  margin-left: 9px !important;
  padding-left: 7px;
  border-left: 1px solid gray;
`

const TitleContainer = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
  grid-area: titleContainer;
  ${Text}{
    font-size: 20px;
  }
`

const Currency = styled(Text)`
  margin-left: 7px !important;
`

const Icon = styled.span`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #c3c3c3;
  grid-area: icon;
  ${'' /* box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.1); */}
`


const MiddleSection = styled(Section)`
  background: white;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  ::after{
    content:'';
    position: absolute;
    height: 7px;
    background: orange;
    top: 0;
    width: 100%;
  }
`

const TopSection = styled(Section)`
  display: grid;
  align-items: center;
  grid-template-rows: auto auto;
  row-gap:7px;
  grid-template-columns: auto 1fr;
  grid-template-areas: "icon titleContainer"
                       "icon dateIdContainter";
  span{
    margin-right: 15px;
  }
`

const Container = styled.section`
  width: 100vw;
  height: 100vh;
  background: #000000ba;
  display: grid;
  align-items: center;
  justify-items:center;

  p{
    margin: 0;
  }
`



const OrderContainer = styled.div`
  background: #eeeeee;
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap:30px;
`

const InProcessOrderContainer = styled.section`

  ${OrderContainer}, ${OrderStatusContainer}{
    padding: 30px 40px;
  }

  width: 1000px;
  height: auto;
  min-height: 750px;
  background: white;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 1fr 400px;
  border-radius: 6px;
  overflow: hidden;
`
