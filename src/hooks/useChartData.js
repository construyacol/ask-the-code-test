import { useState, useEffect } from "react";
import { useCoinsendaServices } from "../services/useCoinsendaServices";
import currencyLabels from "../components/Prices/currency-labels";

export default function useChartData() {
    const [data, setData] = useState();
    const [requestBody, setRequestBody] = useState({
		currency_from: currencyLabels.bitcoin,
		currency_to: currencyLabels.cop,
		amount_days: 60
	})
    const [coinsendaServices, { modelData }] = useCoinsendaServices()

    const getData = async () => {
        const res = await coinsendaServices.fetchChartData({ data: requestBody })
        setData(res)
    }

    useEffect(() => {
        getData()
    }, [requestBody]);

    useEffect(() => {
        const currentPair = modelData.pairs.currentPair
        const currencyTo = currentPair.primary_currency.currency.includes('usd') ?
            currentPair.secondary_currency.currency : 'usd'
		const settings = {
			currency_from: currencyLabels[currentPair.primary_currency.currency],
			currency_to: currencyLabels[currencyTo],
			amount_days: 45
		}
		setRequestBody(settings)
	}, [modelData.pairs.currentPair])

    return [data];
}
