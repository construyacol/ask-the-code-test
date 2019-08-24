import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Coinsenda from '../../widgets/icons/logos/coinsenda'


const FooterContainer = props => {
  return(
    <Fragment>
    <div className="FooterContainer">

      <div className="FooterItem FooterItem1">
        <div className="FooterLogo">
          <Coinsenda size={50} color="white" />
          <h1 className="headerTitle headerTitle2 fuenteMuseo">Coinsenda</h1>
        </div>
        {
          window.innerWidth>768 &&
          <Fragment>
            <p className="fuente">soporte@coinsenda.com</p>
            <p className="fuente">prensa@coinsenda.com</p>
          </Fragment>
        }

        <Link to="/docs/support" className="fuente">Canales de Soporte</Link>
        <a href="https://soporte.coinsenda.com/" target="_blank"  rel="noopener noreferrer"  className="fuente">Abrir ticket soporte >> </a>
      </div>

      <div className="FooterItem FooterItem2">
        <h2 className="fuente">Legal</h2>
        <Link to="/docs/terms" className="linkC">
          <p className="fuente">Terminos y condiciones</p>
        </Link>
        <Link to="/docs/legal" className="linkC">
          <p className="fuente">Políticas de privacidad</p>
        </Link>

        {
          window.innerWidth>768 &&
          <div className="socialMediaFooter">
            <a href="https://twitter.com/coin_senda" target="_blank"  rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.facebook.com/coinsenda" target="_blank"  rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.youtube.com/channel/UC1OxthLi2Tqeu7rZ7YpqqyA" target="_blank"  rel="noopener noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        }


      </div>

      <div className="FooterItem FooterItem3">

        <h2 className="fuente">Acerca de</h2>
        {
          window.innerWidth>768 &&
          <Fragment>
            <p className="fuente">Coinsenda</p>
            <p className="fuente">Puestos de trabajo</p>
            <p className="fuente">Gabinete de prensa</p>
          </Fragment>
        }
        <Link to="/docs/faqs" className="fuente">FAQ - preguntas frecuentes</Link>
        <Link to="/docs/fees" className="fuente">Tarifas de uso</Link>
      </div>

    </div>
    <div className="rightsReserved fuente">
      <p className="fuente">
        <span className="fuente2" > © 2019 - 2020 </span>Coinsenda - All rights reserved
      </p>
    </div>
  </Fragment>
  )
}

export default FooterContainer
