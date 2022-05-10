import React from "react";
import loadable from "@loadable/component";
import { ButtonPrincipalMenu } from "../widgets/buttons/buttons";
import { menuPrincipal } from "../api/ui/api.json";
import ScoresComponent from "../widgets/scores";
import MovilMenuComponent from "./movilMenu";
import { useActions } from "../../hooks/useActions";
import { doLogout } from "../utils";
import { getAcronym } from '../../utils'
import useKeyActionAsClick from "../../hooks/useKeyActionAsClick";
// import logo from "../../assets/logo.png";
import { getCdnPath } from '../../environment'
import { useSelector } from "react-redux";
// import useAcronym from '../../hooks/useAcronym'

const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));
// TODO: remove all window ref from components, may be the cause of future
// issues
const MenuPrincipalLayout = (props) => {
  const {
    show_menu_principal,
    close_menu_principal,
    verification_state,
    openSelectCountry,
    navigateTo,
  } = props;


  // const [acronym, setAcronym] = useAcronym();
  const actions = useActions();
  const idForLogoutButton = useKeyActionAsClick(
    true,
    "logout-button",
    27,
    true,
    "onkeyup"
  );

  const { keyActions, osDevice  } = useSelector((state) => state.ui);
  const logoutButtonText = window.innerWidth > 900 ? `Cerrar sesión ${keyActions ? '[ESC]' : ''}` : "Cerrar sesión";

  const logOut = () => {
    actions.confirmationModalToggle();
    actions.confirmationModalPayload({
      title: "Estás a punto de cerrar sesión...",
      description: "¿Estás seguro que deseas salir de Coinsenda?",
      txtPrimary: "Salir de Coinsenda",
      txtSecondary: "Quiero quedarme",
      action: doLogout,
      svg: "logout",
      type: "select_country",
    });
  };
 

  return (
    <section
      className="menuPrincipal fuente"
      style={{
        left: show_menu_principal ? "0" : "-110vw",
      }}
    >
      <div className="contCloseMprincipal" onClick={close_menu_principal}></div>

      <div className="userInfo">
        <div className="logo">
          <img src={`${getCdnPath('assets')}logo.svg`} width={146} height={41} alt="logo" loading="lazy"/>
          <i className="fas fa-arrow-left" onClick={close_menu_principal}></i>
        </div>

        <div className="perfilPiCont">
          <div className={`perfilPic ${verification_state}`}>
            <div className="fuente">
              {!props?.user?.name ? (
                <IconSwitch icon="coinsenda" size={40} color="white" />
              ) : (
                <p className="fuente">{getAcronym(props?.user?.name)}</p>
              )}
            </div>
          </div>
        </div>

        <p className="userName" onClick={props.handleClick}>
          <strong>
            {props.user.name
              ? props.user.name
              : props.user.email
              ? props.user.email
              : "Bienvenido"}
          </strong>
        </p>
        <ScoresComponent />
      </div>

      <div className={`menuItems ${window.innerWidth < 768 ? 'movil' : ''}`}>
        {window.innerWidth > 768 ? (
          <section className="section1">
            {menuPrincipal.map((item) => {
              if (item.clave !== "security" && verification_state !== "accepted") { return false }
              return (
                <ButtonPrincipalMenu
                  activarItem={props.activarItem}
                  path={props.path}
                  {...item}
                  key={item.id}
                />
              );
            })}
            <br />
          </section>
        ) : (
          <section className="section1">
            <MovilMenuComponent
              openSelectCountry={openSelectCountry}
              navigateTo={navigateTo}
              actions={actions}
              {...props}
            />
          </section>
        )}
        <section className={`section2 movil ${osDevice}`}>
          <div
            id={idForLogoutButton}
            className={`menuMovilItems close`}
            onClick={logOut}
          >
            <p className="menuMovilItemTexts close fuente">
              {logoutButtonText}
              <i className="fas fa-power-off"></i>
            </p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default MenuPrincipalLayout;
