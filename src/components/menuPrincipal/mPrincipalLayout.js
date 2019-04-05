import React from 'react'
import ButtonPrincipalMenu from '../widgets/buttons/buttons'
import logo from '../../assets/logo.png'
import userPic from '../../assets/picture.png'
import octo from '../../assets/octo.png'
import { menuPrincipal, menuPrincipalInferior } from '../api/ui/api.json'
import { Medal } from '../widgets/icons'
import ScoresComponent from '../widgets/scores'

const MenuPrincipalLayout = (props) => {

  return(
    <section className="menuPrincipal fuente">
        <div className="userInfo">
          <div className="logo">
              <img src={logo} alt="" width="110"  />
          </div>
            <div className="perfilPic">
              <img src={userPic} alt="" className="userPic" width="100%"/>
            </div>
            <p className="userName" onClick={props.handleClick}><strong>{props.user.name ? props.user.name : props.user.email ? props.user.email : 'Bienvenido'}</strong>
            {
              props.user.verification_level === 'level_1' &&
              <i className="fas fa-check-circle mPverify"></i>
            }
          </p>
            {/* <p className="userBalance"><strong>SALDO</strong>: <span className="number">0.0003</span> BTC / <span className="number">2.000</span> USD</p> */}
        </div>

        <div className="menuItems">
          <section className="section1">
            {
              menuPrincipal.map((item)=>{
                if(!item.visible){return false}
                return <ButtonPrincipalMenu {...props} {...item} key={item.id}/>
              })
            }
          </section>

          <section className="section2">
            <div>
              {
                menuPrincipalInferior.map((item)=>{
                  if(!item.visible){return false}
                  return  <ButtonPrincipalMenu {...props} {...item} key={item.id}/>
                })
              }
            </div>
            <ScoresComponent/>
            
          </section>
        </div>
    </section>
  )
}


export default MenuPrincipalLayout
