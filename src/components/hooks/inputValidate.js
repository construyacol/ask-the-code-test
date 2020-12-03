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
  let minAmountValidation
  let availableAmountValidation

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
      case "spend-amount": // Swap input spend

        value = await formatToCurrency(e.target.value.toString().replace(/,/g, ""), currentWallet.currency);

        if (isNaN(value.toNumber()) || value.toNumber() === "NaN") {
          setCustomError(null)
          setInputState("bad");
          return e.target.value = null;
        }

        if(inputName === 'spend-amount' && !currentPair){
            console.log('No se puede acceder a currentPair')
          return (e.target.value = null);
        }

         min_amount = getMinAmount(inputName)
         available = formatToCurrency(availableBalance, currentWallet.currency);
         minAmountValidation = getMinAmountValidation(inputName, value, min_amount)
         availableAmountValidation = value.isLessThanOrEqualTo(available)

        if (minAmountValidation && availableAmountValidation) {
          setCustomError(null)
          setInputState("good");
          // return e.target.value = value.toFormat();
        } else {
          setInputState("bad");
          ErrorMsgValidate(inputName, e.target.value, min_amount.toFormat(), minAmountValidation, availableAmountValidation)
        }
        return e.target.value = currentWallet.currency_type === 'fiat' ? value.toFormat() : e.target.value;
        // return e.target.value;





        case 'bought-amount':
          const isSecondaryCurrency = currentPair.boughtCurrency === currentPair.secondary_currency.currency
          if(!isSecondaryCurrency){return value}
          // Validamos que la cantidad gastada spend-amount no supere el monto disponible en la cuenta
          availableAmountValidation = await availableSpendAmountValidation()
          value = await formatToCurrency(e.target.value.toString().replace(/,/g, ""), currentPair.secondary_currency);
          min_amount = getMinAmount(inputName)
          minAmountValidation = getMinAmountValidation(inputName, value, min_amount)
          // console.log('Moneda secundaria comprada', currentPair.boughtCurrency, 'Cantidad comprada', value.toFormat(), ' Cantidad Mínima:', min_amount.toFormat(), minAmountValidation)
          if (minAmountValidation && availableAmountValidation) {
            setCustomError(null)
            setInputState("good");
            // return e.target.value = value.toFormat();
          } else {
            setInputState("bad");
            ErrorMsgValidate(inputName, e.target.value, min_amount.toFormat(), minAmountValidation, availableAmountValidation)
          }
          return e.target.value = currentWallet.currency_type === 'fiat' ? value.toFormat() : e.target.value;
        return
      default:
    }
  };


  const availableSpendAmountValidation = async() => {
    const spend_amount = new FormData(document.getElementById("swapForm")).get("spend-amount");
    const spend_amount_value = await formatToCurrency(spend_amount.toString().replace(/,/g, ""), currentWallet.currency);
    const available = formatToCurrency(availableBalance, currentWallet.currency);
    const availableAmountValidation = spend_amount_value.isLessThanOrEqualTo(available)
    return availableAmountValidation
  }

  const ErrorMsgValidate = (inputName, value, min_amount, minAmountValidation, availableAmountValidation) => {
    if(value.length > 1){
      let errMsg = ""
      switch (inputName) {
        case 'spend-amount': //Swap input
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
        case 'bought-amount':
          errMsg =
          !minAmountValidation && `El monto mínimo a recibir es: ${min_amount} ${currentPair.secondary_currency.currency}`
          return setCustomError(errMsg)
        default:
      }
    }else{
      setCustomError(null)
    }
  }


  const getMinAmount = (inputName) => {
    switch (inputName) {
      case 'spend-amount':
      // El min_amount está expresado en la secondary currency, por lo tanto solo validamos el min amount en el input "spend-amount" si la moneda que se gasta (currentWallet) es la secondary_currency
      // Ej, con el par BTC/COP, el min amount está expresado en cop (20.000 cop), solo validaríamos este campo si estamos dentro de la cuenta de cop y vamos a gastar cop para adquirir btc
        const isSecondaryCurrency = currentWallet.currency.currency === currentPair.secondary_currency.currency
        return formatToCurrency(isSecondaryCurrency ? currentPair.exchange.min_order.min_amount : '0', currentWallet.currency);
      case 'amount':
        return formatToCurrency(withdrawProviders[currentWallet.currency.currency].provider.min_amount, currentWallet.currency)
      case 'bought-amount':
      // return formatToCurrency(currentPair.exchange.min_order.min_amount, currentWallet.currency);
        return formatToCurrency('20000', currentWallet.currency);
      default:
        return
    }
  }

  const getMinAmountValidation = (inputName, value, min_amount) => {
    switch (inputName) {
      case 'spend-amount':
        const isSecondaryCurrency = currentWallet.currency.currency === currentPair.secondary_currency.currency
        return isSecondaryCurrency ? value.isGreaterThanOrEqualTo(min_amount) : value.isGreaterThan(min_amount);
      case 'amount':
      case 'bought-amount':
        return value.isGreaterThanOrEqualTo(min_amount)
      default:
    }
  }

  const debouncedValidateState = debounce(validateState, 100);

  return [inputState, validateState, setInputState, customError];
};

//
