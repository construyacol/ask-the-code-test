import React, {Component} from 'react'
import MenuSuperiorLayout from './mSuperiorLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import { formatToCurrency } from '../../services/convert_currency'

import Headroom from 'headroom.js'
import { withRouter } from "react-router";
import PropTypes from 'prop-types'


class MenuSuperiorContainer extends Component {

  _isMounted = false;

  state = {
    movil:window.innerWidth < 768 ? true : false,
    buy_price:null,
    sell_price:null,
    headRoomClass:'unpinned'
  }

  logout = async() =>{
    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload({
      title:"Estás a punto de cerrar sesión...",
      description:"¿Estás seguro que deseas salir de Coinsenda?",
      txtPrimary:"Salir de Coinsenda",
      txtSecondary:"Quiero quedarme",
      action:(this.logOutFin),
      svg:"logout",
      type:"select_country"
    })
  }

  logOutFin = () => {
    this.props.logOut()
    this.props.action.logged_in(false)
  }

  country_change = () => {
    this.props.action.ready_to_play(false)
  }


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

  mouseOver = () =>{
    this.setState({headRoomClass:'pinned'})
    // this.props.action.HeadRoom('pinned')
  }

  formating_currency = async() => {
    const { currentPair } = this.props
    if(!currentPair){return false}
    let buy_price = await formatToCurrency(currentPair.buy_price, currentPair.secondary_currency, true)
    let sell_price = await formatToCurrency(currentPair.sell_price, currentPair.secondary_currency, true)
    if(this._isMounted){
      this.setState({
        buy_price,
        sell_price
      })
    }
  }

  componentDidUpdate(prevProps){
    // console.log('||||||||||||||||||||||||||||||||| componentDidMount MENU CONTAINER ==> ', this.props)
    if(prevProps.match.params.primary_path !== this.props.match.params.primary_path || prevProps.currentPair !== this.props.currentPair){
      this.formating_currency()
      this.setState({headRoomClass:'unpinned'})
    }
  }

    componentWillUnmount(){
      this._isMounted = false
    }

   async componentDidMount(){
     this._isMounted = true
    // this.setState({headRoomClass:'unpinned'})
    let menuSuperior = document.getElementById('mSuperior')
    let detonador = document.getElementById('containerElement')
    const headroom = new Headroom(menuSuperior, {
      "offset": 100,
       "tolerance" : 10,
      "scroller" :detonador,
      onUnpin:()=>{
        this.setState({headRoomClass:'unpinned'})
        // this.props.action.HeadRoom('unpinned')
      },
      onPin:()=>{
        this.setState({headRoomClass:'pinned'})
        // this.props.action.HeadRoom('pinned')
      }
    })
    await headroom.init()

    if(!this.props.currentPair){
      this.props.action.getPairByCountry(this.props.user.country)
    }else{
      this.formating_currency()
    }

  }


  toggle_menu = () =>{
    this.props.action.current_section_params({show_menu_principal:true})
  }

  back_method = () =>{
    this.props.action.section_view_to('initial')
  }



  render(){
    return(
      <MenuSuperiorLayout
        logout={this.logout}
        toggle_menu={this.toggle_menu}
        mouseOver={this.mouseOver}
        openSelectCountry={this.openSelectCountry}
        back_method={this.back_method}
        {...this.state}
        {...this.props}/>
    )
  }
}



MenuSuperiorContainer.propTypes = {
  currentPair:PropTypes.object,
  item_quote:PropTypes.object,
  loader:PropTypes.bool,
  logOut:PropTypes.func,
  loggedIn:PropTypes.bool,
  show_menu_principal:PropTypes.bool
}


function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){
  // console.log('desde M E N U - - - S U P E R I O R - - - - :::', state)
  const { user, user_id } = state.modelData
  return{
    HeadRoomClass:state.ui.headroom,
    currentPair:state.modelData.pairs.currentPair,
    loader:state.isLoading.loader,
    item_quote:state.ui.item_quote,
    loggedIn:state.auth.loggedIn,
    show_menu_principal:state.ui.current_section.params.show_menu_principal,
    user:user && user[user_id]
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps) (MenuSuperiorContainer))
