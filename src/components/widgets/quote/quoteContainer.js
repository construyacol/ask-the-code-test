import React, { Component, Fragment } from 'react'
import QuoteLayout from './quoteLayout'
import { connect } from 'react-redux'
import SimpleLoader from '../loaders'
import actions from '../../../actions'
import { bindActionCreators } from 'redux'
import { number_format } from '../../../services'
import './quote.css'

class QuoteContainer extends Component {


  state = {
    buy_price:this.props.pairs.currentPair.buy_price,
    sell_price:this.props.pairs.currentPair.sell_price,
    movil:window.innerWidth < 768 ? true : false
  }

  select_currency = payload => {
    this.props.action.SearchCurrentPair(payload, 'currency')
  }

  componentWillReceiveProps(props){
    let buy
    let sell
    if(props.pairs.currentPair){
       buy = number_format(props.pairs.currentPair.buy_price)
       sell = number_format(props.pairs.currentPair.sell_price)
       this.setState({
         buy_price:buy,
         sell_price:sell
       })
    }
  }

  switchItem = payload =>{
    const action = payload.target.id
    this.props.action.ItemQuoteActive(action)

    this.setState({
      buy:action === 'buy' ? true : false ,
      sell:action === 'sell' ? true : false
    })
  }


  render(){
    // console.log('S T A T E - - - Q U O T E - - - C O N T A I N E R:::', window)

    const { currentPair } = this.props.pairs
    return(
      <Fragment>
        {
          !currentPair ?
          <div className="quoteLoader">
            <SimpleLoader
              label="Cargando Precios"
              color="white"
            />
          </div>
          :
          <QuoteLayout
            select_currency={this.select_currency}
            switchItem={this.switchItem}
            {...this.state}
            {...this.props}
          />
        }
      </Fragment>
    )
  }

}

function mapStateToProps(state, props){
  // console.log('S T A T E - - - Q U O T E - - - C O N T A I N E R:::', state.model_data.pairs.user_collection)
  return{
    pairs:state.model_data.pairs,
    loader:state.isLoading.loader,
    user_collection:state.model_data.pairs.user_collection,
    buy:state.ui.item_quote.buy,
    sell:state.ui.item_quote.sell
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (QuoteContainer)
