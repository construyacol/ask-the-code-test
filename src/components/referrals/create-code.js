import React from "react";
import CreateReferralLink from "./createReferralLink";
import styled, { css } from "styled-components";
import { device } from "../../const/const";



function CreateCode(props) {
  return (
    <Container id="container">
      <Text>
        <p>
          Gána el<span className="fuente2">0.5% </span> de todas las operaciones de compra y venta que tus referidos realicen.
        </p>
      </Text>
        <CreateReferralLink {...props} />

    </Container>
  );
}


const Container = styled.div`
  margin:auto;
  width: 100%;
  max-width: 1000px;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  grid-row-gap: 15px;
  justify-self: center;
  align-self: center;
  padding: 50px;
  height: calc(100% - 100px);



  @media ${device.tabletL} {
    padding: 50px 25px;
    width: calc(100% - 50px);
  }

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
    color: #6b6b6b;
    font-weight: bold;
    text-align: center;
    span{
      font-weight: bold;
      margin: 0 7px;
    }
    p {
        font-size: 16px;
        color: #6b6b6b;
        font-weight: 100;
        max-width: 1100px;
        margin-top: 2em;
    }
}
`;



export default CreateCode;
