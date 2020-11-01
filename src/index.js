import React from 'react';
// import { render } from 'react-dom';
import loadable from '@loadable/component'
import { hydrate, render } from "react-dom";
// import { render } from 'react-snapshot';
import './basic-style.css';
import './index.css';
import './new-mobile-style.css';
import * as serviceWorker from './serviceWorker';
// import RootContainer from './root'
import { Provider } from 'react-redux'
import LoaderAplicationTiny from './components/widgets/loaders/loader-application-tiny';
import { _createStore } from './store';
// import { updateLocalForagePersistState } from './components/hooks/sessionRestore';
// const script = document.createElement("script");
// script.src = "https://scrollmagic.io/docs/plugins_debug.addIndicators.js";
// script.async = true;
// document.body.appendChild(script);

const LazyRoot = loadable(() => import('./components/Root'), {
  fallback: <LoaderAplicationTiny />
})

export const store = _createStore()


const rootElement = document.getElementById('home-container')
const App = () => (
  <Provider store={store}>
    <LazyRoot />
  </Provider>
)

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
  
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.register();
} else {
  render(<App />, rootElement);
}

const noLogsOnProduction = () => {
  console.log = () => null
}

if (process.env.NODE_ENV === 'production') {
  noLogsOnProduction()
}

if ((window && window.CSS) && window.CSS.registerProperty) {
  window.CSS.registerProperty({
    name: '--primary',
    syntax: '<color>',
    inherits: true,
    initialValue: '#014c7d',
  });
  window.CSS.registerProperty({
    name: '--secondary',
    syntax: '<color>',
    inherits: true,
    initialValue: '#0198ff',
  });
}