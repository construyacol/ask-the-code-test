import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OnlySkeletonAnimation } from "../../../loaders/skeleton";
import UseTxState from "../../../../hooks/useTxState";
import { useFormatCurrency } from "../../../../hooks/useFormatCurrency";
import { getState } from "./";
import { device, ORDER_TYPE_UI_NAME } from "../../../../../const/const";
import { selectWithConvertToObjectWithCustomIndex } from "../../../../hooks/useTxState.js"
import { useSelector } from "react-redux";
import { getHostName } from '../../../../../environment'
// import { useParams } from "react-router-dom";

import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const DetailGenerator = ({ order, title, TitleSuffix, theme }) => {
  const [orders, setOrders] = useState([]);
  const { deposit_providers, tx_path, path } = UseTxState();
  const [, formatCurrency] = useFormatCurrency();
  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
  const currencySimbol = currencies ? currencies[order?.currency?.currency]?.symbol : order?.currency?.currency?.toUpperCase()



  // const params = useParams();
  const orderType = tx_path || path || (window.location.pathname.includes("referral") && "deposits") || "withdraw"
  // const orderType = tx_path || path || "withdraw"
  

  // const formatOrderText = async (itemText) => {
  //   switch (itemText[0]) {
  //     case "to_spend_currency":
  //       return ["Moneda gastada:", itemText[1].currency];
  //     case "to_buy_currency":
  //       return ["Moneda adquirida:", itemText[1].currency];
  //     case "currency":
  //       return ["Divisa:", itemText[1].currency];
  //     case "spent":
  //       return [
  //         "Cantidad gastada:",
  //         await formatCurrency(order.spent, order.to_spend_currency),
  //       ];
  //     case "bought":
  //       return [
  //         "Cantidad adquirida:",
  //         await formatCurrency(order.bought, order.to_buy_currency),
  //       ];
  //     case "state":
  //       return ["Estado:", getState(itemText[1])];
  //     case "price_percent":
  //       return ["Comisión:", itemText[1]];
  //     case "id":
  //       return ["Número de orden:", itemText[1]];
  //     case "created_at":
  //       return ["Creado en:", moment(itemText[1]).format("LL")];
  //     case "updated_at":
  //       return ["Actualizado en:", moment(itemText[1]).format("LL")];
  //     case "expiration_date":
  //       return ["Expira en:", moment(itemText[1]).format("LL")];
  //     case "amount":
  //       return [
  //         "Cantidad:",
  //         await formatCurrency(order.amount, order.currency),
  //       ];
  //     // case "amount_neto":
  //     //   return [
  //     //     "Cantidad neta:",
  //     //     await formatCurrency(order.amount_neto, order.currency),
  //     //   ];
  //     case "confirmations":
  //       return ["Confirmations:", order.confirmations];
  //     case "cost":
  //       return [`Costo ${tx_path === 'withdraws' ? 'retiro' : 'depósito'}:`, order.cost];
  //     case "sent":
  //       return ["Operación:", itemText[1] ? "Debitado" : "-- Sin debitar --"];

  //     case "referral":
  //     case "amount_neto":
  //     case "to_buy_symbol":
  //     case "to_spend_symbol":
  //     case "need_referral_process":
  //     case "referrer_payment_info":
  //     case "fee":
  //     case "tax":
  //     case "withdraw_provider":
  //     case "withdraw_account":
  //     case "metadata":
  //     case "withdraw_account_id":
  //     case "withdraw_provider_id":
  //     case "account_to":
  //     case "account_from":
  //     case "type":
  //     case "pair_id":
  //     case "taged":
  //     case "action_price":
  //     case "country":
  //     case "userId":
  //     case "user":
  //     case "cost_struct":
  //     case "fee_struct":
  //     case "info":
  //     case "tax_struct":
  //     case "account_id":
  //     case "locked":
  //     case "currency_type":
  //     case "cost_id":
  //     case "deposit_provider_id":
  //     case "type_order":
  //     case "activeTrade":
  //     case "paymentProof":
  //     case "withdraw_proof":
  //     case "requestedFundsOrigin":
  //     case "proof":
  //     case "comment":
  //     case "provider_type":
  //     case "visible":
  //     case "inscribed":
  //     case "inscriptions":
  //     case "used_counter":
  //       return;
  //     default:
  //       return itemText;
  //   }
  // };

  const inProcesOrder = async (order) => {
    const isPending = order.state === 'pending'
    switch (order.currency_type) {
      case "fiat":
        let depositProviderInfo = [];
        if (deposit_providers && deposit_providers[order.deposit_provider_id]) {
          const depositProvider = deposit_providers[order.deposit_provider_id];
          depositProviderInfo = [
            [
              "Entidad del depósito:",
              `${depositProvider.depositAccount.ui_name}`,
            ],
            [
              `${depositProvider.depositAccount.account.type.ui_name}`,
              `${depositProvider.depositAccount.account.type.type}`,
            ],
            [
              `${depositProvider.depositAccount.account.account_id.ui_name}`,
              `${depositProvider.depositAccount.account.account_id.account_id}`,
            ],
            [
              `${depositProvider.depositAccount.account.bussines_name.ui_name}`,
              `${depositProvider.depositAccount.account.bussines_name.bussines_name}`,
            ],
            [
              `${depositProvider.depositAccount.account.nit.ui_name}`,
              `${depositProvider.depositAccount.account.nit.nit}`,
            ],
            [
              `${depositProvider.depositAccount.account.dv.ui_name}`,
              `${depositProvider.depositAccount.account.dv.dv}`,
            ],
            [
              `Cantidad ${isPending ? 'por acreditar' : 'acreditada'}`,
              `${await formatCurrency(order.amount, order.currency)} ${order.currency?.currency?.toUpperCase()}`,
            ],
            [
              `Costo del depósito`,
              `${await formatCurrency(depositProvider?.depositAccount?.costs[order?.cost_id]?.fixed, order.currency)} ${order.currency?.currency?.toUpperCase()}`,
            ],
          ];
        }
        // console.log('deposit_providers', order)
        const amountNeto = await formatCurrency(order.amount_neto, order.currency);
        // const amount_neto = await formatCurrency(
        //   order.amount_neto,
        //   order.currency
        // );

        setOrders([
          ...depositProviderInfo,
          ["Total a depositar:", `$${amountNeto}`],
        ]);
        break;
      case "crypto":
        setOrders([
          ["ID:", order.id],
          ["Estado:", getState(order.state)],
          ["Divisa:", `${order.currency.currency}`],
          ["Orden creada en:", moment(order.created_at).format("LL")],
          ["Confirmaciones:", order.confirmations],
          [
            "Cantidad acreditada:",
            await formatCurrency(order.amount, order.currency),
          ],
          ["Costo de operación:", order.cost],
          [
            "Total depósito:",
            await formatCurrency(order.amount_neto, order.currency),
          ],
        ]);
        break;
      default:
    }
  };



  const formatDepositOrder = async(order) => {
    const isPending = order.state === 'pending'
    let parsedOrder = [
      ["Fecha de creación:", moment(order?.created_at).format("LL")],
      ["ID del depósito:", order?.id],
      ["Estado:", getState(order?.state)],
      [`Cantidad ${isPending ? 'por depositar' : 'depositada'}:`, `${await formatCurrency(order?.amount_neto, order?.currency)} ${currencySimbol}`],
      ["Costo del depósito:",  `${order?.cost && await formatCurrency(order?.cost, order?.currency)} ${currencySimbol}`],
      [`Cantidad ${isPending ? 'por acreditar' : 'acreditada'}:`, `${await formatCurrency(order?.amount, order?.currency)} ${currencySimbol}`],
    ]
    return parsedOrder 
  }

  const formatWithdrawOrder = async(order) => {
    let parsedOrder = [
      ["Fecha de creación:", moment(order?.created_at).format("LL")],
      ["ID del retiro:", order?.id],
      ["Estado:", getState(order?.state)],
      ["Total del retiro:", `${await formatCurrency(order?.amount, order?.currency)} ${currencySimbol}`],
      ["Costo del retiro:",  `${order?.cost && await formatCurrency(order?.cost, order?.currency)} ${currencySimbol}`],
      ["Cantidad recibida:", `${await formatCurrency(order?.amount_neto, order?.currency)} ${currencySimbol}`],
    ]
    return parsedOrder 
  }

  const formatSwapsOrder = async(order) => {
    let parsedOrder = [
      ["ID del intercambio:", order?.id],
      ["Fecha de creación:", moment(order?.created_at).format("LL")],
      ["Estado:", getState(order?.state)],
      ["Cantidad gastada:", `${await formatCurrency(order?.spent, order?.to_spend_currency)} ${order?.to_spend_currency?.currency?.toUpperCase()}`],
      ["Cantidad adquirida:", `${order?.bought ? await formatCurrency(order?.bought, order?.to_buy_currency) : '0'} ${order?.to_buy_symbol?.toUpperCase()}`],
    ]
    return parsedOrder 
  }


  const ORDER_DETAIL_BY_TYPE = {
    deposits:formatDepositOrder,
    withdraws:formatWithdrawOrder,
    swaps:formatSwapsOrder,
    deposit:formatDepositOrder,
    withdraw:formatWithdrawOrder
  }

  const formatOrder = async(order) => {
    let parsedOrder = []
    if(!order) return "";
    parsedOrder = await ORDER_DETAIL_BY_TYPE[orderType](order)
    return parsedOrder
  }


  useEffect(() => {
    // the order is converted to an array and formatted
    if (!order) {
      return;
    }
    const init = async () => {
      if ((order.state === "pending" || order.state === "confirmed") && tx_path === "deposits") {
        return await inProcesOrder(order);
      }
      const parsedOrder = await formatOrder(order)
      setOrders(parsedOrder);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit_providers]);


  const pendingDeposit = orderType === 'deposits' && ["pending"].includes(order.state)


  return (
    <Container className={`${title ? "withTitle" : ""} ${pendingDeposit ? 'withPendingDeposit' : ''} ${theme}`}>
      {title && (
        <TitleContainer
          className={`${TitleSuffix ? "titleSuffix" : ""} ${order.state}`}
        >
          <Title className="fuente">{title}</Title>
          {TitleSuffix && <TitleSuffix />}
        </TitleContainer>
      )}
      
      {
        (pendingDeposit) &&
          <DataOrderHeader >
            <p className="fuente">Datos para hacer el {ORDER_TYPE_UI_NAME[orderType]?.ui_name?.toLowerCase()}</p>
            <div className="__line__"/>
          </DataOrderHeader>
         
      }

      {orders && orders.length
        ? orders.map((item, indx) => {
            return (
              <ItemContainer
                key={indx}
                className={`${orders.length === indx + 1 &&  order.state && tx_path === "deposits" && order.state
                }`}
              >
                <LeftText className="fuente">{item[0]}</LeftText>
                <MiddleSection />
                <RightText className="fuente2">{item[1]}</RightText>
              </ItemContainer>
            );
          })
        : new Array(7).fill("1").map((item, indx) => {
            return (
              <ItemContainer className="skeleton" key={indx}>
                <LeftText>skeleton --</LeftText>
                <MiddleSection />
                <RightText>skeleton -------- </RightText>
              </ItemContainer>
            );
          })}
          { 
            (orderType === 'swaps' && order?.referral && ["accepted"].includes(order?.state)) &&
              <ReferralSwapCopy order={order} currencies={currencies}/>
          }
    </Container>
  );
};
// currencies
export default DetailGenerator;


const ReferralSwapCopy = ({ order, currencies }) => {

  return(
      <p className="fuente referalBySwap" style={{fontSize: "12px", color:"var(--paragraph_color)"}}>
        Quién te refirió obtuvo el &nbsp;  
        <span className="fuente2"> 
          {order?.referral?.total_percentage}%&nbsp;
          ({order?.referral?.compra_de_referidos?.amount} {currencies && currencies[order?.referral?.compra_de_referidos?.short_currency?.currency]?.symbol})
          </span> de este intercambio. <a href={`https://${getHostName()}.com/docs/incentives`} target="_blank"  rel="noreferrer" alt="">Aprende cómo hacerlo</a>
      </p>
  )

}

getHostName()

export const DataOrderHeader = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    color:var(--paragraph_color);
    width: 100%;

    p{
        font-size: 17px;
        font-weight: bold;
    }

    .__line__{
        border-bottom: 1px solid #bfbfbf;;
        height: 2px;
        padding-top: 10px;
    }
`



const Text = styled.p`
  width: auto;
  margin: 0;
  font-size: 14px;
`;

// const TotalAmountContainer = styled.div`
//   width: 100%;
//   height: 50px;
//   margin-top: 10px;
//   border-top: 1px solid #bfbfbf;
//   display: flex;
//   justify-content: space-between;
// `;

const TitleContainer = styled.div`
  display: flex;
  &.titleSuffix {
    justify-content: space-between;
  }
  &.pending p {
    color: #ff8660;
  }
  &.confirmed p {
    color: #1cb179;
  }
`;

const Title = styled(Text)`
  font-size: 17px;
  font-weight: bold;
`;
const RightText = styled(Text)`
  text-align: right;
  padding-left: 15px;
  text-transform: capitalize;
  white-space: nowrap;
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const LeftText = styled(Text)`
  text-align: left;
  padding-right: 15px;
  font-weight: bold;
`;
const MiddleSection = styled.span`
  border-bottom: 1px dotted;
  opacity: 0.15;
`;

const ItemContainer = styled.div`
  width: 100%;
  height: 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;

  &.skeleton {
    ${OnlySkeletonAnimation}
    ${RightText}, ${LeftText} {
      background: gray;
      height: 16px;
      border-radius: 3px;
      opacity: 0.5;
    }
  }

  &.pending,
  &.confirmed {
    height: 50px;
    margin-top: 10px;
    border-top: 1px solid #bfbfbf;
    align-items: center;
    ${RightText}, ${LeftText} {
      font-size: 18px;
      color: var(--paragraph_color);
    }
    ${RightText} {
      font-size: 20px;
      font-weight: bold;
    }
  }
`;

const Container = styled.section`
  width: calc(100% - 70px);
  height: calc(100% - 50px);
  display: grid;
  grid-template-rows: repeat(auto-fill, 20px);
  row-gap: 7px;
  padding: 25px 35px;
  position:relative;

  .referalBySwap{
    font-size: 12px;
    width: calc(100% - 100px);
    max-width: calc(500px - 100px);
    text-align: justify;
    justify-self: center;
    padding: 0 50px 0 15px;
    position: absolute;
    font-size: 13px;
    color: var(--paragraph_color);
    left: 20px;
    bottom: -20px;
  }

  @media ${device.tablet} {
    padding: 25px 20px;
    width: calc(100% - 40px);
  }

  &.withTitle {
    height: calc(100% - 95px);
    padding-top: 70px;
    grid-template-rows: 70px repeat(auto-fill, 20px);
  }

  &.withTitle.withPendingDeposit{
    grid-template-rows: 45px 45px repeat(auto-fill, 20px);
  }

  ${Text}, ${MiddleSection} {
    color: var(--paragraph_color);
  }

  &.darkTheme {
    p {
      color: white;
    }
  }
`;

//
