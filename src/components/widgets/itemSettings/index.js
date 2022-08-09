import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import ItemSettings from "./itemSettings";
import KycItemComponent from './kycItem' 
import loadable from "@loadable/component";



const TwoFactorActivate = loadable(() => import("components/widgets/twoFactorActivate/2fa"));


class ItemSettingsInit extends Component {
  item_action = async (item) => {
    const { user } = this.props;
    const { authenticator } = user.security_center;
    // const { phone } = user.settings;
    const { name, other_state } = item;

    // console.log(other_state, name)
    // debugger

    switch (name) {
      case "2auth":
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

        return this.props.action.renderModal(() => <TwoFactorActivate/>);

      default:
        return alert('Ups...')
    }
  };

  update_state = async (payload) => {
    const { name, description } = payload;
    const { user } = this.props;
    const { security_center } = user;
    const { kyc } = security_center;
    const { auth, transactional, withdraw } = security_center.authenticator;
    let movil_viewport = window.innerWidth < 768;
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
          verify: this.props.verification_state === 'accepted' ? true : false,
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
              ? ""
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

        let identityValidation = ["confirmed", "accepted"].includes(kyc.basic) || 
        (["accepted"].includes(kyc.basic) && ["rejected"].includes(kyc.advanced))

        return {
          classic_view: movil_viewport,
          // available: kyc.basic === "confirmed" || kyc.advanced === "accepted" || kyc.advanced === "rejected" ? true : null,
          available:identityValidation,
          verify: kyc.advanced === "accepted",
          other_state: kyc.advanced,
          description:
            kyc.basic === "confirmed" && kyc.advanced === "confirmed"
              ? ""
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
        <KycItemComponent/>
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
  const { verification_state } = state.ui

  return {
    loader: state.isLoading.loader,
    advace_global_step: state.form.globalStep,
    user: user,
    verification_state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemSettingsInit);
