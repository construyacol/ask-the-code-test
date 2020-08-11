import React, { useEffect } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import localForage from 'localforage'
import jwt from 'jsonwebtoken'
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';
import LoaderAplication from './widgets/loaders/loader_app'
import HomeContainer from './home/home-container'
import { isValidToken } from "./utils"
import withHandleError from './withHandleError';
import SocketsComponent from './sockets/sockets'
// import CoinsendaSocket from './sockets/new-socket'
import ToastContainers from './widgets/toast/ToastContainer'
import { doLogout } from './utils'
import { history } from '../const/const';
import SessionRestore from './hooks/sessionRestore'
import { useToastMesssage } from '../hooks/useToastMessage';
// import { useCoinsendaServices } from '../services/useCoinsendaServices'

history.listen((location) => {
  if(location && location.pathname !== '/') {
    return localForage.setItem('previousRoute', location.pathname)
  }
})

function RootContainer(props) {
  // TODO: rename isLoading from state
  const isAppLoaded = useSelector(({ isLoading }) => isLoading.isAppLoaded)
  const [ tryRestoreSession ] = SessionRestore()
  const [ toastMessage ] = useToastMesssage()
  // const [ coinsendaServices ] = useCoinsendaServices()

  const initComponent = async () => {
    // return console.log('|||||||||||||||||||||||||||||||||| HISTORY?::', history)
    const params = new URLSearchParams(history.location.search)

    if (params.has('token')) {
      await localForage.setItem('user_token', params.get('token'))
      await localForage.setItem('created_at', new Date())

      history.push('/')
    }

    const userToken = await localForage.getItem('user_token')
    const created_at = await localForage.getItem('created_at')
    if (!created_at || !userToken) { return doLogout() }

    const availableToken = isValidToken(created_at)
    if (!availableToken) { return doLogout() }
    const userData = jwt.decode(userToken)
    if (!userData) { return doLogout() }
    const { usr, email } = userData

    props.actions.setAuthData({
      userToken,
      userEmail: email,
      userId: usr
    })

    // En este punto el token es valido
    // aqui se verifica que el origen del mensaje sea del Landing

    const parent = window.parent;
    if(parent) {
      parent.postMessage('loadedAndLogged', '*');
    }

    history.push('/')
  }


  useEffect(() => {
    initComponent()
  }, [])

  return (
    <Router
      history={history}
    >

      <SocketsComponent toastMessage={toastMessage} />
      {/* <CoinsendaSocket /> */}
      <ToastContainers />
      <Switch>
        <Route path="/" render={() => (
          !isAppLoaded ?
          <LoaderAplication tryRestoreSession={tryRestoreSession} history={history} />
          :
          <HomeContainer />)} />
      </Switch>
    </Router>
  )

}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions , dispatch)
  }
}

export default withHandleError(connect(() => ({}), mapDispatchToProps)(RootContainer))







//
