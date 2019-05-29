import React, { Component, Fragment } from 'react'
import HomeContainer from './home/homeContainer'
import { Router, Route, Switch } from 'react-router-dom'
import createBrowserHistory from "history/createBrowserHistory"
import LandingPage from './landingPage'
import localForage from 'localforage'
import PagesRouter from './landingPage/pages'
// import AuthComponentContainer from './auth'

const history = createBrowserHistory();
// http://sendaauth.ngrok.io/public/signin?clientId=5bea09f3b5f9071f69c49e05

class RootContainer extends Component {

  state = {
    TokenUser:null
  }

  componentDidMount(){
    this.init_component()
  }

  init_component = async() =>{
    let result
    let TokenUser

    if(history.location.search){
      result = history.location.search.split("?token=")
      TokenUser = result[1]
      await localForage.setItem('TokenUser', TokenUser)
    }

    // let AccessToken = await localForage.getItem('TokenUser')
    let AccessToken = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inpla3kubGFmK2xvY2FsQGdtYWlsLmNvbSIsImxhbmd1YWdlIjoiZXMiLCJpc3MiOiI1YmVhMDlmM2I1ZjkwNzFmNjljNDllMDUiLCJ1c3IiOiI1YmVhMWYwMWJhODQ0OTMwMThiNzUyOGMiLCJqdGkiOiJtTXVCUENieUdlT29NVmZJcG5ZS3lFYW4zaGtra0FFbWxXb21zQVpEeGxDbWZTQ2Q3aHpFYVlGSkRNbVFnajg3IiwiYXVkIjoidHJhbnNhY3Rpb24sYXV0aCxpZGVudGl0eSxub3RpZmljYXRpb24iLCJtZXRhZGF0YSI6IntcImNsaWVudElkXCI6XCI1YmVhMDlmM2I1ZjkwNzFmNjljNDllMDVcIn0iLCJpYXQiOjE1NTkxMDk5ODAsImV4cCI6MTU1OTEyMDc4MH0.iQpTtx_yMnMr-bLy5rmzsb696J64TNNCAy4kJhoFQG3FR8G1P_LYwOk6-TvxEaUNl0cwNvp5YrQzIqp6rGp_wg'

    this.setState({
      TokenUser:AccessToken
    })
    // console.log('ACCESS TOKEN:', AccessToken)
  }

  logOut = async() =>{
    await localForage.removeItem('TokenUser')
    await this.setState({TokenUser:false})
    history.push('/')
  }

  render(){

    const { store } = this.props
    const { TokenUser } = this.state

    return(
      <Router
        history={history}
        >
          <Switch>
            <Route strict path="/help" component={PagesRouter} />
            <Route path="/" render={ () => (
              TokenUser ? (
                  <HomeContainer history={history} token={TokenUser} logOut={this.logOut} />
              ) : (
                // <AuthComponentContainer/>
                <LandingPage history={history} />
              )
            )}/>
          </Switch>
      </Router>
    )

  }

}

export default RootContainer
