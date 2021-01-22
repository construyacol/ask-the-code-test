import React from "react";
import CreateReferralLink from "./createReferralLink";
import styled, { css } from "styled-components";



function CreateCode(props) {
  return (
    <Container id="container">
      <Text>
        <p>
          Por cada amigo que se registre con tu link de referido ganas el 0.5%
          de todas las operaciones de compra y venta que tu amigo realice.
        </p>
      </Text>
        <CreateReferralLink {...props} />

    </Container>
  );
}


const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  grid-row-gap: 15px;
`;

// const FormContainer = styled.div`
//   width: 100%;
//   height: 470px;
//   display: grid;
//   align-items: center;
//   justify-items: center;
//   grid-template-rows: 55% 45%;
//   grid-row-gap: 15px;
//   transition: all 500ms ease;
//   ${(props) =>
//     props.hide &&
//     css`
//       transform: translateY(30px);
//     `}
// `;

const Text = styled.div`
    font-family: 'Raleway', sans-serif !important;
    font-size: 22px;
    color: #3c3c3c;
    font-weight: bold;
    text-align: center;
    p {
        font-size: 16px;
        color: gray;
        font-weight: 100;
        max-width: 1100px;
        margin-top: 2em;
    }
}
`;



export default CreateCode;
