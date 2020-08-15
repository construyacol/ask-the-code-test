import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { formatToCurrency } from '../../../utils/convert_currency'

import './index.css'


class BalanceComponent extends Component {


  state = {
    current_amount: null,
    lastAction: this.props.balance && this.props.balance.lastAction,
    actionType: null,
    animation: null
  }

  componentDidMount() {
    const convertCurrentAmount = async () => {
      let current_amount = await formatToCurrency(this.props.balance.available, this.props.currency, true)
      this.setState({ current_amount })
    }
    convertCurrentAmount()
  }


  componentDidUpdate(prevProps) {
    if (this.props.balance !== prevProps.balance) {
      this.setState({ balance: this.props.balance })
      this.exec_operation(this.props.balance)
    }
  }

  exec_operation = async balance => {

    const {
      lastAction,
      actionAmount,
      available
    } = balance

    if (actionAmount) {
      // el actionAmount es la cantidad a reducir o sumar de la operación, solo con fines de dar feedback visual al usuario, no es indispensable para su funcionalidad
      let actionAmountFormat = await formatToCurrency(actionAmount, this.props.currency, true)
      await this.play_animation('Out')
      await this.setState({
        actionType: lastAction,
        current_amount: actionAmountFormat,
      })
      await this.play_animation('In')
    }

    let availableAmount = await formatToCurrency(available, this.props.currency, true)
    await this.dead_time()
    await this.play_animation('Out')
    await this.setState({
      actionType: null,
      current_amount: availableAmount,
    })
    await this.play_animation('In')
  }

  dead_time = async anim => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        return resolve(true)
      }, 1000)
    })
  }

  play_animation = async anim => {
    return new Promise(async (resolve, reject) => {
      await this.setState({ animation: anim })
      setTimeout(async () => {
        return resolve(true)
      }, 250)
    })
  }


  render() {

    const {
      current_amount,
      actionType,
      animation
    } = this.state

    const {
      currency_type
    } = this.props

    return (
      <div className="BalanceComponent wallet">
        <p className="fuente title balanceTitle">Balance </p>

        <div className={`displayCont itt ${animation}`}>
          <p
            className={`textin fuente2 ${actionType === 'reduce' ? 'reduce' :
              actionType === 'add' ? 'add' : ''}`}>

            {actionType === 'reduce' ? '-' : actionType === 'add' ? '+' : ''}
            {
              currency_type === 'fiat' ?
                `$${current_amount}`
                :
                current_amount
            }

          </p>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const {
    balances,
    user
  } = state.modelData

  const {
    account_id
  } = props

  return {
    balance: balances && balances[account_id],
    user: user,
    currency_type: state.modelData.wallets[account_id].currency_type,
    currency: state.modelData.wallets[account_id].currency
  }
}


function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(BalanceComponent)
