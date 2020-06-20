import React, { useEffect, useState } from 'react'
import OtherModalLayout from '../otherModalLayout'
import styled from 'styled-components'
import { swing_in_bottom_bck, socketIconContainerIntro, backTopSection } from '../../animations'
import { orderStateColors } from '../../../../const/const'
import IconSwitch from '../../icons/iconSwitch'
import { useActions } from '../../../../hooks/useActions'
import useViewport from '../../../../hooks/useWindowSize'
import DetailGenerator from '../../orderDetail/detailGenerator'
import { useFormatCurrency } from '../../../hooks/useFormatCurrency'
import UseTxState from '../../../hooks/useTxState'
import SimpleLoader from '../../loaders'
import QRCode from 'qrcode'


import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')


const OrderDetail = ({order}) => {

  const actions = useActions()
  const  { isMovilViewport } = useViewport()
  const { tx_path, currencies } = UseTxState()

  const cerrar = (e) => {
    if(e.target.dataset.close_modal){
      actions.renderModal(null)
    }
  }

  const { state } = order
  const TitleText = tx_path === 'deposits' ? 'Deposito' :
                tx_path === 'withdraws' ? 'Retiro' :
                tx_path === 'swaps' && 'Intercambio';

  const textState = state === 'accepted' ? 'Aceptado' : state === 'confirmed' ? 'Confirmado' : state === 'pending' ? 'Pendiente' : state === 'rejected' ? 'Rechazado' : 'Cancelado'
  const colorState = state === 'accepted' ? '#1cb179' : state === 'confirmed' ? '#77b59d' : state === 'pending' ? '#ff8660' : 'red'


    return(
      <OtherModalLayout on_click={cerrar}>
        <Layout>
          {
            isMovilViewport &&
            <CloseButton onClick={cerrar}>
              <i className="fas fa-times"></i>
            </CloseButton>
          }

          <TopSection state={order.state}>

            <TitleContainer>
              <OrderIcon className={`fa ${tx_path}`}/>
              <IconSwitch className="TitleIconOrder" size={28} icon={order.currency && order.currency.currency || 'cop'} />
              <Title className="fuente">{TitleText}</Title>
              <DateTitle className="fuente2">Actualizado {moment(order.updated_at).format("LL")}</DateTitle>
            </TitleContainer>

            <CircleIconContainer>
                <IconSwitch size={45} icon={state === 'accepted' ? 'accepted2' : state} color={colorState}/>
                <p className="fuente"
                  style={{color:`${colorState}`}}
                  >
                    {textState}
                </p>
            </CircleIconContainer>

            <ContBackTopSection>
              <BackTopSection />
            </ContBackTopSection>

          </TopSection>

          <DetailGenerator order={order} title={`Detalle del ${TitleText}`}/>

          <BottomSection
            order={order}
            colorState={colorState}
            tx_path={tx_path}
            currencies={currencies}
          />


        </Layout>
      </OtherModalLayout>
    )
  }

  export default OrderDetail


  const BottomSection = ({order, colorState, tx_path, currencies}) => {

    const [ amount ] = useFormatCurrency(order.amount || order.bought, order.currency)
    const textTotal = (tx_path === 'swaps' && order.state === 'accepted') ? 'Saldo adquirido:' : order.state === 'accepted' ? 'Saldo acreditado:' : 'Saldo SIN acreditar:'
    const currency = tx_path === 'swaps' ? currencies[order.to_buy_currency.currency] : currencies[order.currency.currency]

    return(
      <BottomSectionContainer>
        <TitleBottom>
          <hr/>
          { tx_path !== 'swaps' && <p className="fuente">Comprobante de pago</p> }
        </TitleBottom>
        <Container>
          <PaymentProof order={order} className={`${order.state}`}/>
          <TotalAmount color={colorState}>
            <p className="fuente saldo">{textTotal}</p>
            <p className="fuente2 amount">
              {order.currency_type === 'fiat' && '$ '}{amount} {currency && <span className="fuente">{currency.code}</span>}
            </p>
          </TotalAmount>
        </Container>
      </BottomSectionContainer>
    )
  }


  const PaymentProof = ({className, order}) => {

    const { primary_path, coinsendaServices, actions } = UseTxState(order.id)
    const [ paymentProof, setPaymentProof ] = useState()

    const getPaymentProof = async(order) =>{
      if(order.paymentProof){
        const { proof_of_payment } = order.paymentProof
        setPaymentProof(order.currency_type === 'fiat' ? `data:image/png;base64, ${proof_of_payment.raw}` : await QRCode.toDataURL(proof_of_payment.proof))
      }
    }

    useEffect(()=>{
      if(primary_path !== 'swaps' && !order.paymentProof){
        const getData = async() => {
          const PP = await coinsendaServices.getDepositById(order.id)
          if(!PP){return}
          const { proof_of_payment } = PP.paymentProof

          let updateOrder = {
            [PP.id]:{...PP}
          }
          actions.update_item_state(updateOrder, 'deposits')
          getPaymentProof(PP)
        }
        getData()
      }
    }, [])

    useEffect(()=>{
        getPaymentProof(order)
    }, [order])


    return (
      <PaymentProofContainer className={className}>


        {
          paymentProof ?
          <img src={paymentProof} width="90%" height="90%" alt=""/>
          :
          <LoaderContainer >
            <SimpleLoader loader={2} justify="center" color="#206f65"/>
          </LoaderContainer>
        }
      </PaymentProofContainer>
    )

  }


  const LoaderContainer = styled.div`
    width: 90%;
    height: 90%;
    background: white;
    opacity: .6;
    border-radius: 3px;
    display: grid;
    align-items: center;
    justify-items: center;
    position: relative;
  `

  const TotalAmount = styled.div`
    width: auto;
    height: 70px;
    justify-self: end;
    align-self: end;
    p{
      color: ${props => props.color};
      margin: 0;
      text-align: right;
    }
    &>p{
      margin-bottom: 10px;
    }
    .amount{
      font-size: 30px;
      span{
        font-size: 18px;
      }
    }
    .saldo{
      font-size: 16px;
    }
  `


  const PaymentProofContainer = styled.div`
    width: 100%;
    height: 80%;
    border-radius: 3px;
    align-self: center;
    display: grid;
    align-items: center;
    justify-items:center;
    img{
      border-radius: 3px;
    }
    &.accepted{
      background: #206f65;
    }
    &.rejected, &.canceled{
      background: gray;
      opacity: .5;
    }
  `

  const Container = styled.div`
    width: calc(100% - 60px);
    padding: 0 30px;
    height: 100%;
    display: grid;
    grid-template-columns: 100px 1fr;
  `

  const TitleBottom = styled.div`
    display: grid;
    position: relative;
    justify-items:center;
    hr{
      width: 98%;
      opacity: .35;
    }
    p{
      color:gray;
      margin: 0;
      background-color: white;
      position: absolute;
      left: 20px;
      padding: 0 10px;
      align-self: self-end;
      font-size: 14px;
      font-weight: bold;
    }
  `

  const BottomSectionContainer = styled.section`
    height: calc(200px - 40px);
    width: 100%;
    padding: 20px 0;
    display: grid;
    grid-template-rows: auto 1fr;
    row-gap: 20px;
  `

  const TitleContainer = styled.div`
    display: grid;
    .TitleIconOrder{
      grid-area: IconSwitch;
    }
    align-items: center;
    column-gap: 15px;
    row-gap: 4px;
    align-self: center;
    position: absolute;
    left: 30px;
    grid-template-columns: 25px 25px minmax(100px, 200px);
    grid-template-areas:
    "OrderIcon IconSwitch Title"
    "OrderIcon IconSwitch DateTitle";
  `

  const DateTitle = styled.p`
    font-size: 12px;
    color: white;
    grid-area: DateTitle;
    margin: 0;
    padding: 0;
    text-align: left;
    display: grid;
    margin-left: 4px;
    `

  const Icon = styled.i`
    margin-right: 10px;
  `
  const OrderIcon = styled(Icon)`
    font-size: 22px;
    grid-area: OrderIcon;
    color: white;
    margin: 0;
    display: grid !important;
    justify-items: center;

    &.swaps:before{
       content: "\f079";
      }
    }
    &.withdraws:before{
       content: "\f062";
      }
    }
    &.deposits:before{
       content: "\f063";
      }
    }

  `



  const BackTopSection = styled.div`
    width: 120%;
    height: 120%;
    position: absolute;
    background-image: url(/static/media/back.fe9a1b62.png);
    background-size: contain;
    background-repeat: repeat;
    background-position: right;
    opacity: 0.05 !important;
    animation: ${backTopSection};
    animation-duration: 80s;
    animation-iteration-count: infinite;
    transform: scale(1.5);
  `

  const ContBackTopSection = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
  `

  const CloseButton = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
    background: white;
    border-radius: 50%;
    z-index: 2;
    display: grid;
    align-items: center;
    justify-items: center;
    cursor: pointer;
    -webkit-transition: .15s;
    transition: .15s;

    i{
      color: gray;
    }
  `



  const CircleIconContainer = styled.div`
    display: grid;
    align-items: center;
    justify-content: center;
    justify-self: end;
    width: 90px;
    height: 90px;
    background: white;
    border-radius: 50%;
    align-self: flex-end;
    position: relative;
    transform: translate(-30px, 45px) !important;
    p{
        position: absolute;
        margin: 0;
        bottom: -3px;
        font-size: 14px;
        justify-self:center;
    }
  `

  const Title = styled.h3`
    text-align: left;
    color: white;
    margin: 0;
    grid-area: Title;
    font-size: 22px;
    margin-left: 4px;
  `

  const TopSection = styled.section`
    background: ${props => props.state ? orderStateColors[props.state] : 'gray'};
    width: 100%;
    height: 100%;
    display: grid;
    position: relative;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  `

  const Layout = styled.div`
    width: 100%;
    max-width: 600px;
    height: auto;
    min-height:650px;
    background: white;
    display: grid;
    align-items: center;
    justify-items: center;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 11px;
    position: relative;
    grid-template-rows: 115px 1fr auto;

    -webkit-animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
    animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
  `
