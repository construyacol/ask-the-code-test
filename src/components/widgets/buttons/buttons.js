import React from "react";
import loadable from "@loadable/component";
import { Link } from "react-router-dom";
// import { Link as ScrollTo } from "react-scroll";
import useAvailableWalletCreator from "hooks/useAvailableWalletCreator";
// import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import { useSelector } from "react-redux";
import styled from 'styled-components'
import "./buttons.css";
 

const IconSwitch = loadable(() => import("../icons/iconSwitch"));
const SimpleLoader = loadable(() => import("../loaders"));
const PopNotification = loadable(() => import("../notifications"));



// export const ButtonSuccess2 = (props) => {
//   return (
//     <div className="botonForm sucky fuente" title="finalizar">
//       {props.children}
//       <div className="filtrear"></div>
//     </div>
//   );
// };

export const SelectCountryButton = (props) => {
  const { bar, handleClick } = props;

  return (
    <div className={`SelectCountryButton ${bar}`} onClick={handleClick}>
      <div className="countryTextSelect">
        <i className="fas fa-caret-down"></i>
        <div className="contTextCountryButton">
          <p className="fuente">Cambiar País</p>
        </div>
      </div>
      <IconSwitch icon="cop" size={22} />
    </div>
  );
};

export const AddNewItem = (props) => {
  // type define el estilo del boton, recibe 2 parametros 'primary' y 'secondary'
  // label define el texto que llevará el botton para agregar
  // handleClick define el evento que se accionara al dar click en el boton

  const { label, type, handleClick, clases, id } = props;

  return (
    <div
      id={id}
      className={`AddNewItemContainer ${clases}`}
    >
      {/* <div className="BbackgroundAddNew"></div> */}
      <div className={`AddNewItem ${type}`}
      onClick={handleClick}
      >
        <p className=" fuente">
          <i className="fas fa-plus"></i>
          {!label ? "AÑADIR NUEVO" : label}
        </p>
      </div>
    </div>
  );
};

export const AddNewItem2 = (props) => {
  // type define el estilo del boton, recibe 2 parametros 'primary' y 'secondary'
  // label define el texto que llevará el botton para agregar
  // handleClick define el evento que se accionara al dar click en el boton

  // const theme = useContext(CAccountAllowedContext);
  const { label, handleClick, clases } = props;
  const [availableCurrencies] = useAvailableWalletCreator();

  return (
    <section
      className={`AddNewItemContainer ${clases}`}
      onClick={        availableCurrencies && availableCurrencies.length ? handleClick : null
      }
    >
      <div className="BbackgroundAddNew"></div>
      <div
        className={`AddNewItem ${
          availableCurrencies && availableCurrencies.length
            ? "primary"
            : "desactivado"
        }`}
      >
        {/* <div className={`AddNewItem`}> */}
        <p className=" fuente">
          <i className="fas fa-plus"></i>
          {!label ? "AÑADIR NUEVO" : label}
        </p>
      </div>
    </section>
  );
};




export const ButtonPrincipalMenu = ({
  clave,
  path,
  text,
  icon,
  subfix,
  keyCode, 
  className,
  device,
  handleAction,
  ...props
}) => { 


  const { keyActions } = useSelector((state) => state.ui);
  // const elementId = useKeyActionAsClick(
  //   true,
  //   `${clave}-section-button`,
  //   keyCode
  // );
  const isDesktop = window.innerWidth > 1024;
  // keyActions
  const activarItem = (event) => {
    event.currentTarget.blur();
    props.activarItem(clave, clave);
  };

  const buttonText = isDesktop ? `${text} ${keyActions ? `[${subfix}]` : ''}` : text;


  const Wrapper = ["withdraw_accounts"].includes(clave) ? "div" : Link
  const toWithdrawAccounts = ["withdraw_accounts"].includes(clave) ? handleAction : activarItem

  return (
        <Wrapper
          // id={elementId}
          to={`/${clave}`}
          className={`itemMenu ${path === clave ? "activo" : ""} ${className}`}
          onClick={toWithdrawAccounts}
        >
          <HoverTag className="_hoverTag fuente">
            {buttonText}
          </HoverTag>

          <div className={`text ${path === clave ? "activate" : ""}`}>
            <div className="iconButtCont">
              <IconSwitch
                icon={icon}
                size={18}
                color={`${path === clave ? "#14B3F0" : "#d6d6d6"}`}
              /> 
              <PopNotification notifier={clave} />
            </div>
            <p className="itemText fuente">{buttonText}</p>
          </div>

          <div className="indicatorCont">
            <div className={`indicator ${path === clave ? "activate" : ""}`}>
              <div
                className={`indicatorSon ${path === clave ? "activate" : ""}`}
              ></div>
            </div>
          </div>
        </Wrapper>
  );
};


const HoverTag = styled.div`
  position: absolute;
  width: max-content;
  height: fit-content;
  background: #192026cc;
  top: 0;
  z-index: 10;
  left: 71px;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  backdrop-filter: blur(3px);
  margin: auto;
  right: 0;
  bottom: 0;
  display:none;
  pointer-events: none;
`

// export const ButtonModalBack = (props) => {
//   const { volver, color, id = "modal-backstep-button" } = props;

//   return (
//     <div
//       id={id}
//       className="closeModalButtonBack"
//       onClick={volver}
//       style={{ color: color ? color : "gray" }}
//     >
//       <i className="fas fa-arrow-left"></i>
//       {props.children}
//     </div>
//   );
// };

export const InputButton = (props) => {
  // Este es el cta por default
  //clase large => "width:200px !important"

  return (
    <div className="InputButton">
      {props.preventSubmit && (
        <input
          style={{ opacity: 0, width: 0, height: 0, display: "none" }}
          type="submit"
          disabled={true}
        />
      )}
      {props.active ? (
        <input
          id={props.id}
          className={`botonForm ${props.type} fuente `}
          type="submit"
          value={props.label}
          onClick={props.action}
        />
      ) : (
        <div
          className="botonForm desactivado fuente"
          style={{ width: props.ancho }}
        >
          {props.label}
        </div>
      )}
    </div>
  );
};
 
export const ButtonForms = (props) => {
  // SimpleLoader
 

  // Propiedades componente:
  // active: true/false, define si el boton esta o no disponible(available)
  // type: primary / Secondary || estos valores definen los estilos del boton por jerarquía visual call to action primario y secundario
  // siguiente: evento a enlazar el boton
 
  const { clases, id, loader, _id } = props;

  return (
    <div className={`contButton ${clases}`} id={`${id}`}>
      {props.active ? (
        <div
          id={_id}
          className={`continue-withdraw-button botonForm swap ${loader ? "loader" : ""} ${
            props.type
          } fuente`}
          onClick={loader ? null : props.siguiente}
        >
          {!loader ? props.children : <SimpleLoader loader={2} />}
        </div>
      ) : (
        <div
          id="botonForm"
          className={`botonForm desactivado fuente ${props.cenVert}`}
        >
          {props.children}
        </div>
      )}
    </div>
  );
};

export const PaymentConfirButton = (props) => {
  // Propiedades componente:
  // Active: true/false, define si el boton esta o no disponible(available)
  // type: primary / Secondary || estos valores definen los estilos del boton por jerarquía visual call to action primario y secundario
  // Siguiente: evento a enlazar el boton

  const { clases, label, type, cenVert, siguiente, id } = props;

  return (
    <div
      className={`ALconfirmButton contButton ${clases}`}
      data-is_confirm_deposit
    >
      {props.active ? (
        <div
          id={id}
          className={`paymentConfirButton botonForm ${type} fuente`}
          onClick={siguiente}
          data-is_confirm_deposit
        >
          <p id="ALbuttonText" className="ALbuttonText" data-is_confirm_deposit>
            <span className="ALbuttonTextSpan fuente" data-is_confirm_deposit>
              {label}
            </span>
            <i
              id="confirmIcon"
              className="confirmIcon fas fa-arrow-alt-circle-up"
              data-is_confirm_deposit
            ></i>
          </p>
        </div>
      ) : (
        <div
          className={`botonForm desactivado fuente ${cenVert}`}
          data-is_confirm_deposit
        >
          <p id="ALbuttonText" className="ALbuttonText" data-is_confirm_deposit>
            <span className="ALbuttonTextSpan fuente" data-is_confirm_deposit>
              {label}
            </span>
            <i
              id="confirmIcon"
              className="confirmIcon fas fa-arrow-alt-circle-up"
              data-is_confirm_deposit
            ></i>
          </p>
        </div>
      )}
    </div>
  );
};

export const ItemSelected = (props) => {
  const { label, active, close } = props;

  return (
    <div className="containerInputComponent">
      {label && <p className="buttonsP fuente">{label}</p>}
      <div className={`ItemSelectedButton ${active ? "buttonActivated" : ""}`}>
        <i className="fas fa-times itemClose" onClick={close}></i>
        {props.children}
      </div>
    </div>
  );
};

export const ButtonNofity = (props) => {
  const handleAction = () => {
    props.buttonAction(props.item_id);
  };

  return (
    <div
      id={props.id}
      className={`ButtonNofity fuente ${props.className}`}
      onClick={handleAction}
    >
      {props.children}
    </div>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ButtonPrincipalMenu,
  ButtonNofity,
};
