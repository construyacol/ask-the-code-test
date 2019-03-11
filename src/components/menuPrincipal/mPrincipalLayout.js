import React from 'react'
import ButtonPrincipalMenu from '../widgets/buttons/buttons'
import logo from '../../assets/logo.png'
import userPic from '../../assets/picture.jpg'
import octo from '../../assets/octo.png'
import { menuPrincipal, menuPrincipalInferior } from '../api/ui/api.json'


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
            <p className="userName" onClick={props.handleClick}><strong>Andres García</strong><i className="fas fa-check-circle mPverify"></i></p>
            <p className="userBalance"><strong>SALDO</strong>: <span className="number">0.0003</span> BTC / <span className="number">2.000</span> USD</p>
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
            <div className="scores">
                <div className="barra">
                  <div className="progresado"></div>
                  <img src={octo} alt="" width="30"/>
                  <p className="score">Score: <span className="number">450 pts</span></p>
                  <p className="level">level: <span className="number">2</span></p>
                </div>
            </div>
          </section>
        </div>
    </section>
  )
}


export default MenuPrincipalLayout
