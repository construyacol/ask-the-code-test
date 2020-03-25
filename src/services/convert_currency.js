import { BigNumber } from "bignumber.js"
import store from '../'

  export const formatToCurrency = async(n, short_currency, toFormat, delete_surplus_decimals = true) =>{


    let config = {
      "bitcoin":BigNumber.clone({ROUNDING_MODE:BigNumber.ROUND_HALF_UP, DECIMAL_PLACES:8}),
      "bitcoin_testnet":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_HALF_UP, DECIMAL_PLACES: 8}),
      "usd":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_HALF_UP, DECIMAL_PLACES: 3}),
      "ethereum":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_HALF_UP, DECIMAL_PLACES: 8}),
      "cop":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_HALF_UP, DECIMAL_PLACES: 3}),
      "bitcoin_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 6}),
      "bitcoin_testnet_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 6}),
      "usd_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 2}),
      "ethereum_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 6}),
      "cop_fee":BigNumber.clone({ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 0})
    }


    let amount = String(n).slice();

    let currency
    if (short_currency.is_token){
      currency = short_currency.contract_data.token_name;
    } else {
      currency = short_currency.currency;
    }

    // return console.log('PROOF FUNCTION', config[currency])

    if (delete_surplus_decimals){
      if(toFormat){
        return  config[currency](amount).div("1").toFormat();
      }
      return  config[currency](amount).div("1");
    } else {
      return  config[currency](amount);
    }

  }



  const extractCurrencies = (currencies_instances) =>{
      let arr = [];
      currencies_instances.forEach((currency_instance) => {
        let token_name = currency_instance.contract_data ? currency_instance.contract_data.token_name : null;
        let currency_data = [currency_instance.currency, currency_instance.is_token, token_name];
        arr.push(JSON.stringify(currency_data));
      });
      return arr;
    }





  const convertCurrencies = async(currency, amount_spend, pair_id) => {

    let data = {
       "to_spend_currency":currency,
       "want_to_spend":amount_spend.toString(),
       "pair_id":pair_id
     }

    let objetive_pair_instance = store.getState().modelData.all_pairs[pair_id]

    let to_spend_currency = extractCurrencies([data.to_spend_currency]);
    let primary_objetive_currency = extractCurrencies([objetive_pair_instance.primary_currency]);
    let objetive_data = Object.assign({}, data);

    objetive_data.pair_id = objetive_pair_instance.id;

    // console.log('||||||||||||||||| converter, to_spend_currency', to_spend_currency[0], primary_objetive_currency[0])
    if (to_spend_currency[0] === primary_objetive_currency[0]){
      // Es una venta
      data.want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.primary_currency);

      objetive_data.to_spend_currency = objetive_pair_instance.secondary_currency;
      //Formateo según la moneda a la que necesito transformar
      let want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.secondary_currency, false);
      objetive_data.want_to_spend = await want_to_spend.multipliedBy(objetive_pair_instance.sell_price).toFormat();
    }
    else {
      // console.log('Es una compra')
      //Es una compra
      data.want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.secondary_currency);

      objetive_data.to_spend_currency = objetive_pair_instance.primary_currency;

      //Formateo según la moneda a la que necesito transformar
      let want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.primary_currency, false);

      objetive_data.want_to_spend = want_to_spend.div(objetive_pair_instance.buy_price).toFormat();
    }
    // console.log(objetive_data)
    // alert('alert')
    return objetive_data;
  }

  export default convertCurrencies
