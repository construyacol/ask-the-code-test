import { useEffect, useState } from "react";
import { formatToCurrency } from "utils/convert_currency";

export const useFormatCurrency = (objetive_amount, currency) => {
  const [amount, setAmount] = useState(objetive_amount);
  const amountCurrency = currency;

  const formating = async (objetive_amount, currency) => {
    let amount_converted = formatToCurrency(objetive_amount, currency);
    let finalAmount = amount_converted?.isNegative() ? amount_converted?.multipliedBy(-1) : amount_converted
    setAmount(finalAmount.toFormat());
    return finalAmount.toFormat();
  };

  const toBigNumber = async(objetive_amount, currency) => {
    let amount = formatToCurrency(objetive_amount, currency);
    return amount
  }

  useEffect(() => {
    if (amount && amountCurrency) {
      formating(amount, amountCurrency);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [amount, formating, toBigNumber];
};
