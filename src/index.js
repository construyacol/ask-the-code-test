import React from "react";
import { render } from 'react-snapshot';
import "react-toastify/dist/ReactToastify.css";
import "./basic-style.css";
import "./index.css";
import "./new-mobile-style.css";
import "./components/sockets/socket_notify/socketNotify.css";
import * as serviceWorker from "./serviceWorker"; 
import { Provider } from "react-redux";
import { _createStore } from "./store";
import RootContainer from "./components/Root" 
import AppThemeProvider from 'components/layout/themeProvider'

export const store = _createStore();

const rootElement = document.getElementById("home-container");

const App = () => {
  return(
    <Provider store={store}>
      <AppThemeProvider>
        <RootContainer/>
      </AppThemeProvider>
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
