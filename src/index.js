import React from "react";
// import { render } from 'react-dom';
// import loadable from "@loadable/component";
// import { hydrate, render } from "react-dom";
import { render } from 'react-snapshot';
import "./basic-style.css";
import "./index.css";
import "./new-mobile-style.css";
import "./components/sockets/socket_notify/socketNotify.css";
import "./components/withdrawAccounts/new/views/ticket.css";
import "./components/withdrawAccounts/new/views/views.css";
// import "./components/wallets/newWallet/newWallet.css";
import * as serviceWorker from "./serviceWorker"; 
// import RootContainer from './root'
import { Provider } from "react-redux";
// import LoaderAplicationTiny from "./components/widgets/loaders/loader-application-tiny";
import { _createStore } from "./store";
// const script = document.createElement("script");
// script.src = "https://scrollmagic.io/docs/plugins_debug.addIndicators.js";
// script.async = true;
// document.body.appendChild(script);
import RootContainer from "./components/Root" 
// const LazyRoot = loadable(() => import(/* webpackPrefetch: true */ "./components/Root"), { fallback: <LoaderAplicationTiny /> });
// import OnBoardingComponent from './components/forms/widgets/onBoardingComponent/init'
// import PersonalKyc from './components/forms/widgets/personalKycComponent/init'

export const store = _createStore();

const rootElement = document.getElementById("home-container");

const App = () => {
  return(
    <Provider store={store}>
      <RootContainer/>
    </Provider>
  )
};

render(<App />, rootElement);

const noLogsOnProduction = () => {
  console.log = () => null;
};

if (process.env.NODE_ENV === "production" || process.env.REACT_APP_BUILD_CONFIG === "pre_prod") {
  noLogsOnProduction();
}

if(process.env.NODE_ENV === "production"){
  serviceWorker.register();
}

if (window && window.CSS && window.CSS.registerProperty) {
  window.CSS.registerProperty({
    name: "--primary_deg",
    syntax: "<color>",
    inherits: true,
    initialValue: "#ffffff",
  });
  window.CSS.registerProperty({
    name: "--secondary_deg",
    syntax: "<color>",
    inherits: true,
    initialValue: "#ffffff",
  });
}
