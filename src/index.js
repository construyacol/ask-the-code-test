import React, { Suspense } from 'react';
import { render } from 'react-dom';
// import { hydrate, render } from "react-dom";
// import { render } from 'react-snapshot';
import './basic-style.css';
import './index.css';
import './new-mobile-style.css';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux'
// import RootContainer from './root'
import reducer from './reducers'
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import soundsMiddleware from 'redux-sounds'
import soundData from './sounds'
import { Provider } from 'react-redux'
import { mainService } from './services/MainService';
import LoaderAplicationTiny from './components/widgets/loaders/loader-application-tiny';
// import { updateLocalForagePersistState } from './components/hooks/sessionRestore';
// const script = document.createElement("script");
// script.src = "https://scrollmagic.io/docs/plugins_debug.addIndicators.js";
// script.async = true;
// document.body.appendChild(script);
const loadedSoundsMiddleware = soundsMiddleware(soundData)

let store;
if (process.env.NODE_ENV === 'production') {
  store = createStore(
    reducer,
    {},
    composeWithDevTools(
      applyMiddleware(
        thunk,
        loadedSoundsMiddleware
      )
    )
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
} else {
  store = createStore(
    reducer,
    {},
    composeWithDevTools(
      applyMiddleware(
        logger,
        thunk,
        loadedSoundsMiddleware
      )
    )
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
}

store.subscribe(() => {
  if (store.getState().modelData.authData.userToken) {
    mainService.setGlobalState(store.getState())
  }
  // window.onbeforeunload = updateLocalForagePersistState(store.getState().modelData)
});

const LazyRoot = React.lazy(() => import('./components/Root'))

render(
  <Suspense fallback={<LoaderAplicationTiny />}>
    <Provider store={store}>
      <LazyRoot />
    </Provider>
  </Suspense>
  , document.getElementById('home-container')
);

const noLogsOnProduction = () => {
  console.log = () => null
}

if (process.env.NODE_ENV === 'production') {
  noLogsOnProduction()
}

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

export default store