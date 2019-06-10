import React, { Component } from 'react'
import Chart from 'chart.js'
import { connect } from 'react-redux'
import actions from '../../../actions'
import { bindActionCreators } from 'redux'
import localForage from 'localforage'

import './chartCoin.css'


class ChartCoin extends Component {

  componentDidMount(){
    this.init_component()
  }

  init_component = async() => {

    // let lastPrices = await localForage.getItem('prices')
    let lastPrices

    if(!lastPrices){
      lastPrices = await this.props.action.get_historical_price('BTC', 45, '78557cdd8ee21cca98278c189e51b1d2cd859c6ae1bf2992042b61abf7825f41')
      if(!lastPrices){return false}
    }

    await localForage.setItem('prices', lastPrices)

    let ctx = document.getElementById('myChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Precio',
                data: lastPrices.data_price,
                backgroundColor: 'rgb(43, 55, 66, 0.25)',
                borderColor: 'rgb(4, 205, 252)',
                borderWidth: 1,
                steppedLine:'middle'
            }],
            labels: lastPrices.price_date,
        },
        options: {
          animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
          layout: {
              padding: {
                  left: -5,
                  right: 0,
                  top: 0,
                  bottom:-30
              }
          },
          tooltips:{
            enabled:true
          },
          elements: {
                  line: {
                      tension: 0,
                  }
              },
          legend:{
            display: false
          },
          scales: {
                  xAxes: [{
                    stacked: true,
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

    // console.log('this.props ChartCoin||||| ================>', this.props)

    return(
      <div className="chartCoin">
        <div className="contChartCoin">
          <div className="contChartCoinImg"></div>
          <canvas id="myChart" height="200"></canvas>
        </div>
      </div>
    )

  }


}


function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(ChartCoin)
