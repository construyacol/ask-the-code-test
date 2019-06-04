import React, { Fragment, Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { mensaje } from '../../../services'
import IconSwitch from '../icons/iconSwitch'
import VideoPlayer from '../video_player/videoPlayer'

import './detailContainer.css'

class detailContainerLayout extends Component{

  back_method = () =>{
    this.props.action.section_view_to('initial')
  }

  to_sub_section = prop => {
    if(!prop.target.id){return false}
    this.props.action.current_section_params({current_sub_section: prop.target.id})
    if(prop.target.id === 'activity' && !this.props.current_section.params.activity){
      return mensaje('Aún no tienes actividad en esta Billetera')
    }
  }

render(){

  const { items_menu, title, current_section, current_wallet, item_active, current_item } = this.props
  const { view, params } = current_section
  const { activity, current_sub_section } = params
  let movil_viewport = window.innerWidth < 768
  // console.log('|||||||||| °°°°°  DetailContainer  °°°°°||||||||||', this.props)

  return(
    <Fragment>
      <div className="subMenu">
          <div className="menuContainer">
            <div className="itemsMenu fuente" style={{display:view === 'initial' ? 'none' : 'grid'}}>
              {
                (current_wallet && items_menu ? items_menu.length>0 : false) &&
                  items_menu.map(item=>{
                    return (
                        <NavLink to={`/wallets/${item.link}/${current_wallet.id}`}
                          onClick={this.to_sub_section}

                          // className={`DCsubItem ${current_sub_section === item.link ? 'DCactive' : ''} ${(item.link === 'activity' && !activity) ? 'noTamoActivos' : ''}`}
                          id={item.link}
                          key={item.id}
                          className={`menuMovilItem ${current_sub_section === item.link ? 'active' : ''}`}
                          >
                            <div  className={`menuMovilIcon ${current_sub_section === item.link ? 'active' : ''}`} >
                              <IconSwitch size={20} icon={item.link} color="#14b3f0"/>
                            </div>
                            <p>{item.title}</p>
                        </NavLink>
                  )
                  })
              }
            </div>

            {
              !movil_viewport &&
              <Link to="/wallets" className="DCBack" style={{display:view === 'detail' ? '' : 'none'}} onClick={this.back_method}>
                <i className="fas fa-arrow-left"></i>
                <p>Volver</p>
              </Link>
            }


            <div className={`DCTitle ${movil_viewport ? 'movil' : ''}`} style={{display:view === 'detail' ? 'none' : ''}} >
              {
                movil_viewport ?
                <Fragment>
                  <Link to="/wallets" className={`menuMovilItem ${current_item === 'wallets' ? 'active' : ''}`}>
                  <div className={`menuMovilIcon ${current_item === 'wallets' ? 'active' : ''}`} >
                    <IconSwitch size={20} icon="wallets" color="#14b3f0"/>
                  </div>
                   <p>Billeteras</p>
                  </Link>

                    <Link to="/withdraw" className={`menuMovilItem ${current_item === 'withdraw' ? 'active' : ''}`}>
                    <div className={`menuMovilIcon ${current_item === 'withdraw' ? 'active' : ''}`} >
                      <IconSwitch size={20} icon="withdraw" color="#14b3f0"/>
                    </div>
                     <p>Retiros</p>
                    </Link>

                  <Link to="/security" className={`menuMovilItem ${current_item === 'security' ? 'active' : ''}`}>
                    <div className={`menuMovilIcon ${current_item === 'security' ? 'active' : ''}`} >
                      <IconSwitch size={20} icon="security" color="#14b3f0"/>
                    </div>
                   <p>Seguridad</p>
                  </Link>

                </Fragment>
                :
                <p className="fuente">{title}</p>
              }
            </div>
         </div>
      </div>

      <div className={`contenido ${(view === 'detail' && current_wallet) ? 'DCcurrent_wallet' : ''}`}>
         {this.props.children}
         <div className="VideoPlayer">
           <VideoPlayer></VideoPlayer>
         </div>
      </div>
    </Fragment>
  )

  }
}

function mapStateToProps(state, props){

  // console.log('||||||||| VALIDANDO DETALLE ACCOUNT::', props)

  return{
    current_item:state.ui.menu_item_active,
    current_section:state.ui.current_section
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}




export default withRouter(connect(mapStateToProps, mapDispatchToProps) (detailContainerLayout))
