import { useState } from "react";
// import AddressValidator from 'wallet-address-validator'
// import useError from './errorHandle'
import { debounce } from "../../utils";
import { formatToCurrency } from "../../utils/convert_currency";
import WithdrawViewState from "./withdrawStateHandle";
import { useWalletInfo }  from "../../hooks/useWalletInfo";


export default () => {
  const [ inputState, setInputState ] = useState();
  const [ customError, setCustomError ] = useState();

  // const [ setHandleError ] = useError()
  // const globalState = useSelector(state => state)
  // const params = useParams()
  // const { account_id } = params
  // const { wallets, withdrawProviders } = globalState.modelData
  const [{ withdrawProviders }] = WithdrawViewState();
  const { currentPair, currentWallet, availableBalance } = useWalletInfo();
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
          currentWallet.currency.currency === "bitcoin_testnet"
            ? "bitcoin"
            : currentWallet.currency.currency;
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

      case "amount": // Retiro cripto
      case "sell-amount": // Swap input spend

        value = await formatToCurrency(e.target.value.toString().replace(/,/g, ""), currentWallet.currency);

        if (isNaN(value.toNumber()) || value.toNumber() === "NaN") {
          return e.target.value = null;
        }

        if(inputName === 'sell-amount' && !currentPair){
            console.log('No se puede acceder a currentPair')
          return (e.target.value = null);
        }

         min_amount = getMinAmount(inputName)
         available = formatToCurrency(availableBalance, currentWallet.currency);
         const minAmountValidation = getMinAmountValidation(inputName, value, min_amount)
         const availableAmountValidation = value.isLessThanOrEqualTo(available)

        if (minAmountValidation && availableAmountValidation) {
          setCustomError(null)
          setInputState("good");
          // alert(customError)
        } else {
          setInputState("bad");
          ErrorMsgValidate(inputName, e.target.value, min_amount.toFormat(), minAmountValidation, availableAmountValidation)
        }
        return e.target.value = currentWallet.currency_type === 'fiat' ? value.toFormat() : e.target.value;
        break;
      default:
    }
  };

  const ErrorMsgValidate = (inputName, value, min_amount, minAmountValidation, availableAmountValidation) => {
    if(value.length > 1){
      let errMsg = ""
      switch (inputName) {
        case 'sell-amount': //Swap input
          const isSecondaryCurrency = currentWallet.currency.currency === currentPair.secondary_currency.currency
          errMsg =
          // (!minAmountValidation) ? `El monto mínimo para recibir es: ${currentPair.exchange.min_order.min_amount}` :
          (!minAmountValidation && isSecondaryCurrency) ? `El monto mínimo es: ${min_amount}` :
           !availableAmountValidation && `El monto supera el valor disponible en la cuenta`;
          return setCustomError(errMsg)
        case 'amount': //Withdraw cripto input
          errMsg =
          (!minAmountValidation) ? `El monto mínimo es: ${min_amount}` :
           !availableAmountValidation && `El monto supera el valor disponible en la cuenta`;
          return setCustomError(errMsg)
        default:
      }
    }else{
      setCustomError(null)
    }
  }


  const getMinAmount = (inputName) => {
    switch (inputName) {
      case 'sell-amount':
      // El min_amount está expresado en la secondary currency, por lo tanto solo validamos el min amount en el input "sell-amount" si la moneda que se gasta (currentWallet) es la secondary_currency
      // Ej, con el par BTC/COP, el min amount está expresado en cop (20.000 cop), solo validaríamos este campo si estamos dentro de la cuenta de cop y vamos a gastar cop para adquirir btc
        const isSecondaryCurrency = currentWallet.currency.currency === currentPair.secondary_currency.currency
        return formatToCurrency(isSecondaryCurrency ? currentPair.exchange.min_order.min_amount : '0', currentWallet.currency);
        break;
      case 'amount':
        return formatToCurrency(withdrawProviders[currentWallet.currency.currency].provider.min_amount, currentWallet.currency)
      default:
        return
    }
  }

  const getMinAmountValidation = (inputName, value, min_amount) => {
    switch (inputName) {
      case 'sell-amount':
        const isSecondaryCurrency = currentWallet.currency.currency === currentPair.secondary_currency.currency
        return isSecondaryCurrency ? value.isGreaterThanOrEqualTo(min_amount) : value.isGreaterThan(min_amount);
      case 'amount':
        return value.isGreaterThanOrEqualTo(min_amount)
      default:
    }
  }

  const debouncedValidateState = debounce(validateState, 100);

  return [inputState, validateState, setInputState, customError];
};

//
