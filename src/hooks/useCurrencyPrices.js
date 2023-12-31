import { useState, useEffect } from "react";
// import currencyLabels from "../components/Prices/currency-labels";
import { formatToCurrency } from "../utils/convert_currency";
import useCurrencies from './useCurrencies'

export const FormatCurrency = (objetive_amount, currency) => {
  const [amount, setAmount] = useState(objetive_amount);
  const [amountCurrency] = useState(currency);
  const formating = async (objetive_amount, currency) => {
    // console.log('||||||||| FORMATING CURRENCY', objetive_amount, currency)
    let amount_converted = formatToCurrency(objetive_amount, currency);
    setAmount(amount_converted.toFormat());
  };

  useEffect(() => {
    if (amount && amountCurrency) {
      formating(amount, amountCurrency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [amount, formating];
};

function useCurrencyPrices(currentPair) {

  const currencies = useCurrencies()
  const [currencyLabel, setCurrencyLabel] = useState(currencies["bitcoin"]?.symbol);
  const [buyPrice, setBuyPrice] = FormatCurrency(
    currentPair.buy_price,
    currentPair.secondary_currency
  );

  const [sellPrice, setSellPrice] = FormatCurrency(currentPair.sell_price, currentPair.secondary_currency);

  useEffect(() => {
    if (currentPair) {
      setBuyPrice(currentPair.buy_price, currentPair.secondary_currency);
      setSellPrice(currentPair.sell_price, currentPair.secondary_currency);
      setCurrencyLabel(currencies[currentPair.primary_currency]?.symbol);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPair]);
  return [currencyLabel, buyPrice, sellPrice];
}

export default useCurrencyPrices;
