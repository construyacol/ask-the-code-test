import { useState, useEffect } from "react";
import { useCoinsendaServices } from "../services/useCoinsendaServices";
import currencyLabels from "../components/Prices/currency-labels";

export default function useChartData() {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [requestBody, setRequestBody] = useState({
    currency_from: currencyLabels.bitcoin,
    currency_to: currencyLabels.cop,
    amount_days: 60,
  });
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
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestBody]);

  useEffect(() => {
    const currentPair = modelData.pairs.currentPair;
    if (currentPair) {
      const currencyTo = currentPair.primary_currency.currency.includes("usd")
        ? currentPair.secondary_currency.currency
        : "usd";
      const settings = {
        currency_from: currencyLabels[currentPair.primary_currency.currency],
        currency_to: currencyLabels[currencyTo],
        amount_days: 45,
      };
      setRequestBody(settings);
    }
  }, [modelData.pairs.currentPair]);

  return [data, isLoading, name];
}
