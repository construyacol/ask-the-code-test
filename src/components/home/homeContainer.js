import React, { Component, Fragment} from 'react'
import HomeLayout from './homeLayout'
import MenuPrincipalContainer from '../menuPrincipal/menuPrincipalContainer'
import MenuSuperiorContainer from '../menuSuperior/menuSuperiorContainer'
import ModalContainer from '../widgets/modal/modalContainer.js'
import ModalLayout from '../widgets/modal/modallayout'
import DashBoardContainer from '../dashBoard/dashBoardContainer'
import Headroom from 'headroom.js'
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
import createBrowserHistory from "history/createBrowserHistory"
import PairList from "../wallets/views/swap_pair_list"
import TicketContainer from '../widgets/ticket/ticketContainer'
import ModalSettingsView from '../widgets/itemSettings/modal_views'
import ErrorView from '../widgets/errorView'
import io from 'socket.io-client'
import WithdrawFlow from '../wallets/withdraw/withdrawFlowContainer'
import LoaderAplication from '../widgets/loaders/loader_app'


const history = createBrowserHistory();

const {
   ApiUrl,
   TokenUser,
   SocketUrl
} = Environtment


class HomeContainer extends Component{

  state = {
    handleError:false,
    modalVisible:false,
    contenidoModal:this.props.current,
    order_socket:null
  }

  componentDidMount(){

  }


  startSocket = async() =>{
    this.socket = io(SocketUrl)
    console.log('INFORMACIÓN SOKET',this.socket)

    this.socket.on("connect", ()=>{
      this.props.action.load_label('Autenticando canales bilaterales')
      // alert('connect')

      const body = {
        body:{access_token:TokenUser}
      }

      this.socket.emit('authentication', body);
      // this.socket.emit('authentication', {body: {access_token: JSON.stringify(TokenUser)}});

      this.socket.on("authenticated", () => {
          this.socket.on(`/swap/${this.props.user.id}`, async(swap)=>{

            await this.props.action.current_section_params({currentFilter:'swaps'})
            console.log('|||||||||||||||||||||||||||||||||||||| swap', swap)

            if(swap.status === 'done' && swap !== this.state.order_socket){
              this.setState({order_socket:swap})
              return setTimeout(async()=>{
                this.props.action.success_sound()
                await this.props.action.current_section_params({swap_socket_channel:swap, swap_done_id:swap.unique_id, swap_done_out:true})
                this.update_activity(swap)
                  setTimeout(async()=>{
                    await this.props.action.ManageBalance(swap.swap_info.account_from_id, 'reduce', swap.swap_info.want_to_spend)
                    setTimeout(()=>{this.props.action.get_account_balances(this.props.user)},3000)
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

            // console.log(deposit)
            // alert('Cambio deposito detected by socket')

            if(deposit.status === 'done' || deposit.status === 'accepted'){
              await this.props.action.get_deposit_list(this.props.user)
              this.props.action.get_account_balances(this.props.user)
            }

            if(deposit.currency_type === 'crypto'){
              this.props.action.add_new_transaction_animation()
              history.push(`/wallets/activity/${deposit.account_id}`)
            }

          })


          this.socket.on(`/withdraw/${this.props.user.id}`, async(withdraw)=>{

            switch (withdraw.state) {
              case 'accepted':
                return this.props.action.mensaje('El retiro ha sido aceptado','success')
              case 'confirmed':
                // alert('withdraw confirmado')
                 this.props.action.mensaje('Retiro confirmado','success')
                return this.props.action.get_list_user_wallets(this.props.user)
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


  update_activity = (swap) =>{
    setTimeout(async()=>{

      const {
        user,
        swaps,
        update_activity_list
      } = this.props

      await this.props.action.add_done_swap(swaps, user, swap, update_activity_list)
      this.props.action.current_section_params({swap_done_out:false, swap_done_in:true})

      setTimeout(()=>{
        this.props.action.add_coin_sound()
        this.props.action.mensaje('Nuevo intercambio realizado', 'success')
        this.props.action.current_section_params({swap_done_out:false, swap_done_in:false, swap_done_id:false, swap_socket_channel:{
          unique_id:null,
          status:null
        }})
      }, 3000)

    }, 1800)
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
      app_loaded
    } = this.props


    if(this.state.handleError){
      return (<ErrorView/>)
    }

    return(
      <Router
        history={history}
        >
          {
            !app_loaded ?
            <LoaderAplication init_sockets={this.startSocket}/>
            :
            <Fragment>
                <ToastContainers/>

                <HomeLayout modal={modalConfirmation || other_modal || modalVisible ? true : false} >

                    <MenuPrincipalContainer/>

                    <MenuSuperiorContainer Headroom={Headroom}/>
                    {/* En el componente dashboard se cargan todas las vistas */}

                    {/* <DashBoardContainer history={history} {...this.props} /> */}
                    <Route path="/" render={() => <DashBoardContainer history={history} {...this.props} />} />


                  {
                    modalVisible &&
                    <ModalContainer>

                      <ModalLayout  modalView={this.props.modalView} loader={this.props.loader} history={history}>
                        {/* <Route exact strict path={["/wallets", "/wallets/"]} component={NewWallet} /> */}
                            <Fragment>
                              <Route exact strict path="/wallets" component={NewWallet} />
                              <Route exact strict path="/wallets/activity/:id" component={TicketContainer} />
                              <Route exact strict path={["/wallets/deposit/:id", "/activity", "/"]} component={DepositContainer} />
                              <Route exact path="/wallets/withdraw/:id" component={WithdrawFlow} />
                              <Route exact path="/withdraw" component={WithdrawAccountForm} />
                              <Route exact path="/security" component={Kyc} />
                            </Fragment>
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
                        path={["/wallets", "/", "/withdraw", "/wallets/withdraw/:id", "/wallets/swap/:id", "/wallets/activity/:id"]}
                        component={ConfirmationModal}
                      />
                        {/* <Route exact path="/wallets" component={ConfirmationModal} /> */}
                    </ModalContainer>
                  }

                </HomeLayout>

            </Fragment>
      }

      </Router>

    )
  }
}


function mapStateToProps(state, props){
  // console.log('E S T A D O   I N I C I A L', process.env.NODE_ENV === 'development' ? Environment.development : Environment.production)
  // console.log('E S T A D O   I N I C cI A L', state.model_data.user && state.model_data.user[state.model_data.user_id])
  const { wallets, all_pairs, swaps } = state.model_data
  const { app_loaded } = state.isLoading
  // console.log('|||||||||| E S T A D O   I N I C cI A L', app_loaded)

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
      swaps,
      all_pairs,
      update_activity_list:state.ui.current_section.params.methods.activity.update_list
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (HomeContainer)
