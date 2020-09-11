import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { formatToCurrency } from '../../../utils/convert_currency'

import './index.css'

const BalanceComponent = ({ balance, currency, currency_type }) => {
  const [current_amount, set_current_amount] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [animation, setAnimation] = useState(null)

  useEffect(() => {
    if (balance) {
      let current_amount = formatToCurrency(balance.available, currency, true)
      set_current_amount(current_amount)
      exec_operation()
    }
  }, [balance])

  const exec_operation = async () => {
    const {
      lastAction,
      actionAmount,
      available
    } = balance

    if (actionAmount) {
      // el actionAmount es la cantidad a reducir o sumar de la operación, solo con fines de dar feedback visual al usuario, no es indispensable para su funcionalidad
      let actionAmountFormat = await formatToCurrency(actionAmount, currency, true)
      await play_animation('Out')

      setActionType(lastAction)
      set_current_amount(actionAmountFormat)
      await play_animation('In')
    }

    let availableAmount = await formatToCurrency(available, currency, true)
    await dead_time()
    await play_animation('Out')

    setActionType(null)
    set_current_amount(availableAmount)
    await play_animation('In')
  }

  const dead_time = async anim => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        return resolve(true)
      }, 1000)
    })
  }

  const play_animation = async anim => {
    return new Promise(async (resolve) => {
      setAnimation(anim)
      setTimeout(async () => {
        return resolve(true)
      }, 250)
    })
  }
  
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
