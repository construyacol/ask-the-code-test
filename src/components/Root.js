import React, { useState, useEffect } from 'react'
import HomeContainer from './home/homeContainer'
import { Router, Route, Switch } from 'react-router-dom'
// import createBrowserHistory from "history/createBrowserHistory"
import { createBrowserHistory } from "history";
import localForage from 'localforage'
// import PagesRouter from './landingPage/pages'
import jwt from 'jsonwebtoken'

import { isValidToken } from "./utils"
import { connect } from 'react-redux';
import actions from '../actions';
import { bindActionCreators } from 'redux';

// import FreshChat from '../services/freshChat'
// import AuthComponentContainer from './auth'
// import LandingPageContainer from './landing_page/landingContainer'
// import Landing from './landingPage'

const history = createBrowserHistory();

function RootContainer(props) {
  const [userToken, setUserToken] = useState(null)

  const doLogout = async () => {
    await localForage.removeItem('user_token')
    await localForage.removeItem('created_at')
    setUserToken(null)
    window.location.href = process.env.NODE_ENV === 'development' ? "https://devsertec.com/" : "https://www.coinsenda.com/";
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
    setUserToken(userToken)
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
        <Route path="/" render={() => (
          userToken ?
            <HomeContainer />
            :
            <div style={{ background: "linear-gradient(to bottom right,#014c7d,#0198ff)", width: "100vw", height: "100vh" }} />
        )} />
      </Switch>
    </Router>

  )

}

export default connect(() => ({}), (dispatch) => bindActionCreators({ setAuthData: actions.setAuthData }, dispatch))(RootContainer)
