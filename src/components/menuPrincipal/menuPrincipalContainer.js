import React, {Component} from 'react'
import MenuPrincipalLayout from './mPrincipalLayout'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import './mPrincipal.css'
import { scroller } from 'react-scroll'
import PropTypes from 'prop-types'


class MenuPrincipalContainer extends Component{

  activarItem = async (name, link) =>{
    this.props.action.section_view_to('initial')
    this.props.action.CleanNotifications(name)
    scroller.scrollTo('firstInsideContainer', {
      duration: this.props.path === link ? 500 : 0,
      smooth: true,
      containerId: 'containerElement'
    })
  }

  // componentDidUpdate(prevProps){
  //   console.log('|||||||||||||||||||||||||||| ====================> componentDidUpdate MENU PRINCIPAL ==> ', this.props)
  // }

  close_menu_principal = () =>{
    this.props.action.current_section_params({show_menu_principal:false})
  }

  componentDidMount(){
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

  country_change = () => {
    this.props.action.ready_to_play(false)
  }

  go_to = async(pathname) =>{
    await this.props.history.push(pathname)
    return this.props.action.current_section_params({show_menu_principal:false})
  }

// history

  openSelectCountry = async() =>{
    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload({
      title:"Cambiar país de operación",
      description:"Elige el país en el que deseas operar, recuerda que cada país maneja un perfil de operación diferente.",
      txtPrimary:"Cambiar de país",
      txtSecondary:"Cancelar",
      payload:'account_id',
      action:(this.country_change),
      svg:"coinsenda",
      type:"select_country"
    })
  }


  render(){


    // console.log('E S T A D O   I N I C I A L   D E S D E  MENU PRINCIPAL::::', this.props )
    return(
        <MenuPrincipalLayout
          activarItem={this.activarItem}
          path={this.props.path}
          refCallback={this.refCallback}
          close_menu_principal={this.close_menu_principal}
          openSelectCountry={this.openSelectCountry}
          go_to={this.go_to}
          {...this.props}/>
    )
  }
}



MenuPrincipalContainer.propTypes = {
  path:PropTypes.string,
  show_menu_principal:PropTypes.bool,
  user:PropTypes.object,
  verification_state:PropTypes.string
}



  function mapDispatchToProps(dispatch){
    return {
        action: bindActionCreators(actions, dispatch)
    }
  }

  function mapStateToProps(state, props){

    // let path = props.location.pathname.replace('/', '')
    let path = props.match.params.primary_path
    // console.log('ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ROUTER -- -- - - - ', path, props)
    const { user, user_id } = state.modelData
    const { verification_state } = state.ui

    return{
      user:user && user[user_id],
      path,
      show_menu_principal:state.ui.current_section.params.show_menu_principal,
      verification_state
      // user:state.modelData.user ? user : null
    }
  }

export default connect(mapStateToProps, mapDispatchToProps) (MenuPrincipalContainer)
// export default connect(MenuPrincipalContainer)
