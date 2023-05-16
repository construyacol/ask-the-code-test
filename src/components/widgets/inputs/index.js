import React from "react";
import SimpleLoader from "../loaders";
import styled from 'styled-components'
import {CAPACITOR_PLATFORM} from "const/const";


const InputFormContainer = styled.div`
    align-self: center;
    height: auto;
    grid-template-rows: 30px 1fr 30px;
    width: 100%;
    max-width: 450px;
    position: relative;
    display: grid;
    align-items: center;
    justify-items: center;
    row-gap:10px;
`

const InputAuthContainer = styled.div`
    height: 50px;
    max-width: 410px;
    width: 100%;
    border: 1px solid #50667a61;
    border-radius: 6px;
    overflow: hidden;
    display: grid;
    position: relative;
    transition: 0.5s;
    background: white;
`

const TwoFactorInput = styled.input`
  padding: 0 20px;
  width: calc(100% - 40px);
  font-size: 25px;
  text-align: center;
  letter-spacing: 12px;
  height: 100%;
  background: 0 0;
  border: 1px solid transparent;
  outline: 0;
  transition: 0.5s;
  color: var(--paragraph_color);

  &::placeholder {
    color: #50667a4d;
  }
` 

export const InputFormAuth = (props) => {
  const {
    // clase,
    label,
    active,
    type,
    placeholder,
    actualizarEstado,
    name,
    value,
    handleKeyPress,
    status,
    verifying,
    error,
    handleFocus,
    handleBlur,
    disabled,
  } = props;

  // console.log(`${}`)
  // <SimpleLoader/>

  return (
    <InputFormContainer>
      <p
        className="labelText fuente"
        style={{ display: !label ? "none" : "initial" }}
      >
        {label}
      </p>
      <InputAuthContainer
        // className={`inputContainer ${active ? 'inputActivado' : '' }`}
        className="inputContainer inputAuths"
        style={{
          border:
            verifying && !active
              ? "1px solid #039aff"
              : active
              ? "1px solid #59b200"
              : error
              ? "1px solid red"
              : "1px solid #50667a61",
          width: CAPACITOR_PLATFORM === 'ios' ? "85%" : "100%",
        }}
      >
        {!verifying ? (
          <TwoFactorInput
            className={`inputElement TwoFactorTypo fuente2`}
            style={{ color: active ? "#59b200" : "gray" }}
            type={type}
            placeholder={placeholder}
            onChange={actualizarEstado}
            name={name}
            defaultValue={value}
            onKeyPress={name === "account_number" ? handleKeyPress : null}
            onFocus={handleFocus ? handleFocus : null}
            onBlur={handleBlur ? handleBlur : null}
            disabled={disabled}
            autoFocus={true}
          />
        ) : (
          <div className="AuthLoader">
            <SimpleLoader />
          </div>
        )}
      </InputAuthContainer>
      <p
        className="statusInput fuente"
        style={{
          color:
            verifying && !active
              ? "#039aff"
              : active
              ? "#59b200"
              : error
              ? "red"
              : "#50667a61",
        }}
      >
        <i
          className="fas fa-check"
          style={{ display: active ? "initial" : "none" }}
        ></i>
        {status}
      </p>
    </InputFormContainer>
  );
};
