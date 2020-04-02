import React from 'react'
import ModalContainer from '../widgets/modal/modalContainer.js'
import ModalLayout from '../widgets/modal/modallayout'
import NewWallet from '../wallets/newWallet/newWalletContainer'
import WithdrawAccountForm from '../withdrawAccounts/new/withdrawAccountForm'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DepositContainer from '../wallets/deposit/depositContainer'
import actions from '../../actions'
import Kyc from '../kyc/kyc_container'
import { Route } from 'react-router-dom'
import ConfirmationModal from '../widgets/modal/confirmation'
import PairList from "../wallets/views/swap_pair_list"
import TicketContainer from '../widgets/ticket/ticketContainer'
import ModalSettingsView from '../widgets/itemSettings/modal_views'
import WithdrawFlow from '../wallets/withdraw/withdrawFlowContainer'
import TwoFactorActivate from '../widgets/twoFactorActivate/2fa'
import PropTypes from 'prop-types'
import SocketNotify from '../sockets/socket_notify/socketNotify'
import withHandleError from '../withHandleError'

function ModalsSupervisor(props) {
    const {
        otherModal,
        modalVisible,
        modalConfirmation,
        current,
        modalView,
        loader,
        socket_notify
    } = props

    return (
        <>
            {
                modalVisible &&
                <ModalContainer>
                    <ModalLayout modalView={modalView} loader={loader} >
                        <Route exact strict path="/wallets" component={NewWallet} />
                        <Route exact strict path="/wallets/activity/:account_id/:tx_path/:order_id" component={TicketContainer} />
                        <Route strict path="/wallets/deposit/:account_id" component={DepositContainer} />
                        <Route strict path="/wallets/withdraw/:account_id" component={WithdrawFlow} />
                        <Route exact path="/withdraw_accounts" component={WithdrawAccountForm} />
                        <Route exact path="/security" component={current === '2auth' ? TwoFactorActivate : Kyc} />
                    </ModalLayout>
                </ModalContainer>
            }

            {
                otherModal &&
                <ModalContainer>
                    {
                        socket_notify ?
                            <Route path="/" component={SocketNotify} />
                            :
                            <>
                                <Route exact strict path="/wallets/swap/:account_id" component={PairList} />
                                <Route exact path={["/security", "/settings"]} component={ModalSettingsView} />
                            </>
                    }
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
        </>
    )

}


ModalsSupervisor.propTypes = {
    current: PropTypes.string,
    loader: PropTypes.bool,
    modalConfirmation: PropTypes.bool,
    modalView: PropTypes.string,
    modalVisible: PropTypes.bool,
    otherModal: PropTypes.bool
}


function mapStateToProps({ ui, form, isLoading }) {
    return {
        modalView: form.modalView,
        modalVisible: form.modal_visible,
        loader: isLoading.loader,
        current: form.current,
        modalConfirmation: ui.modal_confirmation.visible,
        otherModal: ui.otherModal,
        socket_notify: ui.notifications.socket_notify,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        action: bindActionCreators(actions, dispatch)
    }
}

export default withHandleError(connect(mapStateToProps, mapDispatchToProps)(ModalsSupervisor))
