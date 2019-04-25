import React, { Fragment } from 'react'
import './mSuperior.css'
import SimpleLoader from '../widgets/loaders'
// import coin from '../../assets/btc.png'
import coin from '../widgets/items/assets/coins/btc2.png'
import { SelectCountryButton } from '../widgets/buttons/buttons'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import MenuLoggedOut from './menuLoggedOut'
import Coinsenda from '../widgets/icons/logos/coinsenda'

const MenuSuperiorLayout = (props) =>{

  let compra = "Te compramos a:"
  let venta = "Te vendemos a:"

  const {
    logout,
    HeadRoomClass,
    item_quote,
    movil,
    currentPair,
    sell_price,
    buy_price,
    mouseOver,
    openSelectCountry,
    loggedIn,
    toggle_menu,
    item_active,
    current_section,
    back_method
  } = props

  let back_section = item_active === 'wallets' && current_section === 'detail'
  let view = 'detail'
  // console.log(' - - - - MenuSuperiorLayout - - - -- - :::', props)
  let currency = currentPair ? currentPair.primary_currency.currency : 'coinsenda'

  return(
    <section className="MenuSuperiorLayout fuente" >
      <div className="contDinamic">
        <div className="contenedorLogoSenda">
           <div className="contLogos" style={{top:back_section ? '-100%' : '0%'}}>
             <div className="contItemLogo"><Coinsenda size={30} color="white" /></div>
             <div className="contItemLogo">
               <Link to="/wallets" className="DCBack" style={{display:view === 'detail' ? '' : 'none'}} onClick={back_method}>
               {/* <Link to="/wallets" className="DCBack" style={{display:view === 'detail' ? '' : 'none'}}> */}
                 <i className="fas fa-arrow-left"></i>
               </Link>
             </div>
           </div>
        </div>
        <div className={`containerMenuSuperior ${HeadRoomClass}`} id="mSuperior" onMouseOver={mouseOver}>
          {
            loggedIn ?
            <div className="capsuleMenu1">
                {
                  window.innerWidth>768 ?
                    <div className="itemSup closeSesi" onClick={logout}>
                      <p>Cerrar Sesión</p>
                      <i className="far fa-times-circle"></i>
                    </div>

                  :
                  <div className="itemSup closeSesi burgerMen" onClick={toggle_menu}>
                    <i className="fas fa-bars"></i>
                  </div>
                }

              {/* <div className="itemSup"><i className="far fa-question-circle"></i></div>
              <div className="itemSup"><i className="fas fa-bell"></i></div> */}
              <SelectCountryButton bar="rigth" handleClick={openSelectCountry} />
            </div>
            :
            <div className="loggedInFalse">
              <MenuLoggedOut/>
            </div>

          }

          <div className="capsuleMenu2">
            {
              !currentPair ?
            <Fragment>
              <div className="cagando" >
                  <SimpleLoader
                    color="green"
                    grid="Msuperior"
                  />
              </div>
            </Fragment>
            :
            <Fragment>
              <img className="itemFuera" src={require(`./assets/${currency}.png`)} width="22" alt="" id={currency} title={currency} />

              <div className={`cotization ${movil ? 'movil' : 'desktop' }`}>
                <p className={`buy ${movil ? 'movil' : 'desktop' }`} style={{display:(item_quote.buy || !movil) ? 'flex' : 'none'}}>
                  {compra}
                  <span>
                    <code className="monto" >${sell_price}</code>
                    <i className="Qventa fas fa-angle-double-up" style={{display: movil ? 'initial' : 'none'}}></i>
                  </span>
                </p>
                <p className={`sell ${movil ? 'movil' : 'desktop' }`} style={{display:(item_quote.sell || !movil) ? 'flex' : 'none'}}>
                  {venta}
                  <span>
                    <code className="monto" >${buy_price}</code>
                    <i className="Qventa fas fa-angle-double-down" style={{display: movil ? 'initial' : 'none'}} ></i>
                  </span>
                </p>
              </div>
            </Fragment>
          }
          </div>
        </div>
      </div>
    </section>
  )
}

export default MenuSuperiorLayout
