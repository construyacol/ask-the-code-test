import React, { Component } from 'react'
import { ButtonForms } from '../widgets/buttons/buttons'
// import config from '../landing_page/default'

const oauth = config.oauth
const signinUri = `${oauth.host}/${oauth.signin}?clientId=${oauth.key}`
const signupUri = `${oauth.host}/${oauth.signup}?clientId=${oauth.key}`

class MenuLoggedOut extends Component {


  render(){

    return(
      <div className="MenuLoggedOut">
        <div className="contentLogged"></div>

          <a href={signupUri}>
            <ButtonForms active={true} clases="loggedIn">
              <p className="fuenteMuseo ctaLand" >Iniciar sesión</p>
            </ButtonForms>
          </a>

          <a href={signinUri}>
            <ButtonForms active={true} clases="register">
              <p className="fuenteMuseo ctaLand" >Crear mi cuenta</p>
            </ButtonForms>
          </a>

      </div>
    )
  }
}

export default MenuLoggedOut
