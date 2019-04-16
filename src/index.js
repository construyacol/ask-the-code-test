import React, { Fragment } from 'react';
import {render} from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux'
import RootContainer from './components/Root'
import reducer from './reducers'
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import soundsMiddleware from 'redux-sounds'
import soundData from './sounds'
import { Provider } from 'react-redux'

const loadedSoundsMiddleware = soundsMiddleware(soundData)

const store = createStore(
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

const home = document.getElementById('home-container')


render(
  <Provider store={store}>
      <RootContainer store={store} />
  </Provider>
 , home
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
// serviceWorker.unregister();

export default store


// const logger = ({getState, dispatch}) => next => action => {
//   console.log('estado anterior', getState())
//   console.log('Acción', action)
//   const value = next(action)
//   console.log('este es mi nuevo estado', getState())
//   return value
// }
