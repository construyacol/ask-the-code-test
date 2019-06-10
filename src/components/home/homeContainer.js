import React, { Component, Fragment} from 'react'
import HomeLayout from './homeLayout'
import MenuPrincipalContainer from '../menuPrincipal/menuPrincipalContainer'
import MenuSuperiorContainer from '../menuSuperior/menuSuperiorContainer'
import ModalContainer from '../widgets/modal/modalContainer.js'
import ModalLayout from '../widgets/modal/modallayout'
import DashBoardContainer from '../dashBoard/dashBoardContainer'
import NewWallet from '../wallets/newWallet/newWalletContainer'
import WithdrawAccountForm from '../withdrawAccounts/new/withdrawAccountForm'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ToastContainers from '../widgets/toast/ToastContainer'
import DepositContainer from '../wallets/deposit/depositContainer'
import actions from '../../actions'
import Kyc from '../kyc/kyc_container'
// import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Router, Route, Switch } from 'react-router-dom'
import Environtment from '../../environment'
import ConfirmationModal from '../widgets/modal/confirmation'
import PairList from "../wallets/views/swap_pair_list"
import TicketContainer from '../widgets/ticket/ticketContainer'
import ModalSettingsView from '../widgets/itemSettings/modal_views'
import HandleError from '../widgets/errorView'
import io from 'socket.io-client'
import WithdrawFlow from '../wallets/withdraw/withdrawFlowContainer'
import LoaderAplication from '../widgets/loaders/loader_app'
import TwoFactorActivate from '../widgets/twoFactorActivate/2fa'
import PropTypes from 'prop-types'


const {
   SocketUrl
} = Environtment

class HomeContainer extends Component{

  state = {
    modalVisible:false,
    order_socket:null
  }


  startSocket = async() =>{
    this.socket = io(SocketUrl)
    // console.log('INFORMACIÓN SOKET',this.socket)

    this.socket.on("connect", ()=>{
      this.props.action.load_label('Autenticando canales bilaterales')

      const body = {
        body:{access_token:this.props.user.TokenUser}
      }

      this.socket.emit('authentication', body);

      this.socket.on("authenticated", () => {
        // console.log('authenticated SOKET')
        // alert('AUTENTICADO')

          this.socket.on(`/swap/${this.props.user.id}`, async(swap)=>{
            // await this.props.action.current_section_params({currentFilter:'swaps'})
            // console.log('|||| INTERCAMBIO.... ', swap)

            if(swap.status === 'done' && swap !== this.state.order_socket){
              this.setState({order_socket:swap})

              return setTimeout(async()=>{
                await this.props.action.success_sound()
                await this.props.action.current_section_params({swap_socket_channel:swap, swap_done_id:swap.unique_id, swap_done_out:true})

                await this.props.action.swap_activity_update(swap, 'swaps')

                  setTimeout(async()=>{
                    await this.props.action.current_section_params({active_trade_operation:false})
                    await this.props.action.ManageBalance(swap.swap_info.account_from_id, 'reduce', swap.swap_info.want_to_spend)
                    setTimeout(async()=>{
                      // await this.props.action.get_account_balances(this.props.user)
                      await this.props.action.get_swap_list(this.props.user, this.props.wallets, this.props.all_pairs)
                    },3000)

                  },4000)
              }, 3500)
            }

            if(swap.status === 'error'){
              this.props.action.mensaje('El intercambio no se pudo realizar, contacta con soporte', 'error')
              this.props.action.ticket_canceled()
            }

            this.props.action.current_section_params({swap_socket_channel:swap})

          })


          this.socket.on(`/deposit/${this.props.user.id}`, async(deposit)=>{

            if(deposit.state === 'pending' && deposit.currency_type === 'fiat'){
              // console.log('||||||||||||||||| ------ DEPOSITO SOCKET|', deposit)
              await this.props.action.get_deposit_list(this.props.user)
              await this.props.action.update_activity_account(deposit.account_id, 'deposits')
              await this.props.action.update_pending_activity(deposit.account_id, 'deposits')
            }

            if(deposit.state === 'done' || deposit.state === 'accepted'){
              await this.props.action.get_deposit_list(this.props.user)
              this.props.action.get_account_balances(this.props.user)
            }

            if(deposit.currency_type === 'crypto'){
              this.props.action.add_new_transaction_animation()
              this.props.history.push(`/wallets/activity/${deposit.account_id}`)
            }

          })


          this.socket.on(`/withdraw/${this.props.user.id}`, async(withdraw)=>{

            switch (withdraw.state) {
              // case 'confirmed':
                 // return this.props.action.mensaje('Retiro confirmado','success')
                // return this.props.action.get_list_user_wallets(this.props.user)
              case 'confirmed':
              case 'accepted':
              // case 'pending':
              if(withdraw.currency_type === 'crypto'){
                setTimeout(async()=>{
                  await this.props.action.ManageBalance(withdraw.account_from, 'reduce', withdraw.amount)
                  let get_withdraw_providers = await this.props.action.get_withdraw_providers(this.props.user)
                  await this.props.action.get_withdraw_accounts(this.props.user, get_withdraw_providers, `{"where": {"userId": "${this.props.user.id}"}}`)
                  await this.props.action.get_withdraw_list(this.props.user)
                  await this.props.action.update_activity_account(withdraw.account_from, 'withdrawals')
                  this.props.action.update_pending_activity(withdraw.account_from, 'withdrawals')
                  return this.props.action.mensaje('El retiro se esta procesando','success')
                }, 1000)
                // El timer es para que se pueda ejecutar la animación al agregar el nuevo item withdraw crypto
              }
                break
              default:
              break
            }
            // if(withdraw.state === 'accepted'){
            //
            // }
            //
            // if(withdraw.state === 'confirmed'){
            //   this.props.action.mensaje('El retiro ha sido aceptado','success')
            // }
            // console.log('WITHDRAWWWW!!!! ', withdraw)
            // alert('withdraw actualizado')
            // this.props.action.get_withdraw_list(this.props.user)
          })
          // /sawp/userId
      })
    })
  }



static getDerivedStateFromError(error, info){
  return { handleError:true };
}

  componentDidCatch(error, info){
    this.setState({
      handleError:true,
    })
  }

  componentDidUpdate(){
   // this.props.action.FiatDeposit('cop')
  }

  render(){


    // console.log('Auxilio me desmayo, cashece viejo lesbiano!', Environment.ApiUrl)
    // console.log('|||||°°°°||||||| Este es el inicio del historial |||||°°°°|||||||', this.props)
    const {
      other_modal,
      modalVisible,
      modalConfirmation,
      app_loaded,
      current
    } = this.props


    // console.log('||||||||| HomeContainer INPUTS =======================> ', this.props)

    // if(this.state.handleError){
    //   return (<HandleError/>)
    // }

    return(
      <HandleError>
      <Router
        basename="/app"
        history={this.props.history}
        >
          {
            !app_loaded ?
            <Route path="/" render={() => <LoaderAplication init_sockets={this.startSocket}  current_country="colombia" token={this.props.token} logOut={this.props.logOut} history={this.props.history} />} />
            :
            <Fragment>
                <ToastContainers/>
                <HomeLayout modal={modalConfirmation || other_modal || modalVisible ? true : false} >

                    <MenuPrincipalContainer history={this.props.history}/>
                    <MenuSuperiorContainer logOut={this.props.logOut}/>
                    {/* En el componente dashboard se cargan todas las vistas */}

                    <Route path="/" render={() => <DashBoardContainer  {...this.props} />} />

                  {
                    modalVisible &&
                    <ModalContainer>
                      <ModalLayout  modalView={this.props.modalView} loader={this.props.loader} >
                        {/* <Route exact strict path={["/wallets", "/wallets/"]} component={NewWallet} /> */}
                            <Switch>
                              <Route exact strict path="/wallets" component={NewWallet} />
                              <Route exact strict path="/wallets/activity/:id" component={TicketContainer} />
                              <Route exact strict path={["/wallets/deposit/:id", "/activity", "/"]} component={DepositContainer} />
                              <Route exact path="/wallets/withdraw/:id" component={WithdrawFlow} />
                              <Route exact path="/withdraw" component={WithdrawAccountForm} />
                              <Route exact path="/security" component={current === '2auth' ? TwoFactorActivate : Kyc} />
                            </Switch>
                      </ModalLayout>
                    </ModalContainer>
                  }

                  {
                    other_modal &&
                    <ModalContainer>
                      <Route exact strict path="/wallets/swap/:id" component={PairList} />
                      <Route exact path={["/security", "/settings"]} component={ModalSettingsView} />
                    </ModalContainer>
                  }


                  {
                    modalConfirmation &&
                    <ModalContainer>
                      <Route
                        exact
                        // path={["/wallets", "/", "/withdraw", "/wallets/withdraw/:id", "/wallets/swap/:id", "/wallets/activity/:id", "/security"]}
                        component={ConfirmationModal}
                      />
                        {/* <Route exact path="/wallets" component={ConfirmationModal} /> */}
                    </ModalContainer>
                  }

                </HomeLayout>
            </Fragment>
      }

      </Router>
</HandleError>
    )
  }
}



HomeContainer.propTypes = {
  activeRoute:PropTypes.string,
  all_pairs:PropTypes.object,
  app_loaded:PropTypes.bool,
  current:PropTypes.string,
  loader:PropTypes.bool,
  logOut:PropTypes.func,
  modalConfirmation:PropTypes.bool,
  modalView:PropTypes.string,
  modalVisible:PropTypes.bool,
  other_modal:PropTypes.bool,
  token:PropTypes.string,
  user:PropTypes.object,
  wallets:PropTypes.object
}


function mapStateToProps(state, props){
  // console.log('E S T A D O   I N I C I A L', process.env.NODE_ENV === 'development' ? Environment.development : Environment.production)
  // console.log('E S T A D O   I N I C cI A L', state.model_data.user && state.model_data.user[state.model_data.user_id])
  const { wallets, all_pairs } = state.model_data
  const { app_loaded } = state.isLoading

  return {
      app_loaded,
      modalView:state.form.modalView,
      modalVisible:state.form.modal_visible,
      loader:state.isLoading.loader,
      firstDeposit:state.form.form_deposit.first_deposit,
      current:state.form.current,
      activeRoute:state.ui.menu_item_active,
      modalConfirmation:state.ui.modal_confirmation.visible,
      other_modal:state.ui.other_modal,
      user:state.model_data.user && state.model_data.user[state.model_data.user_id],
      wallets,
      all_pairs
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (HomeContainer)
