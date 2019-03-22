import React, { Component } from 'react'
import KycLayout from './kycLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import { kyc } from '../api/ui/api.json'
import { objectToArray, add_index_to_root_object } from '../../services'


class Kyc extends Component {




  componentDidMount(){
    this.init_component()
  }


  init_component = async() =>{

    // Debemos desarrollar una pantalla que aparezca en primer instancia pidiento el tipo de persona (legal/natural)
    // validamos si el (user.verification_level === 'level_0' && user.person_type === null) seteamos un estado para mostrar la pantalla donde pedimos el person_type, ej:this.setState({person_type})
    // de momento solo aceptaremos personas naturales por lo tanto viene seteado por defecto en (user.person_type:'natural')

    const { user } = this.props

    console.log('||||||||||||| KycContainer P R O P S - - - ', this.props)
    let countryvalidators = await this.props.action.countryvalidators()
    console.log('||||||||||||| KycContainer R E S - - - ', countryvalidators)
    if(user.verification_level === 'level_0'){
      let new_obj = await add_index_to_root_object(countryvalidators.res.levels.level_1.personal[user.person_type])
      let new_arra = await objectToArray(new_obj)
      console.log('||||||||||||| nivel1 data match - - - ', new_arra)
      console.log('||||||||||||| nivel1 data harcode - - - ', kyc)
    }
    // console.log('||||||||||||| Construct model - - - ', res)
  }

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
