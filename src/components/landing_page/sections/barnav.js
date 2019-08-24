import React from 'react'
import Coinsenda from '../../widgets/icons/logos/coinsenda'
import { ButtonForms } from '../../widgets/buttons/buttons'
import { Link } from 'react-router-dom'
import '../css/barNav.css'

const LandingBarNav = props => {

  const { menuActive, signinUri, signupUri, logoAnim, toggle_menu, landing } = props

  return(
      <div className="LandingBarNav">
        <div className="landingBarNavContainer">

          <div className={`landingBarNavBack ${menuActive ? 'active' : ''}`}></div>

          <div className="contentBarNavElements">
            <div className="contBarnavLvl1 lvlBrnav"></div>
            <div className="contBarnavLvl2 lvlBrnav"></div>
          </div>

          {
            !landing && window.innerWidth<768?
            <i className="fas fa-bars burgerMenu" onClick={toggle_menu}></i>
            :
          <div className="contBarNavLogo">
            <Link to="/">
            <div className="contentLogo">
                  <p className={`fuenteMuseo contentLogoText ${logoAnim ? 'active' : ''}`}>Coinsenda</p>
                  <div className={`contIso ${logoAnim ? 'active' : ''}`}>
                  <div className={`containerIsoImg ${logoAnim ? 'active' : ''}`}>
                    <Coinsenda size={30} color="white" />
                  </div>
                  </div>
            </div>
            </Link>
          </div>
        }


          <div className="sesionButtons">

            <div className={`RegisterBarNav ${menuActive ? 'active' : ''}`} >
              <div className="contButtonBarNav">
                <a href={signinUri}>
                  <ButtonForms active={true} clases="register">
                    <p className="fuenteMuseo ctaLand" >Crear mi cuenta</p>
                  </ButtonForms>
                </a>
              </div>
            </div>

            <div className="loginBarNav">
              <a href={signupUri}>
                <p className="fuente">Iniciar sesión</p>
              </a>
            </div>



          </div>

        </div>
      </div>
  )
}

export default LandingBarNav
