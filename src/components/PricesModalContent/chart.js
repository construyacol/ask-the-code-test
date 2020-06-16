
import React, { useState, useEffect } from 'react';
import * as Highcharts from 'highcharts/highstock';
import useChartData from '../../hooks/useChartData';

function ChartComponent(props) {
	const [chartData, setChartData] = useState([])
	const [unparsedData] = useChartData();
	

	const parseChartData = async () => {
		if (!unparsedData) return;
		const data = []
		unparsedData.data.historical_data.forEach(e => {
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
		parseChartData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unparsedData])

	useEffect(() => {
		createChart()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chartData])

	return (
		<div id='chart'></div>
	);
}

export default ChartComponent;
