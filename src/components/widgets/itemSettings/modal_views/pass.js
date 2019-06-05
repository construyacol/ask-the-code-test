import React, { Component, Fragment } from 'react'
import InputForm from '../../inputs'

class PassView extends Component {

  state = {
    status:"",
    pass1:"",
    pass2:""
  }

  actualizarEstado = async(p) =>{

    const { name, value } = p.target

    await this.setState({
      [name]:value
    })


    const{
      pass1,
      pass2
    } = this.state



  console.log('actualizarEstado', this.state.status)

  if(name !== 'pass1'  && pass2.length === pass1.length && pass2 !== pass1){
    await this.props.update_state({
      buttonActive:false
    })

    return this.setState({
      status:"Las contraseñas no coinciden"
    })

  }


  if(name !== 'pass1'  && pass2.length === pass1.length && pass2 === pass1){
    await this.props.update_state({
      buttonActive:true
    })

    return this.setState({
      status:""
    })
  }

  this.props.update_state({
    buttonActive:false
  })

  return this.setState({
    status:""
  })


  }


  render(){

    const {
      buttonActive
    } = this.props


    const{
      status
    } = this.state


    return(
      <Fragment>
        <InputForm
          type="password"
          // label="Escribe tu nueva contraseña"
          placeholder="Escribe la nueva contraseña"
          name="pass1"
          actualizarEstado={this.actualizarEstado}
          active={buttonActive}
          // value={name}
        />

        <InputForm
          type="password"
          // label={description}
          placeholder="Repite la nueva contraseña"
          name="pass2"
          actualizarEstado={this.actualizarEstado}
          active={buttonActive}
          status={status}
          // value={name}
        />
      </Fragment>
    )
  }
}

export default PassView
