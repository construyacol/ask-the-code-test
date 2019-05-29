import React, { Component } from 'react'
import Chart from 'chart.js';
import './chartCoin.css'


class ChartCoin extends Component {

  componentDidMount(){

      let ctx = document.getElementById('myChart').getContext('2d');
      let myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
              datasets: [{
                  label: '_',
                  data: [15, 12, 19, 12, 25, 19, 14, 12, 19, 9, 11, 22, 17, 14, 25, 22, 35],
                  backgroundColor: 'rgb(43, 55, 66, 0.6)',
                  // borderColor: 'rgb(43, 55, 66)',
                  // borderWidth: 2,
                  steppedLine:'middle',
              }]
          },
          options: {
            layout: {
                padding: {
                    left: -5,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            tooltips:{
              enabled:false
            },
            elements: {
                    line: {
                        tension: 0.3, // disables bezier curves
                    }
                },
            legend:{
              display: false
            },
            scales: {
                    xAxes: [{
                      gridLines:{
                        display:false
                      },
                        ticks: {
                          callback: function(value, index, values) {
                              return '';
                          }
                        }
                      }],
                    yAxes: [{
                      gridLines:{
                        display:false
                      },
                        ticks: {
                          callback: function(value, index, values) {
                              return '';
                          }
                        }
                      }],
              }
          }
      });
  }


  render(){

    return(
      <div className="chartCoin">
        <div className="contChartCoin">
          <div className="contChartCoinImg"></div>
          <canvas id="myChart"></canvas>
        </div>
      </div>
    )

  }


}


export default ChartCoin
