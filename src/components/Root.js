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
import { history } from "../const/const";
import SessionRestore from "./hooks/sessionRestore";
import useToastMessage from "../hooks/useToastMessage";
import LoaderAplication from './widgets/loaders/loader_app'
import useValidateTokenExp from './hooks/useValidateTokenExp'
import {
  doLogout,
  saveUserToken,
  getUserToken
} from "./utils";

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
  const authData = useSelector(({ modelData:{ authData } }) => authData);
  const [tryRestoreSession] = SessionRestore();
  const [toastMessage] = useToastMessage();
  useValidateTokenExp()


  const initComponent = async () => {
    const params = new URLSearchParams(history.location.search);

    if (params.has("token") && params.has("refresh_token")) {
      await saveUserToken(params.get("token"), params.get("refresh_token"))
      history.push("/");
    }

    const userData = await getUserToken();
    console.log('userData', userData)
    if(!userData){return}
    const { userToken, refreshToken, decodedToken } = userData
    if(!Object.keys(authData).length){
      props.actions.setAuthData({
        userToken,
        userEmail: decodedToken.email,
        userId: decodedToken.usr
      });
    }

    // En este punto el token es valido
    // Emitimos un mensaje de usuario logeado, escuchamos el mensaje desde la landing page para recuperar la sesión

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
    // TODO: <TokenValidator></TokenValidator>
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
