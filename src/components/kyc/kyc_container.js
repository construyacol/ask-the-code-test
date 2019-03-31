import React, { Component } from 'react'
import KycLayout from './kycLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import { kyc } from '../api/ui/api.json'
// import { countries } from '../api/ui/countries'

import { objectToArray, add_index_to_root_object } from '../../services'
import { serveKycData, converToInitState, extractSelectList } from '../../services'


class Kyc extends Component {

  state = {
    kyc_data_basic:null,
    select_list:null
  }

  componentDidMount(){
    this.init_component()
  }

  init_component = async() =>{
    // Debemos desarrollar una pantalla que aparezca en primer instancia pidiento el tipo de persona (legal/natural)
    // validamos si el (user.verification_level === 'level_0' && user.person_type === null) seteamos un estado para mostrar la pantalla donde pedimos el person_type, ej:this.setState({person_type})
    // de momento solo aceptaremos personas naturales por lo tanto viene seteado por defecto en (user.person_type:'natural')
    // this.props.action.Loader(true)
    // const { user, form_kyc_basic_state } = this.props
    // console.log('||||||||||||| KycContainer P R O P S - - - ', this.props)
    // let countryvalidators = await this.props.action.countryvalidators()
    // if(user.verification_level === 'level_0'){
    // if(user.verification_level !== 'level_0'){
        // this.props.action.Loader(true)
    //     const { user } = this.props
    //     let countryvalidators = await this.props.action.countryvalidators()
    //     let kyc_data_basic = await serveKycData(countryvalidators.res.levels.level_1.personal[user.person_type])
    //     let init_state = await converToInitState(countryvalidators.res.levels.level_1.personal[user.person_type])
    //     let get_country_list = await this.props.action.get_country_list()
    //     let select_list = await extractSelectList(kyc_data_basic, countryvalidators.res.levels.level_1.personal[user.person_type])
    //     select_list.countries = get_country_list
    //
    //     init_state = {
    //         data_state:{
    //           ...init_state,
    //           ...form_kyc_basic_state.data_state,
    //           country_prefix:""
    //         }
    //     }
    //
    //     init_state.data_state.country = user.country
    //
    //     // console.log('||||||||||||| countryvalidators R E S - - - ', countryvalidators.res.levels.level_1.personal[user.person_type])
    //     // console.log('||||||||||||| select_list R E S - - - ', select_list)
    //
    //     await this.props.action.UpdateForm('kyc_basic', init_state)
    //     await this.setState({kyc_data_basic, select_list})
    //     this.props.action.Loader(false)
    // }
  }

  nextKyc = async(info_type) => {

    const { form_kyc_basic, user } = this.props
    this.props.action.Loader(true)
    await this.props.action.update_identity_profile(form_kyc_basic, user, info_type)

    setTimeout(()=>{
      this.user_update()
      // this.props.action.CleanForm('kyc_basic')
      this.props.action.IncreaseStep('kyc_global_step')
      this.props.action.success_sound()
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
    // console.log('S T A T E -- K Y C --- C O N T A I N E R', countries)

    return(
      <KycLayout
        nextKyc={this.nextKyc}
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
  const { user, user_id} = state.model_data

  return{
    loader:state.isLoading.loader,
    globalStep:state.form.globalStep,
    user:user[user_id],
    form_kyc_basic:state.form.form_kyc_basic
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (Kyc)
