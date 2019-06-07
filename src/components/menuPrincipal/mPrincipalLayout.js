import React from 'react'
import ButtonPrincipalMenu from '../widgets/buttons/buttons'
import logo from '../../assets/logo.png'
import userPic from '../../assets/picture.jpg'
import { menuPrincipal } from '../api/ui/api.json'
import ScoresComponent from '../widgets/scores'
import IconSwitch from '../widgets/icons/iconSwitch'
import MovilMenuComponent from './movilMenu'
// import store from '../../'



const MenuPrincipalLayout = (props) => {

  const {
    show_menu_principal,
    close_menu_principal,
    verification_state,
    openSelectCountry,
    go_to
  } = props


  // const { user, user_id } = store.getState().model_data
  // const country = user[user_id].country


  return(
    <section className="menuPrincipal fuente" style={{left:show_menu_principal ? '0' : '-110vw' }}>

        <div className="contCloseMprincipal" onClick={close_menu_principal}>
          {/* <i class="fas fa-times"></i> */}
        </div>

        <div className="userInfo">
          <div className="logo">
              <img src={logo} alt="" width="110"  />
              <i className="fas fa-arrow-left"  onClick={close_menu_principal}></i>
              {/* <ArrowRight size={20} color="white" /> */}
          </div>

          <div className="perfilPiCont">
            <div className="contImgPicProfile">

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


            </div>
            <div className={`perfilPic ${verification_state}`}>
              <img src={userPic} alt="" className="userPic" width="100%"/>
            </div>
          </div>



            <p className="userName" onClick={props.handleClick}><strong>{props.user.name ? props.user.name : props.user.email ? props.user.email : 'Bienvenido'}</strong>
            {
              props.user.verification_level === 'level_1' &&
              <i className="far fa-check-circle mPverify"></i>
            }
            </p>
            {/* <p className="userBalance"><strong>SALDO</strong>: <span className="number">0.0003</span> BTC / <span cl  assName="number">2.000</span> USD</p> */}
            {
              window.innerWidth<768 &&
              <ScoresComponent/>
            }
        </div>

        <div className="menuItems">
          {
            window.innerWidth>768 ?
              <section className="section1">
                {
                  menuPrincipal.map((item)=>{
                    if(!item.visible){return false}
                    return <ButtonPrincipalMenu {...props} {...item} key={item.id}/>
                  })
                }
              </section>
              :
              <section className="section1">
                <MovilMenuComponent openSelectCountry={openSelectCountry} go_to={go_to}/>
              </section>
          }


          <section className={`section2 ${window.innerWidth>768 ? '' : 'movil' }`}>
            {/* <div>
              {
                menuPrincipalInferior.map((item)=>{
                  if(!item.visible){return false}
                  return  <ButtonPrincipalMenu {...props} {...item} key={item.id}/>
                })
              }
            </div> */}
            {
              window.innerWidth>768 ?
              <ScoresComponent/>
              :
              <div className="menuMovilItems close">
                <p className="menuMovilItemTexts close fuente">Cerrar sesión</p>
              </div>
            }
          </section>
        </div>
    </section>
  )
}


export default MenuPrincipalLayout
