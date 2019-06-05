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
    visible:true,
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

  validate_state = async() =>{

    let verification_state = await this.props.action.get_verification_state()

    if(!verification_state){
      return this.setState({
        visible:true,
        message:"Bienvenido, completa el proceso de verificación y comienza a operar en Coinsenda",
        icon:'verified',
        ctaText:"Enseñame ahora >>",
        background:'linear-gradient(to bottom right, #00D2FF, #3A7BD5)',
        action:this.validate_kyc_basic
      })
    }

    if(verification_state === 'confirmed'){
      return this.setState({
        visible:true,
        message:"Nuestro sistema esta verificando tus documentos, en breve podrás operar en Coinsenda",
        icon:'verified',
        ctaText:null,
        background:'linear-gradient(to bottom right, #00D2FF, #3A7BD5)',
        action:null
      })
    }
    if(verification_state === 'rejected'){
      return this.setState({
        visible:true,
        message:"Tus datos han sido rechazados, aprende a verificarte correctamente en tan solo 1 minuto.",
        icon:'rejected',
        ctaText:"Enseñame ahora >>",
        background:'#b31217',
        action:this.validate_kyc_basic
      })
    }
    if(verification_state === 'pending'){
      return this.setState({
        visible:true,
        message:"¡Genial!, estas a 1 solo paso de completar tu proceso de verificación..",
        icon:'verified',
        ctaText:"Enseñame ahora >>",
        background:'#989500',
        action:this.validate_kyc_advanced
      })
    }

  }

  validate_kyc_advanced = () =>{
    this.props.action.play_video('kyc_advanced')
  }

  validate_kyc_basic = () =>{
    this.props.action.play_video('kyc_basic')
  }

  go_to = () =>{
    // this.props.action.play_video('kyc_basic')
    // alert('goto')
  }

  close = () =>{
    return this.setState({visible:false})
  }

  render(){
    const { visible, message, ctaText, icon, background, action } = this.state

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
               <a onClick={action}>{ctaText}</a>
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
  const { verification_state } = state.ui
  return {
      user:user[user_id],
      verification_state
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (PanelAlertContainer)
