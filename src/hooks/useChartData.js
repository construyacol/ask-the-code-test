import { useState, useEffect } from "react";
import { useCoinsendaServices } from "../services/useCoinsendaServices";
import currencyLabels from "../components/Prices/currency-labels";
import { selectWithConvertToObjectWithCustomIndex } from '../components/hooks/useTxState'
import { useSelector } from "react-redux";

export default function useChartData() {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))

  const [requestBody, setRequestBody] = useState();
  const [coinsendaServices, { modelData }] = useCoinsendaServices();

  const getData = async () => {
    setLoading(true);
    const res = await coinsendaServices.fetchChartData({ data: requestBody });
    if (!res) return;
    setName(res.data.pair);
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    if(!requestBody) return ;
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestBody]);

  useEffect(() => {
    const currentPair = modelData.pairs.currentPair;
    if (currentPair && currencies) {
      // const currencyTo = currentPair.primary_currency.currency.includes("usd") ? currentPair.secondary_currency.currency : "usd";
      // const settings = {
      //   currency_from: currencyLabels[currentPair.primary_currency.currency],
      //   currency_to: currencyLabels[currencyTo],
      //   amount_days: 45,
      // };
      const primaryCur = currentPair.primary_currency.currency
      const secondaryCur = currentPair.secondary_currency.currency
      const settings = {
          currency_from: currencies[primaryCur]?.symbol,
          currency_to: currencies[secondaryCur]?.symbol,
          amount_days: 45
      }
      setRequestBody(settings);
    }
  }, [modelData.pairs.currentPair, currencies]);

  return [data, isLoading, name];
}
