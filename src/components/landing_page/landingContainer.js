import React, { Component } from 'react'
import HeaderLanding from './sections/header'
import { ButtonForms } from '../widgets/buttons/buttons'
import config from '../landingPage/default'
import QuoteCurrenciesLanding from './sections/quoteCurrenciesLanding'
import './landingPageContainer.css'

const oauth = config.oauth
const signinUri = `${oauth.host}/${oauth.signin}?clientId=${oauth.key}`

class LandingPageContainer extends Component {


  render(){

    return(
      <section id="LandingPageContainer">
        <HeaderLanding>
          <div className="HeaderLandingContent">

            <div className="headerFirstSection">
              <h1 className="headerTitle fuenteMuseo">Tu puerta de entrada hacia la cripto economía</h1>
              <p className="headerParr fuente">Compra y vende Bitcoin de forma rapida y segura en todo Colombia</p>
              <a href={signinUri}>
                <ButtonForms active={true} clases="register">
                  <p className="fuenteMuseo ctaLand" >Crear mi cuenta</p>
                </ButtonForms>
              </a>
            </div>

            <div className="headerSecondSection">
                <QuoteCurrenciesLanding/>
            </div>

          </div>
        </HeaderLanding>

        <section className="sections"></section>
      </section>
    )

  }


}


export default LandingPageContainer
