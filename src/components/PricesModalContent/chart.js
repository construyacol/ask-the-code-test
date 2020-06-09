
import React, { useState, useEffect } from 'react';
import * as Highcharts from 'highcharts/highstock';
import currencyLabels from '../Prices/currency-labels';
import { useCoinsendaServices } from '../../services/useCoinsendaServices';

function ChartComponent(props) {

	const [chartData, setChartData] = useState([])
	const [requestBody, setRequestBody] = useState({
		currency_from: currencyLabels.bitcoin,
		currency_to: currencyLabels.cop,
		amount_days: 60
    })
    const [coinsendaServices] = useCoinsendaServices()

	const getChartData = async () => {
		return;
		const response = await coinsendaServices.fetchChartData({ data: requestBody })
		if (!response.data.data.historical_data) return;
		const data = []
		response.data.data.historical_data.forEach(e => {
			const date = new Date(e['date']).getTime();
			if (!Number.isNaN(date))
				data.push([date, e['close_price']])
		})
		setChartData(data)
	}

	const createChart = () => {
		const moreConfigs = props.width < 900 || props.height < 1366 ? {
			chart: {
				height: props.height / 2
			},
		} : {};

		Highcharts.stockChart('chart', {
			rangeSelector: {
				selected: 1
			},
			navigator: {
				enabled: false
			},
			title: {
				text: ''
			},
			series: [{
				name: '',
				data: chartData,
				color: '#04D499',
				tooltip: {
					valueDecimals: 2
				}
			}],
			...moreConfigs
		});
	}

	useEffect(() => {
		getChartData()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [requestBody])

	useEffect(() => {
		createChart()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chartData])

	useEffect(() => {
		const settings = {
			currency_from: currencyLabels[props.currentPair.primary_currency.currency],
			currency_to: currencyLabels[props.currentPair.secondary_currency.currency],
			amount_days: 45
		}
		setRequestBody(settings)
	}, [props.currentPair])

	return (
		<div id='chart'></div>
	);
}

export default ChartComponent;
