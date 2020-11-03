import React, { useEffect } from "react";
import { Router, Route } from "react-router-dom";
import localForage from "localforage";
import jwt from "jsonwebtoken";
import loadable from "@loadable/component";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../actions";
// import { isValidToken } from "./utils"
import withHandleError from "./withHandleError";
import HomeContainer from "./home/home-container";
import { doLogout } from "./utils";
import { history } from "../const/const";
import SessionRestore from "./hooks/sessionRestore";
import useToastMessage from "../hooks/useToastMessage";

const LazyLoader = loadable(() => import("./widgets/loaders/loader_app"));
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

    const userToken =
      "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbnN0cnV5YWNvbCtkb3VnbGFzQGdtYWlsLmNvbSIsImxhbmd1YWdlIjoiZXMiLCJpc3MiOiI1ZTc5NDcxNzY0ZGNkYjAxNmEzNjljZDgiLCJ1c3IiOiI1ZWNkYWQyZGNkZmI3NDAwZTE4NzA2NmIiLCJqdGkiOiIzRUo4OFBqSmc2ZXJGMGZvSGU0S1dBSEVrTVVFQjVDUk5CNEJDT2RWcUFvMzhKOWU3bTljRnBxNzRINzU2Q3hzIiwiYXVkIjoidHJhbnNhY3Rpb24sYXV0aCxpZGVudGl0eSxpbmZvLGRlcG9zaXQsYWNjb3VudCx3aXRoZHJhdyxzd2FwIiwibWV0YWRhdGEiOiJ7fSIsImlhdCI6MTYwNDMzMTU5NywiZXhwIjoxNjA0MzQyMzk3fQ.SFjIUWRwGdMBug5dtB7HFMSxfYnej-moWX39Mw0DrBanVGKFK9CV5BtthFSTyTOHhNbUC8wrJOB-7YJW2Acf4A";

    // const created_at = await localForage.getItem('created_at')
    // const userToken = await localForage.getItem('user_token')
    // if (!created_at || !userToken) { return doLogout() }

    // const availableToken = isValidToken(created_at)
    // if (!availableToken) { return doLogout() }
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

    // const parent = window.parent;
    // if (parent) {
    //   parent.postMessage('loadedAndLogged', '*');
    // }

    history.push("/");
  };

  useEffect(() => {
    initComponent();
  }, []);

  return (
    <Router history={history}>
      {!isAppLoaded ? (
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
