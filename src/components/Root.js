import React, { Component } from 'react'
import HomeContainer from './home/homeContainer'
import { Router, Route, Switch } from 'react-router-dom'
// import createBrowserHistory from "history/createBrowserHistory"
import { createBrowserHistory } from "history";
import localForage from 'localforage'
// import PagesRouter from './landingPage/pages'
import jwt from 'jsonwebtoken'
// import FreshChat from '../services/freshChat'
// import AuthComponentContainer from './auth'
// import LandingPageContainer from './landing_page/landingContainer'
// import Landing from './landingPage'

const history = createBrowserHistory();



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
    // console.log('|||||||| userData', userData)
    if(!userData){return this.logOut()}
    const { usr, email } = userData
    // console.log(AccessToken)
    this.setState({
      // TokenUser:'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inpla3kubGFmK2xvY2FsQGdtYWlsLmNvbSIsImxhbmd1YWdlIjoiZXMiLCJpc3MiOiI1ZDIzNDk4MTI0OWYwZDJkMWJmMWI3MmUiLCJ1c3IiOiI1ZDIzNGExMTMwMzViZTJlMThhOTUzY2EiLCJqdGkiOiJ3WjRwUk5rd096TjZmZUxsMGxBRVhZZld2QXpoRG0zMVVMVWZ1S0tvdTZHcngxYWdNODdMcHcyOVB4Umw1QmdWIiwiYXVkIjoidHJhbnNhY3Rpb24saWRlbnRpdHksYXV0aCIsIm1ldGFkYXRhIjoie1wiY2xpZW50SWRcIjpcIjVkMjM0OTgxMjQ5ZjBkMmQxYmYxYjcyZVwifSIsImlhdCI6MTU2OTQzODU2OCwiZXhwIjoxNTY5NDQ5MzY4fQ.1XkXD0mdOj0LfrSVyTsFs4ZkguH1kWS9aYPYdPs3v8_nSMIfVtU-Y6YXIgU0_gDoVU_Yr7tueZ5rxQWlxlNUkQ',
      TokenUser:AccessToken,
      userId:usr,
      email
      // TokenUser:'5d234a113035be2e18a953ca'
    })
    history.push('/')
  }

  logOut = async() =>{

    window.location.href = process.env.NODE_ENV === 'development' ? "https://devsertec.com/" :"https://www.coinsenda.com/";
    await localForage.removeItem('TokenUser')
    await localForage.removeItem('created_at')
    await this.setState({TokenUser:false, userId:null})
  }

  render(){

    const { TokenUser, userId, email } = this.state

    const user_data = {
      token:TokenUser,
      userId,
      logOut:this.logOut,
      email
    }

    return(
      <Router
        history={history}
        >
        <Switch>
          <Route path="/" render={()=>(
            TokenUser ?
            <HomeContainer history={history} user_data={user_data} {...this.props} />
            :
            <div style={{background:"linear-gradient(to bottom right,#014c7d,#0198ff)", width:"100vw", height:"100vh"}} ></div>
          )}/>
        </Switch>
      </Router>

    )
  }
}

export default RootContainer
