import React from "react";
// import {render} from 'react-dom';
// import { hydrate, render } from "react-dom";
import { render } from "react-snapshot";
import "./basic-style.css";
import "./index.css";
import "./new-mobile-style.css";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware } from "redux";
import RootContainer from "./components/Root";
// import RootContainer from './root'
import reducer from "./reducers";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import soundsMiddleware from "redux-sounds";
import soundData from "./sounds";
import { Provider } from "react-redux";
import { mainService } from "./services/MainService";
import { updateLocalForagePersistState } from "./components/hooks/sessionRestore";
// const script = document.createElement("script");
// script.src = "https://scrollmagic.io/docs/plugins_debug.addIndicators.js";
// script.async = true;
// document.body.appendChild(script);
const loadedSoundsMiddleware = soundsMiddleware(soundData);

const store = createStore(
  reducer,
  {},
  composeWithDevTools(applyMiddleware(logger, thunk, loadedSoundsMiddleware))
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  if (store.getState().modelData.authData.userToken) {
    mainService.setGlobalState(store.getState());
  }
  window.onbeforeunload = updateLocalForagePersistState(
    store.getState().modelData
  );
});

const home = document.getElementById("home-container");
render(
  <Provider store={store}>
    <RootContainer />
  </Provider>,
  home
);

// const rootElement = document.getElementById('home-container')
// if (rootElement.hasChildNodes()) {
//   hydrate(<Provider store={store}><RootContainer/></Provider>, rootElement);
// } else {
//   render(<Provider store={store}><RootContainer/></Provider>, rootElement);
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
// serviceWorker.unregister();

export default store;

// const logger = ({getState, dispatch}) => next => action => {
//   console.log('estado anterior', getState())
//   console.log('Acción', action)
//   const value = next(action)
//   console.log('este es mi nuevo estado', getState())
//   return value
// }
