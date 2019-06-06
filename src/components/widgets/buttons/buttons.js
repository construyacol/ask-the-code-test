import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PopNotification from '../notifications'
import IconSwitch from '../icons/iconSwitch'
// import { Link as ScrollTo } from "react-scroll";

import './buttons.css'

export const ButtonSuccess = (props) =>{
  const{
    cta_secondary
  } = props

  return(
    <div id={`${cta_secondary ? 'secondary' : '' }`} className={`botonForm suck fuente ${cta_secondary ? 'secondary' : '' }`} onClick={props.toggleModal} title="finalizar">
        {props.children}
    </div>
  )
}


export const ButtonSuccess2 = (props) =>{

  return(
    <div className="botonForm sucky fuente" title="finalizar">
        {props.children}
        <div className="filtrear"></div>
    </div>
  )
}


export const SelectCountryButton = (props) =>{

  const { bar, handleClick } = props

  return(
    <div className={`SelectCountryButton ${bar}`}  onClick={handleClick}>
        <div className="countryTextSelect">
          <i className="fas fa-caret-down"></i>
          <div className="contTextCountryButton">
            <p className="fuente">Cambiar País</p>
          </div>
        </div>
        <IconSwitch icon="cop" size={22} />
    </div>
  )
}


export const AddNewItem = props => {
// type define el estilo del boton, recibe 2 parametros 'primary' y 'secondary'
// label define el texto que llevará el botton para agregar
// handleClick define el evento que se accionara al dar click en el boton

  const { label, type, handleClick, clases } = props

  return(
      <section className={`AddNewItemContainer ${clases}`} onClick={handleClick}>
        <div className="BbackgroundAddNew"></div>
        <div className={`AddNewItem ${type}`}>
          <p className=" fuente" ><i className="fas fa-plus"></i>{!label ? 'AÑADIR NUEVO' : label}</p>
        </div>
      </section>
  )
}


export class ButtonPrincipalMenu extends Component{

  activarItem = () =>{
    this.props.activarItem(this.props.clave, this.props.clave)
  }

  render(){
    return(
      <Link to={`/${this.props.clave}`} className={`itemMenu ${this.props.itemStatus === this.props.clave ? 'activo' : ''}`} onClick={this.activarItem}>
        <div className={`text ${this.props.itemStatus === this.props.clave ? 'activate' : ''}`}>
          <div className="iconButtCont">
            <IconSwitch icon={this.props.icon} size={20} color={`${this.props.itemStatus === this.props.clave ? "#14B3F0" : "#acacac"}`} />
            <PopNotification notifier={this.props.clave}/>
          </div>
          <p className="itemText">{this.props.text}</p>
        </div>

        <div className="indicatorCont">
            <div className={`indicator ${this.props.itemStatus === this.props.clave ? 'activate' : ''}`}>
              <div className={`indicatorSon ${this.props.itemStatus === this.props.clave ? 'activate' : ''}`}></div>
            </div>
        </div>
      </Link>
    )
  }

}


// export const ButtonPrincipalMenu = (props) => {
//   return(
//     <Link to={props.link} className={`itemMenu ${props.itemStatus === props.clave ? 'activo' : ''}`} onClick={() => props.activarItem(props.clave)}>
//       <div className={`text ${props.itemStatus === props.clave ? 'activate' : ''}`}><i className={props.icon}></i><p className="itemText">{props.text}</p></div>
//       <div className="indicatorCont">
//           <div className={`indicator ${props.itemStatus === props.clave ? 'activate' : ''}`}>
//             <div className={`indicatorSon ${props.itemStatus === props.clave ? 'activate' : ''}`}></div>
//           </div>
//       </div>
//     </Link>
//   )
// }


export const ButtonModalClose = (props) => {
  const {
    toggleModal,
    color
  } = props

  return(
    <div className="closeModalButtonCont" onClick={toggleModal} style={{color:color ? color : 'gray'}}>
      <i className="fas fa-times" ></i>
      {props.children}
    </div>
  )
}

export const ButtonModalBack = (props) => {

  const {
    volver,
    color
  } = props

  return(
    <div className="closeModalButtonBack" onClick={volver}  style={{color:color ? color : 'gray'}}>
      <i className="fas fa-arrow-left"></i>
      {props.children}
    </div>
  )
}

export const InputButton = (props) => {
  // Este es el cta por default
  //clase large => "width:200px !important"

  return(
    <div className="InputButton" >
      {
        props.active ?
        <input className={`botonForm ${props.type} fuente `} type="submit" value={props.label} onClick={props.action} />
        :
        <div className="botonForm desactivado fuente" style={{width:props.ancho}}  >
          {props.label}
        </div>
      }
    </div>
  )
}

export const ButtonForms = (props) => {

  // Propiedades componente:
  // active: true/false, define si el boton esta o no disponible(available)
  // type: primary / Secondary || estos valores definen los estilos del boton por jerarquía visual call to action primario y secundario
  // siguiente: evento a enlazar el boton

  const { clases, id } = props

  return(
    <div className={`contButton ${clases}`} id={`${id}`}>
      {
        props.active ?
        <div id="botonForm" className={`botonForm ${props.type} fuente`} onClick={props.siguiente} >
          {props.children}
        </div>
        :
        <div id="botonForm" className={`botonForm desactivado fuente ${props.cenVert}`} >
          {props.children}
        </div>
      }
    </div>
  )
}


export const PaymentConfirButton = (props) => {

  // Propiedades componente:
  // Active: true/false, define si el boton esta o no disponible(available)
  // type: primary / Secondary || estos valores definen los estilos del boton por jerarquía visual call to action primario y secundario
  // Siguiente: evento a enlazar el boton

  const { clases, label, type, cenVert, siguiente } = props

  return(
    <div className={`contButton ${clases}`} id={`ALconfirmButton`}>
      {
        props.active ?
        <div id="paymentConfirButton" className={`botonForm ${type} fuente`} onClick={siguiente}>
          <p id="ALbuttonText" className="ALbuttonText">
            <span className="ALbuttonTextSpan fuente">{label}</span>
            <i id="confirmIcon" className="confirmIcon fas fa-arrow-alt-circle-up"></i>
          </p>
        </div>
        :
        <div className={`botonForm desactivado fuente ${cenVert}`} >
          <p id="ALbuttonText" className="ALbuttonText">
            <span className="ALbuttonTextSpan fuente">{label}</span>
            <i id="confirmIcon" className="confirmIcon fas fa-arrow-alt-circle-up"></i>
          </p>
        </div>
      }
    </div>
  )
}


export const ItemSelected = (props) =>{
  const{
    label,
    active,
    close
  } = props

  return(
    <div className="containerInputComponent">
      {
        label &&
        <p className="buttonsP fuente">{label}</p>
      }
        <div className={`ItemSelectedButton ${active ? 'buttonActivated': ''}`}>
          <i className="fas fa-times itemClose" onClick={close}></i>
          {props.children}
        </div>
    </div>
  )
}

export default ButtonPrincipalMenu
