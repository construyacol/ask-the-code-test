import React, { useEffect, useState } from "react";
import { Router, Route } from "react-router-dom";
import localForage from "localforage";
import loadable from "@loadable/component";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../actions";
import withHandleError from "./withHandleError";
import withCoinsendaServices from "./withCoinsendaServices";
import HomeContainer from "./home/home-container";
import { history } from "../const/const";
import useToastMessage from "../hooks/useToastMessage";
import LoaderAplication from './widgets/loaders/loader_app'
import { store } from '../'
import hotJar from '../services/Hotjar'
import { STORAGE_KEYS } from "../const/storageKeys";
import { CAPACITOR_PLATFORM } from 'const/const'
import SessionRestore, { updateLocalForagePersistState } from "hooks/sessionRestore";
import CookieMessage from 'components/widgets/cookieMessage'
import {
  // doLogout,
  // verifyTokensValidity,
  // validateExpTime,
  saveUserToken,
  getUserToken,
  openLoginMobile
} from "utils/handleSession";
// import { getAllUrlParams } from "utils/urlUtils";
import { DEFAULT_PARAMS } from 'utils/paymentRequest'
// import checkVersion from 'react-native-store-version';

// const LazyLoader = loadable(() => import(/* webpackPrefetch: true */ "./widgets/loaders/loader_app"));
// const LazySocket = loadable(() => import(/* webpackPrefetch: true */ "./sockets"));
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
  const [toastMessage] = useToastMessage();
  const [ showOnBoarding, setShowOnBoarding ] = useState(false)
  const [ tryRestoreSession ] = SessionRestore();


  const initComponent = async (mobileURL) => {

    const params = new URLSearchParams(mobileURL ?? history.location.search);
    // if(params.has(DEFAULT_PARAMS.main)){
    //   console.log('getAllUrlParams', getAllUrlParams(history.location.search))
    //   return history.push("/paymentRequest");
    // }
    if(params.has("token") && params.has("refresh_token")){
      await localForage.setItem("sessionState", {});
      const decodeJwt = await saveUserToken(params.get("token"), params.get("refresh_token"))
      if(!decodeJwt)return;
      history.push("/");
    }
    const userData = await getUserToken();
    if(!userData){return console.log('Error obteniendo el token::48 Root.js')}
    const { userToken, decodedToken } = userData
    // if(decodedToken.email.includes('bitsendaTest')) return console.log('decodedToken ==> ', decodedToken);
    if(!Object.keys(authData).length){
      props.actions.setAuthData({
        userToken,
        userEmail: decodedToken.email,
        userId: decodedToken.usr
      });
    }
    const parent = window.parent;
    if(parent){
      parent.postMessage("loadedAndLogged", "*");
      if(params.has("recovery")){
        return console.log('<========   Recuperando sesión   =======>')
      }
    }
    if(params.has('face_recognition')){
      const Element = await import("./forms/widgets/biometricKycComponent/init");
      if (!Element) return;
      const BiometricKyc = Element.default
      props.actions.renderModal(() => <BiometricKyc/>);
    }

    history.push("/");
  };

  useEffect(() => {
    async function initRoot() {
      if (CAPACITOR_PLATFORM !== 'web') {
        const userToken = await localForage.getItem(STORAGE_KEYS.user_token);
        if (!userToken && !isAppLoaded) {
          openLoginMobile(initComponent);
        }
      } 
      if(!isAppLoaded) return initComponent();
    }
    initRoot()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAppLoaded]);

  useEffect(() => {
    hotJar()
  }, [])

  useEffect(() => {
    if(showOnBoarding){ 
      const initOnBoarding = async() => {
        const Element = await import("./forms/widgets/onBoardingComponent/init");
        const OnBoardingComponent = Element.default
        return props.actions.renderModal(() => <OnBoardingComponent/>); 
      }
        initOnBoarding()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnBoarding])

  return (
    <Router history={history}>
      <Route>
        <ModalsSupervisor/>
      </Route>

      <Route exact strict path="/paymentRequest" render={() => <div style={{width:"100vw", height:"100vh", background:"red"}}><p>Solicitud de pago</p></div>} />

      {(!isAppLoaded) ? (
        <LoaderAplication 
          history={history} 
          tryRestoreSession={tryRestoreSession}
          setShowOnBoarding={setShowOnBoarding} 
          {...props}
        />
      ) : (
        <>
          <CookieMessage/>
          <LazySocket toastMessage={toastMessage} />
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
// export default withCoinsendaServices(withHandleError(connect(() => ({}), mapDispatchToProps)(RootContainer)));
