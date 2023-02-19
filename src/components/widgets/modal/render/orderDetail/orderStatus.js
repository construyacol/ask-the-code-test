import React, { useEffect, useState } from "react";
import UseTxState from "hooks/useTxState";
import api, { orderStatus } from "./rest.json";
import { OnlySkeletonAnimation } from "../../../loaders/skeleton";
import styled from "styled-components";
import { device } from "../../../../../const/const";
import { useSelector } from "react-redux";
import moment from "moment";
import { checkIfFiat } from 'core/config/currencies';
import "moment/locale/es";
moment.locale("es");

const OrderStatus = ({ order, movil }) => {

  const [orderState, setOrderState] = useState();
  const { currentOrder, tx_path } = UseTxState();
  const skeletons = new Array(4).fill(["created"]);
  const depositProviders = useSelector(({modelData:{ deposit_providers }}) => deposit_providers);


  useEffect(() => {
    let statusCopys = {};
    const providerType = depositProviders[order.deposit_provider_id]?.provider_type
    console.log('statusCopys ::', providerType, api[tx_path])

    for (let prop in api[tx_path]) {
      statusCopys = {
        ...statusCopys,
        [prop]: {
          ...api[tx_path][prop],
          completed: currentOrder.state === prop,
        },
      };
    }
    // console.log(statusCopys, api[tx_path])
    setOrderState(Object.entries(statusCopys));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder.state]);

  // console.log('|||||||||||||||| OrderSupervisor ::', orderState)
  const currencyType = checkIfFiat(order?.currency) ? 'fiat' : 'crypto'

  return (
    <OrderStatusContainer>
      <TopSectionStatus>
        <Text className="fuente">
          {orderStatus[tx_path][order.state][currencyType].title}
        </Text>
        <SubTitle className="fuente">
          {orderStatus[tx_path][order.state][currencyType].description}
        </SubTitle>
      </TopSectionStatus>
      {!movil && (
        <StatusContainer>
          {
            orderState ? 
            orderState.map((state, index) => {
              return (
                <StatusItem
                  state={state}
                  order={currentOrder}
                  key={index}
                  active={state[1].completed}
                  className={`${orderState.length === index + 1 ? "statusStep finalStep" : "statusStep"} ${state[1].completed ? "activeStep" : ""}`}
                />
              );
            })
            : 
            skeletons.map((state, index) => {
              return (
                <StatusItem
                  state={state}
                  key={index}
                  className={`${
                    skeletons.length === index + 1
                      ? "statusStep finalStep"
                      : "statusStep"
                  } skeleton`}
                  skeleton
                />
              );
            })
          }
        </StatusContainer>
      )}
    </OrderStatusContainer>
  );
};

const StatusItem = ({ className, state, order, active, skeleton }) => {
  
  const activated = active && active.toString();
  const currencyType = checkIfFiat(order?.currency) ? 'fiat' : 'crypto'

  return (
    <Status className={`status ${className}`}>
      <Indicator className={className} />
      <Description>
        {skeleton ? (
          <Skeleton />
        ) : (
          <>
            <StatusTitle className="fuente" active={activated}>
              {state[1].ui_text[currencyType] || state[1].ui_text}
            </StatusTitle>
            <DateStatusText className="fuente2" active={activated}>
              {active && order.state === "pending"
                ? "Pendiente"
                : active
                ? "En proceso..."
                : state[0] === "created"
                ? moment(order.created_at).format("LL")
                : state[0] === "pending"
                ? moment(order.updated_at).format("LL")
                : state[0] === "confirmed" && order.state === "confirmed"
                ? moment(order.updated_at).format("LL")
                : ""}
            </DateStatusText>
          </>
        )}
      </Description>
    </Status>
  );
};

export default OrderStatus;

export const Text = styled.p`
  margin: 0;
`;

const OrderStatusContainer = styled.div`
  background: #f5f5f5;
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 25px;
  padding: 30px 40px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;

  @media ${device.tablet} {
    grid-template-rows: 1fr;
    padding: 25px 20px;
  }
`;
const TopSectionStatus = styled.div`
  display: grid;
  row-gap: 10px;
  height: auto;
`;

const SubTitle = styled(Text)`
  font-size: 13px;
  color: var(--paragraph_color);
`;

const StatusContainer = styled.div`
  padding: 45px 0;
  display: grid;
  grid-template-rows: repeat(auto-fill, 70px);
  row-gap: 10px;
`;

const Status = styled.div`
  height: 70px;
  padding: 0 20px;
  display: grid;
  align-items: center;
  grid-template-columns: 20px 1fr;

  &.activeStep ~ .status .statusStep {
    background: #dadada;
    ::after {
      background: #dadada;
    }
  }

  &.activeStep .statusStep {
    ::after {
      background: #dadada;
    }
  }
`;

const Indicator = styled.div`
  justify-self: center;
  width: 14px;
  height: 14px;
  background: #0198ff;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  display: grid;
  align-items: center;
  justify-items: center;
  border: 2px solid #f5f5f5;

  &.activeStep {
    width: 14px;
    height: 14px;
    border: 2px solid #0198ff;
    background: transparent !important;
    position: relative;
    ::after {
      top: 16px !important;
    }
    ::before {
      content: "";
      width: 6px;
      height: 6px;
      background: #0198ff;
      border-radius: 50%;
    }
  }

  &.statusStep::after {
    content: "";
    width: 2px;
    height: 64px;
    background: #0198ff;
    position: absolute;
    -webkit-align-self: center;
    align-self: start;
    top: 14px;
    z-index: 1;
  }

  &.statusStep.finalStep::after {
    display: none;
  }

  &.skeleton {
    background: #c1c1c1;
    ::after {
      background: #c1c1c1;
    }
  }
`;
const Description = styled.div`
  padding-left: 20px;
  display: grid;
  row-gap: 5px;
  p {
    margin: 0;
  }
`;

const Skeleton = styled.div`
  width: 100%;
  height: 16px;
  background: #c1c1c1;
  border-radius: 3px;
  ${OnlySkeletonAnimation}
`;

const StatusTitle = styled(Text)`
  font-size: 14px;
  color: ${(props) => (props.active === "true" ? "#0198FF" : "var(--paragraph_color)")};
`;

const DateStatusText = styled(Text)`
  font-size: 12px;
  color: ${(props) => (props.active === "true" ? "#0198FF" : "#adadad")};
`;

//
