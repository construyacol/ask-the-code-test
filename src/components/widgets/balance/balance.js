import React, { Component }  from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'

import './index.css'


class BalanceComponent extends Component {


  state = {
    balance:this.props.balance,
    current_amount:this.props.balance.available,
    lastAction:this.props.balance && this.props.balance.lastAction,
    actionType:null,
    animation:null
  }


  componentWillReceiveProps(props){
    const{
      balance
    } = props

    if(this.state.balance === balance){return false}
    this.setState({balance})
    this.exec_operation(balance)

  }

  exec_operation = async balance => {

    const{
      lastAction,
      actionAmount
    } = balance

    if(actionAmount){
        await this.play_animation('Out')
        await this.setState({
          actionType:lastAction,
          current_amount:actionAmount ? actionAmount : balance.available,
        })
        await this.play_animation('In')
    }

      await this.dead_time()
      await this.play_animation('Out')
      await this.setState({
        actionType:null,
        current_amount:balance.available,
      })
      await this.play_animation('In')
      this.setState({animation:null})
    // await this.props.action.get_list_user_wallets(this.props.user)
    // await this.props.action.get_account_balances(this.props.user)
  }

  dead_time = async anim =>{
      return new Promise(async(resolve, reject)=>{
        setTimeout(async()=>{
          return resolve(true)
        }, 1000)
      })
  }

  play_animation = async anim =>{
      return new Promise(async(resolve, reject)=>{
        await this.setState({animation:anim})
        setTimeout(async()=>{
          return resolve(true)
        }, 250)
      })
  }


  render(){

    const{
      balance,
      current_amount,
      lastAction,
      actionType,
      animation
    } = this.state

    // console.log('|||||| BALANCE: ', balance)

    return(
      <div className="BalanceComponent wallet">
        <p className="fuente title balanceTitle">Balance </p>

        <div className={`displayCont itt ${animation}`}>
          <p
            className={`textin fuente2 ${actionType === 'reduce' ? 'reduce':
                                  actionType === 'add' ? 'add': ''}`}>

            {actionType === 'reduce' ? '-' : actionType === 'add' ? '+' : '' }
            {current_amount}

          </p>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props){

  const{
    balances,
    user,
    user_id
  } = state.model_data

  const{
    account_id
  } = props

  // console.log('|||||||||||||| mapStateToProps', balances && balances[account_id])

  return{
    balance:balances && balances[account_id],
    user:user[user_id]
  }
}


function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (BalanceComponent)
