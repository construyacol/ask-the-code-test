import { useState } from "react";
// import AddressValidator from 'wallet-address-validator'
// import useError from './errorHandle'
import { debounce } from "../../utils";
import { formatToCurrency } from "../../utils/convert_currency";
import WithdrawViewState from "./withdrawStateHandle";
import UseSwapInfo from "./useSwapInfo";


export default () => {
  const [inputState, setInputState] = useState();
  // const [ setHandleError ] = useError()
  // const globalState = useSelector(state => state)
  // const params = useParams()
  // const { account_id } = params
  // const { wallets, withdrawProviders } = globalState.modelData
  const [{ current_wallet, withdrawProviders }] = WithdrawViewState();
  const [{ currentPair }] = UseSwapInfo();
  let value
  let min_amount
  let available


  // const getMinAmount


  const validateState = async (inputName, e) => {
    if (!e.target.value || e.target.value.length === 0) {
      return setInputState(null);
    }
    switch (inputName) {

      case "name-account":
        if (e.target.value.length > 2) {
          setInputState("good");
        }

        break;

      case "address":
      case "address-account":
        // case: `address` si encontramos @ al inicio de la linea: ^@
        if (inputName === "address" && e.target.value.match(/^@/g)) {
          // console.log('activando sistema de tags')
          return;
        }

        let AddressValidator;
        AddressValidator = await import("wallet-address-validator");

        let currency =
          current_wallet.currency.currency === "bitcoin_testnet"
            ? "bitcoin"
            : current_wallet.currency.currency;
        let finalValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "");

        let addressVerify = await AddressValidator.validate(
          finalValue,
          currency
        );

        if (addressVerify) {
          setInputState("good");
        } else {
          setInputState("bad");
        }
        e.target.value = finalValue;
        break;

      case "amount":
      // Retiro cripto

        value = await formatToCurrency(
          e.target.value.toString().replace(/,/g, ""),
          current_wallet.currency
        );

        if (isNaN(value.toNumber()) || value.toNumber() === "NaN") {
          return (e.target.value = null);
        }

         min_amount = await formatToCurrency(withdrawProviders[current_wallet.currency.currency].provider.min_amount, current_wallet.currency);
         available = await formatToCurrency(current_wallet.available, current_wallet.currency);

        if (value.isGreaterThanOrEqualTo(min_amount) && value.isLessThanOrEqualTo(available)) {
          setInputState("good");
        } else {
          setInputState("bad");
        }
        return e.target.value;



      case "sell-amount":

        value = await formatToCurrency(
          e.target.value.toString().replace(/,/g, ""),
          current_wallet.currency
        );

        if (isNaN(value.toNumber()) || value.toNumber() === "NaN") {
          return (e.target.value = null);
        }
        if(!currentPair){
          console.log('No se puede acceder a currentPair')
          return (e.target.value = null);
        }

        // El min_amount está expresado en la secondary currency, por lo tanto solo validamos el min amount en el input "sell-amount" si la moneda que se gasta (current_wallet) es la secondary_currency
         const isSecondaryCurrency = current_wallet.currency.currency === currentPair.secondary_currency.currency
         min_amount = await formatToCurrency(isSecondaryCurrency ? currentPair.exchange.min_order.min_amount : '0', current_wallet.currency);
         available = await formatToCurrency(current_wallet.available, current_wallet.currency);

        const min_amount_validation = isSecondaryCurrency ? value.isGreaterThanOrEqualTo(min_amount) : value.isGreaterThan(min_amount);

        if (min_amount_validation && value.isLessThanOrEqualTo(available)) {
          setInputState("good");
        } else {
          setInputState("bad");
        }
        return e.target.value = current_wallet.currency_type === 'fiat' ? value.toFormat() : e.target.value;

        break;
      default:
    }
  };

  const debouncedValidateState = debounce(validateState, 100);

  return [inputState, validateState, setInputState];
};

//
