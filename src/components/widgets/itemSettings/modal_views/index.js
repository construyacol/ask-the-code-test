import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../../actions";
import SimpleLoader from "../../loaders";
import IconSwitch from "../../icons/iconSwitch";
import { ButtonForms } from "../../buttons/buttons";
import AuthReq from "./authreq";
import OtherModalLayoutPairs from "../../modal/otherModalLayoutPairs";
import withCoinsendaServices from "../../../withCoinsendaServices";
import styled from "styled-components";

const Container = styled.section`
  width: calc(100% - 40px);
  height: calc(100% - 105px);
  position: absolute;
  top: 65px;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: 150px 1fr 80px;
  padding: 20px;

  .contenidoView{
    display: grid;
    justify-items: center;
    position: relative;
    width: 100%;
    height: 100%;
  }

  #authReq{
    position: absolute;
    width: 100%;
    height: 100%;
    background: #ffffffc4;
    z-index: 2;
    display: grid;
    justify-items: center;
  }

  #successOperation {
    justify-self: center;
    margin: 0 !important;
    font-size: 22px;
    color: #59b200;
    align-self: center;
  }
`

export class ModalSettingsView extends Component {

  state = {
    buttonActive: false,
    auth: this.props.params.authenticator.auth,
    section: "",
    data: null,
    action_triger: null,
    animOn: false,
    loader: false,
    success: false,
  };

  close_modal = () => {
    this.props.action.toggleOtherModal();
  };

  authenticated = () => {
    this.setState({
      auth: false,
    });
  };

  componentDidMount() {
    const { params } = this.props;

    const { code } = params;

    this.setState({
      section: code,
    });
  }

  update_state = (payload) => {
    this.setState(payload);
  };

  view_switch = (props) => {
    const { code } = props;
    switch (code) {
      case "2auth":
        this.success(props);
        return <SimpleLoader label="Actualizando" />;
      default:
        return alert('jum')
    }
  };

  toggle_anim = (payload) => {
    this.setState({ animOn: !this.state.animOn });

    if (payload) {
      setTimeout(() => {
        this.setState({
          section: payload,
        });
      }, 200);
    }

    setTimeout(() => {
      this.setState({ animOn: !this.state.animOn });
    }, 2000);
  };

  handleClick = (payload) => {
    // console.log(`actualizando, sección : ${this.state.section}, enviando el parametro: ${this.state.data}`)
    this.setState({
      loader: true,
    });

    setTimeout(() => {
      this.success();
    }, 1000);
  };

  success = (payload) => {
    const { code } = payload;

    setTimeout(async () => {
      await this.props.action.isAppLoading(true);
      const { other_state } = payload;
      // console.log('||||||| success', payload)

      let user_update = {
        ...this.props.user,
      };
      // console.log('||||||| user_update1', user_update)

      if (code === "transactional") {
        user_update.security_center.authenticator.transactional =
          other_state === "to_disable" ? false : true;
        await this.props.coinsendaServices.updateUser(user_update);
      }
      // if(code === 'withdraw'){
      //   user_update.security_center.authenticator.withdraw = other_state === 'to_disable' ? false : true
      //   await this.props.coinsendaServices.updateUser(user_update)
      // }
      if (code === "2auth" || code === "withdraw") {
        user_update.security_center.authenticator.auth =
          other_state === "to_disable" ? false : true;
        user_update.security_center.authenticator.transactional =
          other_state === "to_disable" ? false : true;
        user_update.security_center.authenticator.withdraw =
          other_state === "to_disable" ? false : true;
        await this.props.coinsendaServices.updateUser(user_update);
      }
      // console.log('||||||| user_update2', user_update)

      await this.props.action.isAppLoading(false);
      this.setState({
        loader: false,
        success: true,
        section: "success",
        buttonActive: true,
      });
    }, 600);
  };

  // PassWordView
  render() {
    // console.log('ModalSettingsView - - componentDidMount', this.props)
    const { params } = this.props;

    const { title, txtPrimary, txtSecondary, code } = params;

    const { buttonActive, auth, animOn, section, loader, success } = this.state;

    const atributos = {
      icon: `${auth ? "2auth" : section}`,
      size: 80,
      color: `${success ? "#59b200" : "#1babec"}`,
    };
    let movil_viewport = window.innerWidth < 768;

    return (
      <OtherModalLayoutPairs
        title={title}
        close_modal={this.close_modal}
        classes={code}
      >
        {/* <p className="OtherModalFind"></p> */}

        <Container >
          {code === "country" || code === "currency" ? (
            <this.view_switch {...params} />
          ) : (
            <Fragment>
              <IconSwitch {...atributos} animon={animOn || 'false'} />
              {success ? (
                <div className="contenidoView">
                  <p id="successOperation" className="fuente">
                    Segundo factor deshabilitado exitosamente
                  </p>
                </div>
              ) : (
                <div className="contenidoView fuentePrin">
                  {!loader ? (
                    auth ? (
                      <AuthReq
                        label="Digita el código Authenticator aquí:"
                        authenticated={this.authenticated}
                        toggle_anim={this.toggle_anim}
                        isTryToDisable2fa
                      />
                    ) : (
                      <this.view_switch {...params} />
                    )
                  ) : (
                    <SimpleLoader />
                  )}
                </div>
              )}
            </Fragment>
          )}

          <div className="CMControls">
            {!success && !movil_viewport ? (
              <Fragment>
                <ButtonForms
                  type="secundary"
                  active={true}
                  siguiente={this.close_modal}
                >
                  {txtSecondary}
                </ButtonForms>

                <ButtonForms
                  type="primary"
                  active={buttonActive}
                  siguiente={this.handleClick}
                >
                  {txtPrimary}
                </ButtonForms>
              </Fragment>
            ) : (
              <ButtonForms
                type="primary"
                active={buttonActive}
                siguiente={this.close_modal}
              >
                Finalizar
              </ButtonForms>
            )}
          </div>
        </Container>
      </OtherModalLayoutPairs>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

function mapStateToProps(state, props) {
  const { user } = state.modelData;

  return {
    params: state.ui.current_section.params.settings,
    user: user,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCoinsendaServices(ModalSettingsView));
