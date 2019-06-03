import React, {Component} from 'react'
import MenuPrincipalLayout from './mPrincipalLayout'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import { toast  } from 'react-toastify'
import './mPrincipal.css'
// import { Link as ScrollTo } from "react-scroll"
import Scroll, { scroller } from 'react-scroll'
// import { bindActionCreators } from 'redux'


class MenuPrincipalContainer extends Component{

  activarItem = async (name, link) =>{
    // console.log('ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ', name, link)
    this.props.action.MenuItemActive(link)
    this.props.action.section_view_to('initial')
    this.props.action.CleanNotifications(name)
      this.props.action.HeadRoom('unpinned')

    scroller.scrollTo('firstInsideContainer', {
      duration: this.props.menu_item_active === link ? 500 : 0,
      smooth: true,
      containerId: 'containerElement'
    })
  }

  close_menu_principal = () =>{
    this.props.action.current_section_params({show_menu_principal:false})
  }

  componentDidMount(){
    this.props.action.HeadRoom('unpinned')
    scroller.scrollTo('firstInsideContainer', {
      offset:0,
      duration:0 ,
      smooth: true,
      containerId: 'containerElement'
    })



    if(window.innerWidth<768){
      return this.props.action.current_section_params({show_menu_principal:false})
    }

    this.props.action.current_section_params({show_menu_principal:true})
  }

  render(){


    // console.log('E S T A D O   I N I C I A L   D E S D E  MENU PRINCIPAL::::', this.props )
    return(
        <MenuPrincipalLayout
          activarItem={this.activarItem}
          itemStatus={this.props.menu_item_active}
          refCallback={this.refCallback}
          close_menu_principal={this.close_menu_principal}
          {...this.props}/>
    )
  }
}

  function mapDispatchToProps(dispatch){
    return {
        action: bindActionCreators(actions, dispatch)
    }
  }

  function mapStateToProps(state, props){
    // console.log('ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ', state.model_data)

    const { user, user_id } = state.model_data

    return{
      user:user && user[user_id],
      menu_item_active:state.ui.menu_item_active,
      show_menu_principal:state.ui.current_section.params.show_menu_principal
      // user:state.model_data.user ? user : null
    }
  }

export default connect(mapStateToProps, mapDispatchToProps) (MenuPrincipalContainer)
// export default connect(MenuPrincipalContainer)
