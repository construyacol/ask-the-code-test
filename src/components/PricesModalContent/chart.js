import React, { useState, useEffect } from "react";
import * as Highcharts from "highcharts/highstock";
import useChartData from "../../hooks/useChartData";
import { setInputFilter } from "../../utils";
import { chartOptions } from "../../const/const";

function ChartComponent(props) {
  const [chartData, setChartData] = useState([]);
  const [unparsedData, _, name] = useChartData();

  const parseChartData = async () => {
    if (!unparsedData) return;
    const data = [];
    unparsedData.data.historical_data.forEach((e) => {
      const date = new Date(e.date * 1000).getTime();
      if (!Number.isNaN(date)) data.push([date, e["close_price"]]);
    });
    setChartData(data);
  };

  const createChart = () => {
    let moreConfigs =
      props.height < 1366
        ? {
            chart: {
              height: props.height / 2.4,
            },
          }
        : {};

    moreConfigs =
      props.width < 900
        ? {
            chart: {
              height: props.height / 1.7,
            },
          }
        : {};
    Highcharts.setOptions(chartOptions);
    Highcharts.stockChart("chart", {
      navigator: {
        enabled: false,
      },
      title: {
        text: "",
      },
      series: [
        {
          name: name,
          data: chartData,
          color: "#04D499",
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
      rangeSelector: {
        selected: 1,
        inputEnabled: true,
        inputEditDateFormat: "%d/%m/%Y",
        inputDateParser: function (value) {
          value = value.split("/");
          const result = new Date(+value[2], value[1] - 1, +value[0]).getTime();
          return result;
        },
        buttons: [
          {
            type: "week",
            count: 1,
            text: "1s",
          },
          {
            type: "month",
            count: 1,
            text: "1m",
          },
          {
            type: "all",
            text: "Todo",
          },
        ],
      },
      ...moreConfigs,
    });
  };

  useEffect(() => {
    parseChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unparsedData]);

  useEffect(() => {
    createChart();
    setTimeout(() => {
      setInputFilter(document.getElementsByName("min")[0], function (value) {
        return /^\d{0,2}?[/]?\d{0,2}?[/]?\d{0,4}?$/.test(value);
      });
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  return <div id="chart"></div>;
}

export default ChartComponent;
