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
    visible:false
  }

  componentDidMount(){
    const { user } = this.props
    if(user.levels && user.levels.personal === 'rejected'){
      this.setState({
        visible:true,
        message:"Tus datos han sido rechazados, aprende a verificarte correctamente en tan solo 1 minuto.",
        icon:'rejected',
        ctaText:"Enseñame"
      })
    }
    if(user.levels && user.levels.personal === 'confirmed'){
      this.setState({
        visible:true,
        message:"¡Genial!, estas a 1 solo paso de completar tu proceso de verificación..",
        icon:'verified',
        ctaText:"Enseñame"
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
    let verificate_state = user.levels && user.levels.personal === 'rejected' ? 'rejected' : user.levels.personal === 'confirmed' ? 'confirmed_personal' : ''
    const { visible, message, ctaText, icon } = this.state

    return(
      <div className={`PanelAlertContainer ${visible && 'visible'}`} id="PanelAlertContainer" style={{background:verificate_state === 'rejected' ? '#b31217' : verificate_state === 'confirmed_personal' ? '#989500' : 'white'}}>
         <div className="alertContainer fuente">
           <IconSwitch
             icon={icon}
             size={25}
             color="white"
           />
           <div className="alertContainerText">
             <p>{message}</p>
             <a onClick={this.go_to}>{ctaText}</a>
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
