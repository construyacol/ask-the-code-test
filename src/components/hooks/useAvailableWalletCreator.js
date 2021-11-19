import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { CAccountAllowedContext } from '../context'
import { convertToObjectWithCustomIndex } from "../../utils";

function useAvailableWalletCreator() {
  const [availableCurrencies, setAvailableCurrencies] = useState();
  const { currencies, wallets } = useSelector((state) => state.modelData);

  const getAvailableCurrencies = async () => {
    if (!currencies || !wallets) {
      return setAvailableCurrencies(currencies);
    }
    let objectCurrencies = await convertToObjectWithCustomIndex(
      currencies,
      "currency"
    );
    let availableWallets = await convertToObjectWithCustomIndex(
      wallets,
      "currency.currency"
    );
    let resultCurrencies = [];

    Object.keys(objectCurrencies).forEach((currency_name) => {
      if (!availableWallets[currency_name]) {
        resultCurrencies.push(objectCurrencies[currency_name]);
      }
    });
    setAvailableCurrencies(resultCurrencies);
  };

  useEffect(() => {
    getAvailableCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies, wallets]);

  return [availableCurrencies];
}

export default useAvailableWalletCreator;
