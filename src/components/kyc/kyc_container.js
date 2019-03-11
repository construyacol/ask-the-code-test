import React, { Component } from 'react'
import KycLayout from './kycLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'


class Kyc extends Component {



  nextKyc = () => {

    this.props.action.Loader(true)
    this.props.action.CleanForm('kyc_basic')
    this.user_update()
    setTimeout(()=>{

      this.props.action.IncreaseStep('kyc_global_step')
      setTimeout(()=>{this.props.action.Loader(false)},1000)

    }, 3000)

  }


  user_update = async() =>{
        const {
          user
        } = this.props

        let new_user = {
          ...user,
          security_center:{
            ...user.security_center,
            kyc:{
              ...user.security_center.kyc,
              basic:true
            }
          }
        }

        return this.props.action.update_user(new_user)
  }



  siguiente = () =>{
    this.props.action.IncreaseStep('kyc_global_step')
  }

  exit = () =>{
    this.props.action.ToggleModal(false)
  }

  render(){
    // console.log('S T A T E -- K Y C --- C O N T A I N E R')

    return(
      <KycLayout
        nextKyc={this.nextKyc}
        siguiente={this.siguiente}
        exit={this.exit}
        {...this.props}
      />
    )
  }

}

function mapStateToProps(state, props){
  // console.log('S T A T E -- K Y C --- C O N T A I N E R', state)
  const { user, user_id} = state.model_data

  return{
    loader:state.isLoading.loader,
    globalStep:state.form.globalStep,
    user:user[user_id]
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Kyc)
