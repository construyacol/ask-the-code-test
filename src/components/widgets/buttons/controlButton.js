import React from "react";
import styled from "styled-components";
// import { InputButton } from './buttons'
import SimpleLoader from "../loaders";
import { LoaderContainer } from "../loaders";

const ControlButton = ({ loader, formValidate, label, handleAction, id }) => {
  return (
    <ControlsContainer
      id="controlsContainer"
      className={`${loader ? "loader" : ""}`}
    >
      {loader && (
        <LoaderContainer>
          <SimpleLoader loader={2} />
        </LoaderContainer>
      )}
      <InputButton
        label={label}
        type="primary"
        id={id}
        active={formValidate}
        handleAction={(e) => {
          e.currentTarget.blur();
          handleAction && handleAction(e);
        }}
      />
    </ControlsContainer>
  );
};

export const InputButton = (props) => {
  // Este es el cta por default
  //clase large => "width:200px !important"

  return (
    <InputButtonCont>
      <input
        style={{ opacity: 0, width: 0, height: 0, display: "none" }}
        type="submit"
        disabled={true}
      />
      {props.active ? (
        <input
          id={props.id}
          className={`botonForm ${props.type} fuente `}
          type="button"
          value={props.label}
          onClick={props.handleAction}
        />
      ) : (
        // <div className="botonForm desactivado fuente" style={{width:props.ancho}}  >
        <DisabledButton className="disabledButton fuente" >{props.label}</DisabledButton>
      )}
    </InputButtonCont>
  );
};

const InputButtonCont = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  .botonForm {
    width: 100% !important;
  }
`;

const BotonForm = styled.div`
  max-width: 300px;
  width: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  border-style: none !important;
  font-size: 17px !important;
  padding: 18px 0px;
  -webkit-transition: 0.2s;
  transition: 0.2s;
`;

const DisabledButton = styled(BotonForm)`
  background: #8080807d;
  color: white;
  opacity: 0.4;
`;

const ControlsContainer = styled.div`
  display: grid;
  justify-items: center;
  width: 100%;
  height: 56px;
  position: relative;
  max-width: 300px;
  justify-self: center;
  align-self: center;

  &.loader::after {
    content: "";
    background: rgb(255, 255, 255, 0.8);
    width: 100%;
    height: 100%;
    position: absolute;
  }

  @media screen and (max-width: 768px) {
    align-self:end;
  }
`;

export default ControlButton;
