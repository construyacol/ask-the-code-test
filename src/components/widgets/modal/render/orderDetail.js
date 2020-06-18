import React from 'react'
import OtherModalLayout from '../otherModalLayout'
import styled from 'styled-components'
import { swing_in_bottom_bck, socketIconContainerIntro, backTopSection } from '../../animations'
import { orderStateColors } from '../../../../const/const'
import IconSwitch from '../../icons/iconSwitch'
import { useActions } from '../../../../hooks/useActions'
import useViewport from '../../../../hooks/useWindowSize'
import DetailGenerator from '../../orderDetail/detailGenerator'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')


const OrderDetail = ({order, tx_path}) => {

  const actions = useActions()
  const  { isMovilViewport } = useViewport()

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

        </Layout>
      </OtherModalLayout>
    )
  }

  export default OrderDetail


  const MiddleSection = styled.div`

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
    background: ${props => props.state ? orderStateColors[props.state] : 'white'};
    width: 100%;
    height: 100%;
    display: grid;
    position: relative;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  `

  const Layout = styled.div`
    width: 100%;
    max-width: 550px;
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
    grid-template-rows: 115px 1fr;

    -webkit-animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
    animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
  `
