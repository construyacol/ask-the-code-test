import { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import io from 'socket.io-client'
import Environtment from '../../environment'
// import { objectToArray } from '../../services'
import { withRouter } from "react-router";
const { SocketUrl } = Environtment
let add_swap


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
        const body = {body:{access_token:user.userToken}}
        socket.emit('authentication', body);


        socket.on("authenticated", () => {

          socket.on(`/swap/${user.id}`, async(swap)=>{
            if(swap.state === 'pending'){
              await this.setState({currentSwap:swap})
            }
            this.swap_management(swap)
          })

          socket.on(`/deposit/${user.id}`, async(deposit)=>{
            // DEPOSITO CRIPTO ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            if(deposit.state === 'pending' && deposit.currency_type === 'crypto'){
              await this.setState({currentDeposit:deposit})
            }else{
              this.deposit_mangagement(deposit)
            }

            // if(deposit.state === 'rejected' || deposit.state === 'canceled'){
            //   this.deposit_mangagement(deposit)
            // }


          })

          socket.on(`/withdraw/${user.id}`, async(withdraw)=>{


            if(withdraw.state === 'pending'){
              await this.setState({currentWithdraw:withdraw})
            }
            this.withdraw_mangagement(withdraw)

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
            //   await this.props.action.update_activity_state(this.props.withdrawals[withdraw.id].account_id, 'withdrawals')
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




withdraw_mangagement = async (withdraw) => {

  // console.log('||||||||||||||||||| )======)>>>> WITHDRAW == ', withdraw)
  // this.props.action.success_sound()


  // proof withdraw fiat/cripto
  if(withdraw.proof){

    if(!this.props.withdraws || (this.props.withdraws && !this.props.withdraws[withdraw.id])){
      let cWithdraw = await this.props.action.get_order_by_id(withdraw.id, 'withdraws')
      await this.props.action.get_withdraws(cWithdraw.account_id)
    }

    if(this.props.withdraws && this.props.withdraws[withdraw.id]){
      await this.props.action.update_item_state({[withdraw.id]:{...this.props.withdraws[withdraw.id], proof:withdraw.proof, sent:true, state:"accepted"}}, 'withdraws')
      await this.props.action.update_activity_state(this.props.withdraws[withdraw.id].account_id, 'withdraws')
      this.props.action.AddNotification('wallets', {account_id:this.props.withdraws[withdraw.id].account_id, order_id:withdraw.id}, 1)
      await this.props.action.socket_notify(this.props.withdraws[withdraw.id], 'withdraws')
      this.props.action.other_modal_toggle()
      this.props.action.success_sound()
    }
    // await this.props.action.get_account_id_by_withdraw_id(withdraw.id)
  }

  if(withdraw.state === 'pending' && withdraw.currency_type === 'crypto'){

    let res = await this.props.action.add_update_withdraw(withdraw.id, 'confirmed')
    if(!res){
      this.props.action.Loader(false)
      return this.props.action.mensaje('No se ha podido crear la orden de retiro', 'error')
    }
  }


  const { currentWithdraw } = this.state
  // console.log('|||||||||||||||||||||||||||||||||||  Withdraw SOCKET ==>', withdraw.state, ' == ', withdraw.id, ' ==> ', currentWithdraw)

  if(withdraw.state === 'confirmed' && currentWithdraw.currency_type === 'crypto'){
    // console.log('========> RESPUESTA ENDPOINT RETIRO', new_withdraw_model

    let new_withdraw_model = {
      id:currentWithdraw.id,
      unique_id:currentWithdraw.id,
      type_order:'withdraw',
      account_id:currentWithdraw.account_id,
      ...currentWithdraw,
      state:"confirmed"
    }

    // console.log('°°=°=°=°==°=°=°=°=°=°==°=°=°=°=°=°=°=°==°=°=°==°=°=°=°  WITHDRAW CONFIRMED ==>', this.props.user)

    await this.props.action.add_item_state('withdraws', new_withdraw_model)
    await this.props.action.update_activity_state(new_withdraw_model.account_id, 'withdraws')
    await this.props.action.ManageBalance(new_withdraw_model.account_id, 'reduce', new_withdraw_model.amount)
    await this.props.action.Loader(false)
    this.props.action.add_new_transaction_animation()
    this.props.action.get_account_balances(this.props.user)
    this.props.history.push(`/wallets/activity/${new_withdraw_model.account_id}/withdraws`)
  }




  if(withdraw.state === 'accepted' && currentWithdraw.currency_type === 'fiat'){

    let new_order = this.state.currentWithdraw

    let new_withdraw = {
      account_id:new_order.account_id,
      amount:new_order.amount,
      amount_neto:new_order.amount_neto,
      comment:"",
      country:new_order.country,
      currency:new_order.currency,
      currency_type:new_order.currency_type,
      cost:new_order.cost,
      cost_struct:new_order.cost_struct,
      deposit_provider_id:"",
      expiration_date:new Date(),
      id:new_order.id,
      state:"confirmed",
      sent:false,
      unique_id:new_order.id,
      userId:new_order.userId,
      withdraw_account:new_order.withdraw_account_id,
      withdraw_provider:new_order.withdraw_provider_id,
      type_order:"withdraw",
    }

    await this.props.action.add_item_state('withdraws', new_withdraw)
    // await this.props.action.update_item_state({[new_withdraw.id]:new_withdraw}, 'withdraws')
    await this.props.action.update_activity_state(new_withdraw.account_id, 'withdraws')
    // await this.props.history.push(`/wallets/activity/${new_withdraw.account_id}/withdraws`)
    this.props.action.add_new_transaction_animation()
  }







  // if(withdraw.metadata && !withdraw.state){
  //   // alert('withdraw socket')
  //
  //     const { userId } = withdraw
  //     let fiat_accounts = await this.props.action.get_fiat_accounts_by_userId(userId)
  //     if(!fiat_accounts){return false}
  //
  //     for (let i = 0; i < fiat_accounts.length; i++) {
  //       if(fiat_accounts[i].currency.currency !== 'usd'){
  //         const { activity_for_account } = this.props
  //         if(activity_for_account[fiat_accounts[i].id] && activity_for_account[fiat_accounts[i].id].withdraws){return false}
  //         await this.props.action.get_withdraws(fiat_accounts[i].id, 'withdraws')
  //       }
  //     }
  //     this.props.action.mensaje('Retiro(s) ha(n) sido enviado(s) a tu cuenta bancaria.', 'success')
  //     this.props.action.success_sound()
  //
  // }


}

























 deposit_mangagement = async deposit => {

   // console.log('|||||||| _______________________________________DEPOSIT SOCKET', deposit)
   // this.props.action.success_sound()

   if(deposit.state === 'pending' && deposit.currency_type === 'fiat'){
     await this.props.action.add_item_state('deposits', {...deposit, type_order:'deposit'})
     await this.props.action.update_activity_state(deposit.account_id, 'deposits')
   }

   // if(deposit.state === 'confirmed' && (this.state.currentDeposit && this.state.currentDeposit.currency_type === 'crypto')){
   if(deposit.state === 'confirmed'){

     if(!this.props.deposits || (this.props.deposits && !this.props.deposits[deposit.id])){
       let cDeposit = await this.props.action.get_one_deposit(deposit.id)

       if(this.props.activity_for_account[cDeposit.account_id] && this.props.activity_for_account[cDeposit.account_id].deposits){
         await this.props.action.add_item_state('deposits', {...cDeposit, type_order:'deposit'})
         await this.props.action.update_activity_state(cDeposit.account_id, 'deposits')
         console.log('======================================> ESTA CUENTA SI TIENE DEPOSITOS, MANUAL ADD ', this.props.deposits[deposit.id], cDeposit)
       }else{
         await this.props.action.get_deposits(cDeposit.account_id)
         console.log('======================================> ESTA CUENTA NO TIENE DEPOSITOS, GET DEPOSITS ', this.props.deposits[deposit.id], cDeposit)
       }

       // console.log('======================================> DEPOSIT SOCKET ', cDeposit, this.props.activity_for_account[cDeposit.account_id])
       this.props.action.AddNotification('wallets', {account_id:cDeposit.account_id, order_id:cDeposit.id}, 1)
       await this.props.action.socket_notify({...cDeposit, state:'confirmed'}, 'deposits', 'Nuevo deposito detectado')
       this.props.action.other_modal_toggle()
       this.props.action.success_sound()
       setTimeout(()=>{ this.props.action.add_coin_sound()}, 1500)
     }



   }

   if(deposit.confirmations){
     if(!this.props.deposits || (this.props.deposits && !this.props.deposits[deposit.id])){
       let cDeposit = await this.props.action.get_order_by_id(deposit.id, 'deposits')
       await this.props.action.get_deposits(cDeposit.account_id)
       // console.log('=============> DEPOSIT SOCKET ', cDeposit)
     }

     if(this.props.deposits && this.props.deposits[deposit.id]){
       await this.props.action.update_item_state({[deposit.id]:{...this.props.deposits[deposit.id], confirmations:deposit.confirmations}}, 'deposits')
       await this.props.action.update_activity_state(this.props.deposits[deposit.id].account_id, 'deposits')
     }
   }


   if(deposit.state === 'accepted'){

     if(!this.props.deposits || (this.props.deposits && !this.props.deposits[deposit.id])){
       let cDeposit = await this.props.action.get_order_by_id(deposit.id, 'deposits')
       await this.props.action.get_deposits(cDeposit.account_id)
       // console.log('=============> DEPOSIT SOCKET ', cDeposit)
     }

     if(this.props.deposits && this.props.deposits[deposit.id]){

       this.props.action.AddNotification('wallets', {account_id:this.props.deposits[deposit.id].account_id, order_id:deposit.id}, 1)
       await this.props.action.update_item_state({[deposit.id]:{...this.props.deposits[deposit.id], state:deposit.state}}, 'deposits')
       await this.props.action.update_activity_state(this.props.deposits[deposit.id].account_id, 'deposits')
       this.props.action.get_account_balances(this.props.user)
       await this.props.action.socket_notify(this.props.deposits[deposit.id], 'deposits')
       this.props.action.other_modal_toggle()
       this.props.action.success_sound()
       setTimeout(()=>{ this.props.action.add_coin_sound()}, 1500)

     }

   }



   if(deposit.state === 'rejected' || deposit.state === 'canceled'){
     if(this.props.deposits[deposit.id].state === 'canceled'){return false}
     // setTimeout(async()=>{
       // Tiempo para que transcurra la animación del item
       await this.props.action.update_item_state({[deposit.id]:{...this.props.deposits[deposit.id], state:deposit.state}}, 'deposits')
       await this.props.action.update_activity_state(this.props.deposits[deposit.id].account_id, 'deposits')
       this.props.action.exit_sound()
       let state = deposit.state === 'canceled' ? 'cancelado' : 'rechazado'
       this.props.action.mensaje(`Deposito ${state}`, 'error')
     // }, 2000)
   }


   if(deposit.state === 'confirmed'){
     // console.log('deposito confirmado fiat')
     if((this.props.deposits && this.props.deposits[deposit.id]) && this.props.deposits[deposit.id].currency_type === 'fiat'){
       await this.props.action.update_item_state({[deposit.id]:{...this.props.deposits[deposit.id], state:deposit.state}}, 'deposits')
       await this.props.action.update_activity_state(this.props.deposits[deposit.id].account_id, 'deposits')
       this.props.action.get_account_balances(this.props.user)
       this.props.history.push('?form=deposit_confirmed_success')
     }
   }



 }






















  swap_management = async(swap) => {

    // console.log('||||||||||||||||||||||||||||| ===========> SOCKET SWAP => ', swap.state, '  ==>  ', swap, this.props)

    if(swap.state === 'pending'){
      await this.props.action.current_section_params({active_trade_operation:true})
      // el bought lo retorna el socket en el estado aceptado
      let new_swap = swap

      add_swap = {
        account_id: new_swap.account_from,
        account_to: new_swap.account_to,
        action_price: new_swap.action_price,
        amount: '--',
        amount_neto: "",
        bought: '--',
        comment: "",
        currency: new_swap.to_spend_currency,
        currency_bought:new_swap.to_buy_currency,
        // currency_type:current_wallet.currency_type,
        deposit_cost: "",
        deposit_provider_id: "",
        expiration_date:new Date(),
        id:new_swap.id,
        unique_id:new_swap.id,
        spent: new_swap.spent,
        state:new_swap.state,
        type_order: "swap"
      }
      // console.log(' ||||||||||||||| NEW SWAP  =====> ', {[add_swap.id]:{...add_swap, state:add_swap.state}})
      // await this.props.action.update_item_state({[add_swap.id]:{...add_swap, state:add_swap.state}}, 'swaps')

      await this.props.action.add_item_state('swaps', add_swap)
      await this.props.action.update_activity_state(new_swap.account_from, 'swaps')
      await this.props.action.add_new_transaction_animation()
      this.props.action.Loader(false)
      return this.props.history.push(`/wallets/activity/${new_swap.account_from}/swaps`)
    }


    if(swap.state === 'accepted' && this.state.currentSwap.state !== 'done'){
      const { currentSwap } = this.state
      // console.log('________________________swap_ accepted', swap)
      // await this.props.action.update_activity_state(this.props.withdraws[withdraw.id].account_id, 'withdraws')

      await this.props.action.current_section_params({swap_socket_channel:{...currentSwap, state:'processing'}})

      return setTimeout(async()=>{
        await this.props.action.success_sound()
        await this.props.action.current_section_params({swap_socket_channel:{...currentSwap, state:'done'}, swap_done_id:currentSwap.id, swap_done_out:true})
        await this.props.action.swap_activity_update({...currentSwap, bought:swap.bought}, 'swaps')
        await this.setState({currentSwap:{...currentSwap, state:'done'}})

          setTimeout(async()=>{
            await this.props.action.current_section_params({active_trade_operation:false})
            await this.props.action.ManageBalance(currentSwap.account_from, 'reduce', currentSwap.spent)
            setTimeout(async()=>{
              // await this.props.action.update_item_state({[swap.id]:{...add_swap, bought:swap.bought}}, 'swaps')
              // await this.props.action.update_activity_state(currentSwap.account_from, 'swaps')

              // await  this.props.action.getSwapList()
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
  // console.log('||||||||||||||||||||||||||||||||||||||||||||| ======>>> props Sockets ==> ', props)

  const { loggedIn } = state.auth
  const { user, user_id, deposits, withdraws } = state.modelData

  return{
    loggedIn,
    user:user && user[user_id],
    deposits,
    withdraws,
    activity_for_account:state.storage.activity_for_account
  }

}


const mapDispatchToProps = (dispatch) =>{
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default  withRouter(connect(mapStateToProps, mapDispatchToProps) (SocketsComponent))
