import React, { useEffect, useState } from "react";
import Chart from "chart.js";
import { connect } from "react-redux";
import actions from "../../../actions";
import { bindActionCreators } from "redux";
import useViewport from "../../../hooks/useWindowSize";
import moment from "moment";
import "moment/locale/es";
// import localForage from 'localforage'

import "./chartCoin.css";
import useChartData from "../../../hooks/useChartData";
let chart;

const ChartCoin = () => {
  const [lastPrices, setLastPrices] = useState();
  const [loader, setLoader] = useState();
  const { isMovilViewport } = useViewport();
  const [unparsedData] = useChartData();

  const getPrices = async () => {
    if (!unparsedData) return;
    setLoader(true);
    let price_list = [],
      date_list = [];
    const { historical_data } = unparsedData.data;
    if (!historical_data) return setLoader(false);
    let days = historical_data.length - 1;

    for (let data of historical_data) {
      price_list.push(data.close_price);
      date_list.push(moment().subtract(days, "days").calendar());
      days--;
    }

    setLastPrices({ price_list: price_list, date_list });
  };

  useEffect(() => {
    getPrices();
  }, [unparsedData]);

  useEffect(() => {
    if (!isMovilViewport) {
      init_component();
    }
  }, []);

  useEffect(() => {
    if (chart && lastPrices) {
      chart.data.datasets[0].data = lastPrices.price_list;
      chart.data.labels = lastPrices.date_list;
      setTimeout(() => {
        chart.update();
        setLoader(false);
      }, 2000);
    }
  }, [chart, lastPrices]);

  const init_component = async () => {
    // return console.log('|||||||||||||||||||||||||||| GET HISTORICAL DATA ==>', lastPrices, )

    let ctx = document.getElementById("myChart").getContext("2d");

    let gradientStroke = "rgb(4, 205, 252)";
    let gradientFill = "rgb(43, 55, 66, 0.3)";

    // if(this.props.landingView){
    //   gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    //   gradientStroke.addColorStop(1, "#005790");
    //   gradientStroke.addColorStop(0, "#1ea4ff");
    //
    //   gradientFill = ctx.createLinearGradient(0, 30, 0, 350);
    //   gradientFill.addColorStop(1, "rgb(0, 111, 185, 0)");
    //   gradientFill.addColorStop(0, "rgb(30, 164, 255, 0.65)");
    // }else{
    //   gradientStroke = 'rgb(4, 205, 252)'
    //   gradientFill = 'rgb(43, 55, 66, 0.3)'
    // }

    chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Precio",
            data: new Array(45).fill(8000),
            backgroundColor: gradientFill,
            fill: true,
            // backgroundColor: `${this.props.landingView ? gradientFill : 'rgb(43, 55, 66, 0.35)'}`,
            // borderColor: 'rgb(4, 205, 252)',
            borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            borderWidth: 1,
            steppedLine: "middle",
          },
        ],
        labels: new Array(45).fill(8000),
      },
      options: {
        animation: {
          duration: 0, // general animation time
        },
        hover: {
          animationDuration: 300, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        layout: {
          padding: {
            left: -5,
            right: 0,
            top: 0,
            bottom: -30,
          },
        },
        tooltips: {
          enabled: true,
        },
        elements: {
          line: {
            tension: 0,
          },
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: false,
              },
              ticks: {
                callback: function (value, index, values) {
                  return "";
                },
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                callback: function (value, index, values) {
                  return "";
                },
              },
            },
          ],
        },
      },
    });
  };

  return (
    <div className="chartCoin">
      <div className="contChartCoin">
        <div className="contChartCoinImg"></div>
        <canvas
          id="myChart"
          className={`${loader ? "skeleton" : ""}`}
          height="200"
        ></canvas>
      </div>
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(ChartCoin);
