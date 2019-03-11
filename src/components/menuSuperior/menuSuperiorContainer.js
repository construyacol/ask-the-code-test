import React, {Component} from 'react'
import MenuSuperiorLayout from './mSuperiorLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import { number_format } from '../../services'


class MenuSuperiorContainer extends Component {

  state = {
    movil:window.innerWidth < 768 ? true : false
  }

  open = () =>{
    this.props.action.ToggleModal()
    this.props.action.CurrentForm('kyc_basic')
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

  componentDidMount(){
    const {Headroom} = this.props
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
  }

  render(){

    // console.log('MENU SUPERIOR_________::', this.props)

    return(
      <MenuSuperiorLayout
        open={this.open}
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
  return{
    redux_class:state.ui.headroom,
    currentPair:state.model_data.pairs.currentPair,
    loader:state.isLoading.loader,
    item_quote:state.ui.item_quote
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (MenuSuperiorContainer)
