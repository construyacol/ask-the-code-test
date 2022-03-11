import React from "react";
import styled from "styled-components";
// import currencyLabels from "./currency-labels";
import useCurrencies from '../../hooks/useCurrencies'

const PricesComponent = ({ change, data }) => {
  let { currencyLabel, buyPrice, sellPrice } = data;
  const currencies = useCurrencies()
  let currencySymbol = currencies[currencyLabel]?.symbol;


  return (
    <PricesStyled>
      <ExchangeBox
        {...{ change, price: sellPrice, type: "sell", currencySymbol }}
      />
      <PricesDividerStyled />
      <ExchangeBox
        {...{ change, price: buyPrice, type: "buy", currencySymbol }}
      />
    </PricesStyled>
  );
};

const ExchangeBox = ({ change, price, type, currencySymbol }) => (
  <ExchangeBoxStyled>
    <label>
      TE {type === "buy" ? "VENDEMOS" : "COMPRAMOS"}{" "}
      <label className="strong">{currencySymbol}</label> A<br />
      <label
        className="root-content-numbers"
        style={change ? { color: "#1FE47B" } : {}}
      >
        ${price}
      </label>
    </label>
  </ExchangeBoxStyled>
);

const ExchangeBoxStyled = styled.div`
  display: flex;
  font-family: "Raleway";
  && .root-content-numbers {
    font-weight: bold;
    font-size: 21px;
    font-family: Tomorrow;
    font-display: swap;
  }
  && label {
    text-align: center;
    letter-spacing: 4px;
    font-size: 10px;
    line-height: 26px;
  }
  && .strong {
    font-weight: bold;
    color: #ffffff;
    font-family: "Raleway";
  }
  @media (max-width: 900px) {
    transform: scale(1.2);
    left: 0;
    right: 0;
    && label {
      letter-spacing: 0px;
      font-size: 9px;
      line-height: 18px;
    }
    && .root-content-numbers {
      font-size: 15px;
      letter-spacing: -1;
    }
  }
  @media (min-width: 481px) and (max-width: 767px) {
    && label {
      letter-spacing: 0px;
      font-size: 9px;
      line-height: 18px;
    }
    && .root-content-numbers {
      font-size: 15px;
      letter-spacing: -1;
    }
  }
  @media (max-width: 320px) {
    left: 22%;
    transform: scale(1.1);
  }
`;

const PricesStyled = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  height: 9%;
  min-width: 230px;
  color: rgba(255, 255, 255, 1);
  align-items: center;
  font-size: 8px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  min-width: 430px;
  z-index: 2;
`;

const PricesDividerStyled = styled.div`
  height: 30px;
  width: 2px;
  margin: 0 4em;
  background-color: #ffffff;
  border-radius: 4px;
  transform: rotate(10deg);
  @media (max-width: 900px) {
    height: 25px;
    width: 1px;
    transform: rotate(0deg);
  }
  @media (max-width: 370px) {
    margin: 0 1.5em;
  }
`;

export default PricesComponent;
