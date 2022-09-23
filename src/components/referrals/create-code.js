import React from "react";
import CreateReferralLink from "./createReferralLink";
import styled from "styled-components";
// import { device } from "../../const/const";

function CreateCode(props) {
  return (
    <Container id="container">
      <CreateReferralLink {...props} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
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

// const Text = styled.div`
//     font-family: 'Raleway', sans-serif !important;
//     font-size: 22px;
//     color: var(--paragraph_color);
//     font-weight: bold;
//     span{
//       font-weight: bold;
//       margin: 0 7px;
//     }
//     p {
//         font-size: 16px;
//         color: var(--paragraph_color);
//         font-weight: 100;
//     }
// }
// `;


export default CreateCode;
