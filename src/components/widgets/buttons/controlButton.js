import React from "react";
import styled from "styled-components";
// import { InputButton } from './buttons'
import SimpleLoader from "../loaders";
import { LoaderContainer } from "../loaders";
import { useSelector } from "react-redux";




export const SecondaryButton = ({ handleAction, label }) => {
  return(
      <ButtonContaniner onClick={handleAction}>
          <p className="fuente">
              {label}
          </p>
      </ButtonContaniner>
  )
}

const ButtonContaniner = styled.div`
  width:auto;
  min-width: 120px;
  text-align: center;
  cursor:pointer;
  p{
      color:var(--title1);
      font-weight:bold;
      font-size:15px;
  }
`


// osDevice
const ControlButton = ({ 
  loader=undefined, 
  formValidate = null, 
  label, 
  handleAction, 
  id=undefined, 
  inputProps=undefined ,
  className="",
  type="primary"
}) => {

  const { osDevice } = useSelector((state) => state?.ui);

  return (
    <ControlsContainer
      id="controlsContainer"
      className={`${loader ? "loader" : ""} ${osDevice} ${className}`}
    >
      {loader && (
        <LoaderContainer>
          <SimpleLoader loader={2} />
        </LoaderContainer>
      )}
      <InputButton
        label={label}
        type={type}
        id={id}
        className={className}
        active={formValidate}
        handleAction={(e) => {
          e.currentTarget.blur();
          handleAction && handleAction(e);
        }}
        {...inputProps}
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
          className={`botonForm ${props.type}  fuente `}
          type="button"
          value={props.label}
          onClick={props.handleAction}
        />
      ) : (
        // <div className="botonForm desactivado fuente" style={{width:props.ancho}}  >
        <DisabledButton className={`fuente ${props.className}`} >{props.label}</DisabledButton>
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


  &.settingButton{
      height: fit-content;
      padding: 14px 18px;
      width: calc(100% - 36px);
  }


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

  &.settingButton{
    input{
      height: fit-content;
      padding: 14px 18px;
    }
  }

  @media screen and (max-width: 768px) {
    ${'' /* align-self:end; */}
  }
`;

export default ControlButton;
