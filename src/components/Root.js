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

const LazyLoader = loadable(() => import(/* webpackPrefetch: true */ "./widgets/loaders/loader_app"));
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
    // return console.log('|||||||||||||||||||||||||||||||||| HISTORY?::', history)
    const params = new URLSearchParams(history.location.search);

    if (params.has("token")) {
      console.log('|||||||||||||||||||||||||||      |||||||||||||||| params.has:::', params.get("token"))
      // debugger
      await localForage.setItem("user_token", params.get("token"));
      await localForage.setItem("created_at", new Date());

      history.push("/");
    }


    // const userToken = JSON.parse(localForage.getItem('user_token'));
    // const created_at = JSON.parse(localForage.getItem('created_at'));
    const userToken = await localForage.getItem("user_token");
    const created_at = await localForage.getItem("created_at");
    // console.log('|||||||||||||||||||||||||||||||||||||||      |||| userToken:::', userToken)
    // console.log('|||||||||||||||||||||||||||||||||||||||||||||||| created_at:::', created_at)
    // debugger
    if (!created_at || !userToken) {
      return doLogout();
    }
    const availableToken = isValidToken(created_at);
    if (!availableToken) {
      toastMessage(`Su sessión ha caducado`, "error");
      return doLogout();
    }
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
    // aqui se verifica que el origen del mensaje sea del Landing

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
      {!isAppLoaded || (window.reactSnap && process.env.NODE_ENV === "production") ? (
        <LazyLoader tryRestoreSession={tryRestoreSession} history={history} />
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
