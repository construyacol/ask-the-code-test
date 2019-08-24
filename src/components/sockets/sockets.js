import { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import io from 'socket.io-client'
import Environtment from '../../environment'
import { objectToArray } from '../../services'
const { SocketUrl } = Environtment




class SocketsComponent extends Component {

  state = {
    currentSwap:null,
    currentDeposit:null,
    currentWithdraw:null
  }


  componentDidUpdate(prevProps) {
  if (this.props.loggedIn !== prevProps.loggedIn) {

    if(this.props.loggedIn){


      const socket = io(SocketUrl)
      const { user } = this.props

      let tryReconnect = () =>{
        if (socket.connected === false) {
          socket.connect()
        }
      }

      let intervalID = setInterval(tryReconnect, 2000)
      socket.on('disconnect', async function() {
        intervalID = setInterval(tryReconnect, 2000)
      });


      socket.on("connect", ()=>{
        clearInterval(intervalID)
        const body = {body:{access_token:user.TokenUser}}
        socket.emit('authentication', body);


        socket.on("authenticated", () => {

          socket.on(`/swaps/${user.id}`, async(swap)=>{
            if(swap.state === 'pending'){
              this.setState({currentSwap:swap})
            }else{
              this.swapUpdate(swap)
            }
          })

          socket.on(`/deposit/${user.id}`, async(deposit)=>{
            // DEPOSITO CRIPTO ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            if(deposit.state === 'pending' && deposit.currency_type === 'crypto'){
              this.setState({currentDeposit:deposit})
            }else{
              this.deposit_mangagement(deposit)
            }

          })

          socket.on(`/withdraw/${user.id}`, async(withdraw)=>{
            // console.log('||||||||||||||||||| __________________________________withdraw', withdraw)
            if(withdraw.state === 'pending' && withdraw.currency_type === 'crypto'){
              this.setState({currentWithdraw:withdraw})
            }

            // if(withdraw.state === 'accepted' && this.state.currentWithdraw.id === withdraw.id){
            //
            // setTimeout(async()=>{
            //   console.log('||||||||||||||||||| __________________________________withdraw ===> ', withdraw.id)
            //   let withdraw_array = await objectToArray(this.props.withdrawals)
            //   let search_by = {
            //     name:"id",
            //     id:withdraw.id
            //   }
            //   let replace_prop = {
            //     name:"state",
            //     state:"accepted"
            //   }
            //   await this.props.action.edit_array_element(search_by, replace_prop, withdraw_array, true, 'withdrawals')
            //   // await this.props.action.get_withdraw_list(this.props.user)
            //   await this.props.action.update_activity_account(this.props.withdrawals[withdraw.id].account_id, 'withdrawals')
            //   await this.props.action.update_pending_activity(this.props.withdrawals[withdraw.id].account_id, 'withdrawals')
            //   this.props.action.success_sound()
            // }, 3000)
            // }

          })






        })
      })

    }

  }
}



























 deposit_mangagement = async deposit => {


   if(deposit.state === 'confirmed' && this.state.currentDeposit && this.state.currentDeposit.currency_type === 'crypto'){
     // Si el deposito confirmado de tipo cripto no existe, lo agregamos

     if(!this.props.deposits[deposit.id]){
       const { currentDeposit } = this.state
       this.props.action.AddNotification('wallets', {account_id:currentDeposit.account_id, order_id:currentDeposit.id}, 1)
       await this.props.action.get_deposit_list(this.props.user)
       await this.props.action.update_activity_account(currentDeposit.account_id, 'deposits')
       await this.props.action.update_pending_activity(currentDeposit.account_id, 'deposits')
       await this.props.action.socket_notify({...currentDeposit, state:'confirmed'}, 'deposit')
       this.props.action.other_modal_toggle()
       this.props.action.success_sound()
       setTimeout(()=>{ this.props.action.add_coin_sound()}, 1500)
     }

   }


   if(deposit.state === 'accepted'){
     // console.log('|||||||| _______________________________________DEPOSIT SOCKET', this.props.deposits[deposit.id])
     this.props.action.AddNotification('wallets', {account_id:this.props.deposits[deposit.id].account_id, order_id:deposit.id}, 1)
     let deposit_array = await objectToArray(this.props.deposits)
     let search_by = {
       name:"id",
       id:deposit.id
     }
     let replace_prop = {
       name:"state",
       state:"accepted"
     }
     await this.props.action.edit_array_element(search_by, replace_prop, deposit_array, true)
     await this.props.action.update_activity_account(this.props.deposits[deposit.id].account_id, 'deposits')
     await this.props.action.update_pending_activity(this.props.deposits[deposit.id].account_id, 'deposits')
     this.props.action.get_account_balances(this.props.user)
     await this.props.action.socket_notify(this.props.deposits[deposit.id], 'deposit')
     this.props.action.other_modal_toggle()
     this.props.action.success_sound()
     setTimeout(()=>{ this.props.action.add_coin_sound()}, 1500)
   }



   // if(deposit.state === 'confirmed' && this.props.deposits[deposit.id] && this.props.deposits[deposit.id].currency_type === 'crypto'){
   //     // Si ya existe el deposito confirmado cripto, actualizamos el # de confirmaciones
   //     // let deposit_array = await objectToArray(this.props.deposits)
   //     // let search_by = {
   //     //   name:"id",
   //     //   id:deposit.id
   //     // }
   //     // let replace_prop = {
   //     //   name:"confirmations",
   //     //   confirmations:this.props.deposits[deposit.id].confirmations
   //     // }
   //     // await this.props.action.edit_array_element(search_by, replace_prop, deposit_array, true)
   //     await this.props.action.get_deposit_list(this.props.user)
   //     await this.props.action.update_activity_account(this.props.deposits[deposit.id].account_id, 'deposits')
   //     await this.props.action.update_pending_activity(this.props.deposits[deposit.id].account_id, 'deposits')
   //     this.props.action.success_sound()
   // }

 }






















  swapUpdate = async(swap) => {

    if(swap.state === 'accepted' && this.state.currentSwap.state !== 'done'){
      const { currentSwap } = this.state
      // console.log('________________________swapUpdate', currentSwap)
      await this.props.action.current_section_params({swap_socket_channel:{...currentSwap, state:'processing'}})

      return setTimeout(async()=>{
        await this.props.action.success_sound()
        await this.props.action.current_section_params({swap_socket_channel:{...currentSwap, state:'done'}, swap_done_id:currentSwap.id, swap_done_out:true})
        await this.props.action.swap_activity_update(currentSwap, 'swaps')
        await this.setState({currentSwap:{...currentSwap, state:'done'}})

          setTimeout(async()=>{
            await this.props.action.current_section_params({active_trade_operation:false})
            await this.props.action.ManageBalance(currentSwap.account_from, 'reduce', currentSwap.spent)
            setTimeout(async()=>{
              // await  this.props.action.get_swap_list()
              // await  this.props.action.update_pending_activity(currentSwap.account_from, 'swaps')
            },3000)
          },4000)
      }, 3500)
    }

    if(swap.status === 'error'){
       this.props.action.mensaje('El intercambio no se pudo realizar, contacta con soporte', 'error')
       this.props.action.ticket_canceled()
       // this.props.action.current_section_params({swap_socket_channel:this.state.currentSwap})
    }

  }

  render(){
    return null;
  }
}

const mapStateToProps = (state, props) =>{

  const { loggedIn } = state.auth
  const { user, user_id, deposits, withdrawals } = state.model_data

  return{
    loggedIn,
    user:user && user[user_id],
    deposits,
    withdrawals
  }

}


const mapDispatchToProps = (dispatch) =>{
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default  connect(mapStateToProps, mapDispatchToProps) (SocketsComponent)
