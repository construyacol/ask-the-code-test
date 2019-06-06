import React, { Component } from 'react'
import { InputFormAuth } from '../../inputs'

import './viewSettings.css'

class AuthReq extends Component {
  // handleFocus => Evento opcional que se dispara al hacer focus en el input
  // handleBlur => Evento opcional que se dispara al perder el foco del input
  // authenticated => Evento que se dispara al ingresar el codigo 2auth correctamente
  // toggle_anim => Evento opcional para transicionar el componente en caso de exito


state = {
  buttonActive:false,
  loader:false,
  verifying:false,
  status:"",
  error:false,
  value:"",
  desaparecer:false
}

actualizarEstado = p =>{

  const { value } = p.target

  if(value.length > 5 && value === '666999'){

    setTimeout(()=>{
     this.setState({
        buttonActive:true,
        status:"Verificado con Exito",
        error:false,
        loader:false,
        value:value
      })
      this.ok_auth()
    },700)

    return this.setState({
      loader:true,
      buttonActive:false,
      status:"Verificando..."
    })

  }



  if(value.length > 5 && value !== '666999'){

    setTimeout(()=>{
      this.setState({
        error:true,
        loader:false,
        status:"El codigo de verificación es incorrecto"
      })
    },500)


    return this.setState({
      loader:true,
      buttonActive:false,
      status:"Verificando..."
    })
  }

  this.setState({
    status:"",
    buttonActive:false,
    loader:false,
    error:false
  })



}

ok_auth = () =>{

  setTimeout(()=>{
    this.props.toggle_anim && this.props.toggle_anim()
    this.setState({
      desaparecer:this.props.toggle_anim && true
    })
  },1200)

  setTimeout(()=>{
    this.props.authenticated && this.props.authenticated()
    // this.props.toggle_anim()
  }, 1500)
}


  render(){

    const {
      buttonActive,
      loader,
      status,
      error,
      value,
      desaparecer
    } = this.state

    const {
      label,
      handleFocus,
      handleBlur
    } = this.props



    // console.log('|||||  AuthReq - - - ', this.props)

    return(
      <div id="authReq" className={`${desaparecer ? 'desaparece': ''}`}>

        <InputFormAuth
          type="number"
          label={label}
          placeholder="Escribe tu codigo 2FA de 6 digitos"
          name="auth"
          actualizarEstado={this.actualizarEstado}
          active={buttonActive}
          verifying={loader}
          value={value}
          status={status}
          error={error}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
        />

      </div>
    )
  }
}

export default AuthReq
