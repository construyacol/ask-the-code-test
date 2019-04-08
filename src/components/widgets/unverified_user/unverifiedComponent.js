import React, { Component, Fragment } from 'react'
import { ButtonForms } from '../buttons/buttons'
import IconSwitch from '../icons/iconSwitch'
import { withRouter } from "react-router"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'


import './index.css'


class UnverifiedComponent extends Component {

  state = {
    state_verification:null
  }

  componentDidMount(){
    const { advanced, basic } = this.props.user.security_center.kyc
    let state_verification = advanced === 'confirmed' && basic === 'confirmed' && 'confirmed'
    this.setState({state_verification})
  }

  go_verification = async() =>{
    await this.props.action.section_view_to('initial')
    await this.props.history.push(`/security`)
    setTimeout(()=>{
      this.props.action.ToggleModal()
    },20)
  }

  render(){

    const atributos ={
      icon: 'verified',
      size:110,
      color:'#989898'
    }

    const { state_verification } = this.state

    return(
      <section className="UnverifiedComponent">
        <div className="UnverifiedComponentIcon">
          <IconSwitch {...atributos}/>
        </div>
          <p className="fuente">

            {state_verification !== 'confirmed' ?
            'Debes completar el proceso de verificación avanzado para poder operar en coinsenda.' : 'Hemos recibido satisfactoriamente tus datos, en breve te notificaremos el estado de verificación de los mismos'}

          </p>
        <div className={`UnverifiedComponentIconButtons ${state_verification}`}>
            <ButtonForms
              type="primary"
              active={true}
              siguiente={state_verification !== 'confirmed' ? this.go_verification : null}
            >

              {state_verification !== 'confirmed' ? 'Completar mi verificación' : 'Verificando tus datos'}
            </ButtonForms>
        </div>
      </section>
    )
  }
}


function mapStateToProps(state, props){

  const { user, user_id } = state.model_data

  return{
    user:user[user_id]
  }

}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps) (UnverifiedComponent))
