import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import './css/landing.css'
import { connect } from 'react-redux'
import config from './default'
import styles from './css/landing.css';

import logo from './img/logo.png'
import bigLogo from './img/logo.png'
import screenshot from './img/lap-mobile.png'
import col from './img/ico-col.png'
const oauth = config.oauth
const signinUri = `${oauth.host}/${oauth.signin}?clientId=${oauth.key}`
const signupUri = `${oauth.host}/${oauth.signup}?clientId=${oauth.key}`


class Landing extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false,
      ref_code: ''
    }
  }

  componentWillUnmount(){

  }
  componentDidMount () {
    // const html = document.querySelector('html')
    // const layer = document.querySelector('div.layer')
    // if (layer) {
    //   layer.style.height = html.offsetHeight + 'px'
    // }

    // if (this.props.location.search) {
    //   // URL
    //   const url = new URL(window.location.href)
    //
    //   // Search ref_code
    //   const ref_code = url.searchParams.get('ref_code')
    //
    //   // Set ref_code in localStore
    //   localStorage.setItem('ref_code', ref_code)
    //
    //   // Search ref_code in localStore
    //   const localCode = localStorage.getItem('ref_code')
    //
    //   if (localCode) {
    //     this.setState({
    //       ref_code
    //     })
    //   }
    // }
  }

  handleClickRemove = () => {
    localStorage.removeItem('ref_code')
  }

  render () {
    const { ref_code } = this.state

    return (
      <div className="landing landing">
        <div className="landing layer"></div>
        <header>
          <div className="landing containerLanding">
            <a href="/" id="logo"><img src={logo} alt="Coinsenda" style={{width: 165,padding: "10px 5px"}} /></a>
            <div className="landing buy-sell">
              <div className="landing buy">
                {/* <p>Precio para vender<br />${this.props.buyPrice.toLocaleString()} COP</p> */}
              </div>
              <div className="landing sell">
                {/* <p>Precio para comprar<br />${this.props.sellPrice.toLocaleString()} COP</p> */}
              </div>
            </div>
            <a className="landing cotizacion" href="#prices" onClick={() => this.setState({showModal: true})}>Cotización</a>
            <nav>
              <a href="/#" id="menu-icon">
                <span></span>
                <span></span>
                <span></span>
              </a>
              <ul id="access-menu">
                <li>
                  <a href={signinUri}>Ingresa</a>
                </li>
                <li>
                  {
                    ref_code ? (
                      <a onClick={this.handleClickRemove} href={`${signupUri}&ref_code=${ref_code}`}>Regístrate</a>
                    ) : (
                      <a href={signupUri}>Regístrate</a>
                    )
                  }
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <section className="landing top">
          <div className="landing bot-skew"></div>
          <div className="landing container-landing">
            <div className="landing row-landing">
              <div className="landing span-full span-6 text-right">
                <h1>La forma más fácil de comprar y vender
                  <span className="landing big"> Bitcoins</span>
                  <span className="landing col"> en todo <b>Colombia</b></span>
                </h1>
                {
                    ref_code ? (
                      <a className="landing round" onClick={this.handleClickRemove} href={`${signupUri}&ref_code=${ref_code}`}>Crea tu Cuenta</a>
                    ) : (
                      <a className="landing round" href={signupUri}>Crea tu Cuenta</a>
                    )
                }
              </div>
              <div className="landing span-full span-6">
                <img src={screenshot} className="landing full-width" alt="Laptop" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing bondades text-center">
          <div className="landing container-landing">
            <h2>
              <span>Lo primero eres tú</span>
            </h2>
            <div className="landing row">
              <div className="landing span-full span-4">
                <h4>
                  <span className="landing bondad-01">Operamos las 24hs</span>
                </h4>
                <p>El Bitcoin no para; nosotros tampoco. ¡Compra y vende en pesos colombianos cuando quieras! </p>
              </div>
              <div className="landing span-full span-4">
                <h4>
                  <span className="landing bondad-02">Pensamos en ti</span>
                </h4>
                <p>Brindamos una atención rápida, segura y personalizada para que te sientas cómodo, ¡siempre! </p>
              </div>
              <div className="landing span-full span-4">
                <h4>
                  <span className="landing bondad-03">Hecho a tu medida</span>
                </h4>
                <p>Compra en efectivo o transferencia bancaria, utilizando los múltiples medios de pago.</p>
              </div>
              <div className="landing full-width pull-left text-center">
                {
                    ref_code ? (
                      <a className="landing round blue-bg" onClick={this.handleClickRemove} href={`${signupUri}&ref_code=${ref_code}`}>Crea tu Cuenta</a>
                    ) : (
                      <a className="landing round blue-bg" href={signupUri}>Crea tu Cuenta</a>
                    )
                }
              </div>
            </div>

          </div>
        </section>
        <section className="landing steps">
          <div className="landing bot-skew"></div>
          <div className="landing top-skew"></div>
          <div className="landing container-landing">
            <div className="landing round-steps">
              <div className="landing step">
                <span>1</span>
              </div>
              <div className="landing step">
                <span>2</span>
              </div>
              <div className="landing step">
                <span>3</span>
              </div>
            </div>
            <div className="landing step-content">
              <h4>Reg&iacute;strate</h4>
              <p>Crea tu cuenta, personal y segura, con tu correo electr&oacute;nico o redes sociales.</p>
            </div>
            <div className="landing step-content">
              <h4>Deposita</h4>
              <p>Utiliza los medios de pago tradicionales que funcionan en Colombia.</p>
            </div>
            <div className="landing step-content">
              <h4>Recibe</h4>
              <p>Recibe tu saldo en Bitcoin o Pesos Colombianos donde tu quieras.</p>
            </div>
          </div>
        </section>
        <section className="landing aprende text-center">
          <div className="landing container-landing">
            <h2>
              <span>¿C&oacute;mo funciona Coinsenda?</span>
            </h2>
            <div className="landing row">
              <div className="landing col-md-4">
                <div className="landing videoWrapper">
                  <iframe
                    title="v1"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/XHeewT5NAXQ"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
                <h4>Video Explicativo Coinsenda</h4>
              </div>
              <div className="landing col-md-4">
                <div className="landing videoWrapper">
                  <iframe
                    title="v1"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/6iNTT7zUYX4"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
                <h4>Cómo comprar Bitcoins en Colombia</h4>
              </div>
              <div className="landing col-md-4">
                <div className="landing videoWrapper">
                  <iframe
                    title="v1"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/eGEDtSeAw88"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
                <h4>Cómo cambiar tus Bitcoins por pesos colombianos</h4>
              </div>
            </div>
          </div>
        </section>
        <section className="landing footer">
          <div className="landing top-skew"></div>
          <div className="landing container-fluid" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 5,
            width: '100%',
            background: '#030829'
          }}>
            <div className="landing row">
              <div className="landing span-5">
                <img src={bigLogo} width="80%" alt="Coinsenda" className="landing brand" />
              </div>
              <div className="landing span-5">
                <h4>Legal</h4>
                <ul>
                  <li>
                    <Link to="/legal/terms">» T&eacute;rminos y Condiciones</Link>
                  </li>
                  <li>
                    <Link to="/legal/privacy">» Políticas de privacidad</Link>
                  </li>
                </ul>
              </div>
              <div className="landing span-5">
                <h4>Ayuda</h4>
                <ul>
                  <li>
                    <Link to="/help">» Preguntas frecuentes</Link>
                  </li>
                  <li>
                    <Link to="/fees">» Tarifas de uso</Link>
                  </li>
                  {/*
                  <li>
                    <Link to="/help">» Chat</Link>
                  </li>
                  */}
                </ul>
              </div>
              <div className="landing span-5">
                <h4>Contacto</h4>
                <ul>
                  <li>
                    <a
                      href="https://soporte.coinsenda.com"
                      target="_blank"
                      rel="noopener noreferrer">
                      » Abre un ticket
                    </a>
                  </li>
                  <li>
                    <a href="mailto:soporte@coinsenda.com">» soporte@coinsenda.com</a>
                  </li>
                  <li className="landing socials">
                    <span itemScope itemType="http://schema.org/Organization">
                      <link itemProp="url" href="http://coinsenda.com" />
                      <a
                        href="https://www.facebook.com/coinsenda"
                        target="_blank"
                        rel="noopener noreferrer"
                        itemProp="sameAs"
                        className="landing social">
                        <i className="landing fab fa-facebook" />
                      </a>
                      <a
                        href="https://www.instagram.com/coinsenda"
                        target="_blank"
                        rel="noopener noreferrer"
                        itemProp="sameAs"
                        className="landing social">
                        <i className="landing fab fa-instagram" />
                      </a>
                      <a
                        href="https://twitter.com/coin_senda"
                        target="_blank"
                        rel="noopener noreferrer"
                        itemProp="sameAs"
                        className="landing social">
                        <i className="landing fab fa-twitter" />
                      </a>
                    </span>
                  </li>
                  <li className="landing socials">
                    <img src={col} alt="Colombia" />
                  </li>
                </ul>
              </div>
              <div className="landing span-5">
                <h4>Bogotá</h4>
                <span className="landing asLink">» Carrera 7 # 156-68 </span>
                <h4>Cali</h4>
                <span className="landing asLink">» Calle 33A Norte # 2N-73</span>
              </div>
            </div>
            <div className='footer-copyright text-center'>
              © 2018 Coinsenda - All rights reserved
            </div>
          </div>
        </section>
        {/* <PricesModal
          open={this.state.showModal}
          closeHandler={() => this.setState({showModal: false})}
        /> */}
      </div>
    )
  }
}

// Landing.propTypes = {
//   sellPrice: PropTypes.number.isRequired,
//   buyPrice: PropTypes.number.isRequired
// }

function mapStateToProps(state, props){
  return {
    sellPrice: null,
    buyPrice: null
  }
}

// export default connect(mapPairsToProps)(Landing)
export default connect(mapStateToProps)(Landing)
