import React, { Component, Fragment } from 'react'
import { InputFormAuth } from '../../inputs'
import SimpleLoader from '../../loaders'

import './viewSettings.css'

class AuthReq extends Component {


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
      verifying,
      error,
      value,
      desaparecer
    } = this.state

    // console.log('|||||  AuthReq - - - ', this.props)

    return(
      <div id="authReq" className={`${desaparecer ? 'desaparece': ''}`}>

        <InputFormAuth
          type="number"
          label="Ingresa el codigo Authenticator para continuar"
          placeholder="Digita el codigo aquí"
          name="auth"
          actualizarEstado={this.actualizarEstado}
          active={buttonActive}
          verifying={loader}
          // value={name}
          value={value}
          status={status}
          error={error}
        />

      </div>
    )
  }
}

export default AuthReq
