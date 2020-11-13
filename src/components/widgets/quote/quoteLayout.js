import React, { Fragment } from "react";
import { coins } from "../../api/ui/api.json";
import ItemLayout from "../items/itemLayout";
// import Slider from './slide'
import ChartCoin from "../chartCoin/chartCoin.js";
import PropTypes from "prop-types";
import styled from "styled-components";
import { skeleton } from "../loaders/skeleton";

const QuoteLayout = (props) => {
  // console.log('S T A T E - - - Q U O T E - - - - L A Y O U T - - - C O N T A I N E R:::', props)
  // if(!props.currentPair){
  // return <SkeletonLoader/>
  // }

  const { user_collection, buy, sell, movil, switchItem, currentPair } = props;
  const { select_currency } = props;
  const { localCurrency } = props;
  const { buy_price, sell_price } = props;
  let iter = 0;

  const secondCurrency = localCurrency.includes("testnet")
    ? "bitcoin"
    : localCurrency;
  const toSearch =
    currentPair && currentPair.primary_currency.currency.includes("testnet")
      ? "bitcoin"
      : currentPair && currentPair.primary_currency.currency;
  const conditionToShowIcon =
    currentPair &&
    (currentPair.buy_pair === `BTC/${secondCurrency.toUpperCase()}` ||
      currentPair.buy_pair === `USD/${secondCurrency.toUpperCase()}` ||
      currentPair.buy_pair === `BTCT/${secondCurrency.toUpperCase()}`);
  const foundCoin = coins.find((item) => item.name.includes(toSearch));

  return (
    <QuoteLayoutCont>
      <ChartCoin />

      {!props.currentPair ? (
        <SkeletonLoader />
      ) : (
        <QuoteLayoutContainer className="qLC">
          <PricesContainer
            className={`${movil ? "movilPrices" : "desktopPrices"} prices`}
          >
            <div
              className="movilSwitch"
              style={{ display: movil ? "grid" : "none" }}
            >
              <p
                className={`itemSwitch ${buy ? "active" : "inactive"}`}
                onClick={switchItem}
                id="buy"
              >
                Te compramos a:
              </p>
              <p
                className={`itemSwitch ${sell ? "active" : "inactive"}`}
                onClick={switchItem}
                id="sell"
              >
                Te vendemos a:
              </p>
            </div>

            <div
              className="buy"
              style={{ display: buy || !movil ? "grid" : "none" }}
            >
              <p
                className="fuente"
                style={{ display: movil ? "none" : "initial" }}
              >
                Te compramos a:
              </p>
              <h1 className="fuente2 Qprice">
                ${sell_price}{" "}
                <span className="fuente">
                  {localCurrency.toUpperCase()}{" "}
                  <i
                    className="Qventa fas fa-angle-double-up"
                    style={{ display: movil ? "initial" : "none" }}
                  ></i>
                </span>
              </h1>
            </div>

            <div
              className="sell"
              style={{ display: sell || !movil ? "grid" : "none" }}
            >
              <p
                className="fuente"
                style={{ display: movil ? "none" : "initial" }}
              >
                Te vendemos a:
              </p>
              <h1 className="fuente2 Qprice">
                ${buy_price}{" "}
                <span className="fuente">
                  {localCurrency.toUpperCase()}{" "}
                  <i
                    className="Qventa fas fa-angle-double-down"
                    style={{ display: movil ? "initial" : "none" }}
                  ></i>
                </span>
              </h1>
            </div>
          </PricesContainer>

          <CoinList
            className={`coinList ${
              user_collection
                ? user_collection.length > 1 && window.innerWidth > 768
                  ? "user_collection"
                  : ""
                : ""
            }`}
          >
            {user_collection ? (
              window.innerWidth > 768 ? (
                user_collection.map((item) => {
                  iter++;
                  if (iter > 3) {
                    return false;
                  }
                  return (
                    <Fragment key={item.id}>
                      <ItemLayout
                        actives={
                          currentPair.primary_currency.currency === item.name &&
                          true
                        }
                        {...item}
                        actualizarEstado={select_currency}
                      />
                    </Fragment>
                  );
                })
              ) : (
                <ItemLayout actives {...coins[0]} key={coins[0].id} />
              )
            ) : // <Slider currency={currency} items={user_collection} select_currency={select_currency} />
            conditionToShowIcon && foundCoin ? (
              <ItemLayout actives={true} {...foundCoin} />
            ) : (
              <h1>{currentPair.buy_pair}</h1>
            )}
          </CoinList>
        </QuoteLayoutContainer>
      )}
    </QuoteLayoutCont>
  );
};

QuoteLayout.propTypes = {
  buy: PropTypes.bool,
  buy_price: PropTypes.string,
  loader: PropTypes.bool,
  movil: PropTypes.bool,
  select_currency: PropTypes.func,
  sell: PropTypes.bool,
  sell_price: PropTypes.string,
  switchItem: PropTypes.func,
  user_collection: PropTypes.array,
};

// PropTypes

export default QuoteLayout;

const SkeletonLoader = () => {
  let movil = window.innerWidth < 768;

  return (
    <QuoteLayoutContainer>
      <PricesContainer
        className={`${movil ? "movilPrices" : "desktopPrices"} prices skeleton`}
      >
        <div className="buy" style={{ display: `${movil ? "none" : "grid"}` }}>
          <p className="fuente skeleton"></p>
          <h1 className="fuente2 Qprice skeleton"></h1>
        </div>

        <div className="buy" style={{ display: "grid" }}>
          <p className="fuente skeleton"></p>
          <h1 className="fuente2 Qprice skeleton"></h1>
        </div>
      </PricesContainer>
      <CoinList className="coinList">
        <ItemLayout actives={true} {...coins[0]} key={coins[0].id} />
      </CoinList>
    </QuoteLayoutContainer>
  );
};

const CoinList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  justify-self: center;
`;

const PricesContainer = styled.div`
  display: grid;
  color: white;
  grid-column-gap: 10px;
  column-gap: 10px;

  &.movilPrices.skeleton {
    grid-template-rows: initial;
  }

  p,
  h1 {
    margin: 0 !important;
  }

  p.skeleton,
  h1.skeleton {
    height: 20px;
    width: 100%;
    background: #b1b1b1;
    max-width: 170px;
    border-radius: 3px;
  }

  h1.skeleton {
    max-width: 250px;
    height: 24px;
  }

  .Qprice {
    text-shadow: 1px 1px #656565;
  }
`;

const QuoteLayoutCont = styled.section`
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  position: relative;

  .skeleton {
    animation-name: ${skeleton};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    opacity: 0.5;
  }
`;

const QuoteLayoutContainer = styled.div`
  max-width: 700px;
  height: 90%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40% 1fr;
  position: relative;
`;
