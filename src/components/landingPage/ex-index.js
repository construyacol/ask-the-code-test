import React from 'react'
import { Link } from 'react-router-dom'
import './css/landing.css'

import config from '../../default'

import logo from './img/logo.png'
import bigLogo from './img/logo-big.png'
import screenshot from './img/lap-mobile.png'
import fb from './img/ico-fb.png'
import ig from './img/ico-ig.png'
import tw from './img/ico-tw.png'
// import col from './img/ico-col.png'

// partimos esto en head, main y footer?

export default props => {
  const oauth = config.oauth
  const signinUri = `${oauth.host}/${oauth.signin}?clientId=${oauth.key}`
  const signupUri = `${oauth.host}/${oauth.signup}?clientId=${oauth.key}`

  return (
    <div className="landing">
      <div className="layer"></div>
      <header>
        <div className="container-landing">
          <a href="/" id="logo"><img src={logo} alt="Coinsenda" /></a>
          <div className="buy-sell">
            <div className="buy">
              <p>Precio de compra<br />$19.990.000 COP</p>
            </div>
            <div className="sell">
              <p>Precio de venta<br />$18.560.000 COP</p>
            </div>
          </div>
          <nav>
            <a href="/#" id="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </a>
            <ul>
              <li>
                <a href="/#">Soporte</a>
              </li>
              <li>
                <a href={signinUri} className="green">Ingresar</a>
              </li>
              <li>
                <a href={signupUri} className="green">Registrate</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <section className="top">
        <div className="bot-skew"></div>
        <div className="container-landing">
          <div className="row-landing">
            <div className="span-full span-6 text-right">
              <h1>La forma más fácil de comprar y vender
                <span className="big">Bitcoins</span>
                <span className="col">en todo <b>Colombia</b></span>
              </h1>
              <a className="round" href={signupUri}>Crear Cuenta</a>
            </div>
            <div className="span-full span-6">
              <img src={screenshot} className="full-width" alt="Laptop" />
            </div>
          </div>
        </div>
      </section>
      <section className="bondades text-center">
        <div className="container-landing">
          <h2>
            <span>Bondades</span>
          </h2>
          <div className="row">
            <div className="span-full span-4">
              <h4>
                <span className="bondad-01">Operamos las 24hs</span>
              </h4>
              <p>El Bitcoin no para, nosotros tampoco, compra y vende en pesos colombianos cuando quieras </p>
            </div>
            <div className="span-full span-4">
              <h4>
                <span className="bondad-02">Pensamos en vos</span>
              </h4>
              <p>Atención rápida, segura y personalizada </p>
            </div>
            <div className="span-full span-4">
              <h4>
                <span className="bondad-03">Hecho a tu medida</span>
              </h4>
              <p>Compra en efectivo o transferencia bancaria, utilizando los múltiples medios de pago</p>
            </div>
            <div className="full-width pull-left text-center">
              <a className="round blue-bg" href={signupUri}>Crear Cuenta</a>
            </div>
          </div>

        </div>
      </section>
      <section className="steps">
        <div className="bot-skew"></div>
        <div className="top-skew"></div>
        <div className="container-landing">
          <div className="round-steps">
            <div className="step">
              <span>1</span>
            </div>
            <div className="step">
              <span>2</span>
            </div>
            <div className="step">
              <span>3</span>
            </div>
          </div>
          <div className="step-content">
            <h4>Reg&iacute;strate</h4>
            <p>Crea una cuenta personal y segura con tu correo electr&oacute;nico o redes sociales</p>
          </div>
          <div className="step-content">
            <h4>Deposita</h4>
            <p>Utiliza los medios de pago tradicionales que funcionan en Colombia</p>
          </div>
          <div className="step-content">
            <h4>Recibe</h4>
            <p>Recibe tu saldo en Bitcoin o Pesos Colombianos dependiendo como tu quieras</p>
          </div>
        </div>
      </section>
      <section className="aprende text-center">
        <div className="container-landing">
          <h2>
            <span>Aprende m&aacute;s</span>
          </h2>
          <div className="row">
            <div className="span-full span-4">
              <div className="videoWrapper">
                <iframe
                  title="v1"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/y4ZkuymS_N4"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <h4>¿Cómo funciona Coinsenda?</h4>
            </div>
            <div className="span-full span-4">
              <div className="videoWrapper">
                <iframe
                  title="v2"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/y4ZkuymS_N4"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <h4>¿Cómo comprar Bitcoins?</h4>
            </div>
            <div className="span-full span-4">
              <div className="videoWrapper">
                <iframe
                  title="v3"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/y4ZkuymS_N4"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <h4>¿Cómo cambiar Bitcoins a Pesos Colombianos?</h4>
            </div>
          </div>
        </div>
      </section>
      <section className="footer">
        <div className="top-skew"></div>
        <div className="container-landing">
          <div className="row">
            <div className="span-full span-3">
              <img src={bigLogo} alt="Coinsenda" className="brand" />
            </div>
            <div className="span-full span-3">
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link to="/legal">» T&eacute;rminos y Condiciones</Link>
                </li>
                <li>
                  <Link to="/legal">» Políticas de privacidad</Link>
                </li>
                <li>
                  <Link to="/legal">» Tratamiento de datos</Link>
                </li>
              </ul>
            </div>
            <div className="span-full span-3">
              <h4>Ayuda</h4>
              <ul>
                <li>
                  <Link to="/help">» FAQ</Link>
                </li>
                <li>
                  <Link to="/help">» Soporte</Link>
                </li>
                <li>
                  <Link to="/help">» Chat</Link>
                </li>
              </ul>
            </div>
            <div className="span-full span-3">
              <h4>Contacto</h4>
              <ul>
                <li>
                  <a href="mailto:info@coinsenda.com">» info@coinsnda.com</a>
                </li>
                <li>
                  <a href="https://www.facebook.com/sendacolombia" className="social"><img src={fb} alt="Facebook" /></a>
                  <a href="https://www.instagram.com/sendacolombia" className="social"><img src={ig} alt="Instagram" /></a>
                  <a href="https://twitter.com/CoinsendaColombia" className="social"><img src={tw} alt="Twitter" /></a>
                </li>
                {/* <li>
                  <a href="/"><img src={col} alt="col" /></a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
