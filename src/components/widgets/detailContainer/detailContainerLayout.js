import React, { Fragment, Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { mensaje } from '../../../services'
import './detailContainer.css'

class detailContainerLayout extends Component{

  back_method = () =>{
    this.props.action.section_view_to('initial')
  }

  to_sub_section = prop => {
    this.props.action.current_section_params({current_sub_section: prop.target.id})
    if(prop.target.id === 'activity' && !this.props.current_section.params.activity){
      return mensaje('Aún no tienes actividad en esta Billetera')
    }

  }

render(){

  const { items_menu, title, current_section, current_wallet } = this.props
  const { view, params } = current_section
  const { activity, current_sub_section } = params
  // console.log('|||||||||| °°°°°  DetailContainer  °°°°°||||||||||', activity)

  return(
    <Fragment>
      <div className="subMenu">
          <div className="menuContainer">
            <div className="itemsMenu fuente" style={{display:view === 'initial' ? 'none' : ''}}>
              {
                (current_wallet && items_menu ? items_menu.length>0 : false) &&
                  items_menu.map(item=>{
                    // console.log('|||||||||| °°°°°  DetailContainer  °°°°°||||||||||', item)
                    return (
                    <Fragment key={item.id}>
                        <NavLink to={`/wallets/${item.link}/${current_wallet.id}`}
                          onClick={this.to_sub_section}
                          className={`DCsubItem ${current_sub_section === item.link ? 'DCactive' : ''} ${(item.link === 'activity' && !activity) ? 'noTamoActivos' : ''}`}
                          id={item.link}
                          >
                            {item.title}
                        </NavLink>
                    </Fragment>
                  )
                  })
              }
            </div>

            <Link to="/wallets" className="DCBack" style={{display:view === 'detail' ? '' : 'none'}} onClick={this.back_method}>
            <i className="fas fa-arrow-left"></i>
            <p>Volver</p>
            </Link>

            <div className="DCTitle" style={{display:view === 'detail' ? 'none' : ''}} >
              <p className="fuente">{title}</p>
            </div>
         </div>
      </div>

      <div className={`contenido ${(view === 'detail' && current_wallet) ? 'DCcurrent_wallet' : ''}`}>
         {this.props.children}
      </div>
    </Fragment>
  )

  }
}

function mapStateToProps(state, props){

  // console.log('||||||||| VALIDANDO DETALLE ACCOUNT::', props)

  return{
    current_section:state.ui.current_section
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}




export default withRouter(connect(mapStateToProps, mapDispatchToProps) (detailContainerLayout))
