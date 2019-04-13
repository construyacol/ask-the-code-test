import React, { Component } from 'react'
import { ButtonForms } from '../widgets/buttons/buttons'
import config from '../landingPage/default'

const oauth = config.oauth
const signinUri = `${oauth.host}/${oauth.signin}?clientId=${oauth.key}`
const signupUri = `${oauth.host}/${oauth.signup}?clientId=${oauth.key}`

class MenuLoggedOut extends Component {


  render(){

    return(
      <div className="MenuLoggedOut">
        <div className="contentLogged"></div>
        <a href={signinUri}>
          <ButtonForms active={true} clases="register">
              Registrarme
          </ButtonForms>
        </a>

        <a href={signupUri}>
          <ButtonForms active={true} clases="loggedIn">
              Iniciar sesión
          </ButtonForms>
        </a>

      </div>
    )

  }

}

export default MenuLoggedOut
