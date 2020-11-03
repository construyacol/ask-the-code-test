import React, { Component, Fragment } from "react";
import Coinsenda from "../widgets/icons/logos/coinsenda.js";
import { NavArrow, Security2 } from "../widgets/icons";
import AuthComponent from "./auth";
import AuthReq from "../widgets/itemSettings/modal_views/authreq";

import "./authComponent.css";

class AuthComponentContainer extends Component {
  state = {
    homeScreen: true,
    msgSecondSection: "",
    screen: "login", // login / register / recovery_account / reset_pass
    anim: "in",
    childrenAnim: "in",
    authenticator: true,
    actionSuccess: false,
  };

  msgSection = (msg) => {
    // Metodo para cargar el titulo que hace referencia al componente secundario que se ha renderizado
    this.setState({ msgSecondSection: msg });
  };

  firstScreen = async (homeScreen) => {
    // metodo para indicar si esta o no esta en la pantalla principal recibe como parametro un booleano
    await this.setState({ homeScreen });
  };

  changeScreen = async (screen) => {
    // Metodo para switchear componente a renderizar
    await this.animation("out");
    await this.setState({ screen });
    await this.animation("in");
  };

  animation = async (anim, children) => {
    return new Promise(async (resolve, reject) => {
      await this.setState(!children ? { anim } : { childrenAnim: anim });
      setTimeout(() => {
        return resolve(true);
      }, 150);
    });
  };

  volver = async () => {
    await this.animation("out");
    await this.firstScreen(true);
    await this.setState({ screen: "login", actionSuccess: false });
    await this.animation("in");
  };

  volverFromChild = async () => {
    await this.animation("out", true);
    await this.firstScreen(true);
    await this.setState({ screen: "login", actionSuccess: false });
    await this.animation("in", true);
  };

  success = (actionSuccess) => {
    this.setState({ actionSuccess });
  };

  render_component = () => {
    const { screen } = this.state;
    // console.log('|||||| render_component()', screen)

    return (
      <Fragment>
        {screen === "login" || screen === "register" ? (
          <AuthComponent
            {...this.state}
            firstScreen={this.firstScreen}
            msgSection={this.msgSection}
            changeScreen={this.changeScreen}
            volver={this.volverFromChild}
            animation={this.animation}
            success={this.success}
            section={screen}
          />
        ) : screen === "recovery_account" || screen === "reset_pass" ? (
          <AuthComponent
            {...this.state}
            firstScreen={this.firstScreen}
            msgSection={this.msgSection}
            changeScreen={this.changeScreen}
            volver={this.volverFromChild}
            animation={this.animation}
            success={this.success}
            section={screen}
          />
        ) : (
          screen === "authenticator" && (
            <div className="Auth2fa">
              <Security2 size={75} color="#016ab1" />
              <div className="contAuthReq">
                <AuthReq />
              </div>
            </div>
          )
        )}
      </Fragment>
    );
  };

  render() {
    const { homeScreen, msgSecondSection, anim, screen } = this.state;

    return (
      <div className="AuthComponent">
        <div className="backMovil"></div>

        <div className="AuthContainer">
          <div className="logotype">
            <Coinsenda size={50} color="white" />
            <h1 className="fuenteMuseo">Coinsenda</h1>
          </div>

          <div className="AuthC">
            <div className="AuthTitle">
              <div className="AuthContT">
                <div className="textTitleToggle">
                  <div
                    className="titleToggle"
                    style={{
                      transform: !homeScreen
                        ? "translateY(-35px)"
                        : "translateY(0)",
                    }}
                  >
                    <p className="fuente">Inicio de Sesión</p>

                    <div className="AuthNavTitle">
                      {screen !== "reset_pass" && (
                        <div className="iconContAuth" onClick={this.volver}>
                          <NavArrow color="#0066aa" size={15} />
                        </div>
                      )}
                      <p className="fuente">{msgSecondSection}</p>
                    </div>
                  </div>
                </div>
                <hr className="Authr" />
              </div>
            </div>

            <div className={`AuthSwitchComponent ${anim}`}>
              <this.render_component />
            </div>
          </div>

          <div className="footerText">
            <p className="fuenteMuseo">
              © 2019 - 2021 Coinsenda.com Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthComponentContainer;
