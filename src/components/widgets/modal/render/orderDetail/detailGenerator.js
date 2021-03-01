import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OnlySkeletonAnimation } from "../../../loaders/skeleton";
import UseTxState from "../../../../hooks/useTxState";
import { useFormatCurrency } from "../../../../hooks/useFormatCurrency";
import { getState } from "./";
import { device } from "../../../../../const/const";

import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const DetailGenerator = ({ order, title, TitleSuffix, theme }) => {
  const [orders, setOrders] = useState([]);
  const { deposit_providers, tx_path } = UseTxState();
  const [, formatCurrency] = useFormatCurrency();

  const formatOrderText = async (itemText) => {
    // console.log(itemText)
    switch (itemText[0]) {
      case "to_spend_currency":
        return ["Moneda gastada:", itemText[1].currency];
      case "to_buy_currency":
        return ["Moneda adquirida:", itemText[1].currency];
      case "currency":
        return ["Divisa:", itemText[1].currency];
      case "spent":
        return [
          "Cantidad gastada:",
          await formatCurrency(order.spent, order.to_spend_currency),
        ];
      case "bought":
        return [
          "Cantidad adquirida:",
          await formatCurrency(order.bought, order.to_buy_currency),
        ];
      case "state":
        return ["Estado:", getState(itemText[1])];
      case "price_percent":
        return ["Comisión:", itemText[1]];
      case "id":
        return ["Número de orden:", itemText[1]];
      case "created_at":
        return ["Creado en:", moment(itemText[1]).format("LL")];
      case "updated_at":
        return ["Actualizado en:", moment(itemText[1]).format("LL")];
      case "expiration_date":
        return ["Expira en:", moment(itemText[1]).format("LL")];
      case "amount":
        return [
          "Cantidad:",
          await formatCurrency(order.amount, order.currency),
        ];
      // case "amount_neto":
      //   return [
      //     "Cantidad neta:",
      //     await formatCurrency(order.amount_neto, order.currency),
      //   ];
      case "confirmations":
        return ["Confirmations:", order.confirmations];
      case "cost":
        return ["Costo:", order.cost];
      case "sent":
        return ["Operación:", itemText[1] ? "Debitado" : "-- Sin debitar --"];

      case "referral":
      case "amount_neto":
      case "to_buy_symbol":
      case "to_spend_symbol":
      case "need_referral_process":
      case "referrer_payment_info":
      case "fee":
      case "tax":
      case "withdraw_provider":
      case "withdraw_account":
      case "metadata":
      case "withdraw_account_id":
      case "withdraw_provider_id":
      case "account_to":
      case "account_from":
      case "type":
      case "pair_id":
      case "taged":
      case "action_price":
      case "country":
      case "userId":
      case "user":
      case "cost_struct":
      case "fee_struct":
      case "info":
      case "tax_struct":
      case "account_id":
      case "locked":
      case "currency_type":
      case "cost_id":
      case "deposit_provider_id":
      case "type_order":
      case "activeTrade":
      case "paymentProof":
      case "withdraw_proof":
      case "requestedFundsOrigin":
      case "proof":
      case "comment":
        return;
      default:
        return itemText;
    }
  };

  const inProcesOrder = async (order) => {
    switch (order.currency_type) {
      case "fiat":
        let depositProviderInfo = [];
        if (deposit_providers && deposit_providers[order.deposit_provider_id]) {
          const depositProvider = deposit_providers[order.deposit_provider_id];
          depositProviderInfo = [
            [
              "Entidad de deposito:",
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
          ];
        }
        // console.log('deposit_providers', order)
        const amount = await formatCurrency(order.amount, order.currency);
        const amount_neto = await formatCurrency(
          order.amount_neto,
          order.currency
        );

        setOrders([
          ...depositProviderInfo,
          // [
          //   "Comisión:",
          //   `${order.fee_struct && `${order.fee_struct.percent}%`} ~ ${
          //     order.fee
          //   }`,
          // ],
          // ["Impuesto:", `~ ${order.tax}`],
          ["Cantidad acreditada:", `~ $${amount}`],
          ["Total a depositar:", `~ $${amount}`],
        ]);
        break;
      case "crypto":
        setOrders([
          ["Número de orden:", order.id],
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
            "Total deposito:",
            await formatCurrency(order.amount_neto, order.currency),
          ],
        ]);
        break;
      default:
    }
  };

  useEffect(() => {
    // the order is converted to an array and formatted
    if (!order) {
      return;
    }
    const init = async () => {
      if (
        (order.state === "pending" || order.state === "confirmed") &&
        tx_path === "deposits"
      ) {
        return await inProcesOrder(order);
      }
      const transOrders = [];
      for (let orderItem of Object.entries(order)) {
        const ui_items = await formatOrderText(orderItem);
        // console.log(ui_items)
        if (ui_items) {
          transOrders.push(ui_items);
        }
      }
      setOrders(transOrders);
    };
    init();
  }, [deposit_providers]);

  // console.log(order, orders)

  return (
    <Container className={`${title ? "withTitle" : ""} ${theme}`}>
      {title && (
        <TitleContainer
          className={`${TitleSuffix ? "titleSuffix" : ""} ${order.state}`}
        >
          <Title className="fuente">{title}</Title>
          {TitleSuffix && <TitleSuffix />}
        </TitleContainer>
      )}
      {orders && orders.length
        ? orders.map((item, indx) => {
            return (
              <ItemContainer
                key={indx}
                className={`${
                  orders.length === indx + 1 &&
                  order.state &&
                  tx_path === "deposits" &&
                  order.state
                }`}
              >
                <LeftText className="fuente">{item[0]}</LeftText>
                <MiddleSection />
                <RightText className="fuente2">{item[1]}</RightText>
              </ItemContainer>
            );
          })
        : new Array(10).fill("1").map((item, indx) => {
            return (
              <ItemContainer className="skeleton" key={indx}>
                <LeftText>skeleton --</LeftText>
                <MiddleSection />
                <RightText>skeleton -------- </RightText>
              </ItemContainer>
            );
          })}
    </Container>
  );
};

export default DetailGenerator;

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
      color: #383838;
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

  @media ${device.tablet} {
    padding: 25px 20px;
    width: calc(100% - 40px);
  }

  &.withTitle {
    height: calc(100% - 95px);
    padding-top: 70px;
    grid-template-rows: 70px repeat(auto-fill, 20px);
  }

  ${Text}, ${MiddleSection} {
    color: gray;
  }

  &.darkTheme {
    p {
      color: white;
    }
  }
`;

//
