import {Component} from 'react'
import { createPortal } from 'react-dom'

class ModalContainer extends Component{
   render(){
     return createPortal(
       // Que voy a renderizar, / Donde lo voy a renderizar
       this.props.children,
       document.getElementById('modal-container')
     )
   }
}

export default ModalContainer
