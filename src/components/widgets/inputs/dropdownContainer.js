import React, { Component } from 'react'
import DropDownLayout from './ui/dropdownlayout'
import './inputStyles.css'

class DropDownContainer extends Component{

  state = {
    elements:this.props.elements,
    open:false,
    placeHolder:"Ahorros/Corriente"
  }

  abrir = (e) =>{
    this.setState({
      open:!this.state.open
    })
  }

  selectItem = (event) => {

    const text = event.target.title

    const estado = {
      target:{
        name:'account_type',
        value:text
      }
    }

    this.setState({
      placeHolder:text
    })

    this.props.actualizarEstado(estado)
  }


  render(){

    const { label, active } = this.props
    // console.log('DESDE EL CONTENEDOR DEL DROPDOWN::::', this.props)
    return(
      <DropDownLayout
        elements={this.state.elements}
        open={this.state.open}
        abrir = {this.abrir}
        placeholder={this.state.placeHolder}
        selectItem={this.selectItem}
        label={label}
        active={active}
      />
    )
  }
}

export default DropDownContainer
