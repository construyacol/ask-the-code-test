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
import ConfirmationModal from '../widgets/modal/confirmation'
import PairList from "../wallets/views/swap_pair_list"
import TicketContainer from '../widgets/ticket/ticketContainer'
import ModalSettingsView from '../widgets/itemSettings/modal_views'
import HandleError from '../widgets/errorView'
import WithdrawFlow from '../wallets/withdraw/withdrawFlowContainer'
import LoaderAplication from '../widgets/loaders/loader_app'
import TwoFactorActivate from '../widgets/twoFactorActivate/2fa'
import PropTypes from 'prop-types'
import SocketNotify from '../sockets/socket_notify/socketNotify'
import SocketsComponent from '../sockets/sockets'
// import { formatToCurrency } from '../../services/convert_currency'


class HomeContainer extends Component{

  state = {
    modalVisible:false
  }


  // startSocket = async() =>{
  //
  //   this.socket = io(SocketUrl)
  //
  //   this.socket.on("connect", ()=>{
  //     this.props.action.load_label('Autenticando canales bilaterales')
  //     console.log(this.socket)
  //     alert('conectado?')
  //
  //     const body = {
  //       body:{access_token:this.props.user.TokenUser}
  //     }
  //     this.socket.emit('authentication', body);
  //     this.socket.on("authenticated", () => {
  //       // console.log('authenticated SOKET')
  //       alert('AUTENTICADO')
  //
          // this.socket.on(`/deposit/${this.props.user.id}`, async(deposit)=>{
          //
          //   if(deposit.state === 'pending' && deposit.currency_type === 'fiat'){
          //     // console.log('||||||||||||||||| ------ DEPOSITO SOCKET|', deposit)
          //     await this.props.action.get_deposit_list(this.props.user)
          //     await this.props.action.update_activity_account(deposit.account_id, 'deposits')
          //     await this.props.action.update_pending_activity(deposit.account_id, 'deposits')
          //   }
          //
          //   if(deposit.state === 'done' || deposit.state === 'accepted'){
          //     await this.props.action.get_deposit_list(this.props.user)
          //     this.props.action.get_account_balances(this.props.user)
          //   }
          //
          //   if(deposit.currency_type === 'crypto'){
          //     this.props.action.add_new_transaction_animation()
          //     this.props.history.push(`/wallets/activity/${deposit.account_id}`)
          //   }
          //
          // })
  //
  //
  //         this.socket.on(`/withdraw/${this.props.user.id}`, async(withdraw)=>{
  //
  //           switch (withdraw.state) {
  //             // case 'confirmed':
  //                // return this.props.action.mensaje('Retiro confirmado','success')
  //               // return this.props.action.get_list_user_wallets(this.props.user)
  //             case 'confirmed':
  //             case 'accepted':
  //             // case 'pending':
  //             if(withdraw.currency_type === 'crypto'){
  //               setTimeout(async()=>{
  //                 await this.props.action.ManageBalance(withdraw.account_from, 'reduce', withdraw.amount)
  //                 let get_withdraw_providers = await this.props.action.get_withdraw_providers(this.props.user)
  //                 await this.props.action.get_withdraw_accounts(this.props.user, get_withdraw_providers, `{"where": {"userId": "${this.props.user.id}"}}`)
  //                 await this.props.action.get_withdraw_list(this.props.user)
  //                 await this.props.action.update_activity_account(withdraw.account_from, 'withdrawals')
  //                 this.props.action.update_pending_activity(withdraw.account_from, 'withdrawals')
  //                 return this.props.action.mensaje('El retiro se esta procesando','success')
  //               }, 1000)
  //               // El timer es para que se pueda ejecutar la animación al agregar el nuevo item withdraw crypto
  //             }
  //               break
  //             default:
  //             break
  //           }
  //           // if(withdraw.state === 'accepted'){
  //           //
  //           // }
  //           //
  //           // if(withdraw.state === 'confirmed'){
  //           //   this.props.action.mensaje('El retiro ha sido aceptado','success')
  //           // }
  //           // console.log('WITHDRAWWWW!!!! ', withdraw)
  //           // alert('withdraw actualizado')
  //           // this.props.action.get_withdraw_list(this.props.user)
  //         })
  //         // /sawp/userId
  //     })
  //   })
  // }



static getDerivedStateFromError(error, info){
  return { handleError:true };
}

  componentDidCatch(error, info){
    this.setState({
      handleError:true,
    })
  }

  // componentDidUpdate(prevProps){
  //   if (this.props.app_loaded !== prevProps.app_loaded) {
  //     setTimeout(()=>{
  //       let currency = {
  //         currency:'cop',
  //         is_token:false
  //       }
  //       this.props.action.socket_notify({account_id:'5d406e3cbb245069d61021c5', item_type:'deposit', currency, amount:1500000}, 'deposit')
  //       this.props.action.other_modal_toggle()
  //       this.props.action.success_sound()
  //       // add_coin_sound
  //     }, 1000)
  //     // this.formatToCurrencies()
  //
  //   }
  // }

  // componentDidMount(){
  // }

  // formatToCurrencies = async props =>{
  //   let currency = {
  //     currency:'cop',
  //     is_token:false
  //   }
  //   let resul = await formatToCurrency(50000, currency, true)
  //   console.log('formatToCurrencies', resul, true)
  //   alert('puta')
  // }

  render(){

    const {
      other_modal,
      modalVisible,
      modalConfirmation,
      app_loaded,
      current,
      user_data
    } = this.props




    return(
      <HandleError>
        <SocketsComponent/>

      <Router
        basename="/app"
        history={this.props.history}
        >
          {
            !app_loaded ?
            <Route path="/" render={() => <LoaderAplication user_data={user_data} history={this.props.history} />} />
            :
            <Fragment>
                <ToastContainers/>
                <HomeLayout modal={modalConfirmation || other_modal || modalVisible ? true : false} >

                    <MenuPrincipalContainer history={this.props.history}/>
                    <MenuSuperiorContainer logOut={user_data.logOut}/>
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
                      {
                        this.props.socket_notify ?
                          <Route path="/" component={SocketNotify} />
                          :
                          <Fragment>
                            <Route exact strict path="/wallets/swap/:id" component={PairList} />
                            <Route exact path={["/security", "/settings"]} component={ModalSettingsView} />
                          </Fragment>
                      }
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
  modalConfirmation:PropTypes.bool,
  modalView:PropTypes.string,
  modalVisible:PropTypes.bool,
  other_modal:PropTypes.bool,
  user:PropTypes.object,
  wallets:PropTypes.object
}


function mapStateToProps(state, props){
  // console.log('E S T A D O   I N I C I A L', process.env.NODE_ENV === 'development' ? Environment.development : Environment.production)
  // console.log('E S T A D O   I N I C cI A L', state.model_data.user && state.model_data.user[state.model_data.user_id])
  const { wallets, all_pairs } = state.model_data
  const { app_loaded } = state.isLoading
  const { socket_notify } = state.ui.notifications

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
      all_pairs,
      socket_notify
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (HomeContainer)
