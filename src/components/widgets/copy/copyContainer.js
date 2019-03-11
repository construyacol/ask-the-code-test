import React, { Component } from 'react'
import CopyLayout from './copyLayout'
import { toast } from 'react-toastify';

import './copyStyle.css'


class CopyContainer extends Component {



  copy = (payload) => {
    let aux = document.createElement("input")
    aux.setAttribute("value", payload.target.id)
     document.body.appendChild(aux);
     aux.select();
     document.execCommand("copy");
     document.body.removeChild(aux);

     toast("¡Copiado Exitosamente!", {
       position: toast.POSITION.BOTTOM_RIGHT,
        pauseOnFocusLoss: false,
        draggablePercent: 60,
        className: "putito",
        bodyClassName: "putitoText",
        progressClassName: 'putitoProgress',
        toastId:1,
        autoClose: 3000
     });
  }

  render(){

    const { valueToCopy, color, max_width }= this.props

    return(
      <CopyLayout
        valor = {valueToCopy}
        copy = {this.copy}
        color = {color}
        max_width= {max_width}
      />
    )
  }
}

export default CopyContainer
