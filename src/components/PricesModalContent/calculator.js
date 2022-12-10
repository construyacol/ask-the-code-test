import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import convertCurrencies from "../../utils/convert_currency";
import { getCdnPath } from '../../environment'
import { CURRENCY_INDEX_IMG } from 'core/config/currencies'

const NumberInput = loadable(() => import("../widgets/inputs/numberInput"));

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { currentPair } = props;
  const [convertedCurrency, setConvertedCurrency] = useState();
  const [amount, setAmount] = useState("20000");

  const convert = async (value) => {
    // En este ejemplo utilizamos el convertidor para comprar Bitcoin, es decir, gastamos COP y adquirimos Bitcoin
    let converted_currency = await convertCurrencies(
      currentPair.secondary_currency,
      value,
      currentPair.id,
      currentPair
    );
    setConvertedCurrency(converted_currency);
  };

  useEffect(() => {
    convert(amount.replace(/,/g, ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPair]);

  const handleChange = (e) => {
    const value = String(e.target.value).replace(/,/g, "") || "0";
    if (isNaN(value) || value === "NaN") {
      return e.preventDefault();
    }
    setAmount(value);
    convert(value);
  };

  let inputStyles = {
    fontSize: "16px",
  };

  const currencyImg = currentPair.primary_currency.currency
  

  return (
    <div className="root-content-items-calc">
      <CalculatorInput
        iconPath={`${getCdnPath('assets')}prices-modal/ic_cop.svg`}
        type="text"
        useCustomInput
        value={amount}
        onChange={handleChange}
        autoComplete="off"
        className="numberFont"
        style={inputStyles}
      />
      <div
        className="exchange-arrows"
        style={{
          backgroundImage: `url(${getCdnPath('assets')}prices-modal/ellipse.svg)`,
        }}
      > 
        <img
          src={`${getCdnPath('assets')}prices-modal/exchange_arrows.png`}
          style={{ margin: "0.5em 1em" }}
          alt=""
        />
      </div>
      <CalculatorInput
        iconPath={`${getCdnPath('assets')}coins/${CURRENCY_INDEX_IMG[currencyImg] || currencyImg}.png`}
        type="text"
        defaultValue={convertedCurrency && convertedCurrency.want_to_spend}
        readOnly
        className="numberFont"
        style={inputStyles}
      />
    </div>
  );
};

function CalculatorInput({ iconPath, useCustomInput, ...rest }) {
  return (
    <div className="item-content-calc-number">
      <img src={iconPath} alt="" />
      {useCustomInput ? <NumberInput {...rest} /> : <input {...rest} />}
    </div>
  );
}
