import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import loadable from "@loadable/component";
import { bindActionCreators } from "redux";
import localForage from "localforage";
import actions from "../../../actions";
import { withRouter } from "react-router";
import usePrevious from "../../hooks/usePreviousValue";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import withHandleError from "../../withHandleError";
import { doLogout } from "../../utils";
import KeyActionsInfo from "../modal/render/keyActionsInfo";
import useViewport from "../../../hooks/useWindowSize";
import { hotjar } from "react-hotjar";

import "./loader.css";

const IconSwitch = loadable(() => import("../icons/iconSwitch"), {
  fallback: (
    <div
      style={{
        height: 77,
        width: 200,
        display: "grid",
      }}
    />
  ),
});
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
const SelectCountry = loadable(() =>
  import("../maps/select_country/select_country")
);

function LoaderAplication({ actions, history, tryRestoreSession }) {
  const [country, setCountry] = useState("colombia");
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [anim, setAnim] = useState("in");
  const [coinsendaServices, reduxState] = useCoinsendaServices();
  const { authData } = reduxState.modelData;
  const { appLoadLabel } = reduxState.isLoading;
  const previousLoadLabel = usePrevious(appLoadLabel);
  const { isTabletOrMovilViewport } = useViewport();

  const registerColors = () => {};

  const initComponent = async (newCountry) => {
    const { userToken } = authData;

    const isSessionRestored = await tryRestoreSession(userToken);
    if (isSessionRestored) {
      await actions.isLoggedInAction(true);
      coinsendaServices.postLoader(doLogout);
      return redirectURL(isSessionRestored);
    }

    if (!userToken) return;

    let profile = await coinsendaServices.fetchUserProfile();
    if (!profile) {
      if (!newCountry) {
        return setCountry(null);
      }
      profile = await coinsendaServices.addNewProfile(newCountry);
    }

    if (
      !profile ||
      (!profile.countries[country] && !profile.countries[newCountry])
    ) {
      return false;
    }

    if (!country && !newCountry) {
      return false;
    }
    const userCountry = newCountry ? newCountry : country;

    const res = await coinsendaServices.countryValidators();
    if (!res) {
      prepareCountrySelection();
      return doLogout();
    }

    // Verificamos que el país sea valido, si no, retornamos al componente para seleccionar país
    if (!res.countries[userCountry]) {
      prepareCountrySelection();
      return false;
    }
    await animation("out");
    await setCountry(userCountry);
    await animation("in");

    await coinsendaServices.loadFirstEschema();

    const user = await coinsendaServices.fetchCompleteUserData(
      userCountry,
      profile
    );
    if (!user) {
      return false;
    }

    await actions.isLoggedInAction(true);
    await coinsendaServices.init(doLogout);
    return redirectURL();
  };

  const redirectURL = async (isSessionRestored) => {
    coinsendaServices.freshChatInitUser();
    if (!isMovilViewport) {
      coinsendaServices.initPushNotificator();
    }

    const verificationStatus = await coinsendaServices.getVerificationState();
    if (verificationStatus !== "accepted") {
      await actions.addNotification("security", null, 1);
      await history.push("/security");
      return actions.isAppLoaded(true);
    }

    if (isSessionRestored) {
      const PREVIOUS_ROUTE = await localForage.getItem("previousRoute");
      history.push(PREVIOUS_ROUTE ? PREVIOUS_ROUTE : "/wallets");
      actions.isAppLoading(false);
    } else {
      await history.push("/wallets");
    }
    showKeyActionModal(verificationStatus);
    return actions.isAppLoaded(true);
  };

  const showKeyActionModal = async (verificationStatus) => {
    if (verificationStatus === "accepted") {
      const toParse = await localForage.getItem("keysModalShow");
      const keysModalShowed = JSON.parse(toParse);
      if (
        !isTabletOrMovilViewport &&
        (!keysModalShowed ||
          (keysModalShowed.showed && keysModalShowed.showed < 2))
      ) {
        actions.renderModal(KeyActionsInfo);
        localForage.setItem(
          "keysModalShow",
          JSON.stringify({
            showed: keysModalShowed ? keysModalShowed.showed + 1 : 0,
          })
        );
      }
    }
  };

  const prepareCountrySelection = async () => {
    await animation("out");
    setCountry(null);
    setProgressBarWidth(0);
    await animation("in");
  };

  const selectCountry = async (newCountry) => {
    actions.isAppLoading(true);
    await initComponent(newCountry);
    actions.isAppLoading(false);
  };

  const animation = async (animation) => {
    return new Promise(async (resolve) => {
      setAnim(animation);
      setTimeout(() => {
        return resolve(true);
      }, 300);
    });
  };

  useEffect(() => {
    registerColors();
  }, []);

  useEffect(() => {
    if (authData.userToken) {
      initComponent();
    }
  }, [authData.userToken]);

  useEffect(() => {
    if (previousLoadLabel !== appLoadLabel) {
      setProgressBarWidth(progressBarWidth + 33);
    }
  }, [appLoadLabel]);

  return (
    <div className={`LoaderAplication ${!country ? "withOutContry" : ""}`}>
      {!country ? (
        <div className={`LoaderAplication loaderLayout ${anim}`}>
          <SelectCountry select_country={selectCountry} />
        </div>
      ) : (
        <div className={`LoaderContainer loaderLayout`}>
          <IconSwitch className="Loader__icon" icon={country} size={60} />

          <div className="logotypes">
            <Coinsenda size={50} color="white" />
            <h1 className="fuente">Coinsenda</h1>
          </div>
          <p className="fuente">{appLoadLabel}</p>
        </div>
      )}
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
