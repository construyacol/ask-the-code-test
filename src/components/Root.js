import React, { useEffect, useState } from "react";
import { Router, Route } from "react-router-dom";
import localForage from "localforage";
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
// import useValidateTokenExp from './hooks/useValidateTokenExp'
import FreshChat from '../services/FreshChat' 
import { store } from '../'
import { updateLocalForagePersistState } from './hooks/sessionRestore'
import {
  // doLogout,
  verifyTokensValidity,
  saveUserToken,
  getUserToken
} from "./utils";

// const LazyLoader = loadable(() => import(/* webpackPrefetch: true */ "./widgets/loaders/loader_app"));
const LazySocket = loadable(() => import(/* webpackPrefetch: true */ "./sockets/sockets"));
const LazyToast = loadable(() => import(/* webpackPrefetch: true */ "./widgets/toast/ToastContainer"));
const ModalsSupervisor = loadable(() => import("./home/modals-supervisor.js"));

history.listen((location) => {
  if (location && location.pathname !== "/") {
    updateLocalForagePersistState(store.getState().modelData)
    return localForage.setItem("previousRoute", location.pathname);
  }
});

function RootContainer(props) { 
  // TODO: rename isLoading from state
  const isAppLoaded = useSelector(({ isLoading }) => isLoading.isAppLoaded);
  const authData = useSelector(({ modelData:{ authData } }) => authData);
  const [tryRestoreSession] = SessionRestore();
  const [toastMessage] = useToastMessage();
  const [ showOnBoarding, setShowOnBoarding ] = useState(false)
  // useValidateTokenExp()

  const initComponent = async () => {
    const params = new URLSearchParams(history.location.search);

    if (params.has("token") && params.has("refresh_token")) {
      await localForage.setItem("sessionState", {});
      const decodeJwt = await saveUserToken(params.get("token"), params.get("refresh_token"))
      if(!decodeJwt){return}
      history.push("/");
    }

    const userData = await getUserToken();
    
    if(!userData){return console.log('Error obteniendo el token::48 Root.js')}
    const { userToken, decodedToken } = userData
    // if(decodedToken.email.includes('_testing')){
    //   return console.log('userToken ==> ', userToken)
    // }
    if(!Object.keys(authData).length){
      props.actions.setAuthData({
        userToken,
        userEmail: decodedToken.email,
        userId: decodedToken.usr
      });
    }

    verifyTokensValidity()
    // En este punto el token es valido
    // Emitimos un mensaje de usuario logeado, escuchamos el mensaje desde la landing page para recuperar la sesión

    
    const parent = window.parent;
    if(parent){
      parent.postMessage("loadedAndLogged", "*");
      if(params.has("recovery")){
        return console.log('<========   Recuperando sesión   =======>')
      }
    }
 
    if(params.has('face_recognition')){
      const Element = await import("./forms/widgets/biometricKycComponent/init");
      if(!Element) return;
      const FormsComponent = Element.default
      props.actions.renderModal(() => <FormsComponent/>);
    }
    history.push("/");
  };

  useEffect(() => {
    initComponent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(showOnBoarding){
      const initOnBoarding = async() => {
        const Element = await import("./forms/widgets/onBoardingComponent/init");
        // const Element = await import("./forms/widgets/personalKycComponent/init");
        const OnBoardingComponent = Element.default
        return props.actions.renderModal(() => <OnBoardingComponent/>); 
      }
      initOnBoarding()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnBoarding])

  return (
    // TODO: <TokenValidator></TokenValidator>
    <Router history={history}>

      <Route>
        <ModalsSupervisor/>
      </Route>

      {!isAppLoaded ? (
        <LoaderAplication tryRestoreSession={tryRestoreSession} history={history} setShowOnBoarding={setShowOnBoarding} />
      ) : (
        <>
          <LazySocket toastMessage={toastMessage} />
          <FreshChat/>
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
