import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import ItemSettings from "./itemSettings";

// const country = [
//   "colombia",
//   "chile",
//   "peru",
//   "republica dominicana",
//   "argentina"
// ]

class ItemSettingsInit extends Component {
  item_action = async (item) => {
    const { user } = this.props;
    const { authenticator } = user.security_center;
    const { phone } = user.settings;
    const { name, other_state } = item;

    // debugger

    switch (name) {
      case "kyc_basic":
        // await this.props.action.ToStep("globalStep", 0);
        // await this.props.action.CurrentForm("kyc_basic");
        // return this.props.action.toggleModal();
        const Element = await import("../../forms/widgets/personalKycComponent/init");
        const PersonalKycComponent = Element.default
      return this.props.action.renderModal(() => <PersonalKycComponent/>); 
      case "kyc_financial":
        
        await this.props.action.CurrentForm("kyc_basic");
        await this.props.action.ToStep("globalStep", 3);
        const Element2 = await import("../../kyc/kyc_container");
        const IdentityKycComponent = Element2.default
        return this.props.action.renderModal(() => <IdentityKycComponent/>); 
      // return this.props.action.toggleModal();

      case "kyc_advanced": 
        await this.props.action.CurrentForm("kyc_basic");
        await this.props.action.ToStep("globalStep", 2);
        return this.props.action.toggleModal();
      case "2auth":
        // console.log('||||||| CLICK ITEM', item)
        if (other_state === "to_disable") {
          await this.props.action.current_section_params({
            settings: {
              title: "Deshabilitando segundo factor",
              description: `Desactivarás la segunda capa de seguridad en todos los servicios activos.`,
              txtPrimary: "Desactivar",
              txtSecondary: "Cancelar",
              authenticator: authenticator,
              code: name,
              other_state,
            },
          });
          return this.props.action.toggleOtherModal();
        }
        await this.props.action.CurrentForm("2auth");
        return this.props.action.toggleModal();
      case "phone":
        await this.props.action.current_section_params({
          settings: {
            title: "Actualizar número de movil",
            description: `${
              phone
                ? `Tu número actual es: ${phone}`
                : "Aún no tienes número celular de respaldo"
            }`,
            txtPrimary: "Actualizar",
            txtSecondary: "Cancelar",
            // action:this.update_phone,
            payload: phone,
            code: name,
            type: "number",
            placeholder: "Escribe el nuevo número",
            authenticator: authenticator,
          },
        });
        return this.props.action.toggleOtherModal();

      case "pass":
        await this.props.action.current_section_params({
          settings: {
            title: "Cambia tu contraseña",
            description: `Esta contraseña es la que utilizas para acceder a tu cuenta`,
            txtPrimary: "Actualizar",
            txtSecondary: "Cancelar",
            code: name,
            type: "number",
            placeholder: "Escribe el nuevo número",
            authenticator: authenticator,
          },
        });
        return this.props.action.toggleOtherModal();

      case "transactional":
        await this.props.action.current_section_params({
          settings: {
            title: `${
              other_state === "to_disable"
                ? "Deshabilitando 2FA"
                : "Agregando capa de seguridad"
            }`,
            description: `Activa el segundo factor para hacer operaciones de intercambio en coinsenda`,
            txtPrimary: "Agregar",
            txtSecondary: "Cancelar",
            authenticator: authenticator,
            code: name,
            other_state,
          },
        });
        return this.props.action.toggleOtherModal();
      case "withdraw":
        await this.props.action.current_section_params({
          settings: {
            title: `${
              other_state === "to_disable"
                ? "Deshabilitando 2FA"
                : "Agregando capa de seguridad"
            }`,
            description: `Activa el segundo factor para hacer operaciones de Retiro en coinsenda`,
            txtPrimary: "Agregar",
            txtSecondary: "Cancelar",
            authenticator: authenticator,
            code: name,
            other_state,
          },
        });
        return this.props.action.toggleOtherModal();
      case "country":
        await this.props.action.current_section_params({
          settings: {
            title: "Elige el país de operación actual",
            txtPrimary: "Agregar",
            txtSecondary: "Cancelar",
            authenticator: false,
            code: name,
          },
        });
        return this.props.action.toggleOtherModal();
      case "currency":
        await this.props.action.current_section_params({
          settings: {
            title: "Elige tu divisa de cotización",
            txtPrimary: "Agregar",
            txtSecondary: "Cancelar",
            authenticator: false,
            code: name,
          },
        });
        return this.props.action.toggleOtherModal();
      default:
    }
  };

  update_state = async (payload) => {
    const { name, description } = payload;

    const { user } = this.props;

    const { security_center } = user;

    const { kyc } = security_center;

    const { auth, transactional, withdraw } = security_center.authenticator;

    let movil_viewport = window.innerWidth < 768;

    // console.log('|||desde el componente ItemSettings', name, payload)

    switch (name) {
      case "email":
        return {
          available: true,
          verify: security_center.email,
          classic_view: movil_viewport,
        };
      case "identity":
        return {
          available: true,
          verify: true,
          classic_view: movil_viewport,
        };
      case "kyc_financial":
        return {
          classic_view: movil_viewport,
          icon: kyc.financial === "rejected" ? "error" : null,
          color: kyc.financial === "rejected" ? "#c70000" : null,
          available: kyc.basic === "accepted" && kyc.advanced === "accepted",
          verify: kyc.financial === "accepted",
          other_state: kyc.financial,
          description:
            kyc.financial === "confirmed"
              ? "Tus datos financieros estan siendo verificados en estos momentos..."
              : kyc.financial === "rejected"
              ? "Tus datos no se han podido verificar, intenta nuevamente"
              : description,
        };
      case "kyc_basic":
        return {
          classic_view: movil_viewport,
          color: kyc.basic === "rejected" ? "#c70000" : null,
          icon: kyc.basic === "rejected" ? "error" : null,
          available: true,
          verify: kyc.basic === "accepted",
          description:
            kyc.basic === "confirmed" && !kyc.advanced
              ? "Continúa con la identificación intermedia para dar inicio a la verificación de tus datos."
              : kyc.basic === "confirmed" && kyc.advanced === "confirmed"
              ? "El sistema esta verificando tus datos..."
              : kyc.basic === "rejected" && kyc.advanced === "rejected"
              ? user.verification_error ||
                "¡Vaya!, al parecer los datos no se han podido verificar, vuelve a intentarlo"
              : "",
          other_state:
            kyc.basic === "confirmed" && kyc.advanced === "confirmed"
              ? "confirmed"
              : kyc.basic === "confirmed" &&
                (!kyc.advanced || kyc.advanced === "rejected")
              ? "send"
              : kyc.advanced === "rejected"
              ? "rejected"
              : null,
        };

      case "kyc_advanced":
        return {
          classic_view: movil_viewport,
          available:
            kyc.basic === "confirmed" || kyc.advanced === "accepted" || kyc.advanced === "rejected"
              ? true
              : null,
          verify: kyc.advanced === "accepted",
          other_state: kyc.advanced,
          description:
            kyc.basic === "confirmed" && kyc.advanced === "confirmed"
              ? "El sistema esta verificando tus datos..."
              : kyc.advanced === "rejected" && "",
        };

      case "2auth":
        // console.log('|||||||||||||| HABILITAR DESACTIVABLE 2AUTH', authenticator)
        return {
          classic_view: movil_viewport,
          available: true,
          other_state: auth ? "to_disable" : null,
          verify: auth,
        };

      case "transactional":
        return {
          classic_view: movil_viewport,
          available: auth && true,
          other_state: transactional ? "to_disable" : null,
          verify: auth && transactional,
        };

      case "withdraw":
        return {
          classic_view: movil_viewport,
          available: auth && true,
          other_state: withdraw ? "to_disable" : null,
          verify: auth && withdraw,
        };

      default:
        return false;
    }
  };

  update_phone = (prop) => {
    // console.log('update_phone update_phone update_phone', prop)
  };

  render() {
    const { data } = this.props;
    // console.log('ItemSettingsInit', this.props)

    return (
      <section className="SecurityCenter">
        {data &&
          data.map((item) => {
            return (
              <ItemSettings
                name={item.name}
                item={item}
                key={item.id}
                item_action={this.item_action}
                update_state={this.update_state}
                {...this.props}
              />
            );
          })}
      </section>
    ); 
  }
}

function mapStateToProps(state, props) {
  const { user } = state.modelData;
  return {
    loader: state.isLoading.loader,
    advace_global_step: state.form.globalStep,
    user: user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemSettingsInit);
