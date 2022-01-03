import React, { Suspense, useEffect } from "react";
import loadable from "@loadable/component";
// import { hotjar } from "react-hotjar";
import { Element, Events, scrollSpy } from "react-scroll";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import FreshChat from "../../services/freshChat";
import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import { bindActionCreators } from "redux";
import actions from "../../actions";
import ContentTab from "../widgets/detailContainer/content-tab";
import useBlockScroll from "../../hooks/useBlockScroll";
import withCoinsendaServices from "../withCoinsendaServices";
import { LazyLoaderPage } from "./dashboard-skeletons";
import "./dashboard.css";
import '../widgets/items/items.css'

const WalletsContainerComponent = loadable(()=> import("../wallets/walletContainer"),
  {
    fallback:<LazyLoaderPage path={"withdraw_accounts"} />
  }
)


const WitdrawAccountContainer = loadable(() => import(/* webpackPrefetch: true */ "../withdrawAccounts/witdrawAccountContainer"), {fallback: <LazyLoaderPage path={"withdraw_accounts"} />});
const SecurityCenter = loadable(() => import("../securityCenter/securityCenter"), {fallback: <LazyLoaderPage path={"security"} />});
const ReferralComponent = loadable(() => import("../referrals/referralsComponent"), {fallback: <LazyLoaderPage path={"referral"} />});

const PanelAlertContainer = loadable(() => import("../widgets/panelAlert/panelAlertContainer"));
const VideoPlayer = loadable(() =>  import("../widgets/video_player/videoPlayer"));

let UPDATE_CURRENT_PAIR_INTERVAL_ID = 0;

const TAB_TITLE = {
  security: "Centro de seguridad",
  wallets: "Mis billeteras",
  referral: "Invita amigos y gana",
  withdraw_accounts: "Mis Cuentas de retiro",
};

function DashBoardContainer(props) {
  useBlockScroll();
  const [coinsendaServices] = useCoinsendaServices();

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
      coinsendaServices.updateCurrentPair(query, "currentPair");
    }, 20000);
  };

  const onMount = async () => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {/* <QuoteContainer /> */}
        <div className="containerSection" name="firstInsideContainer">
          <Route
            path={["/:primary_path/:path/:account_id/", "/:primary_path"]}
            render={(routeProps) => ( <ContentTab {...props} {...routeProps} title={TAB_TITLE[props.primary_path]} />)}
          />
          <Suspense fallback={<LazyLoaderPage path={props.primary_path} />}>
            <Switch>
              <Route path="/wallets" component={WalletsContainerComponent} />
              <Route path="/withdraw_accounts" component={WitdrawAccountContainer} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCoinsendaServices(DashBoardContainer));
