import React, { Fragment } from 'react';
import {render} from 'react-dom';
import './index.css';
import HomeContainer from './components/home/homeContainer'
import * as serviceWorker from './serviceWorker';
// import sesion from './components/api'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
// import nomalizedApp from './schemas'
import reducer from './reducers'
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import soundsMiddleware from 'redux-sounds'
import soundData from './sounds'
import AuthComponentContainer from './components/auth'
import CubicMessageComponent from './components/widgets/showMessage/cubic'

// const logger = ({getState, dispatch}) => next => action => {
//   console.log('estado anterior', getState())
//   console.log('Acción', action)
//   const value = next(action)
//   console.log('este es mi nuevo estado', getState())
//   return value
// }

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
   // <Provider store={store}>
   //   <Fragment>
   //     <HomeContainer/>
   //   </Fragment>
   // </Provider>

 <AuthComponentContainer/>
  , home
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

export default store
