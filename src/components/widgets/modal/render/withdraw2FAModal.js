import React from "react";
import OtherModalLayout from "../otherModalLayout";
import styled from "styled-components";
import {
  swing_in_bottom_bck,
  socketIconContainerIntro,
  backTopSection,
} from "../../animations";
import AuthReq from "../../itemSettings/modal_views/authreq";
import IconSwitch from "../../icons/iconSwitch";
import { useActions } from "../../../../hooks/useActions";
import { IconClose } from "../../shared-styles";

const Withdraw2FaModal = ({ callback, isWithdraw2fa, cancelAction }) => {
  const actions = useActions();

  const cerrar = (e, forcedClose) => {
    if (forcedClose || !e || (e.target.dataset && e.target.dataset.close_modal)) {
      actions.renderModal(null);
      if (cancelAction) {
        cancelAction();
      }
    }
  };

  return (
    <OtherModalLayout on_click={cerrar}>
      <Layout>
        <IconClose theme="dark" size={20} />
        <TopSection>
          <Title className="fuente">Autenticación de retiro</Title>
          <CircleIconContainer>
            <div className="wavExpansive in" />
            <IconSwitch size={60} icon="twofa" />
          </CircleIconContainer>
          <ContBackTopSection>
            <BackTopSection className="backTopSection" />
          </ContBackTopSection>
        </TopSection>
        <BottomSection>
          <Description>
            <p className="fuente">
              Digita el código <span className="fuente2">2FA</span> para
              continuar.
            </p>
            <AutContainer>
              <AuthReq isWithdraw2fa={isWithdraw2fa} authenticated={callback} />
            </AutContainer>
          </Description>
          <ButtonCont onClick={() => cerrar(false, true)}>Cancelar</ButtonCont>
        </BottomSection>
      </Layout>
    </OtherModalLayout>
  );
};

export default Withdraw2FaModal;

const BackTopSection = styled.div`
  opacity: 0.05 !important;
  animation: ${backTopSection};
  animation-duration: 30s;
  animation-iteration-count: infinite;
`;

const ContBackTopSection = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
`;

// const CloseButton = styled.div`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   width: 35px;
//   height: 35px;
//   background: white;
//   border-radius: 50%;
//   z-index: 2;
//   display: grid;
//   align-items: center;
//   justify-items: center;
//   cursor: pointer;
//   -webkit-transition: 0.15s;
//   transition: 0.15s;
//
//   i {
//     color: gray;
//   }
// `;

const AutContainer = styled.div`
  width: 100%;
  position: relative;
  height: 70px;
`;

const ButtonCont = styled.div`
  padding: 8px 15px 8px 15px;
  background: #e6e6e6;
  display: grid;
  width: auto;
  min-width: 200px;
  height: 35px;
  display: grid;
  align-items: center;
  border-radius: 6px;
  align-self: center;
  margin-bottom: 20px;
  justify-items: center;
  cursor: pointer;
  -webkit-transition: 0.15s;
  transition: 0.15s;
  color: #888888;

  &:hover {
    background: #0198ff;
    color: white;
  }
`;

const Description = styled.div`
  width: 80%;
  position: relative;
  display: grid;
  justify-items: center;
  align-items: center;
  height: 111px;
  span {
    margin: 0 7px;
  }
`;

const BottomSection = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  position: relative;
  padding-top: 0px;
  /* grid-template-rows: repeat(3, auto); */
  grid-template-rows: 1fr auto;
  align-items: center;
  height: 100%;
  grid-row-gap: 10px;
  row-gap: 10px;
`;

const CircleIconContainer = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  background: white;
  border-radius: 50%;
  justify-self: center;
  align-self: flex-end;
  position: relative;

  animation: ${socketIconContainerIntro};
  animation-duration: 0.35s;
  animation-delay: 0.25s;
  animation-fill-mode: forwards;
  transform: translateY(15px) scale(0);
`;

const Title = styled.h3`
  text-align: center;
  color: white;
  margin: 30px 0 10px 0;
`;

const TopSection = styled.section`
  background: linear-gradient(to bottom right, #0175c3, #039aff);
  width: 100%;
  height: 100%;
  display: grid;
  position: relative;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
`;

const Layout = styled.div`
  width: 100%;
  max-width: 410px;
  height: 460px;
  background: white;
  display: grid;
  align-items: center;
  justify-items: center;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  border-radius: 11px;
  position: relative;
  grid-template-rows: 30% 70%;

  -webkit-animation: ${swing_in_bottom_bck} 1s
    cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    both;
`;
