import React, { useState } from "react";
import { InputFormAuth } from "../../inputs";
import { useCoinsendaServices } from "../../../../services/useCoinsendaServices";

import "./viewSettings.css";

const AuthReq = (props) => {
  const [buttonActive, setButtonActive] = useState();
  const [loader, setLoader] = useState();
  // const [verifying, setVerifying] = useState();
  const [status, setStatus] = useState();
  const [error, setError] = useState();
  const [valueState, setValueState] = useState();
  const [desaparecer, setDesaparecer] = useState();
  const [coinsendaServices] = useCoinsendaServices();

  const success = (value, res) => {
    setButtonActive(true);
    setStatus("Verificado con Éxito");
    setError(false);
    setLoader(false);
    setValueState(value);
    return ok_auth(res);
  };

  const actualizarEstado = async (p) => {
    const { value } = p.target;

    if (value.length > 5) {
      setLoader(true);
      setButtonActive(false);
      setStatus("Verificando...");

      if (props.isWithdraw2fa) {
        return ok_auth(value);
      }

      let res;
      if (props.isTryToDisable2fa) {
        res = await coinsendaServices.disable2fa(value);
      } else {
        res = await coinsendaServices.addNewTransactionSecurity(value);
      }

      if (!res) {
        setStatus("El código de verificación es incorrecto");
        setError(true);
        return setLoader(false);
      }

      return success(value, res);
    }

    setStatus("");
    setButtonActive(false);
    setLoader(false);
    setError(false);
  };

  const ok_auth = (payload) => {
    setTimeout(() => {
      props.toggle_anim && props.toggle_anim();
      setDesaparecer(props.toggle_anim && true);
    }, 1200);

    setTimeout(() => {
      props.authenticated && props.authenticated(payload);
    }, 1500);
  };

  const { label, handleFocus, handleBlur, disabled } = props;

  return (
    <div id="authReq" className={`${desaparecer ? "desaparece" : ""}`}>
      <InputFormAuth
        disabled={disabled}
        type="number"
        label={label}
        placeholder="CODIGO 2FA"
        name="auth"
        actualizarEstado={actualizarEstado}
        active={buttonActive}
        verifying={loader}
        value={valueState}
        status={status}
        error={error}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
      />
    </div>
  );
};

export default AuthReq;
