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

    let lastPrices = await localForage.getItem('pricess')

    if(!lastPrices){
      lastPrices = await this.props.action.get_historical_price()
      if(!lastPrices){return false}
    }

    await localForage.setItem('prices', lastPrices)
    let ctx = document.getElementById('myChart').getContext('2d');

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lastPrices,
            datasets: [{
                label: '_',
                data: lastPrices,
                backgroundColor: 'rgb(43, 55, 66, 0.3)',
                // borderColor: 'rgb(43, 55, 66)',
                borderColor: 'rgb(4, 205, 252)',
                borderWidth: 1,
                steppedLine:'middle',
            }]
        },
        options: {
          layout: {
              padding: {
                  left: -5,
                  right: 0,
                  top: 0,
                  bottom:-30
              }
          },
          tooltips:{
            enabled:false
          },
          // elements: {
          //         line: {
          //             tension: 0.3, // disables bezier curves
          //         }
          //     },
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
          <canvas id="myChart" height="200"></canvas>
        </div>
      </div>
    )

  }


}


function mapStateToProps(state, props){
  // console.log('S T A T E - - - Q U O T E - - - C O N T A I N E R:::', state.model_data.pairs.user_collection)
  return{
    pairs:null
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartCoin)
