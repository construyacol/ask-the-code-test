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
import { DEFAULT_PARAMS } from 'utils/paymentRequest'
import { getAllUrlParams } from "utils/urlUtils";
import { loadKeyboard } from "utils";

const LazySocket = loadable(() => import(/* webpackPrefetch: true */ "components/sockets/sockets"));
const LazyToast = loadable(() => import(/* webpackPrefetch: true */ "components/widgets/toast/ToastContainer"));
const ModalsSupervisor = loadable(() => import("./home/modals-supervisor.js"));
const PaymentRequestView = loadable(() => import('pages/paymentRequest'));

loadKeyboard();

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
    if(params.has("token") && params.has("refresh_token")){
      await localForage.setItem("sessionState", {});
      const decodeJwt = await saveUserToken(params.get("token"), params.get("refresh_token"))
      if(!decodeJwt)return;
      history.push("/");
    } 
    const paymentRequest = JSON.parse(localStorage.getItem('paymentRequest'))
    if(params.has(DEFAULT_PARAMS.main) || paymentRequest){
      return history.push({
        pathname: '/paymentRequest', 
        state:params.has(DEFAULT_PARAMS.main) ? getAllUrlParams(mobileURL ?? history.location.search) : { paymentRequest }
      });
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
    if(params.has('pse_success')){
      const Element = await import("components/forms/widgets/fiatDeposit/pseViews/callBackSuccess");
      if (!Element) return;
      const PseSuccess = Element.default
      const params = getAllUrlParams(mobileURL ?? history.location.search) || {}
      // const params = {}
      props.actions.renderModal(() => <PseSuccess {...params}/>);
    }
    history.push("/");
  };

  useEffect(() => {
    async function initRoot() {
      if(CAPACITOR_PLATFORM !== 'web'){
        function handleTouchEnd(event) {
          // scroll into input
          console.log('event.target ==> ', event.target);
          event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          event.preventDefault();
        }

        const inputElements = document.querySelectorAll('input, select, textarea');
        inputElements.forEach(function(element) {
          element.addEventListener('touchend', handleTouchEnd);
        });

        const appHeight = () => {
          const doc = document.documentElement
          doc.style.setProperty('--app-height', `${window.innerHeight}px`)
        }
        window.addEventListener('resize', appHeight)
        appHeight()
        const userToken = await localForage.getItem(STORAGE_KEYS.user_token);
        if(!userToken && !isAppLoaded) openLoginMobile(initComponent);
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
      <Route exact path="/paymentRequest" component={PaymentRequestView} />
      {(!isAppLoaded && !history.location.pathname.includes("paymentRequest")) ? (
        <LoaderAplication 
          history={history} 
          tryRestoreSession={tryRestoreSession}
          setShowOnBoarding={setShowOnBoarding} 
          {...props}
        />
      ) : isAppLoaded ? (
        <>
          <LazySocket toastMessage={toastMessage} />
          <CookieMessage/>
          <LazyToast />
          <Route path="/" render={() => <HomeContainer />} />
        </>
      ):<></>
      }
    </Router>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

// export default withHandleError(connect(() => ({}), mapDispatchToProps)(RootContainer));
export default withCoinsendaServices(withHandleError(connect(() => ({}), mapDispatchToProps)(RootContainer)));
