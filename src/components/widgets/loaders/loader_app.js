import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import loadable from "@loadable/component";
import { bindActionCreators } from "redux";
import localForage from "localforage";
import actions from "../../../actions";
import { withRouter } from "react-router";
import usePrevious from "hooks/usePreviousValue";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import withHandleError from "../../withHandleError";
import { doLogout } from "utils/handleSession";
// import KeyActionsInfo from "../modal/render/keyActionsInfo";
import useViewport from "../../../hooks/useWindowSize";
// import { hotjar } from "react-hotjar";
// import OnBoardingComponent from './components/forms/widgets/onBoardingComponent/init'
// import useToastMessage from "../../../hooks/useToastMessage";
import "./loader.css";
 
// const IconSwitch = loadable(() => import("../icons/iconSwitch"), {
//   fallback: (
//     <div 
//       style={{
//         height: 77,
//         width: 200,
//         display: "grid",
//       }}
//     />
//   ),
// });
const Coinsenda = loadable(() => import("../icons/logos/coinsenda"), {
  fallback: (
    <div
      style={{
        height: 50,
        width: 50,
        display: "block",
      }}
    />
  ),
});

// const OnBoardingComponent = loadable(() => import("../../forms/widgets/onBoardingComponent/init"));
// const SelectCountry = loadable(() => import("../maps/select_country/select_country"));

function LoaderAplication({ actions, history, tryRestoreSession, setShowOnBoarding }) {
 
  const [country] = useState("international");
  // const [ countryImg, setCountryImg ] = useState("international")
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  // const [anim, setAnim] = useState("in");
  const [coinsendaServices, reduxState] = useCoinsendaServices();
  const { authData } = reduxState.modelData;
  const { appLoadLabel } = reduxState.isLoading;
  const previousLoadLabel = usePrevious(appLoadLabel);
  // const [toastMessage] = useToastMessage();
  const { 
    // isTabletOrMovilViewport, 
    isMovilViewport 
  } = useViewport();

  const initComponent = async () => {

    const { userToken } = authData;
    const isSessionRestored = await tryRestoreSession();
    console.log('isSessionRestored', isSessionRestored)
    if (isSessionRestored) {
      await actions.isLoggedInAction(true);
      coinsendaServices.postLoader(doLogout);
      return redirectURL(isSessionRestored);
    } 
    
    if (!userToken) return;
   
    let { error } = await coinsendaServices.fetchUserProfile();

    if (error && error?.message?.toLowerCase()?.split(" ")?.join("_")?.includes(`unknown_"profile"_id_"undefined"`)) {
      const { error } = await coinsendaServices.addNewProfile(country);
      if(error) return alert(error?.message, 'error');
      setShowOnBoarding(true) 
      document.querySelector('.LoaderAplication')?.classList?.add('withOnboarding')
    }

    document.querySelector('.LoaderAplication')?.classList?.add('withUser')
    await coinsendaServices.loadFirstEschema();
    const user = await coinsendaServices.fetchCompleteUserData();
    if (!user) {
      return false;
    }
    await actions.isLoggedInAction(true);
    await coinsendaServices.init(doLogout);
    return redirectURL();
  };

  const redirectURL = async (isSessionRestored) => {
    // coinsendaServices.freshChatInitUser();
    if (!isMovilViewport) coinsendaServices.initPushNotificator();

    const verificationStatus = coinsendaServices.getVerificationState();
    if (verificationStatus !== "accepted") {
      // await actions.addNotification("security", null, 1);
      await history.push("/settings/kyc");
      return actions.isAppLoaded(true);
    }

    if (isSessionRestored) {
      const PREVIOUS_ROUTE = await localForage.getItem("previousRoute");
      history.push(PREVIOUS_ROUTE ? PREVIOUS_ROUTE : "/wallets");
      actions.isAppLoading(false);
    } else {
      await history.push("/wallets");
    } 
    // showKeyActionModal(verificationStatus);
    return actions.isAppLoaded(true);
  };

  // const showKeyActionModal = async (verificationStatus) => {
  //   if (verificationStatus === "accepted") {
  //     const toParse = await localForage.getItem("keysModalShow");
  //     const keysModalShowed = JSON.parse(toParse);
  //     if (
  //       !isTabletOrMovilViewport &&
  //       (!keysModalShowed ||
  //         (keysModalShowed.showed && keysModalShowed.showed < 2))
  //     ) {
  //       actions.renderModal(KeyActionsInfo);
  //       localForage.setItem("keysModalShow", JSON.stringify({showed: keysModalShowed ? keysModalShowed.showed + 1 : 0})
  //       );
  //     }
  //   }
  // };



  useEffect(() => {
    if (authData.userToken) {
      initComponent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData.userToken]);

  useEffect(() => {
    if (previousLoadLabel !== appLoadLabel) {
      setProgressBarWidth(progressBarWidth + 33);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLoadLabel]);

  return (
    <div className={`LoaderAplication`}>
        <div className={`LoaderContainer loaderLayout`}>
          <div className="logotypes">
            <Coinsenda size={45} color="white" />
            <h1 className="fuente">Coinsenda</h1>
          </div>
          <p className="fuente">{appLoadLabel}</p>
        </div>
      <div className="KycprogressBar loader">
        <div
          className="kycPropgressed"
          style={{ width: `${progressBarWidth}%` }}
        ></div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default withHandleError(
  connect(() => ({}), mapDispatchToProps)(withRouter(LoaderAplication))
);
