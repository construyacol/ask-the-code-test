import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { OnlySkeletonAnimation } from "../../../loaders/skeleton";
import UseTxState, { selectWithConvertToObjectWithCustomIndex } from "hooks/useTxState";
import { useFormatCurrency } from "hooks/useFormatCurrency";
import { getState } from "./";
import { device, ORDER_TYPE_UI_NAME } from "../../../../../const/const";
import { useSelector } from "react-redux";
import { getHostName } from '../../../../../environment'
import DetailTemplateComponent from '../../../detailTemplate'
import { MiddleSection } from '../../../detailTemplate'
import { checkIfFiat, parseSymbolCurrency } from 'core/config/currencies';
import { selectDepositAccountsByNetwork } from 'selectors'
import BigNumber from "bignumber.js"

import moment from "moment";
import "moment/locale/es";
moment.locale("es");


export const useDetailParseData = (order, detailType) => { 
 
  const [data, setData] = useState([]);
  const [, formatCurrency] = useFormatCurrency();
  const { deposit_providers } = UseTxState();
  const { withdraw_accounts } = useSelector((state) => state.modelData)
  const depositAccountsByProvType = useSelector((state) => selectDepositAccountsByNetwork(state, order?.currency));

  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
  const currencySimbol = currencies ? parseSymbolCurrency(currencies[order?.currency]?.symbol) : parseSymbolCurrency(order?.currency)?.toUpperCase()
  
  const inProcesOrder = async (order) => {
    const isPending = order.state === 'pending'
    const currencyType = checkIfFiat(order?.currency) ? 'fiat' : 'crypto'
    switch (currencyType) {
      case "fiat":
        let depositProviderInfo = [];
        if (deposit_providers && deposit_providers[order.deposit_provider_id]) {
          const depositProvider = deposit_providers[order.deposit_provider_id];
          const depositAccount = depositAccountsByProvType[depositProvider?.provider_type];
          if(depositProvider?.provider_type === 'pse'){
            depositProviderInfo = [
              [
                "Entidad del depósito:",
                `${depositAccount.ui_name}`,
              ], 
              [
                `Cantidad ${isPending ? 'por acreditar' : 'acreditada'}`,
                `${await formatCurrency(order.amount, order.currency)} ${currencySimbol}`,
              ],
              [
                `Costo del depósito`,
                `${await formatCurrency(new BigNumber(order?.cost).plus(order?.cost_tax || 0), order.currency)} ${currencySimbol}`,
              ]
            ];
          }else if(depositProvider?.provider_type === 'internal_network'){
            depositProviderInfo = [
              [
                "Tipo de depósito:",
                `Transferencia interna`,
              ],
              [
                `Cantidad ${isPending ? 'por acreditar' : 'acreditada'}`,
                `${await formatCurrency(order.amount, order.currency)} ${currencySimbol}`,
              ],
              [
                `Costo del depósito`,
                `${await formatCurrency(new BigNumber(order?.cost).plus(order?.cost_tax || 0), order.currency)} ${currencySimbol}`,
              ]
            ];
          }else if(depositProvider?.currency_type === 'crypto'){
            depositProviderInfo = [
              ["ID:", order.id],
              ["Estado:", getState(order.state)],
              ["Divisa:", `${parseSymbolCurrency(order.currency)}`],
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
            ];
          }else{
            depositProviderInfo = [
              [
                "Entidad del depósito:",
                `${depositAccount.ui_name}`,
              ],
              [
                `${depositAccount?.account?.type?.ui_name}`,
                `${depositAccount?.account?.type?.type}`,
              ],
              [
                `${depositAccount.account.account_id.ui_name}`,
                `${depositAccount.account.account_id.account_id}`,
              ],
              [
                `${depositAccount.account.bussines_name.ui_name}`,
                `${depositAccount.account.bussines_name.bussines_name}`,
              ],
              [
                `${depositAccount.account.nit.ui_name}`,
                `${depositAccount.account.nit.nit}`,
              ],
              [
                `${depositAccount.account.dv.ui_name}`,
                `${depositAccount.account.dv.dv}`,
              ],
              [
                `Cantidad ${isPending ? 'por acreditar' : 'acreditada'}`,
                `${await formatCurrency(order.amount, order.currency)} ${currencySimbol}`,
              ],
              [
                `Costo del depósito`,
                `${await formatCurrency(depositAccount?.costs[order?.cost_id]?.fixed, order.currency)} ${currencySimbol}`,
              ]
            ];
          }
        }

        const amountNeto = await formatCurrency(order.amount_neto, order.currency);
        setData([
          ...depositProviderInfo,
          ["Total a depositar:", `$${amountNeto}`],
        ]);
        break;
      case "crypto":
        setData([
          ["ID:", order.id],
          ["Estado:", getState(order.state)],
          ["Divisa:", `${parseSymbolCurrency(order.currency)}`],
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
      ["Fecha de creación:", moment(order?.created_at).format('D [de] MMM[.] [de] YYYY H:mm')],
      ["ID del depósito:", order?.id],
      ["Estado:", getState(order?.state)],
      [`Cantidad ${isPending ? 'por depositar' : 'depositada'}:`, `${await formatCurrency(order?.amount_neto, order?.currency)} ${currencySimbol}`],
      ["Costo del depósito:",  `${order?.cost && await formatCurrency(new BigNumber(order?.cost).plus(order?.cost_tax || 0), order?.currency)} ${currencySimbol}`],
      [`Cantidad ${isPending ? 'por acreditar' : 'acreditada'}:`, `${await formatCurrency(order?.amount, order?.currency)} ${currencySimbol}`],
    ]
    return parsedOrder 
  }


  const formatWithdrawOrder = async(order) => {
    let parsedOrder = []

    if(!checkIfFiat(order?.currency)){
      const { truncatedString } = await import('hooks/useTruncatedAddress');
      const { LabelCopy } = await import('core/components/molecules')

      if(withdraw_accounts[order?.withdraw_account_id]){
        let truncatedAddress = truncatedString(withdraw_accounts[order?.withdraw_account_id]?.account_address?.value)
        parsedOrder.push(["Destino:", { Component:() => (
        <LabelCopy size={25} data={withdraw_accounts[order?.withdraw_account_id]?.account_address?.value}>
          {truncatedAddress}
        </LabelCopy>)
        }])
      }

      if(order?.metadata){
        let bitrefill_invoice_id = truncatedString(order?.metadata?.bitrefill_invoice_id || '')
        if(order?.metadata?.is_bitrefill){
          parsedOrder.push(["ID factura:", { 
            Component:() => (
            <LabelCopy size={25} data={order?.metadata?.bitrefill_invoice_id}>
              {bitrefill_invoice_id}
            </LabelCopy>
            )
          }]) 
          return [
            ["Fecha de creación:", moment(order?.created_at).format('D [de] MMM[.] [de] YYYY H:mm')],
            ["Estado:", getState(order?.state)],
            ["Costo por retiro:",  `${order?.cost && await formatCurrency(order?.cost, order?.currency)} ${currencySimbol}`],
            ["Cantidad de la compra:", `${await formatCurrency(order?.amount_neto, order?.currency)} ${currencySimbol}`],
            ["Total gastado:", `${await formatCurrency(order?.amount, order?.currency)} ${currencySimbol}`],
            ...parsedOrder,
          ]
        }
      }
    }

    parsedOrder = [
      ["Fecha de creación:", moment(order?.created_at).format('D [de] MMM[.] [de] YYYY H:mm')],
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
      ["Cantidad gastada:", `${await formatCurrency(order?.spent, order?.to_spend_currency)} ${parseSymbolCurrency(order?.to_spend_currency)?.toUpperCase()}`],
      ["Cantidad adquirida:", `${order?.bought ? await formatCurrency(order?.bought, order?.to_buy_currency) : '0'} ${parseSymbolCurrency(order?.to_buy_symbol)?.toUpperCase()}`],
    ]
    return parsedOrder 
  }

  
  const formatShortWithdraw = async(order) => {
    let parsedOrder = [
      [`Cantidad por debitar:`, `${await formatCurrency(order?.amount, order?.currency)} ${currencySimbol}`],
      ["Costo del retiro:",  `${order?.cost && await formatCurrency(order?.cost, order?.currency)} ${currencySimbol}`],
    ]
    return parsedOrder 
  }

  const formatShortDeposit = async(order) => {
    let parsedOrder = [
      [`Cantidad por acreditar:`, `${await formatCurrency(order?.amount, order?.currency)} ${currencySimbol}`],
      ["Costo:",  `${order?.cost && await formatCurrency(new BigNumber(order?.cost).plus(order?.cost_tax || 0), order?.currency)} ${currencySimbol}`],
    ]
    return parsedOrder 
  }

  const formatDepositAccount = async(data) => {
  let parsedOrder = [
    [`${data?.account?.bussines_name?.ui_name}`, `${data?.account?.bussines_name?.bussines_name}`],
    [`${data?.account?.nit?.ui_name}`, `${data?.account?.nit?.nit}`],
    [`${data?.account?.dv?.ui_name}`, `${data?.account?.dv?.dv}`],
  ]
  return parsedOrder 
  }


  const ACTIONS = {
    shortDeposit:formatShortDeposit,
    shortWithdraw:formatShortWithdraw,
  }


  useEffect(() => {
    const init = async() => {
        if(detailType && order){
          ACTIONS[detailType] && setData(await ACTIONS[detailType](order))
        }
    }
    init()
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [order])


  return { 
    data, 
    inProcesOrder,
    formatDepositOrder,
    formatWithdrawOrder,
    formatSwapsOrder,
    formatDepositAccount,
    formatCurrency,
    currencySimbol
  }

}








const DetailGenerator = ({ order, title, TitleSuffix, theme }) => {

  const [orders, setOrders] = useState([]);
  const { deposit_providers, tx_path, path } = UseTxState();
  // const [, formatCurrency] = useFormatCurrency();
  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
  // const { withdraw_accounts } = useSelector((state) => state.modelData)
  // const currencySimbol = currencies ? currencies[order?.currency?.currency]?.symbol : order?.currency?.currency?.toUpperCase()
  
  const { 
    data, 
    inProcesOrder,
    formatDepositOrder,
    formatWithdrawOrder,
    formatSwapsOrder
  } = useDetailParseData(order);

  useEffect(() => {
    if(data){
      setOrders(data)
    }
  }, [data])


  // const params = useParams();
  const orderType = tx_path || path || (window.location.pathname.includes("referral") && "deposits") || "withdraw"
  // const orderType = tx_path || path || "withdraw"


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
 
      <DetailTemplateComponent
        items={orders}
        tx_path={tx_path}
        order={order}
      />

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
          ({order?.referral?.compra_de_referidos?.amount} {currencies && currencies[order?.referral?.compra_de_referidos?.short_currency]?.symbol})
          </span> de este intercambio. <a href={`https://${getHostName()}.com/docs/incentives`} target="_blank"  rel="noreferrer" alt="">Aprende cómo hacerlo</a>
      </p>
  )

}


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
    grid-template-rows: 70px repeat(auto-fill, minmax(20px, auto));
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
