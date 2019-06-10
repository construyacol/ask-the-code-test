import React, {Component} from 'react'
import MenuSuperiorLayout from './mSuperiorLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import { number_format } from '../../services'
import Headroom from 'headroom.js'
import { withRouter } from "react-router";
import PropTypes from 'prop-types'


class MenuSuperiorContainer extends Component {

  state = {
    movil:window.innerWidth < 768 ? true : false,
    buy_price:this.props.currentPair && number_format(this.props.currentPair.buy_price),
    sell_price:this.props.currentPair && number_format(this.props.currentPair.sell_price)
  }

  logout = async() =>{
    // this.props.action.CurrentForm('kyc_basic')
    // this.props.action.ToggleModal()
    console.log('this.props.history', this.props)
    // let user_update = {
    //   ...this.props.user,
    //   TokenUser:null
    // }
    // await this.props.action.update_user(user_update)

    // this.props.history.push('/landing')
    await this.props.logOut()
    this.props.action.logged_in(false)
  }

  componentWillReceiveProps(props){

    let buy
    let sell

    if(props.currentPair){
       buy = number_format(props.currentPair.buy_price)
       sell = number_format(props.currentPair.sell_price)
       this.setState({
         buy_price:buy,
         sell_price:sell
       })
    }
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
    this.props.action.HeadRoom('pinned')
  }


  componentDidMount(){
    let menuSuperior = document.getElementById('mSuperior')
    let detonador = document.getElementById('containerElement')
    const headroom = new Headroom(menuSuperior, {
      "offset": 100,
       "tolerance" : 10,
      "scroller" :detonador,
      onUnpin:()=>{
        this.props.action.HeadRoom('unpinned')
      },
      onPin:()=>{
        this.props.action.HeadRoom('pinned')
      }
    })
    headroom.init()

    if(!this.props.currentPair){
    this.props.action.get_pairs_for('colombia')
    }
    // console.log('||||||||| componentDidMount:', this.props)
  }


  toggle_menu = () =>{
    this.props.action.current_section_params({show_menu_principal:true})
  }

  back_method = () =>{
    this.props.action.section_view_to('initial')
  }



  render(){
    // console.log('MENU SUPERIOR_________::', this.props)
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
  HeadRoomClass:PropTypes.string,
  currentPair:PropTypes.object,
  current_section:PropTypes.string,
  item_active:PropTypes.string,
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
  return{
    item_active:state.ui.menu_item_active,
    current_section:state.ui.current_section.view,
    HeadRoomClass:state.ui.headroom,
    currentPair:state.model_data.pairs.currentPair,
    loader:state.isLoading.loader,
    item_quote:state.ui.item_quote,
    loggedIn:state.auth.loggedIn,
    show_menu_principal:state.ui.current_section.params.show_menu_principal
    // user:user && user[user_id]
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps) (MenuSuperiorContainer))
