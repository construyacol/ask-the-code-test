import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import IconSwitch from "../icons/iconSwitch";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import useViewport from '../../../hooks/useWindowSize'
import "./panelAlert.css";

 



const PanelAlertContainer = (props) => {
  const { isMovilViewport } = useViewport()
  const [coinsendaServices] = useCoinsendaServices();
  const [state, setState] = useState({
    visible: false,
    message: "",
    icon: "",
    ctaText: "",
    background: "white",
    action: null,
  });
  const { user } = props 

  useEffect(() => {
    if (props.history.location.pathname === "/security") {
      validate_state();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  const openConfirmedDisclaimer = () => {
    props.action.confirmationModalToggle();
    props.action.confirmationModalPayload({
      title: "Verificación de identidad",
      description: "Las verificaciones de identidad actualmente se procesan en mínutos de forma automática, en los casos en los que la información cargada presente problemas, la verificación pasará a revisarse de forma manual en un plazo máximo de 72 horas hábiles.",
      txtPrimary: "Entendido",
      action: null,
      svg: "identity",
    });
  }


  const validate_state = async () => {
    const verification_state = await coinsendaServices.getVerificationState();

    if (!verification_state) {
      return setState({
        visible: true,
        message:
          "Bienvenido, completa el proceso de verificación y comienza a operar en Coinsenda",
        icon: "verified",
        ctaText: "Enseñame ahora >>",
        background: "linear-gradient(to bottom right, #00D2FF, #3A7BD5)",
        action: validate_kyc_basic,
      });
    }

    if (verification_state === "confirmed") {
      return setState({
        visible: true,
        message:
          "Hemos recibido tus documentos. Una vez verificada la cuenta podrás empezar a operar.",
        icon: "verified",
        ctaText: 'Saber más...',
        background: "linear-gradient(to bottom right, #00D2FF, #3A7BD5)",
        action: openConfirmedDisclaimer,
      });
    }
    if (verification_state === "rejected") {
      return setState({
        visible: true,
        message:
          "Tus datos han sido rechazados, aprende a verificarte correctamente en tan solo 1 minuto.",
        icon: "rejected",
        ctaText: "Enseñame ahora >>",
        background: "#b31217",
        action: validate_kyc_basic,
      });
    }
    if (verification_state === "pending") {
      return setState({
        visible: true,
        message:
          "¡Genial!, estas a 1 solo paso de completar tu proceso de verificación..",
        icon: "verified",
        ctaText: "Enseñame ahora >>",
        background: "#989500",
        action: validate_kyc_advanced,
      });
    }
  };

  const validate_kyc_advanced = () => {
    props.action.play_video("kyc_advanced");
  };

  const validate_kyc_basic = () => {
    props.action.play_video("kyc_basic");
  };

  // go_to = () =>{
  //   // props.action.play_video('kyc_basic')
  //   // alert('goto')
  // }

  const close = async () => {
    const verification_state = await coinsendaServices.getVerificationState();

    if (
      !verification_state ||
      (verification_state !== "confirmed" && verification_state !== "accepted")
    ) {
      coinsendaServices.freshChatTrack("need help to verification");
    }
    // console.log('AYuda para verificación', (props.user.levels && props.user.levels.personal !== 'confirmed'), props.user)
    return setState({ ...state, visible: false });
  };

  const { visible, message, ctaText, icon, background, action } = state;


  return (
    
    <div
      className={`PanelAlertContainer ${visible && "visible"}`}
      id="PanelAlertContainer"
      style={{ 
        background: background, 
        gridTemplateColumns: `${isMovilViewport ? '1fr' : '30px 1fr' }`,
        padding: `${isMovilViewport ? '10px 30px 20px 10px ' : '0 20px' }`
      }}
    >
      { !isMovilViewport && <i className="fas fa-times" onClick={close}></i>}
      <div className="alertContainer fuente">
        { !isMovilViewport && <IconSwitch icon={icon} size={25} color="white" />} 
        <div className={`alertContainerText ${isMovilViewport ? 'isMobile' : ''}`}>
          <p>{message}</p>
          {ctaText && <div onClick={action} className={'_hiperLink isMobile'}>{ctaText}</div>}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, props) {
  const { user } = state.modelData;
  const { verification_state } = state.ui;
  return {
    user: user,
    verification_state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelAlertContainer);
