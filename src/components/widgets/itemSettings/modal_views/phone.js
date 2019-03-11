import React, { Component } from 'react'
import IconSwitch from '../../icons/iconSwitch'
import InputForm from '../../inputs'
import { ButtonForms } from '../../buttons/buttons'
import AuthReq from './authreq'

class PhoneView extends Component {

  state = {
    status:""
  }

  actualizarEstado = p =>{
    const {
      payload
     } = this.props

    const { value } = p.target

    let estado = false

    if(value.length>6 && value !== payload){
      this.setState({
        status:""
      })
      return this.props.update_state({
        buttonActive:true,
        data:value
      })
    }

    if(value.length>6 && value === payload){
      this.setState({
        status:"Tu nuevo numero no puede coincidir con el numero actual, cambialo."
      })
    }
    return this.props.update_state({
      buttonActive:false,
      data:value
    })
  }


  render(){

    const {
      description,
      placeholder,
      code,
      type,
      buttonActive,
      auth
    } = this.props

    const {
      status
    } = this.state


    const atributos ={
      icon:`${auth ? '2auth' : code}`,
      size:80,
      color:`#1babec`
    }



    return(
      <InputForm
        type={type}
        label={description}
        placeholder={placeholder}
        name={code}
        actualizarEstado={this.actualizarEstado}
        active={buttonActive}
        status={status}
        // value={name}
      />
    )
  }
}

export default PhoneView
