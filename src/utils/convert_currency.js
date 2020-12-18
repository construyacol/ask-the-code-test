import { store } from "..";
import { currencyFormatByCoin } from "../const/const";

export const formatToCurrency = (n, short_currency, delete_surplus_decimals = true) => {
  const amount = String(n).slice();
  const currency = short_currency.is_token
    ? short_currency.contract_data.token_name
    : short_currency.currency;

  if (delete_surplus_decimals) {
    return currencyFormatByCoin[currency](amount).div("1");
  } else {
    return currencyFormatByCoin[currency](amount);
  }
};

const extractCurrencies = (currencies_instances) => {
  let arr = [];
  currencies_instances.forEach((currency_instance) => {
    let token_name = currency_instance.contract_data
      ? currency_instance.contract_data.token_name
      : null;
    let currency_data = [
      currency_instance.currency,
      currency_instance.is_token,
      token_name,
    ];
    arr.push(JSON.stringify(currency_data));
  });
  return arr;
};

const convertCurrencies = async (currency, amount_spend, pair_id) => {
  let data = {
    to_spend_currency: currency,
    want_to_spend: amount_spend.toString(),
    pair_id: pair_id,
  };

  let objetive_pair_instance = store.getState().modelData.all_pairs[pair_id];

  let to_spend_currency = extractCurrencies([data.to_spend_currency]);
  let primary_objetive_currency = extractCurrencies([
    objetive_pair_instance.primary_currency,
  ]);
  let objetive_data = Object.assign({}, data);

  objetive_data.pair_id = objetive_pair_instance.id;

  // console.log('||||||||||||||||| converter, to_spend_currency', to_spend_currency[0], primary_objetive_currency[0])
  if (to_spend_currency[0] === primary_objetive_currency[0]) {
    // Es una venta
    data.want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.primary_currency);
    objetive_data.to_spend_currency = objetive_pair_instance.secondary_currency;
    //Formateo según la moneda a la que necesito transformar
    let want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.secondary_currency, false);
    objetive_data.want_to_spend = await want_to_spend.multipliedBy(objetive_pair_instance.sell_price).toFormat();
  } else {
    //Es una compra
    data.want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.secondary_currency);
    objetive_data.to_spend_currency = objetive_pair_instance.primary_currency;
    //Formateo según la moneda a la que necesito transformar
    let want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.primary_currency, false);
    objetive_data.want_to_spend = want_to_spend.div(objetive_pair_instance.buy_price).toFormat();
  }
  return objetive_data;
};


export const _convertCurrencies = async (currency, amount_spend, pair_id) => {
  let data = {
    to_spend_currency: currency,
    want_to_spend: amount_spend.toString(),
    pair_id: pair_id,
  };

  let objetive_pair_instance = store.getState().modelData.all_pairs[pair_id];

  let to_spend_currency = JSON.stringify(data.to_spend_currency);
  let primary_objetive_currency = JSON.stringify(objetive_pair_instance.primary_currency);

  let objetive_data = Object.assign({}, data);

  objetive_data.pair_id = objetive_pair_instance.id;
  if (to_spend_currency == primary_objetive_currency){
    // Es una venta
    data.want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.primary_currency);

    objetive_data.to_spend_currency = objetive_pair_instance.secondary_currency;
    //Formateo según la moneda a la que necesito transformar
    let want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.secondary_currency, false);
    objetive_data.want_to_spend = await want_to_spend.multipliedBy(objetive_pair_instance.sell_price).div("1");
  } else {
    //Es una compra
    data.want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.secondary_currency);

    objetive_data.to_spend_currency = objetive_pair_instance.primary_currency;
    //Formateo según la moneda a la que necesito transformar
    let want_to_spend = await formatToCurrency(data.want_to_spend, objetive_pair_instance.primary_currency, false);
    objetive_data.want_to_spend = want_to_spend.div(objetive_pair_instance.buy_price);
  }
  return objetive_data;
};








export default convertCurrencies;
