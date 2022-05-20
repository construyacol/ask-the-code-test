import React, { useEffect } from "react";
import { connect } from "react-redux";
import actions from "../../actions";
import { bindActionCreators } from "redux";
import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import { navigation_components } from "../api/ui/api.json";
import { Router, Route } from "react-router-dom";
import AccountList from "../widgets/accountList/account-list";
// import SimpleLoader from '../widgets/loaders'
import PropTypes from "prop-types";
import { AccountListSkeletonLoader } from "../dashBoard/dashboard-skeletons";
import { WalletDetail } from "../wallets/walletContainer";
import ActivityView from "../wallets/views/activity";
import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import { useSelector } from "react-redux";

function WitdrawAccountContainer(props) {
  const title = "Mis Cuentas de retiro";

  useEffect(() => {
    props.action.cleanCurrentSection();
    props.action.CurrentForm("bank");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { items_menu } = navigation_components.wallets;
  const { withdraw_accounts, isAppLoaded, data, history } = props;


  return(
    <>

      <Router history={history}>
        <Route
          path={["/:primary_path/:path/:account_id/", "/:primary_path"]}
          render={(routeProps) => (
            <>
              {/* <Route
                strict
                path="/:primary_path/:path/:account_id/:tx_path"
                render={(renderProps) => (
                  <WalletDetail wallets={data} {...renderProps} />
                )}
              /> */}
              <Route
                exact
                path="/:primary_path"
                render={() => (
                  <>
                    {!withdraw_accounts ? (
                      <AccountListSkeletonLoader />
                    ) : (
                      isAppLoaded &&
                      withdraw_accounts && (
                        <AccountList {...routeProps} isWithdrawView />
                      )
                    )}
                  </>
                )}
              />
              {/* <Route
                strict
                path={["/:primary_path/:path/:account_id/:tx_path"]}
                component={ActivityWrapperView}
              /> */}
              {/* <Route strict path={["/:primary_path/:path/:account_id/:tx_path"]} render={(renderProps) => <ActivityWrapperView {...renderProps}/>} /> */}
            </>
          )}
        />
      </Router>
    </>
  )
  
}




WitdrawAccountContainer.propTypes = {
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  current_wallet: PropTypes.object,
  user: PropTypes.object,
  withdraw_accounts: PropTypes.array,
};

function mapStateToProps({ modelData, ui, isLoading }) {
  const { user } = modelData;

  const { isAppLoaded } = isLoading;

  return {
    withdraw_accounts: user.withdraw_accounts,
    user,
    current_wallet: ui.current_section.params.current_wallet,
    currencies: modelData.currencies || null,
    isAppLoaded,
    data: modelData.withdraw_accounts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WitdrawAccountContainer);

const ActivityWrapperView = (props) => {
  const { params } = props.match;
  const activity = useSelector(
    (state) => state.storage.activity_for_account[params.account_id]
  );
  const withdraws = useSelector((state) => state.modelData.withdraws);
  const [coinsendaServices] = useCoinsendaServices();

  useEffect(() => {
    if (activity) {
      let result = [];
      Object.entries(withdraws).filter((item) => {
        return (
          item[1].withdraw_account_id === params.account_id &&
          result.push(item[1])
        );
      });
      coinsendaServices.updateActivityState(
        params.account_id,
        "withdraws",
        result
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ActivityView {...props} />;
};
