
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
		const response = await coinsendaServices.fetchChartData({ data: requestBody })
		if (!response) return;
		const data = []
		response.data.historical_data.forEach(e => {
			const date = new Date(e['date']).getTime();
			if (!Number.isNaN(date))
				data.push([date, e['close_price']])
		})
		setChartData(data)
	}

	const createChart = () => {
		let moreConfigs = props.height < 1366 ? {
			chart: {
				height: props.height / 2.4
			},
		} : {};

		moreConfigs = props.width < 900 ?
			{
				chart: {
					height: props.height / 1.7
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
