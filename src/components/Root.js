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

const LazyLoader = loadable(() =>
  import(/* webpackPrefetch: true */ "./widgets/loaders/loader_app")
);
const LazySocket = loadable(() => import("./sockets/sockets"));
const LazyToast = loadable(() => import("./widgets/toast/ToastContainer"));

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
      await localForage.setItem("user_token", params.get("token"));
      await localForage.setItem("created_at", new Date());

      history.push("/");
    }

    // const userToken =
    //   "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbnN0cnV5YWNvbCtkb3VnbGFzQGdtYWlsLmNvbSIsImxhbmd1YWdlIjoiZXMiLCJpc3MiOiI1ZTc5NDcxNzY0ZGNkYjAxNmEzNjljZDgiLCJ1c3IiOiI1ZWNkYWQyZGNkZmI3NDAwZTE4NzA2NmIiLCJqdGkiOiJsSVhVSGxPdlkzVnBhSU1wSnMxY2pnT0VaQ2Z4ZElYZDhDYVFRejB3SGhYaExqbWtHUW9KbHdHb3R4RFdxd3phIiwiYXVkIjoidHJhbnNhY3Rpb24sYXV0aCxpZGVudGl0eSxpbmZvLGRlcG9zaXQsYWNjb3VudCx3aXRoZHJhdyxzd2FwIiwibWV0YWRhdGEiOiJ7XCJjbGllbnRJZFwiOlwiNWU3OTQ3MTc2NGRjZGIwMTZhMzY5Y2Q4XCJ9IiwiaWF0IjoxNjA0NjAzNjgzLCJleHAiOjE2MDQ2MTQ0ODN9.MGG7I1X3CyIrUGUIxUyYm_LxAY3lsC5xw-l0CyFilGv3PE2RTwNQTlPJkO9ZQpphbE0gTkmPYygGFgXbJGAyrw";

    const created_at = await localForage.getItem("created_at");
    const userToken = await localForage.getItem("user_token");
    if (!created_at || !userToken) {
      return doLogout();
    }

    const availableToken = isValidToken(created_at);
    if (!availableToken) {
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
      {!isAppLoaded ||
      (window.reactSnap && process.env.NODE_ENV === "production") ? (
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

export default withHandleError(
  connect(() => ({}), mapDispatchToProps)(RootContainer)
);

//
