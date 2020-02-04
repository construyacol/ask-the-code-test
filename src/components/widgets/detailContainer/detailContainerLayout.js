import React, { Fragment, Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
// import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
// import { mensaje } from '../../../services'
import IconSwitch from '../icons/iconSwitch'

import './detailContainer.css'

class detailContainerLayout extends Component{

  // back_method = () =>{
  //   // this.props.action.section_view_to('initial')
  // }

  // to_sub_section = prop => {
    // if(!prop.target.id){return false}
    // this.props.action.current_section_params({current_sub_section: prop.target.id})
    // if(prop.target.id === 'activity' && !this.props.current_section.params.activity){
    //   return mensaje('Aún no tienes actividad en esta Billetera')
    // }
  // }

render(){

  const { items_menu, title, current_section, current_wallet, pathname, primary_path } = this.props
  const { params } = current_section
  // const { current_sub_section } = params
  let movil_viewport = window.innerWidth < 768
  console.log('|||||||||| °°°°°  DetailContainer  °°°°°||||||||||', this.props)

  return(
    <Fragment>
      <div className="subMenu">
          <div className="menuContainer">
            <div className="itemsMenu fuente" style={{display:!pathname ? 'none' : 'grid'}}>
              {
                (current_wallet && items_menu ? items_menu.length>0 : false) &&
                  items_menu.map(item=>{
                    return (
                        <NavLink to={`/wallets/${item.link}/${current_wallet.id}${item.link === 'activity' ? `/${params.currentFilter}` : ''}`}
                          // onClick={this.to_sub_section}
                          id={item.link}
                          key={item.id}
                          className={`menuMovilItem ${pathname === item.link ? 'active' : ''}`}
                          >
                            <div  className={`menuMovilIcon ${pathname === item.link ? 'active' : ''}`} >
                              <IconSwitch size={20} icon={item.link} color="#14b3f0"/>
                            </div>
                            <p>{item.title}</p>
                        </NavLink>
                  )
                  })
              }
            </div>

            {
              (!movil_viewport) &&
              <Link to="/wallets" className="DCBack" style={{display:(pathname) ? '' : 'none'}} >
                <i className="fas fa-arrow-left"></i>
                <p>Volver</p>
              </Link>
            }


            <div className={`DCTitle ${primary_path} ${movil_viewport ? 'movil' : ''}`} style={{display:pathname ? 'none' : ''}} >
              {
                (movil_viewport && primary_path !== 'referral') ?
                <Fragment>
                  <Link to="/wallets" className={`menuMovilItem ${primary_path === 'wallets' ? 'active' : ''}`}>
                  <div className={`menuMovilIcon ${primary_path === 'wallets' ? 'active' : ''}`} >
                    <IconSwitch size={20} icon="wallets" color="#14b3f0"/>
                  </div>
                   <p className="fuente" >Billeteras</p>
                  </Link>

                    <Link to="/withdraw_accounts" className={`menuMovilItem ${primary_path === 'withdraw_accounts' ? 'active' : ''}`}>
                    <div className={`menuMovilIcon ${primary_path === 'withdraw_accounts' ? 'active' : ''}`} >
                      <IconSwitch size={20} icon="withdraw" color="#14b3f0"/>
                    </div>
                     <p className="fuente" >Retiros</p>
                    </Link>

                  <Link to="/security" className={`menuMovilItem ${primary_path === 'security' ? 'active' : ''}`}>
                    <div className={`menuMovilIcon ${primary_path === 'security' ? 'active' : ''}`} >
                      <IconSwitch size={20} icon="security" color="#14b3f0"/>
                    </div>
                   <p className="fuente" >Seguridad</p>

                  </Link>

                </Fragment>
                :
                <p className="fuente">{title}</p>
              }
            </div>
         </div>
      </div>

      <div className={`contenido ${(primary_path && current_wallet) ? 'DCcurrent_wallet' : ''} ${primary_path} ${pathname}`}>
         {this.props.children}
      </div>

    </Fragment>
  )

  }
}

function mapStateToProps(state, props){

  // let path = props.location && props.location.pathname
  // let str = path
  // let res = path && str.split("/");
  // console.log('||||||||| VALIDANDO DETALLE ACCOUNT::', res.length, res[2], path)

  let account_opts = {}
  if(props.match){
    const { path, primary_path, account_id } = props.match.params
    account_opts = {
      current_wallet:(props.wallets && account_id) && props.wallets[account_id],
      pathname:path,
      primary_path
    }
  }

  // console.log('||||||||| VALIDANDO DETALLE ACCOUNT::', props)

  return{
    current_section:state.ui.current_section,
    // pathname:res && res.length > 1 && res[2]
    ...account_opts
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}




export default connect(mapStateToProps, mapDispatchToProps) (detailContainerLayout)
// export default withRouter(connect(mapStateToProps, mapDispatchToProps) (detailContainerLayout))
