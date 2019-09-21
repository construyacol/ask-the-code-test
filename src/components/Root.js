import React, { Component } from 'react'
import HomeContainer from './home/homeContainer'
import { Router, Route, Switch } from 'react-router-dom'
import createBrowserHistory from "history/createBrowserHistory"
import localForage from 'localforage'
// import PagesRouter from './landingPage/pages'
import HelPages from './landing_page/help_pages'
import jwt from 'jsonwebtoken'

// import AuthComponentContainer from './auth'
import LandingPageContainer from './landing_page/landingContainer'
// import Landing from './landingPage'

const history = createBrowserHistory();
// http://sendaauth.ngrok.io/public/signin?clientId=5bea09f3b5f9071f69c49e05



class RootContainer extends Component {

  state = {
    TokenUser:null,
    userId:"default"
  }

  componentDidMount(){
    this.init_component()
  }

  token_is_valid = async(created_at) => {
    // Este metodo valida si el token esta vigente, vigencia => 2.5 hrs (150min)
    var fechaInicio = created_at.getTime();
    var fechaFin    = new Date().getTime();
    var diff = (fechaFin - fechaInicio)/(1000*60);
    if(parseInt(diff) >= 150){
      return false
    }
    return true
  }



  init_component = async() =>{

    let result
    let TokenUser

    if(history.location.search){
      result = history.location.search.split("?token=")
      TokenUser = result[1]
      await localForage.setItem('TokenUser', TokenUser)
      await localForage.setItem('created_at', new Date())
      history.push('/')
    }

    let AccessToken = await localForage.getItem('TokenUser')


    let created_at = await localForage.getItem('created_at')
    if(!created_at || !AccessToken){return this.logOut()}

    let availableToken = await this.token_is_valid(created_at)
    if(!availableToken){return this.logOut()}
    // console.log('|||||||| availableToken', availableToken)

    let userData = await jwt.decode(AccessToken)
    console.log('|||||||| userData', userData)
    if(!userData){return this.logOut()}
    const { usr } = userData
    console.log(AccessToken)
    this.setState({
      TokenUser:AccessToken,
      userId:usr
      // TokenUser:null
    })
  }

  logOut = async() =>{
    await localForage.removeItem('TokenUser')
    await localForage.removeItem('created_at')
    await this.setState({TokenUser:false, userId:null})
    history.push('/')
  }

  render(){

    const { TokenUser, userId } = this.state

    const user_data = {
      token:TokenUser,
      userId:userId,
      logOut:this.logOut
    }

    return(
      <Router
        history={history}
        >
          <Switch>
            <Route strict path="/docs" component={HelPages} />
            <Route path="/" render={ () => (
              TokenUser ? (
                  <HomeContainer history={history} user_data={user_data} />
              )
              : !userId &&
              (
               <LandingPageContainer history={history} />
              )
            )}/>
          </Switch>
      </Router>
    )
  }
}

export default RootContainer
