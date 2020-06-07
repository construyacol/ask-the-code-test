import React, { Component } from 'react'
import CopyLayout from './copyLayout'
import { mensaje } from '../../../utils'

import './copyStyle.css'


class CopyContainer extends Component {

// @Params
// valueToCopy => string
// color => string
// max_width => number

  copy = (payload) => {
    let aux = document.createElement("input")
    aux.setAttribute("value", payload.target.id)
     document.body.appendChild(aux);
     aux.select();
     document.execCommand("copy");
     document.body.removeChild(aux);
    return mensaje("¡Copiado Exitosamente!")

  }

  render(){

    const { valueToCopy, color, max_width, onlyIcon } = this.props

    return(
      <CopyLayout
        valor = {valueToCopy}
        copy = {this.copy}
        color = {color}
        max_width= {max_width}
        onlyIcon = {onlyIcon}
      />
    )
  }
}

export default CopyContainer
