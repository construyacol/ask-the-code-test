import React from "react";
import loadable from "@loadable/component";
import ModalContainer from "../widgets/modal/modalContainer.js";
import ModalLayout from "../widgets/modal/modallayout";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../actions";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import withHandleError from "../withHandleError";
import useToastMessage from "../../hooks/useToastMessage.js";
import KycSkeleton from '../kyc/basic/skeleton'
import DWFiatFlowSkeleton from "../wallets/views/skeleton/dWFiatFlowSkeleton"
import WithdrawAccountFlowSkeleton from '../withdrawAccounts/skeleton'
import NewWalletSkeleton from '../wallets/newWallet/skeleton'
import ConfirmationModal from '../widgets/modal/confirmation'


const SocketNotify = loadable(() => import("../sockets/socket_notify/socketNotify"));
const TwoFactorActivate = loadable(() => import("../widgets/twoFactorActivate/2fa"));
const WithdrawFlow = loadable(() => import("../wallets/withdraw/withdrawFlowContainer"), { fallback: <DWFiatFlowSkeleton/> });
const ModalSettingsView = loadable(() => import("../widgets/itemSettings/modal_views"));
const PairList = loadable(() => import("../wallets/views/swap_pair_list"));
const Kyc = loadable(() => import("../kyc/kyc_container"), { fallback:<KycSkeleton/> } );
const DepositContainer = loadable(() => import("../wallets/deposit/depositContainer"), { fallback: <DWFiatFlowSkeleton/> });
const WithdrawAccountForm = loadable(() => import("../withdrawAccounts/new/withdrawAccountForm"), { fallback: <WithdrawAccountFlowSkeleton/> });
const NewWallet = loadable(() => import("../wallets/newWallet/newWalletContainer"), { fallback: <NewWalletSkeleton/> });


function ModalsSupervisor(props) {
  const {
    otherModal,
    isModalVisible,
    modalConfirmation,
    current,
    modalView,
    loader,
    isSocketNotification,
    RenderModal,
  } = props;
  const [toastMessage] = useToastMessage();

  return (
    <>
      <ModalContainer condition={isModalVisible}>
        <ModalLayout modalView={modalView} loader={loader}>

          <Route exact strict path="/wallets" component={NewWallet} />

          <Route strict path="/wallets/deposit/:account_id" render={(renderProps) => {
            return (<DepositContainer {...renderProps} toastMessage={toastMessage} />);
          }}/>

          <Route
            strict path="/wallets/withdraw/:account_id" render={(renderProps) => {
              return (
                <WithdrawFlow {...renderProps} toastMessage={toastMessage} />
              );
            }}
          />

          <Route
            exact path="/withdraw_accounts" render={(renderProps) => {
              return (
                <WithdrawAccountForm {...renderProps} toastMessage={toastMessage}/>
              );
            }}
          />

          <Route
            exact path="/security" component={current === "2auth" ? TwoFactorActivate : Kyc}

          />

        </ModalLayout>
      </ModalContainer>

      <ModalContainer condition={otherModal}>
        {isSocketNotification ? (
          <Route path="/" component={SocketNotify} />
        ) : (
          <>
            <Route
              exact
              strict
              path="/wallets/swap/:account_id"
              render={(renderProps) => <PairList {...renderProps} />}
            />
            <Route
              exact
              path={["/security", "/settings"]}
              component={ModalSettingsView}
            />
          </>
        )}
      </ModalContainer>
      <ModalContainer condition={modalConfirmation}>
        <Route exact component={ConfirmationModal} />
      </ModalContainer>

      <ModalContainer condition={RenderModal}>
        {
          RenderModal && (
            <Route
              path={[
                "/:primary_path/:path/:account_id/:tx_path/:order_id",
                "/:primary_path/:path/:account_id",
                "/",
              ]}
              render={() => React.createElement(RenderModal)}
            />
          )
          // React.createElement(RenderModal)
        }
      </ModalContainer>
    </>
  );
}

ModalsSupervisor.propTypes = {
  current: PropTypes.string,
  loader: PropTypes.bool,
  modalConfirmation: PropTypes.bool,
  modalView: PropTypes.string,
  isModalVisible: PropTypes.bool,
  otherModal: PropTypes.bool,
};

function mapStateToProps({ ui, form, isLoading }) {
  return {
    modalView: form.modalView,
    isModalVisible: form.isModalVisible,
    loader: isLoading.loader,
    current: form.current,
    modalConfirmation: ui.modal_confirmation.visible,
    otherModal: ui.otherModal,
    isSocketNotification: ui.notifications.socket_notify,
    RenderModal: ui.modal.render,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default withHandleError(
  connect(mapStateToProps, mapDispatchToProps)(ModalsSupervisor)
);
