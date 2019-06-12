import React, { Component } from 'react'
import HomeContainer from './home/homeContainer'
import { Router, Route, Switch } from 'react-router-dom'
import createBrowserHistory from "history/createBrowserHistory"
import localForage from 'localforage'
import PagesRouter from './landingPage/pages'
// import AuthComponentContainer from './auth'
import LandingPageContainer from './landing_page/landingContainer'

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
    // let AccessToken = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inpla3kubGFmK2xvY2FsQGdtYWlsLmNvbSIsImxhbmd1YWdlIjoiZXMiLCJpc3MiOiI1YmVhMDlmM2I1ZjkwNzFmNjljNDllMDUiLCJ1c3IiOiI1YmVhMWYwMWJhODQ0OTMwMThiNzUyOGMiLCJqdGkiOiJBUVZKVzZjSTVQVmkwU1RjSWhCZnVZeEdaeUtva1BRYXJFYWg4RVpEZDk0SndRY2t6VXoxZTFlTjNHZ0w3RUFQIiwiYXVkIjoidHJhbnNhY3Rpb24sYXV0aCxpZGVudGl0eSxub3RpZmljYXRpb24iLCJtZXRhZGF0YSI6IntcImNsaWVudElkXCI6XCI1YmVhMDlmM2I1ZjkwNzFmNjljNDllMDVcIn0iLCJpYXQiOjE1NjAyODY2NDIsImV4cCI6MTU2MDI5NzQ0Mn0.iwN-f20P4ndMoIB1JKzQq_7SWwMC-o9zLPorYXl8oHv3AP1gK7ZnrIwLpfNm35k2s_3-SRGtXmw85oq996BCkg'

    this.setState({
      // TokenUser:AccessToken
      TokenUser:null
    })
  }

  logOut = async() =>{
    await localForage.removeItem('TokenUser')
    await this.setState({TokenUser:false})
    history.push('/')
  }

  render(){

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
                <LandingPageContainer history={history} />
                // <LandingPage history={history} />
              )
            )}/>
          </Switch>
      </Router>
    )
  }
}

export default RootContainer
