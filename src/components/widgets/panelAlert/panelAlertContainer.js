import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import IconSwitch from '../icons/iconSwitch'

import './panelAlert.css'



class PanelAlertContainer extends Component {

  state = {
    message:"",
    ctaText:"",
    visible:false,
    background:'white'
  }

  componentDidUpdate(prevProps){
    if(prevProps !== this.props){
      this.validate_state()
    }
  }

  componentDidMount(){
    this.validate_state()
  }

  validate_state = () =>{
    const { user } = this.props

    if(user.security_center.kyc.basic === 'confirmed' && user.security_center.kyc.advanced === 'confirmed'){
      return this.setState({
        visible:true,
        message:"Nuestro sistema esta analizando tus datos, si todo sale bien, en breve podrás operar en Coinsenda",
        icon:'verified',
        ctaText:null,
        background:'linear-gradient(to bottom right, #00D2FF, #3A7BD5)'
      })
    }

    if(user.security_center.kyc.basic === 'rejected'){
      return this.setState({
        visible:true,
        message:"Tus datos han sido rechazados, aprende a verificarte correctamente en tan solo 1 minuto.",
        icon:'rejected',
        ctaText:"Enseñame",
        background:'#b31217'
      })
    }
    if(user.security_center.kyc.basic === 'confirmed'){
      return this.setState({
        visible:true,
        message:"¡Genial!, estas a 1 solo paso de completar tu proceso de verificación..",
        icon:'verified',
        ctaText:"Enseñame",
        background:'#989500'
      })
    }
  }

  go_to = () =>{
    // alert('goto')
  }

  close = () =>{
    return this.setState({visible:false})
  }

  render(){
    const { user } = this.props
    const { visible, message, ctaText, icon, background } = this.state

    return(
      <div className={`PanelAlertContainer ${visible && 'visible'}`} id="PanelAlertContainer" style={{background:background}}>
         <div className="alertContainer fuente">
           <IconSwitch
             icon={icon}
             size={25}
             color="white"
           />
           <div className="alertContainerText">
             <p>{message}</p>
             {
               ctaText &&
               <a onClick={this.go_to}>{ctaText}</a>
             }
           </div>
         </div>
         <i className="fas fa-times" onClick={this.close}></i>
      </div>
    )
  }

}




function mapStateToProps(state, props){
  const { user, user_id } = state.model_data
  return {
      user:user[user_id]
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (PanelAlertContainer)
