import React, { useState, useEffect } from "react";
import IconSwitch from "../icons/iconSwitch";
import QRCode from "qrcode";
import AuthReq from "../itemSettings/modal_views/authreq";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import SuccessComponentScreen from "../success_screen/success_screen";
import styled from "styled-components";
import { skeleton } from "../loaders/skeleton";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";

import "./2fa.css";

const OTP_TITLE = "Coinsenda";

const TwoFactorActivate = (props) => {
  const [qr, setQr] = useState();
  const [inputFocus, setInputFocus] = useState();
  const [private_key, setPrivate_key] = useState();
  const [success_screen, setSuccess_screen] = useState();
  const [switch_to_success, setSwitch_to_success] = useState();
  const [loader, setLoader] = useState(true);
  const [coinsendaServices] = useCoinsendaServices();

  const handleFocus = () => {
    if (!private_key) {
      return;
    }
    setInputFocus(true);
  };

  const handleBlur = () => {
    setInputFocus(false);
  };
 
  const success_event = async (transactionSecurity) => {
    props.action.isAppLoading(true);
    setSuccess_screen(true);
    setTimeout(() => {
      props.action.isAppLoading(false);
      setSwitch_to_success(true);
    }, 500);
  };

  const finish_process = async () => {
    props.action.toggleModal();
  };

  useEffect(() => {
    const init = async () => {
      const code = await coinsendaServices.getNew2faSecretCode();
      if (!code) {
        return;
      }
      const { data } = code;
      setQr(
        await QRCode.toDataURL(`otpauth://totp/${OTP_TITLE}?secret=${data}`)
      );
      setPrivate_key(data);
      setLoader(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TwoFactorActivateCont
      className={`TwoFactorActivate ${
        !switch_to_success ? "TwoFactorActivateOn" : ""
      } ${loader ? "skeleton" : ""}`}
    >
      {!switch_to_success ? (
        <div
          className={`TwoFactorActivate ${success_screen ? "desaparecer" : ""}`}
        >
          <div
            className="TLayout layer1"
            style={{ opacity: inputFocus ? "0.03" : "1" }}
          >
            <div className="header2fa"></div>
            <div className="body2fa">
              <div className="bodySon">
                <p className="fuente">
                  Abre Google Authenticator y escanea el código QR ó ingresa el código secreto manualmente.
                </p>
                {qr && !loader ? (
                  <img src={qr} alt="" width="200px" />
                ) : (
                  <QrLoader className="skeleton"></QrLoader>
                )}
              </div>
              <div className="footer2fa"></div>
            </div>
          </div>

          <div className="TLayout layer2">
            <div className="header2fa">
              <h3 className="fuente">
                Habilitar segundo factor de autenticación <span className="fuente2">2FA</span>
              </h3>
              <IconSwitch icon="2auth" size={75} color="#1babec" />
            </div>
            <div className="body2fa">
              <div
                className="bodySon"
                style={{ height: inputFocus ? "10%" : "50%" }}
              ></div>
              <div className="footer2fa">
                <div className="footer2faText">
                  <div
                    className={`footer2faTextDes ${
                      inputFocus ? "desp" : "desaparecer"
                    }`}
                  >
                    <p className="fuente">
                      Recuerda que en caso de pérdida de tu dispositivo movil,
                      solo podrás reactivar el 2FA con el código secreto{" "}
                      <span className={`secretCode fuente2`}>
                        {private_key}
                      </span>{" "}
                      escribelo en papel y guardalo, es tu responsabilidad
                    </p>
                  </div>
                  
                  <p
                    className={`fuente2 secretCode ${
                      private_key ? "" : "skeleton text"
                    } ${inputFocus ? "desaparecer" : "aparecer"}`}
                  >
                    {private_key}
                  </p>
                </div>
                <AuthReq
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  authenticated={success_event}
                  disabled={loader}
                  {...props}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`TwoFactorActivate success ${
            success_screen ? "aparecer" : ""
          }`}
        >
          <SuccessComponentScreen
            title="Segundo factor de autenticación activado"
            cta_text="El proceso de activación se ha realizado satisfactoriamente."
            confetti={true}
            cta_secondary={false}
            cta_primary_text="Finalizar"
            user_name={props.user.name}
            siguiente={finish_process}
          />
        </div>
      )}
    </TwoFactorActivateCont>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

function mapStateToProps(state, props) {
  const { user } = state.modelData;
  return {
    user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TwoFactorActivate);

const TwoFactorActivateCont = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  justify-items: center;

  .skeleton {
    animation-name: ${skeleton};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    opacity: 0.5;
  }
  .skeleton.text {
    width: 250px;
    height: 25px;
    background: #bfbfbf;
    border-radius: 3px;
    justify-self: center;
  }
`;

const QrLoader = styled.div`
  width: 180px;
  height: 160px;
  background: #bfbfbf;
  border-radius: 3px;
`;
