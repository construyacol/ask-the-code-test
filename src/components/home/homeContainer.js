import React from 'react'
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
import { Route, Switch } from 'react-router-dom'
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

function HomeContainer(props) {
  const {
    other_modal,
    modalVisible,
    modalConfirmation,
    isAppLoaded,
    current,
    doLogout,
    history,
    modalView,
    loader,
    socket_notify
  } = props

  return (
    <HandleError>
      <ToastContainers />
      <SocketsComponent />

      {
        !isAppLoaded ?
          <Route path="/" render={() => <LoaderAplication history={history} />} />
          :
          <HomeLayout modal={modalConfirmation || other_modal || modalVisible ? true : false} >

            <Route
              path="/:primary_path"
              component={MenuPrincipalContainer} />
            <Route
              path={["/:primary_path/:path", "/:primary_path"]}
              render={renderProps => (<MenuSuperiorContainer {...renderProps} logOut={doLogout} />)} />
            <Route
              path="/:primary_path"
              render={renderProps => (<DashBoardContainer  {...renderProps} />)} />

            {
              modalVisible &&
              <ModalContainer>
                <ModalLayout modalView={modalView} loader={loader} >
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
                    socket_notify ?
                      <Route path="/" component={SocketNotify} />
                      :
                      <>
                        <Route exact strict path="/wallets/swap/:account_id" component={PairList} />
                        <Route exact path={["/security", "/settings"]} component={ModalSettingsView} />
                      </>
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

      }

    </HandleError>
  )

}


HomeContainer.propTypes = {
  activeRoute: PropTypes.string,
  isAppLoaded: PropTypes.bool,
  current: PropTypes.string,
  loader: PropTypes.bool,
  modalConfirmation: PropTypes.bool,
  modalView: PropTypes.string,
  modalVisible: PropTypes.bool,
  other_modal: PropTypes.bool
}


function mapStateToProps(state) {
  const { authData } = state.modelData
  const { isAppLoaded } = state.isLoading
  const { socket_notify } = state.ui.notifications

  return {
    isAppLoaded,
    modalView: state.form.modalView,
    modalVisible: state.form.modal_visible,
    loader: state.isLoading.loader,
    current: state.form.current,
    activeRoute: state.ui.menu_item_active,
    modalConfirmation: state.ui.modal_confirmation.visible,
    other_modal: state.ui.other_modal,
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
