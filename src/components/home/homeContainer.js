import React, { Component, Fragment } from 'react'
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


class HomeContainer extends Component {

  render() {

    const {
      other_modal,
      modalVisible,
      modalConfirmation,
      isAppLoaded,
      current,
      doLogout
    } = this.props

    return (
      <HandleError>
        <ToastContainers />
        <SocketsComponent />

          {
            !isAppLoaded ?
              <Route path="/" render={() => <LoaderAplication history={this.props.history} />} />
              :
              <Fragment>
                <HomeLayout modal={modalConfirmation || other_modal || modalVisible ? true : false} >

                  <Route path="/:primary_path" component={MenuPrincipalContainer} />
                  <Route path={["/:primary_path/:path", "/:primary_path"]} render={(props) => (<MenuSuperiorContainer {...this.props} {...props} logOut={doLogout} />)} />
                  <Route path="/:primary_path" render={(props) => <DashBoardContainer  {...props} {...this.props} />} />

                  {
                    modalVisible &&
                    <ModalContainer>
                      <ModalLayout modalView={this.props.modalView} loader={this.props.loader} >
                        <Switch>
                          <Route exact strict path="/wallets" component={NewWallet} />
                          <Route exact strict path="/wallets/activity/:account_id/:tx_path/:order_id" component={TicketContainer} />
                          <Route strict path="/wallets/deposit/:account_id" component={DepositContainer} />
                          <Route strict path="/wallets/withdraw/:account_id" component={WithdrawFlow} />
                          <Route exact path="/withdraw_accounts" component={WithdrawAccountForm} />
                          <Route exact path="/security" component={current === '2auth' ? TwoFactorActivate : Kyc} />
                        </Switch>
                      </ModalLayout>
                    </ModalContainer>
                  }

                  {
                    other_modal &&
                    <ModalContainer>
                      <Switch>
                        {
                          this.props.socket_notify ?
                            <Route path="/" component={SocketNotify} />
                            :
                            <Fragment>
                              <Route exact strict path="/wallets/swap/:account_id" component={PairList} />
                              <Route exact path={["/security", "/settings"]} component={ModalSettingsView} />
                            </Fragment>
                        }
                      </Switch>
                    </ModalContainer>
                  }


                  {
                    modalConfirmation &&
                    <ModalContainer>
                      <Route
                        exact
                        component={ConfirmationModal}
                      />
                    </ModalContainer>
                  }

                </HomeLayout>
              </Fragment>
          }

      </HandleError>
    )
  }
}



HomeContainer.propTypes = {
  activeRoute: PropTypes.string,
  all_pairs: PropTypes.object,
  isAppLoaded: PropTypes.bool,
  current: PropTypes.string,
  loader: PropTypes.bool,
  modalConfirmation: PropTypes.bool,
  modalView: PropTypes.string,
  modalVisible: PropTypes.bool,
  other_modal: PropTypes.bool,
  user: PropTypes.object,
  wallets: PropTypes.object
}


function mapStateToProps(state, props) {
  // console.log('E S T A D O   I N I C I A L', process.env.NODE_ENV === 'development' ? Environment.development : Environment.production)
  // console.log('E S T A D O   I N I C cI A L', state.modelData.user && state.modelData.user[state.modelData.user_id])
  const { wallets, all_pairs, authData } = state.modelData
  const { isAppLoaded } = state.isLoading
  const { socket_notify } = state.ui.notifications

  return {
    isAppLoaded,
    modalView: state.form.modalView,
    modalVisible: state.form.modal_visible,
    loader: state.isLoading.loader,
    firstDeposit: state.form.form_deposit.first_deposit,
    current: state.form.current,
    activeRoute: state.ui.menu_item_active,
    modalConfirmation: state.ui.modal_confirmation.visible,
    other_modal: state.ui.other_modal,
    user: state.modelData.user && state.modelData.user[state.modelData.user_id],
    wallets,
    all_pairs,
    socket_notify,
    doLogout: authData.doLogout
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
