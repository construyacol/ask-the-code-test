import { useEffect, useState } from "react";
import { formatToCurrency } from "../../utils/convert_currency";

export const useFormatCurrency = (objetive_amount, currency) => {
  const [amount, setAmount] = useState(objetive_amount);
  const amountCurrency = currency;

  const formating = async (objetive_amount, currency) => {
    // console.log('||||||||| FORMATING CURRENCY', objetive_amount, currency)
    let amount_converted = await formatToCurrency(objetive_amount, currency);
    setAmount(amount_converted.toFormat());
    return amount_converted.toFormat();
  };

  useEffect(() => {
    if (amount && amountCurrency) {
      formating(amount, amountCurrency);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [amount, formating];
};
