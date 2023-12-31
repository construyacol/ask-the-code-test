import { useState } from "react";
import { formatToCurrency, _convertCurrencies } from "utils/convert_currency";
import { useWalletInfo }  from "hooks/useWalletInfo";
import BigNumber from "bignumber.js";
import { checkIfFiat } from 'core/config/currencies';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {

  const [ inputState, setInputState ] = useState();
  const [ customError, setCustomError ] = useState();
  const { currentPair, currentWallet, availableBalance } = useWalletInfo();

  let value
  let min_amount
  let available 
  let minAmountValidation
  let availableAmountValidation

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

      case 'ref_code':
        let min_length = e.target.value.length > 5;
        let max_length = e.target.value.length < 21;
        let alphanumeric = /^[a-z0-9]+$/i.test(e.target.value);
        if(min_length && max_length && alphanumeric){
          setInputState('good')
        }else{
          setInputState('bad')
        } 
        e.target.value = e.target.value.toLowerCase()
        break;

      case "address":
      case "address-account":
        // case: `address` si encontramos @ al inicio de la linea: ^@
        if (inputName === "address" && e.target.value.match(/^@/g)) {
          setInputState(null)
          return;
        }
 
        // const { currency } = currentWallet;
        const withdrawProvider = props?.currentNetwork
        if(!withdrawProvider)return;
        const providerType = withdrawProvider?.provider_type
        let finalValue = e.target.value;
        let addressVerify
        if(providerType === 'internal_network'){
          const validations = await import("utils/validations");
          addressVerify = validations?.emailValidation(finalValue)
          // console.log('emailValidation', validations?.emailValidation(e.target.value))
        }else{
          let AddressValidator = await import("multicoin-address-validator");
          // finalValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
          const { address_validator_config:{ name, network } } = withdrawProvider
          addressVerify = await AddressValidator.validate(
            finalValue,
            name,
            network || 'testnet'
          );
        }

        if (addressVerify) {
          setInputState("good");
        } else {
          setInputState("bad");
        }
        e.target.value = finalValue;
        break;


      case "amount": // Retiro cripto
      case "spend-amount": // Swap input spend

        if(e.target.value.match(/[^0-9.,]/g)){return e.target.value = e.target.value.replace(/[^0-9.,]/g, "")}
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

         min_amount = props?.minAmount || await _getMinAmount(inputName)
         available = formatToCurrency(props.availableBalance || availableBalance, currentWallet.currency);
        //  console.log('available', availableBalance, currentWallet.currency, available.toString(), value.toString())
         minAmountValidation = value.isGreaterThanOrEqualTo(min_amount)
         availableAmountValidation = value.isLessThanOrEqualTo(available)
        //  debugger

        if (minAmountValidation && availableAmountValidation) {
          setCustomError(null)
          setInputState("good");
          // return e.target.value = value.toFormat();
        } else {
          setInputState("bad");
          ErrorMsgValidate(inputName, e.target.value, min_amount?.toFormat(), minAmountValidation, availableAmountValidation)
        }
        
        return e.target.value = checkIfFiat(currentWallet?.currency) ? value.toFormat() : e.target.value;
        // return e.target.value

        // case 'bought-amount':
        //   const isSecondaryCurrency = currentPair.boughtCurrency === currentPair.secondary_currency
        //   if(!isSecondaryCurrency){return value}
        //   // Validamos que la cantidad gastada spend-amount no supere el monto disponible en la cuenta
        //   availableAmountValidation = await availableSpendAmountValidation()
        //   value = await formatToCurrency(e.target.value.toString().replace(/,/g, ""), currentPair.secondary_currency);
        //   min_amount = getMinAmount(inputName)
        //   minAmountValidation = getMinAmountValidation(inputName, value, min_amount)
        //   // console.log('Moneda secundaria comprada', currentPair.boughtCurrency, 'Cantidad comprada', value.toFormat(), ' Cantidad Mínima:', min_amount.toFormat(), minAmountValidation)
        //   if (minAmountValidation && availableAmountValidation) {
        //     setCustomError(null)
        //     setInputState("good");
        //     // return e.target.value = value.toFormat();
        //   } else {
        //     setInputState("bad");
        //     ErrorMsgValidate(inputName, e.target.value, min_amount.toFormat(), minAmountValidation, availableAmountValidation)
        //   }
        //   return e.target.value = checkIfFiat(currentWallet?.currency) ? value.toFormat() : e.target.value;
        // return
      default:
    }
  };

  // const availableSpendAmountValidation = async() => {
  //   const spend_amount = new FormData(document.getElementById("swapForm")).get("spend-amount");
  //   const spend_amount_value = await formatToCurrency(spend_amount.toString().replace(/,/g, ""), currentWallet.currency);
  //   const available = formatToCurrency(availableBalance, currentWallet.currency);
  //   const availableAmountValidation = spend_amount_value.isLessThanOrEqualTo(available)
  //   return availableAmountValidation
  // }

  const ErrorMsgValidate = (inputName, value, min_amount, minAmountValidation, availableAmountValidation) => {
    if(value.length > 1){
      let errMsg = ""
      switch (inputName) {
        case 'spend-amount': //Swap input
          // const isSecondaryCurrency = currentWallet.currency === currentPair.secondary_currency
          errMsg =
          (!minAmountValidation) ? `El monto mínimo es: ${min_amount}` :
           !availableAmountValidation && `El monto supera el valor disponible en la cuenta`;
          return setCustomError(errMsg)
        case 'amount': //Withdraw cripto input
          errMsg =
          (!minAmountValidation) ? `El monto mínimo es: ${min_amount}` :
           !availableAmountValidation && `El monto supera el valor disponible en la cuenta`;
          return setCustomError(errMsg)
        case 'bought-amount':
          errMsg =
          !minAmountValidation && `El monto mínimo a recibir es: ${min_amount} ${currentPair.secondary_currency}`
          return setCustomError(errMsg)
        default:
      }
    }else{
      setCustomError(null)
    }
  }


  const _getMinAmount = async(inputName) => {
    switch (inputName) { 
      // case 'spend-amount':
      // El min_amount está expresado en la secondary currency, por lo tanto solo validamos el min amount en el input "spend-amount" si la moneda que se gasta (currentWallet) es la secondary_currency
      // Ej, con el par BTC/COP, el min amount está expresado en cop (20.000 cop), solo validaríamos este campo si estamos dentro de la cuenta de cop y vamos a gastar cop para adquirir btc
      // const isSecondaryCurrency = currentWallet.currency === currentPair.secondary_currency
        // return formatToCurrency(isSecondaryCurrency ? currentPair.exchange.min_operation.min_amount : '0', currentWallet.currency);
        // return formatToCurrency(currentPair.exchange.min_operation.min_amount, currentPair.exchange.min_operation.currency);
      
        // case 'amount':
        // const { getMinAmount} = await import('utils/withdrawProvider')
        // const withdrawMinAmount = await getMinAmount(currentWallet.currency])
        // return withdrawMinAmount
      case 'spend-amount':
      // case 'bought-amount': 
      console.log('spend-amount')

        let minAmount = new BigNumber(0)
        const minOperationCurrency = currentPair.exchange.min_operation.currency
        if([minOperationCurrency].includes(currentWallet.currency)){
          minAmount = formatToCurrency(currentPair.exchange.min_operation.min_amount, currentPair.exchange.min_operation.currency);
        }else{ 
          const converted = await _convertCurrencies(currentPair.exchange.min_operation.currency, currentPair.exchange.min_operation.min_amount, currentPair.id);
          const { want_to_spend } = converted
          minAmount = want_to_spend
        }
      return minAmount
      default:
        return
    }
  }

  // const getMinAmountValidation = (inputName, value, min_amount) => {
  //   switch (inputName) {
  //     // case 'spend-amount':
  //     //   const isSecondaryCurrency = currentWallet.currency === currentPair.secondary_currency
  //     //   return isSecondaryCurrency ? value.isGreaterThanOrEqualTo(min_amount) : value.isGreaterThan(min_amount);
  //     case 'spend-amount':
  //     case 'amount':
  //     case 'bought-amount':
  //       return value.isGreaterThanOrEqualTo(min_amount)
  //     default:
  //   }
  // }

  // const debouncedValidateState = debounce(validateState, 100);

  return [inputState, validateState, setInputState, customError];
};

