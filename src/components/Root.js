import React, { useEffect } from "react";
import { Router, Route } from "react-router-dom";
import localForage from "localforage";
import jwt from "jsonwebtoken";
import loadable from "@loadable/component";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../actions";
import withHandleError from "./withHandleError";
import HomeContainer from "./home/home-container";
import { doLogout, isValidToken } from "./utils";
import { history } from "../const/const";
import SessionRestore from "./hooks/sessionRestore";
import useToastMessage from "../hooks/useToastMessage";
import LoaderAplication from './widgets/loaders/loader_app'

// const LazyLoader = loadable(() => import(/* webpackPrefetch: true */ "./widgets/loaders/loader_app"));
const LazySocket = loadable(() => import(/* webpackPrefetch: true */ "./sockets/sockets"));
const LazyToast = loadable(() => import(/* webpackPrefetch: true */ "./widgets/toast/ToastContainer"));

history.listen((location) => {
  if (location && location.pathname !== "/") {
    return localForage.setItem("previousRoute", location.pathname);
  }
});

function RootContainer(props) {
  // TODO: rename isLoading from state
  const isAppLoaded = useSelector(({ isLoading }) => isLoading.isAppLoaded);
  const [tryRestoreSession] = SessionRestore();
  const [toastMessage] = useToastMessage();

  const initComponent = async () => {
    const params = new URLSearchParams(history.location.search);
    if (params.has("token")) {
      await localForage.setItem("user_token", params.get("token"));
      history.push("/");
    }

    const userToken = await localForage.getItem("user_token");
    if (!userToken) {return doLogout()}
    // TODO: is valid token
    const userData = jwt.decode(userToken);
    if (!userData) {
      return doLogout();
    }
    const { usr, email } = userData;

    props.actions.setAuthData({
      userToken,
      userEmail: email,
      userId: usr,
    });

    // En este punto el token es valido
    // Emitimos un mensaje de usuario logeado, escuchamos el mensaje desde la landing page para la recuperación de sesiones previas

    const parent = window.parent;
    if (parent) {
      parent.postMessage("loadedAndLogged", "*");
    }

    history.push("/");
  };

  useEffect(() => {
    initComponent();
  }, []);


  return (
    <Router history={history}>
      {!isAppLoaded ? (
        <LoaderAplication tryRestoreSession={tryRestoreSession} history={history} />
      ) : (
        <>
          <LazySocket toastMessage={toastMessage} />
          {/* <CoinsendaSocket /> */}
          <LazyToast />
          <Route path="/" render={() => <HomeContainer />} />
        </>
      )}
    </Router>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default withHandleError(connect(() => ({}), mapDispatchToProps)(RootContainer));

//
