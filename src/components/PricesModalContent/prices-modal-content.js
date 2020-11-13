import React, { useState, useRef, useEffect } from "react";
import CalculatorComponent from "./calculator";
import "./style.css";
import ChartComponent from "./chart";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useCurrencyPrices from "../../hooks/useCurrencyPrices";

const FIRST_CRITERIA = ["BTC/COP", "BTC/USD", "BTC/"];

export default function PricesModalContent(props) {
  const [isDesktop, width, height] = useWindowDimensions();
  const [showSelect, setShowSelect] = useState(false);
  const overlayRef = useRef();
  const selectRef = useRef();

  const { currentPair, pairs } = props;

  const setSelectStyles = () => {
    window.requestAnimationFrame(() => {
      if (overlayRef.current && selectRef.current) {
        overlayRef.current.style.display = showSelect ? "block" : "none";
        selectRef.current.style.bottom = showSelect ? "70vh" : "-1000px";
      }
    });
  };

  useEffect(() => {
    setSelectStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSelect]);

  if (!pairs || !currentPair) {
    return null;
  }

  return (
    <div style={{ overflow: "hidden", height: "100%" }}>
      <div
        ref={overlayRef}
        onClick={() => setShowSelect(false)}
        id="overlay"
      ></div>
      <div className="prices-main-container" style={{ height: "100%" }}>
        <div className="base-container">
          <div className="chart-container">
            <div className="cta-pair">
              <div
                className=""
                onClick={isDesktop ? () => null : () => setShowSelect(true)}
              >
                <img
                  src={require(`../../assets/prices-modal/coin_assets/${currentPair.primary_currency.currency}.svg`)}
                  alt=""
                />
                <label className="exchange-label">{currentPair.buy_pair}</label>
                {!isDesktop && (
                  <img
                    style={{ transform: `rotate(${showSelect ? -90 : 90}deg)` }}
                    className="arrow-down"
                    src={require(`../../assets/prices-modal/ic_arrow_right_desabled.svg`)}
                    alt=""
                  />
                )}
              </div>
              <PairPrices currentPair={currentPair} />
            </div>

            <div className="fill" />
            <ChartComponent
              currentPair={currentPair}
              height={height}
              width={width}
            />
          </div>

          <div className="pair-list-container">
            {isDesktop && <PairsSelect {...props} />}
            <CalculatorComponent currentPair={currentPair} />
          </div>
        </div>
      </div>
      {!isDesktop && (
        <PairsSelect
          setShowSelect={setShowSelect}
          selectRef={selectRef}
          {...props}
        />
      )}
    </div>
  );
}

const PairPrices = ({ currentPair }) => {
  const [currencyLabel, buyPrice, sellPrice] = useCurrencyPrices(currentPair);

  return (
    <div className="pair-prices">
      <div className="price-container buy">
        <p className="font price">Te compramos {currencyLabel} a</p>
        <p className="numberFont amount_price">{buyPrice}</p>
      </div>

      <div className="price-container sell">
        <p className="font price">Te vendemos {currencyLabel} a</p>
        <p className="numberFont amount_price">{sellPrice}</p>
      </div>
    </div>
  );
};

const compare = (a, b) => {
  if (a.buy_pair.includes(FIRST_CRITERIA)) return 1;
  if (a.buy_pair > b.buy_pair) return 1;
  if (b.buy_pair > a.buy_pair) return -1;
  return 0;
};

const PairsSelect = ({
  pairs,
  currentPair,
  changePair,
  selectRef,
  setShowSelect,
}) => {
  return (
    <div ref={selectRef} className="pair-list">
      {pairs.sort(compare).map((pair, key) => {
        const rule = currentPair.id === pair.id;
        const itemClasses = `
          base-horizontal-container base-item-content
          ${rule ? "item-content-active" : ""}
          `;
        return (
          <div
            className={itemClasses}
            onClick={(e) => {
              changePair(pair.buy_pair, "pair");
              setShowSelect && setShowSelect(false);
            }}
            key={key}
          >
            <img
              className={`${!rule ? "img-disable" : "img-enable"}`}
              src={require(`../../assets/prices-modal/coin_assets/${pair.primary_currency.currency}.svg`)}
              alt=""
            />
            <div className="base-item-text-cont">
              <h2 className="font">{pair.primary_currency.currency}</h2>
              <p className="numberFont">{pair.buy_pair}</p>
            </div>
            <img
              style={
                rule
                  ? {}
                  : {
                      opacity: "0.5",
                    }
              }
              src={require(`../../assets/prices-modal/${
                rule ? "ic_select" : "ic_arrow_right_desabled"
              }.svg`)}
              alt=""
            />
          </div>
        );
      })}
    </div>
  );
};
