import React from "react";
import OtherModalLayout from "../../otherModalLayout";
import styled from "styled-components";
import {
  swing_in_bottom_bck,
  backTopSection,
} from "../../../animations";
import { orderStateColors, device, TOTAL_ORDER_AMOUNT_COPYS } from "../../../../../const/const";
import { ORDER_TYPES } from 'const/activity/order'
import IconSwitch from "../../../icons/iconSwitch";
import useViewport from "../../../../../hooks/useWindowSize";
import DetailGenerator from "./detailGenerator";
import { useFormatCurrency } from "hooks/useFormatCurrency";
import UseTxState from "hooks/useTxState";
import InProcessOrder from "./inProcessOrder";
import { 
  IconClose,
  UploadMiddle,
  UploadTextMiddle
} from "../../../shared-styles";
import GetInfoComponentToRender from './infoComponent'
import { TotalAmount } from '../../../shared-styles'
import { checkIfFiat, parseSymbolCurrency } from 'core/config/currencies';
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
 

const OrderSupervisor = () => {

  const { actions, currentOrder, tx_path } = UseTxState();
  const cerrar = (e, forceClose) => {
    if (e && (e.target.dataset.close_modal || forceClose)) {
      actions.isAppLoading(false);
      actions.renderModal(null);
    }
  };

  // const idForCloseModal = useKeyActionAsClick(true, 'close-modal-button-orders', 27, true, 'onkeyup', true)

  // useEffect(() => {
  //   document.onkeyup = (event) => {
  //     if (event.keyCode === 27) {
  //       cerrar(event, true)
  //       // event.preventDefault();
  //     }
  //   }
  //
  //   return () => {
  //     document.onkeyup = false
  //   }
  // }, [document.onkeyup])

  const closeAll = () => {
    actions.renderModal(null);
    return <div></div>;
  };

  if (!currentOrder || !currentOrder.state) {
    actions.renderModal(null);
    return <div></div>;
  }

  return (
    <OtherModalLayout
      id="close-button-with-OtherModalLayout"
      onkeydown={true}
      on_click={cerrar}
    >
      {["accepted", "rejected", "canceled"].includes(currentOrder.state) ? 
      <OrderDetail currentOrder={currentOrder} tx_path={tx_path}/>
      :
      (<InProcessOrder onErrorCatch={closeAll}/>)}
    </OtherModalLayout>
  );
};

export default OrderSupervisor;

export const getState = (state) => {
  return state === "accepted"
    ? "Aceptado"
    : state === "confirmed"
    ? "Confirmado"
    : state === "pending"
    ? "Pendiente"
    : state === "rejected"
    ? "Rechazado"
    : "Cancelado";
};


const orderTypeUiName = (orderType, metaKey) => {
  // return ORDER_TYPE_UI_NAME[orderType]?.ui_name || orderType
  return (metaKey ? ORDER_TYPES[orderType][metaKey] : ORDER_TYPES[orderType]?.label) || ORDER_TYPES[orderType]?.label

}

export const OrderDetail = ({ currentOrder, tx_path }) => {

  console.log('|||||||||||||||  currentOrder', currentOrder)

  // const actions = useActions();
  // const {
    // tx_path,
    // currencies,
    // currentOrder,
    // primary_path,
    // history,
  // } = UseTxState();
  // console.log(currentOrder, currentOrder.id, tx_path, primary_path)
  const { isMovilViewport } = useViewport();

  // console.log('currentOrder', currentOrder)
  // debugger

  if(!currentOrder) return null;
  const { state } = currentOrder;
  const metaKey = currentOrder?.metadata && Object.keys(currentOrder.metadata)[0]

  const TitleText = orderTypeUiName(tx_path, metaKey)

  const textState =
    state === "accepted"
      ? "Aceptado"
      : state === "confirmed"
      ? "Confirmado"
      : state === "pending"
      ? "Pendiente"
      : state === "rejected"
      ? "Rechazado"
      : "Cancelado";

  const colorState =
    state === "accepted"
      ? "#1cb179"
      : state === "confirmed"
      ? "#77b59d"
      : state === "pending"
      ? "#ff8660"
      : "red";
      const ConsolidatedOrder = ["accepted", "rejected", "canceled"].includes(state)



  return (
    <Layout className={`layout3 ${(tx_path !== 'swaps' && (isMovilViewport && ConsolidatedOrder)) ? 'mobileInfoStyles' : ''}`} >
      <IconClose theme="dark" size={20} />

      <TopSection state={currentOrder.state}>
        <TitleContainer>
          <IconSwitch
            className={`fa ${tx_path} orderIcon`}
            size={30}
            icon={`${metaKey || 'orderIcon'}`}
            color="white"
          />

          <IconSwitch
            className="TitleIconOrder"
            size={28}
            icon={
              (currentOrder?.currency || currentOrder?.to_buy_currency) || "cop"
            }
          />
          <Title className="fuente">{TitleText}</Title>
          <DateTitle className="fuente2">
            Actualizado {moment(currentOrder.updated_at).format("LL")}
          </DateTitle>
        </TitleContainer>

        <CircleIconContainer>
          <IconSwitch
            size={isMovilViewport ? 25 : 45}
            icon={state === "accepted" ? "accepted2" : state}
            color={colorState}
          />
          <p className="fuente" style={{ color: `${colorState}` }}>
            {textState}
          </p>
        </CircleIconContainer>

        <ContBackTopSection>
          <BackTopSection />
        </ContBackTopSection>
      </TopSection>

      <DetailGenerator
        order={currentOrder}
        title={`Resumen ${TitleText}`}
      />

      <BottomSection colorState={colorState} currentOrder={currentOrder} tx_path={tx_path} />
    </Layout>
  );
};




const getAmountTitle = (orderType, order) => {
  const select =  TOTAL_ORDER_AMOUNT_COPYS[orderType]
  const uiName = select && (select[order?.state] || select?.ui_name) 
  return uiName || "Cantidad"
}


export const BottomSection = ({ currentOrder, tx_path, colorState }) => {
  const { currencies } = UseTxState();

  const _amount =  (tx_path.includes("withdraw") && currentOrder?.amount_neto) ? currentOrder?.amount_neto : currentOrder?.amount
  const [amount] = useFormatCurrency(
    _amount || currentOrder.bought,
    currentOrder.currency || currentOrder?.to_buy_currency
  );


  const { isMovilViewport } = useViewport();

  // const textTotal =
  //   tx_path === "swaps" && currentOrder.state === "accepted"
  //     ? "Saldo adquirido:"
  //     : currentOrder.state === "accepted"
  //     ? "Saldo acreditado:"
  //     : "Saldo SIN acreditar:";

  const amountTitle = getAmountTitle(tx_path, currentOrder)

  const currency = tx_path === "swaps" ? currencies[currentOrder.to_buy_currency] : currencies[currentOrder.currency];
  const InfoComponent = GetInfoComponentToRender({...currentOrder, tx_path})
  const ConsolidatedOrder = ["accepted", "rejected", "canceled"].includes(currentOrder.state)
// var(--paragraph_color)
  return (
    <BottomSectionContainer>

    <UploadMiddle className={`titleSection payment fuente ${tx_path}`}>
       {/* Title gets from GetInfoComponentToRender */}
      <UploadTextMiddle id="titleInfoComponent" className={`titleSection ${ConsolidatedOrder ? 'consolidatedStyle' : ''}`}/>
      <hr />
    </UploadMiddle>


      <Container consolidatedOrder={ConsolidatedOrder || ''} isMovilViewport={isMovilViewport || ''}>
        <InfoComponent order={currentOrder}/>
        <TotalAmount color={colorState} className={`${currentOrder.state}`}>
          <p className="fuente saldo">{amountTitle}</p>
          <p className="fuente2 amount">
            {checkIfFiat(currentOrder?.currency) && "$ "}
            {amount}{" "} 
            {currency && <span className="fuente">{parseSymbolCurrency(currency?.symbol)?.toUpperCase()}</span>}
          </p>
        </TotalAmount>
      </Container>
    </BottomSectionContainer>
  );
};

const Container = styled.div`
  width: ${props => !props.consolidatedOrder ? '100%' : 'calc(100% - 60px)'};
  padding: ${props => !props.consolidatedOrder ? '0' : '0 30px'};
  height: 100%;
  display: grid;
  grid-template-columns: ${props => props.isMovilViewport ? '1fr' : 'auto 1fr'};
  grid-template-rows: ${props => props.isMovilViewport ? 'auto auto' : '1fr'};
`;



const BottomSectionContainer = styled.section`
  height: calc(200px - 40px);
  width: 100%;
  padding: 20px 0;
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 20px;
`;

const TitleContainer = styled.div`
  display: grid;
  .TitleIconOrder {
    grid-area: IconSwitch;
  }
  .orderIcon{
    grid-area: orderIcon;
    color:white;
  }
  align-items: center;
  column-gap: 15px;
  row-gap: 4px;
  align-self: center;
  position: absolute;
  left: 30px;
  grid-template-columns: 25px 25px minmax(100px, 200px);
  grid-template-areas:
    "orderIcon IconSwitch Title"
    "orderIcon IconSwitch DateTitle";
`;

const DateTitle = styled.p`
  font-size: 12px;
  color: white;
  grid-area: DateTitle;
  margin: 0;
  padding: 0;
  text-align: left;
  display: grid;
  margin-left: 4px;
`;

// const Icon = styled.i``;
// const OrderIcon = styled(Icon)`
//     margin-right: 10px;
//     font-size: 22px;
//     grid-area: OrderIcon;
//     color: white;
//     margin: 0;
//     display: grid !important;
//     justify-items: center;

//     &.swaps:before{
//        content: "\f079";
//       }
//     &.withdraws:before{
//        content: "\f062";
//       }
//     &.deposits:before{
//        content: "\f063";
//       }
//   `;

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
`;

const ContBackTopSection = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
`;

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

  p {
    position: absolute;
    margin: 0;
    bottom: -3px;
    font-size: 14px;
    justify-self: center;
  }

  @media ${device.tablet} {
    width: 60px;
    height: 60px;
    transform: translate(-20px, 45px) !important;
    p {
      bottom: -8px;
    }
  }
`;

const Title = styled.h3`
  text-align: left;
  color: white;
  margin: 0;
  grid-area: Title;
  font-size: 22px;
  margin-left: 4px;
`;

const TopSection = styled.section`
  background: ${(props) => props.state ? orderStateColors[props.state] : "var(--paragraph_color)"};
  width: 100%;
  height: 100%;
  display: grid;
  position: relative;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
`;

export const Layout = styled.div`
  width: 100%;
  max-width: 550px;
  height: auto;
  min-height: 650px;
  background: white;
  display: grid;
  align-items: center;
  justify-items: center;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  border-radius: 11px;
  position: relative;
  grid-template-rows: 115px 1fr auto;

  &.mobileInfoStyles{
    grid-template-rows: 115px 1fr 300px;
  }

  -webkit-animation: ${swing_in_bottom_bck} 1s
    cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    both;
`;
