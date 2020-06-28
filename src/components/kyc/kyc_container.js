import React, { Component } from 'react'
import KycLayout from './kycLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'

class Kyc extends Component {

  state = {
    reset:null,
    financial_success:null,
    identity_success:false
  }



  validate_personal_kyc = async(info_type) => {

    const { form_kyc_basic, user } = this.props
    const { data_state } = form_kyc_basic

    let config = {
      info:{
        "name":data_state.name,
        "surname":data_state.surname,
        "birthday":data_state.birthday,
        "address":data_state.address,
        "phone":`+${data_state.country_prefix[0].prefix[0]}${data_state.phone}`,
        "city":data_state.city,
        "country":data_state.country[0].code,
        "id_type":data_state.id_type[0].code,
        "id_number":data_state.id_number,
        "nationality":data_state.nationality[0].code
      },
      info_type:"personal",
      verification_level:"level_1"
    }


    this.props.action.isAppLoading(true)
    let res = await this.props.action.update_level_profile(config, user)
    if(!res){
             await this.props.action.ReduceStep('kyc_basic', 1)
             this.props.action.isAppLoading(false)
             this.props.action.mensaje('No puedes verificarte en este momento, intenta más tarde', 'error')
      return this.props.action.ReduceStep('kyc_global_step', 1)
    }
    const { data } = res
    const { personal } = data

    let user_update = {
      ...user,
      ...personal,
      levels:{
        ...user.levels,
        personal:'confirmed'
      },
      security_center:{
        ...user.security_center,
        kyc:{
          ...user.security_center.kyc,
          basic:'confirmed'
        }
      }
    }
      await this.props.action.updateUser(user_update)
    // setTimeout(()=>{
      // this.user_update()
      // this.props.action.CleanForm('kyc_basic')

      this.props.action.IncreaseStep('kyc_global_step')
      this.props.action.success_sound()
      this.props.action.isAppLoading(false)
      // setTimeout(()=>{
        // this.props.action.isAppLoading(false)
        // this.props.action.ReduceStep('kyc_basic')
      // },1000)
    // }, 3000)
  }



  validate_identity_kyc = async({base64}) => {
    const { user } = this.props
    const { newselfie, newfront, newback } = base64

    let config = {
      "info":{
        "selfie":newselfie,
        "id_front":newfront,
        "id_back":user.id_type === 'pasaporte' ? newfront : newback
      },
      "info_type":"identity",
      "verification_level":"level_1"
    }
    this.props.action.isAppLoading(true)
    let res = await this.props.action.update_level_profile(config, user)
    // console.log('||||||||||| VALIDATE_RES', res)
    if(!res){
             await this.props.action.ReduceStep('kyc_avanced', 1)
             await this.setState({reset:true})
             this.props.action.isAppLoading(false)
            return this.props.action.mensaje('No puedes verificarte en este momento, intenta más tarde', 'error')
      // return this.props.action.ReduceStep('kyc_global_step', 1)
    }
    let user_update = {
      ...user,
      levels:{
        ...user.levels,
        identity:'confirmed'
      },
      security_center:{
        ...user.security_center,
        kyc:{
          ...user.security_center.kyc,
          advanced:'confirmed'
        }
      }
    }
    // console.log('||||||||||| VALIDATE_IDENTITY_kyc', user_update)
    await this.props.action.updateUser(user_update)
    this.props.action.isAppLoading(false)
    this.setState({identity_success:true})
    return true
  }


validate_financial_kyc = async(info) =>{

const { user } = this.props

  let config = {
    info,
    info_type:"financial",
    verification_level:"level_2"
  }

  let res = await this.props.action.update_level_profile(config, user)
  console.log('°°°°|||| send_files', res)
  if(!res){
           // await this.props.action.ReduceStep('kyc_basic', 1)
           this.props.action.isAppLoading(false)
           return this.props.action.mensaje('No puedes verificarte en este momento, intenta más tarde', 'error')
  }
  this.props.action.success_sound()


  this.setState({
    financial_success:true
  })
  let user_update = {
    ...user,
    levels:{
      ...user.levels,
      financial:'confirmed'
    },
    security_center:{
      ...user.security_center,
      kyc:{
        ...user.security_center.kyc,
        financial:'confirmed'
      }
    }
  }
  // console.log('||||||||||| VALIDATE_IDENTITY_kyc', user_update)
    await this.props.action.updateUser(user_update)
  this.props.action.isAppLoading(false)


}









  siguiente = () =>{
    this.props.action.IncreaseStep('kyc_global_step')
  }

  exit = () =>{
    this.props.action.toggleModal(false)
  }

  render(){
    // console.log('S T A T E -- K Y C --- C O N T A I N E R', countries)

    return(
      <KycLayout
        validate_personal_kyc={this.validate_personal_kyc}
        validate_identity_kyc={this.validate_identity_kyc}
        validate_financial_kyc={this.validate_financial_kyc}
        siguiente={this.siguiente}
        exit={this.exit}
        {...this.props}
        {...this.state}
      />
    )
  }

}

function mapStateToProps(state, props){
  // console.log('S T A T E -- K Y C --- C O N T A I N E R', state)
  const { user } = state.modelData
  const { current } = state.form

  return{
    loader:state.isLoading.loader,
    globalStep:state.form.globalStep,
    user:user,
    form_kyc_basic:state.form.form_kyc_basic,
    current
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Kyc)
