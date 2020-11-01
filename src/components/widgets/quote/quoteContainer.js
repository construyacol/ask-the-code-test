import React, { Component } from 'react'
import QuoteLayout from './quoteLayout'
import { connect } from 'react-redux'
import actions from '../../../actions'
import { bindActionCreators } from 'redux'
import { formatToCurrency } from '../../../utils/convert_currency'
import PropTypes from 'prop-types'
import './quote.css'

class QuoteContainer extends Component {

  state = {
    buy_price: null,
    sell_price: null,
    movil: window.innerWidth < 768 ? true : false
  }

  select_currency = payload => {
    this.props.action.searchCurrentPairAction(payload, 'currency')
  }

  componentDidMount() {
    this.formating_currency()
  }

  formating_currency = async () => {
    const { currentPair } = this.props
    if (!currentPair) { return false }
    let buy_price = await formatToCurrency(currentPair.buy_price, currentPair.secondary_currency, true)
    let sell_price = await formatToCurrency(currentPair.sell_price, currentPair.secondary_currency, true)
    this.setState({
      buy_price,
      sell_price
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.formating_currency()
    }
  }

  switchItem = payload => {
    const action = payload.target.id
    this.props.action.ItemQuoteActive(action)

    this.setState({
      buy: action === 'buy' ? true : false,
      sell: action === 'sell' ? true : false
    })
  }

  render() {
    return (
      <div className="sectionFixedPrice">
            <QuoteLayout
              select_currency={this.select_currency}
              switchItem={this.switchItem}
              {...this.state}
              {...this.props}
            />
      </div>
    )
  }
}

QuoteContainer.propTypes = {
  buy: PropTypes.bool,
  sell: PropTypes.bool,
  loader: PropTypes.bool,
  user_collection: PropTypes.array
}

function mapStateToProps(state, props) {
  return {
    currentPair: state.modelData.pairs.currentPair,
    localCurrency: state.modelData.pairs.localCurrency,
    loader: state.isLoading.loader,
    user_collection: state.modelData.pairs.user_collection,
    buy: state.ui.item_quote.buy,
    sell: state.ui.item_quote.sell
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuoteContainer)
