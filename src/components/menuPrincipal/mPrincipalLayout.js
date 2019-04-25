import React from 'react'
import ButtonPrincipalMenu from '../widgets/buttons/buttons'
import logo from '../../assets/logo.png'
import userPic from '../../assets/picture.png'
import octo from '../../assets/octo.png'
import { menuPrincipal, menuPrincipalInferior } from '../api/ui/api.json'
import { Medal } from '../widgets/icons'
import ScoresComponent from '../widgets/scores'
import {ArrowRight} from '../widgets/icons/'
import ItemSettingsInit from '../widgets/itemSettings/'
import { security_center } from '../api/ui/settings.json'


const MenuPrincipalLayout = (props) => {

  const {
    show_menu_principal,
    close_menu_principal
  } = props

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
            <div className="perfilPic">
              <img src={userPic} alt="" className="userPic" width="100%"/>
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
                {/* <ItemSettingsInit data={security_center} /> */}
              </section>
          }


          <section className="section2">
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
              <div className="fuente closeSessionMo">Cerrar sesión</div>
            }
          </section>
        </div>
    </section>
  )
}


export default MenuPrincipalLayout
