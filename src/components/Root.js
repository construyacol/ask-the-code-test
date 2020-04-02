import React, { useEffect } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from "history";
import localForage from 'localforage'
import jwt from 'jsonwebtoken'
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';
import LoaderAplication from './widgets/loaders/loader_app'
import HomeContainer from './home/home-container'
import { isValidToken } from "./utils"

const history = createBrowserHistory();
const COINSENDA_URL = process.env.NODE_ENV === 'development' ? "https://devsertec.com/" : "https://www.coinsenda.com/";

function RootContainer(props) {
  // TODO: rename isLoading from state
  const isAppLoaded = useSelector(({ isLoading }) => isLoading.isAppLoaded)

  const doLogout = async () => {
    await localForage.removeItem('user_token')
    await localForage.removeItem('created_at')
    window.location.href = COINSENDA_URL
  }

  const initComponent = async () => {
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

    props.setAuthData({
      userToken,
      userEmail: email,
      userId: usr,
      doLogout
    })
    history.push('/')
  }

  useEffect(() => {
    initComponent()
  }, [])

  return (
    <Router
      history={history}
    >
      <Switch>
        <Route path="/" render={() => (!isAppLoaded ? <LoaderAplication history={history} /> : <HomeContainer />)} />
      </Switch>
    </Router>

  )

}

export default connect(() => ({}), (dispatch) => bindActionCreators({ setAuthData: actions.setAuthData }, dispatch))(RootContainer)
