import React, { useState, useEffect } from 'react'
import HomeContainer from './home/homeContainer'
import { Router, Route, Switch } from 'react-router-dom'
// import createBrowserHistory from "history/createBrowserHistory"
import { createBrowserHistory } from "history";
import localForage from 'localforage'
// import PagesRouter from './landingPage/pages'
import jwt from 'jsonwebtoken'

import { isValidToken } from "./utils"
// import FreshChat from '../services/freshChat'
// import AuthComponentContainer from './auth'
// import LandingPageContainer from './landing_page/landingContainer'
// import Landing from './landingPage'

const history = createBrowserHistory();

function RootContainer() {
  const [userToken, setUserToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userEmail, setUserEmail] = useState(null);

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

    setUserId(usr)
    setUserToken(userToken)
    setUserEmail(email)

    history.push('/')
  }

  const doLogout = async () => {
    await localForage.removeItem('user_token')
    await localForage.removeItem('created_at')
    setUserId(null)
    setUserToken(null)
    setUserEmail(null)
    window.location.href = process.env.NODE_ENV === 'development' ? "https://devsertec.com/" : "https://www.coinsenda.com/";
  }

  useEffect(() => {
    initComponent()
  }, [])

  const authProps = {
    userToken,
    userEmail,
    userId,
    doLogout
  }

  return (
    <Router
      history={history}
    >
      <Switch>
        <Route path="/" render={() => (
          userToken ?
            <HomeContainer history={history} user_data={authProps} {...this.props} />
            :
            <div style={{ background: "linear-gradient(to bottom right,#014c7d,#0198ff)", width: "100vw", height: "100vh" }} />
        )} />
      </Switch>
    </Router>

  )

}

export default RootContainer
