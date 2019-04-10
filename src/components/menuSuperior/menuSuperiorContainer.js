import React, {Component} from 'react'
import MenuSuperiorLayout from './mSuperiorLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import { number_format } from '../../services'
import Headroom from 'headroom.js'
import { withRouter } from "react-router";

class MenuSuperiorContainer extends Component {

  state = {
    movil:window.innerWidth < 768 ? true : false,
    buy_price:number_format(this.props.currentPair.buy_price),
    sell_price:number_format(this.props.currentPair.sell_price)
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
    this.props.logOut()
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

    // console.log('||||||||| componentDidMount:', this.props)

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
  }

  render(){

    // console.log('MENU SUPERIOR_________::', this.props)

    return(
      <MenuSuperiorLayout
        logout={this.logout}
        mouseOver={this.mouseOver}
        openSelectCountry={this.openSelectCountry}
        {...this.state}
        {...this.props}/>
    )
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){
  // console.log('desde M E N U - - - S U P E R I O R - - - - :::', state)
  const { user, user_id } = state.model_data
  return{
    redux_class:state.ui.headroom,
    currentPair:state.model_data.pairs.currentPair,
    loader:state.isLoading.loader,
    item_quote:state.ui.item_quote,
    user:user[user_id]
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps) (MenuSuperiorContainer))
