import React, { Component } from 'react'
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
    let AccessToken = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inpla3kubGFmK2xvY2FsQGdtYWlsLmNvbSIsImxhbmd1YWdlIjoiZXMiLCJpc3MiOiI1YmVhMDlmM2I1ZjkwNzFmNjljNDllMDUiLCJ1c3IiOiI1YmVhMWYwMWJhODQ0OTMwMThiNzUyOGMiLCJqdGkiOiJCWlgyRXoxZHkybllMdTE5UEdHOHBERjJIU3RYUVd2dzhZZWxhd3c4MUQ3cjhVS3RxdmRlQUd2NHFpMHN1VmZwIiwiYXVkIjoidHJhbnNhY3Rpb24sYXV0aCxpZGVudGl0eSxub3RpZmljYXRpb24iLCJtZXRhZGF0YSI6IntcImNsaWVudElkXCI6XCI1YmVhMDlmM2I1ZjkwNzFmNjljNDllMDVcIn0iLCJpYXQiOjE1NTk3ODI5MTYsImV4cCI6MTU1OTc5MzcxNn0.gGanZaOGq95sacamhKsL7fbhA26hdAWRHgGC7L6Y7zYqdE6khqbiwMyYfHa7X9fTkv-1Xud4yLcBtCLJ5EXzEw'

    this.setState({
      TokenUser:AccessToken
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
