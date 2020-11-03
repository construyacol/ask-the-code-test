import React, { Component, Fragment } from "react";
import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../actions";
import { ButtonForms } from "../widgets/buttons/buttons";

import "./activity.css";

class ActivityContainer extends Component {
  componentWillMount() {
    this.props.action.isAppLoading(true);
  }

  componentDidMount() {
    this.props.action.MenuItemActive("activity");

    setTimeout(async () => {
      this.props.action.isAppLoading(false);
    }, 0);
  }

  deposit = () => {
    this.props.action.CleanForm("deposit");
    this.props.action.toggleModal();
  };

  toWallets = async () => {
    await this.props.history.push("/withdraw/deposit/5c04f873eb9c94511fd2edfa");
  };

  render() {
    return (
      <Fragment>
        <DetailContainerLayout>
          <ButtonForms type="primary" active={true} siguiente={this.deposit}>
            Hacer mi primer Deposito
          </ButtonForms>
        </DetailContainerLayout>
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  const { current_wallet } = state.ui.current_section.params;
  const {
    user,
    wallets,
    withdrawals,
    deposits,
    swaps,
    activity,
    all_pairs,
  } = state.modelData;

  return {
    loader: state.isLoading.loader,
    wallet_router: state.ui.router_wallet_container,
    local_currency: state.modelData.pairs.localCurrency,
    current_pair: !current_wallet
      ? null
      : state.ui.current_section.params.pairsForAccount[current_wallet.id] &&
        state.ui.current_section.params.pairsForAccount[current_wallet.id]
          .current_pair,
    user: user,
    wallets,
    withdrawals,
    deposits,
    swaps,
    activity,
    all_pairs: all_pairs,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityContainer);
