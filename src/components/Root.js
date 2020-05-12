import React, { useEffect, useState } from 'react'
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
import { COINSENDA_URL } from '../const/const';
import { doLogout } from './utils'
import { history } from '../const/const';
import SessionRestore from './hooks/sessionRestore'
// import { useCoinsendaServices } from '../services/useCoinsendaServices'

let session = {}

function RootContainer(props) {
  // TODO: rename isLoading from state
  const isAppLoaded = useSelector(({ isLoading }) => isLoading.isAppLoaded)
  const [ tryRestoreSession ] = SessionRestore()
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
    history.push('/')
  }


  useEffect(() => {
    initComponent()
  }, [])

  // useEffect(()=>{
  //   // console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||| SESSION :', session)
  //   // debugger
  //   if(session && Object.keys(session).length){
  //     const init = async() => {
  //       // await coinsendaServices.countryValidator()
  //       coinsendaServices.postLoader(doLogout)
  //       await props.actions.isLoggedInAction(true)
  //       await props.actions.isAppLoaded(true)
  //       return history.push('/wallets')
  //     }
  //     init()
  //   }
  // }, [session])


  return (
    <Router
      history={history}
    >

      <SocketsComponent />
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
