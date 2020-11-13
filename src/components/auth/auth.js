import React, { Component, Fragment } from "react";
import ssl from "../../assets/ssl.jpg";
import CubicMessageComponent from "../widgets/showMessage/cubic";
import LoginRegisterView from "./views/login_register";
import RecoveryAccount from "./views/recovery_account";

let timeOut;

class AuthComponent extends Component {
  state = {
    mail: "",
    pswrd: "",
    mail_status: "normal", // normal / bad / good
    passMsg: "¿Olvidaste tu contraseña?",
    forgot: false,
    pswrd2: "",
    pswrd_status: "normal", // normal / bad
    pswrd2_status: "normal", // normal / bad
    loader: false,
    lastSection: this.props.screen,
    cubicSettings: {
      cubicMessage: "",
      backgroundColor: "",
      color: "",
      rotate: false,
    },
  };

  componentDidMount() {
    const { section } = this.props;

    if (section === "login") {
      return false;
    }
    this.props.msgSection(
      `${
        section === "register"
          ? "Creación de Cuenta"
          : section === "recovery_account"
          ? "Recuperar Cuenta"
          : section === "reset_pass" && "Cambio de contraseña"
      }`
    );

    this.props.firstScreen(false);
  }

  componentWillReceiveProps(nextProps) {
    const { lastSection } = this.state;
    if (this.props.screen === nextProps.screen) {
      return false;
    }
    // this.props.screen => "Desde que pantalla provengo"
    // nextProps.screen=> "En que pantalla aterrizo"
    if (
      !this.props.actionSuccess &&
      this.props.screen === "register" &&
      nextProps.screen === "login"
    ) {
      return this.defaultState();
    }
    if (
      (this.props.actionSuccess ||
        this.props.screen === "recovery_account" ||
        this.props.screen === "reset_pass") &&
      nextProps.screen === "login"
    ) {
      const cleaner = async () => {
        await this.defaultState();
        await this.cleanStatus();
      };
      return cleaner();
    }
  }

  updateState = async ({ target }) => {
    // Metodo para actualizar y/o validar la información de los inputs
    // Falta aplicar expresiones regulares a las contraseñas joaquín

    const { name, value } = target;

    const { pswrd } = this.state;

    switch (name) {
      case "mail":
        let minRegex = /@/;
        let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (
          emailRegex.test(value.replace(/^\s+|\s+$|\s+(?=\s)/g, "")) &&
          value.length > 8
        ) {
          this.setState({ mail_status: "good", mail: value });
        } else if (minRegex.test(value)) {
          this.setState({ mail_status: "bad", mail: value });
        } else {
          this.setState({ mail_status: "normal", mail: value });
        }
        break;
      case "pass":
        this.defaultState();
        this.setState({ pswrd: value, pswrd_status: "normal" });
        break;
      case "pass2":
        await this.setState({ pswrd2: value });
        // console.log('||||||| pass valid', value.length >= pswrd.length, value, pswrd)
        if (pswrd.length <= 6) {
          return this.setState({
            cubicSettings: {
              cubicMessage: "La contraseña debe contener más de 6 caracteres",
              backgroundColor: "#f443360d",
              color: "red",
              rotate: true,
            },
            pswrd_status: "bad",
          });
        }

        if (value.length >= pswrd.length && value !== pswrd) {
          return this.setState({
            cubicSettings: {
              cubicMessage: "Las contraseñas no coinciden",
              backgroundColor: "#f443360d",
              color: "red",
              rotate: true,
            },
            pswrd2_status: "bad",
            pswrd_status: "bad",
          });
        } else {
          this.defaultState();
        }
        break;
      default:
    }
  };

  focusActionPass = () => {
    // Si estas en la pantalla login, y haces focus en el input de password, hacemos visible el elemento ¿Olvidaste tu contraseña?
    const { section } = this.props;

    if (section === "login") {
      this.setState({ forgot: true });
    }
  };

  unFocusActionPass = () => {
    // Metodo referenciado para ejecutar cuando el input indicado pierde el foco
    const { section } = this.props;

    if (
      (section === "register" || section === "reset_pass") &&
      this.state.pswrd.length <= 6
    ) {
      return this.setState({
        cubicSettings: {
          cubicMessage: "La contraseña debe contener más de 6 caracteres",
          backgroundColor: "#f443360d",
          color: "red",
          rotate: true,
        },
        pswrd_status: "bad",
      });
    }

    setTimeout(() => {
      this.setState({ forgot: false });
    }, 100);
  };

  forgotPassword = async () => {
    // Metodo para renderizar section de recuperación de cuenta (olvido contraseña)
    await this.defaultState();
    await this.cleanStatus();
    await this.props.changeScreen("recovery_account");
    await this.props.msgSection("Recuperación de cuenta");
    await this.props.firstScreen(false);
  };

  createAccount = async () => {
    await this.setState({ forgot: false });
    await this.props.msgSection("Creación de Cuenta");
    await this.props.firstScreen(false);
    this.props.changeScreen("register");
    this.defaultState();
    clearTimeout(timeOut);
  };

  signIn = () => {
    clearTimeout(timeOut);
    this.props.changeScreen("login");
    this.props.firstScreen(true);
    this.defaultState();
  };

  defaultState = async () => {
    this.setState({
      cubicSettings: {
        ...this.state.cubicSettings,
        rotate: false,
      },
      pswrd_status: "normal",
      pswrd2_status: "normal",
    });

    let data = {
      target: {
        name: "mail",
        value: this.state.mail,
      },
    };
    await this.updateState(data);
    data.name = "pass";
    data.value = this.state.pswrd;
    await this.updateState(data);
  };

  cleanStatus = () => {
    clearTimeout(timeOut);
    this.setState({
      mail_status: "normal",
      pswrd_status: "normal",
      pswrd2_status: "normal",
      mail: "",
      pswrd: "",
      pswrd2: "",
    });
  };

  emulateAuthService = ({ data, unvalidated }) => {
    const { pass } = data;
    this.setState({ loader: true });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (pass === "1231234" || unvalidated) {
          this.setState({ loader: false });
          resolve(true);
        } else {
          this.setState({ loader: false });
          reject(false);
        }
      }, 2000);
    });
  };

  // METODOS DE CONEXIÓN DE SERVICIOS  - -- - - - -  -- - - - - - -- -- - - - -  -- - - - - - -
  // METODOS DE FLUJO RECOVERY ACCOUNT / RESET PASSWORD

  AuthLogin = async () => {
    const { pswrd } = this.state;
    const { authenticator } = this.props;
    let body = { data: { pass: pswrd } };

    let res;
    try {
      res = await this.emulateAuthService(body);
    } catch (error) {
      timeOut = setTimeout(() => {
        this.defaultState();
      }, 7000);

      return this.setState({
        cubicSettings: {
          cubicMessage: "Usuario o contraseña incorrectos",
          backgroundColor: "#f443360d",
          color: "red",
          rotate: true,
        },
        mail_status: "bad",
        pswrd_status: "bad",
        forgot: true,
      });
    }

    if (authenticator) {
      return this.props.changeScreen("authenticator");
    }
  };

  AuthSignin = async () => {
    let body = { data: { pass: null }, unvalidated: true };
    let res = await this.emulateAuthService(body);
    if (!res) {
      return false;
    }
    this.setState({ loader: true });
    await this.props.animation("out", true);
    await this.props.success(true);
    await this.props.animation("in", true);
    this.setState({ loader: false });
    return this.setState({
      cubicSettings: {
        cubicMessage: `Un email de verificación ha sido enviado a ${this.state.mail}, revisalo y completa tu registro.`,
        backgroundColor: "#eefce0",
        color: "green",
        rotate: true,
      },
    });
  };

  socialAuth = async () => {
    let body = { data: { pass: null }, unvalidated: true };
    let res = await this.emulateAuthService(body);
    if (!res) {
      return false;
    }
    this.setState({ loader: true });
    await this.props.animation("out", true);
    await this.props.success(true);
    await this.props.animation("in", true);
    this.setState({ loader: false });
    return this.setState({
      cubicSettings: {
        cubicMessage: `Inicio de sesión con google ha sido satisfactorio`,
        backgroundColor: "#eefce0",
        color: "green",
        rotate: true,
      },
    });
  };

  // METODOS DE FLUJO RECOVERY ACCOUNT / RESET PASSWORD

  SendEmailRecovery = async () => {
    // alert(this.state.mail)

    let body = { data: { pass: null }, unvalidated: true };
    let res = await this.emulateAuthService(body);
    if (!res) {
      return false;
    }
    this.setState({ loader: true });
    await this.props.animation("out", true);
    await this.props.success(true);
    await this.props.animation("in", true);
    this.setState({ loader: false });
    return this.setState({
      cubicSettings: {
        cubicMessage:
          "Hemos enviado un correo electrónico de confirmación, siga las instrucciones que en el se encuentran para continuar...",
        backgroundColor: "#eefce0",
        color: "green",
        rotate: true,
      },
    });
  };

  resetPassword = async () => {
    let body = { data: { pass: null }, unvalidated: true };
    let res = await this.emulateAuthService(body);
    if (!res) {
      return false;
    }
    this.setState({ loader: true });
    await this.props.animation("out", true);
    await this.props.success(true);
    await this.props.animation("in", true);
    this.setState({ loader: false });
    return this.setState({
      cubicSettings: {
        cubicMessage: "La contraseña ha sido cambiada satisfactoriamente...",
        backgroundColor: "#eefce0",
        color: "green",
        rotate: true,
      },
    });
  };

  render() {
    const { mail_status, pswrd, pswrd2, cubicSettings } = this.state;

    const { section } = this.props;

    // console.log('|||||| mail_status()', mail_status)

    let loginValidate = pswrd.length > 6 && mail_status === "good";
    let registerValidate =
      pswrd2.length > 6 &&
      pswrd.length > 6 &&
      pswrd === pswrd2 &&
      mail_status === "good";
    let resetPassValidate =
      pswrd2.length > 6 && pswrd.length > 6 && pswrd === pswrd2;

    return (
      <div className="AuthPanel">
        <div className="AlertMsg">
          <CubicMessageComponent settings={cubicSettings}>
            {section === "login" || section === "register" ? (
              <Fragment>
                <p className="fuente">
                  Por favor, comprueba que estás visitando{" "}
                </p>
                <img src={ssl} alt="" />
              </Fragment>
            ) : (
              <p className="fuente">
                {section === "recovery_account"
                  ? "Escribe el correo electrónico asociado a la cuenta que deseas recuperar"
                  : section === "reset_pass" &&
                    "Digite la nueva contraseña de acceso"}
              </p>
            )}
          </CubicMessageComponent>
        </div>

        {section === "login" || section === "register" ? (
          <LoginRegisterView
            loginValidate={loginValidate}
            registerValidate={registerValidate}
            updateState={this.updateState}
            focusActionPass={this.focusActionPass}
            unFocusActionPass={this.unFocusActionPass}
            forgotPassword={this.forgotPassword}
            AuthLogin={this.AuthLogin}
            AuthSignin={this.AuthSignin}
            createAccount={this.createAccount}
            signIn={this.signIn}
            socialAuth={this.socialAuth}
            {...this.state}
            {...this.props}
          />
        ) : (
          (section === "recovery_account" || section === "reset_pass") && (
            <RecoveryAccount
              loginValidate={loginValidate}
              resetPassword={this.resetPassword}
              resetPassValidate={resetPassValidate}
              updateState={this.updateState}
              unFocusActionPass={this.unFocusActionPass}
              SendEmailRecovery={this.SendEmailRecovery}
              {...this.state}
              {...this.props}
            />
          )
        )}
      </div>
    );
  }
}

export default AuthComponent;
