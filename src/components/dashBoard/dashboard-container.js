import React, { Suspense, useEffect } from "react";
import { hotjar } from "react-hotjar";
import { Element, Events, scrollSpy } from "react-scroll";
import { Route, Switch } from "react-router-dom";
import WalletContainer from "../wallets/walletContainer";
import QuoteContainer from "../widgets/quote/quoteContainer";
import { connect } from "react-redux";
import PanelAlertContainer from "../widgets/panelAlert/panelAlertContainer";
import VideoPlayer from "../widgets/video_player/videoPlayer";
import PropTypes from "prop-types";
import FreshChat from "../../services/freshChat";
import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import SimpleLoader from "../widgets/loaders";
import ItemAccount from "../widgets/accountList/item_account";
import { AccountListContainer } from "../widgets/accountList/styles";

import { ItemSecurity, SecurityLayoutLoader } from "../securityCenter/styles";

import "./dashboard.css";
import { bindActionCreators } from "redux";
import actions from "../../actions";
import ContentTab from "../widgets/detailContainer/content-tab";
import localForage from "localforage";
import { ReferralComponentAsSkeleton } from "../referrals/referralsComponent";
import useBlockScroll from "../../hooks/useBlockScroll";

const WitdrawAccountContainer = React.lazy(() =>
  import("../withdrawAccounts/witdrawAccountContainer")
);
const SecurityCenter = React.lazy(() =>
  import("../securityCenter/securityCenter")
);
const ReferralComponent = React.lazy(() =>
  import("../referrals/referralsComponent")
);
// const Test = React.lazy(() => {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(import('../referrals/referralsComponent')), 3000);
//   });
// });

let UPDATE_CURRENT_PAIR_INTERVAL_ID = 0;

const TAB_TITLE = {
  security: "Centro de seguridad",
  wallets: "Mis billeteras",
  referral: "Mis Referidos",
  withdraw_accounts: "Mis Cuentas de retiro",
};

function DashBoardContainer(props) {
  useBlockScroll();

  // const proofSocketNotify = () => {
  //   const { wallets } = props
  //   const account_id = '5f7995a466db980032411256'
  //
  //   setTimeout(()=>{
  //     let currency = {
  //       currency:'bitcoin_testnet',
  //       is_token:false
  //     }
  //     // props.action.update_item_state({ [wallets[account_id].id]: { ...wallets[account_id], count:1 } }, 'wallets')
  //     props.action.socket_notify({account_id, currency, amount:0.15}, 'deposits')
  //     props.action.toggleOtherModal()
  //     // props.action.success_sound()
  //   }, 2000)
  // }

  const updateCurrentPair = async () => {
    clearInterval(UPDATE_CURRENT_PAIR_INTERVAL_ID);
    UPDATE_CURRENT_PAIR_INTERVAL_ID = setInterval(() => {
      let query = `{"where":{"buy_pair":"${
        props.currentPair && props.currentPair.buy_pair
      }"}}`;
      props.action.update_current_pair(query, "currentPair");
    }, 20000);
  };

  const onMount = async () => {
    hotjar.initialize(1688041, 6);
    // await props.action.freshchat_init_user(props.user)
    // await FreshChat.user_update(props.user)
    // const verification_state = await props.coinsendaServices.getVerificationState()
    // if (verification_state === 'accepted') {
    //   FreshChat.track('user login verified')
    // }
    // if (!props.user.security_center.authenticator.auth) {
    //   FreshChat.show_tags(['security', '2factor'], 'article')
    // }
    scrollSpy.update();
  };

  const onUnmount = () => {
    clearInterval(UPDATE_CURRENT_PAIR_INTERVAL_ID);
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
    // const { userName } = JSON.parse(localStorage.getItem('user'));
  };

  useEffect(() => {
    if (props.currentPair) {
      process.env.NODE_ENV === "production" && updateCurrentPair();
    }
  }, [props.currentPair]);

  useEffect(() => {
    onMount();
    const scroll = document.getElementById("scrollArea");
    const scrollContainer = document.getElementById("containerElement");
    if (scroll && scrollContainer) {
      const addClass = () => {
        scroll.style.pointerEvents = "none";
        scrollContainer.classList.add("wideScrollbar");
      };
      const removeClass = () => {
        scrollContainer.classList.remove("wideScrollbar");
      };
      scrollContainer.childNodes.forEach((el) => {
        el.onmouseenter = () => {
          removeClass();
          scroll.style.pointerEvents = "all";
        };
      });
      scroll.onmouseenter = addClass;
    }

    // proofSocketNotify()
    return onUnmount;
  }, []);

  return (
    <>
      <div
        id="scrollArea"
        style={{
          position: "absolute",
          height: "100vh",
          width: "10px",
          right: 0,
          zIndex: 10,
        }}
      ></div>
      <Element id="containerElement" className="dashBoardLayout">
        <QuoteContainer />
        <div className="containerSection" name="firstInsideContainer">
          <Route
            path={["/:primary_path/:path/:account_id/", "/:primary_path"]}
            render={(routeProps) => (
              <ContentTab
                {...props}
                {...routeProps}
                title={TAB_TITLE[props.primary_path]}
              />
            )}
          />
          <Suspense fallback={<LazyLoaderPage path={props.primary_path} />}>
            <Switch>
              <Route
                path="/wallets"
                render={(renderProps) => <WalletContainer {...renderProps} />}
              />
              <Route
                path="/withdraw_accounts"
                component={WitdrawAccountContainer}
              />
              <Route path="/security" component={SecurityCenter} />
              <Route path="/referral" component={ReferralComponent} />
            </Switch>
          </Suspense>

          {props.primary_path === "security" && (
            <>
              <PanelAlertContainer history={props.history} />
              <VideoPlayer />
            </>
          )}
        </div>
      </Element>
    </>
  );
}

DashBoardContainer.propTypes = {
  activeRoute: PropTypes.string,
  all_pairs: PropTypes.object,
  isAppLoaded: PropTypes.bool,
  current: PropTypes.string,
  loader: PropTypes.bool,
  logOut: PropTypes.func,
  modalConfirmation: PropTypes.bool,
  modalView: PropTypes.string,
  isModalVisible: PropTypes.bool,
  otherModal: PropTypes.bool,
  token: PropTypes.string,
  user: PropTypes.object,
};

function mapStateToProps(state, props) {
  const { user, wallets, all_pairs } = state.modelData;
  const { currentPair } = state.modelData.pairs;

  return {
    user,
    primary_path: props.match.params && props.match.params.primary_path,
    currentPair,
    wallets,
    all_pairs,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoardContainer);

const LazyLoaderPage = ({ path }) => {
  const title =
    path === "withdraw_accounts" ? "Cuentas de retiro" : "Cargando...";
  const LoaderScreen =
    path === "withdraw_accounts"
      ? AccountListSkeletonLoader
      : path === "referral"
      ? ReferralComponentAsSkeleton
      : path === "security"
      ? SecurityCenterSkeletonLoader
      : SimpleLoader;

  return (
    <DetailContainerLayout title={title}>
      <LoaderScreen />
    </DetailContainerLayout>
  );
};

export const AccountListSkeletonLoader = () => {
  return (
    <AccountListContainer className="AccountListContainer">
      <ItemAccount loader />
    </AccountListContainer>
  );
};

const SecurityCenterSkeletonLoader = () => {
  const elements = window.innerWidth < 768 ? 10 : 5;
  const loaderList = new Array(elements).fill({});

  return (
    <>
      {loaderList.map((_, key) => {
        return (
          <SecurityLayoutLoader
            id="security_loader"
            className="SecurityLayoutLoader"
            key={key}
          >
            <ItemSecurity className="loader ItemSecurity">
              <div className="SCimgItem">
                <div className="SCimgItemCont"></div>
              </div>
              <div className="contentSubItem last">
                <div className="contentSubText">
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <div className="SCcta"></div>
              </div>
            </ItemSecurity>
          </SecurityLayoutLoader>
        );
      })}
    </>
  );
};
