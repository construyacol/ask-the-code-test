import React from 'react'
import { ButtonPrincipalMenu } from '../widgets/buttons/buttons'
import logo from '../../assets/logo.png'
import userPic from '../../assets/picture.jpg'
import { menuPrincipal } from '../api/ui/api.json'
import ScoresComponent from '../widgets/scores'
import IconSwitch from '../widgets/icons/iconSwitch'
import MovilMenuComponent from './movilMenu'
import {useActions} from '../../hooks/useActions'
import { doLogout } from '../utils'

// TODO: remove all window ref from components, may be the cause of future issues
const MenuPrincipalLayout = (props) => {

  const {
    show_menu_principal,
    close_menu_principal,
    verification_state,
    openSelectCountry,
    navigateTo
  } = props

  const actions = useActions()
  // const { user, user_id } = store.getState().modelData
  // const country = user.country

  const logOut = () => {
    actions.confirmationModalToggle()
    actions.confirmationModalPayload({
      title: "Estás a punto de cerrar sesión...",
      description: "¿Estás seguro que deseas salir de Coinsenda?",
      txtPrimary: "Salir de Coinsenda",
      txtSecondary: "Quiero quedarme",
      action: (doLogout),
      svg: "logout",
      type: "select_country"
    })
  }

  return (
    <section className="menuPrincipal fuente" style={{ left: show_menu_principal ? '0' : '-110vw' }}>

      <div className="contCloseMprincipal" onClick={close_menu_principal}>
        {/* <i className="fas fa-times"></i> */}
      </div>

      <div className="userInfo">
        <div className="logo">
          <img src={logo} alt="" width="110" />
          <i className="fas fa-arrow-left" onClick={close_menu_principal}></i>
          {/* <ArrowRight size={20} color="white" /> */}
        </div>

        <div className="perfilPiCont">
          {/* <div className="contImgPicProfile">

            {
              verification_state &&
              <IconSwitch
                size={verification_state === 'pending' ? 20 : 20}
                color={verification_state === 'rejected' ? 'red' : '#00D2FF'}
                icon={
                  verification_state === 'rejected' ? 'error' :
                    verification_state === 'confirmed' ? 'confirmed' :
                      verification_state === 'accepted' ? 'accepted' : verification_state
                }
              />
            }


          </div> */}
          <div className={`perfilPic ${verification_state}`}>
            <p className="fuente">EY</p>
            {/* <img src={userPic} alt="" className="userPic" width="100%" /> */}
          </div>
        </div>



        <p className="userName" onClick={props.handleClick}><strong>{props.user.name ? props.user.name : props.user.email ? props.user.email : 'Bienvenido'}</strong>
          {
            props.user.verification_level === 'level_1' &&
            <i className="far fa-check-circle mPverify"></i>
          }
        </p>
        {/* <p className="userBalance"><strong>SALDO</strong>: <span className="number">0.0003</span> BTC / <span cl  assName="number">2.000</span> USD</p> */}
          <ScoresComponent />
      </div>

      <div className="menuItems">
        {
          window.innerWidth > 768 ?
            <section className="section1">
              {
                menuPrincipal.map((item) => {
                  if (!item.visible) { return false }
                  return <ButtonPrincipalMenu {...props} {...item} key={item.id} />
                })
              }
            </section>
            :
            <section className="section1">
              <MovilMenuComponent openSelectCountry={openSelectCountry} navigateTo={navigateTo} />
            </section>
        }




        <section className={`section2 movil`}>
          {/* <div>
              {
                menuPrincipalInferior.map((item)=>{
                  if(!item.visible){return false}
                  return  <ButtonPrincipalMenu {...props} {...item} key={item.id}/>
                })
              }
            </div> */}

              <div className="menuMovilItems close" onClick={logOut}>
                <p className="menuMovilItemTexts close fuente">Cerrar sesión <i className="fas fa-power-off"></i></p>
              </div>
        </section>
      </div>
    </section>
  )
}


export default MenuPrincipalLayout
