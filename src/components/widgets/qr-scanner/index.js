import React, { useState } from "react";
import QrReader from "react-qr-reader";
import OtherModalLayout from "../modal/otherModalLayout";
import { useActions } from "hooks/useActions";
import useToastMessage from "hooks/useToastMessage";
import styled from "styled-components";
import { device, MAIN_COLOR } from "const/const";
import IconSwitch from "../icons/iconSwitch";
import { CloseButton } from "../shared-styles";
// import { regexPaymentRequest } from 'utils/regex'
import { PAYMENT_REQUEST } from 'const/routes'

const QrScanner = (props) => {
  const [facingMode, setFacingMode] = useState(false);
  const [toastMessage] = useToastMessage();
  const actions = useActions();

  const closeModal = (e) => {
    if (e && e.name) {
      toastMessage(`Camara no disponible`, "error");
    }
    actions.renderModal(null);
  };

  const handleScan = (data) => {
    if(!data)return
    closeModal();
    if (new RegExp(PAYMENT_REQUEST, "g").test(data)) return props.onScan(data)
    if (data.indexOf("?") > -1) data = data.slice(0, data.indexOf("?"));
    props.onScan(data.slice(data.indexOf(":") + 1));
  }

  return (
    <OtherModalLayout>
      <Container>
        <CloseButton onClick={closeModal}>
          <i className="fas fa-times"></i>
        </CloseButton>
        <p>Escanear código QR</p>
        <div className="qr-scanner">
          <QrReader
            delay={100}
            facingMode={facingMode ? "user" : "environment"}
            onError={closeModal}
            onScan={handleScan}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <IconSwitch
            icon="swap-camera"
            color={"#14b3f0"}
            onClick={() => setFacingMode(!facingMode)}
            size={50}
          />
        </div>
      </Container>
    </OtherModalLayout>
  );
};

const CornerPos = "-2px";
const CornerStyle = `2px solid ${MAIN_COLOR}`;

const Container = styled.div`
  height: 100%;
  width: 25vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .iconSty {
    cursor: pointer;
  }

  ${CloseButton} {
    right: 50px;
    top: 50px;
  }

  @media ${device.tablet} {
    ${CloseButton} {
      right: 15px;
      top: 15px;
    }
  }

  p {
    color: white !important;
    font-family: "Raleway";
    font-weight: bold;
    width: 100%;
    padding: 0 !important;
    text-align: center;
  }
  > .qr-scanner {
    width: 94%;
    position: relative;

    &:before,
    &:after,
    > section::before,
    > section::after {
      display: block;
      content: "";
      width: 30px;
      height: 30px;
      position: absolute;
    }

    &:before {
      top: ${CornerPos};
      left: ${CornerPos};
      border-top: ${CornerStyle};
      border-left: ${CornerStyle};
    }

    &:after {
      top: ${CornerPos};
      right: ${CornerPos};
      border-top: ${CornerStyle};
      border-right: ${CornerStyle};
    }

    > section::before {
      bottom: ${CornerPos};
      left: ${CornerPos};
      border-bottom: ${CornerStyle};
      border-left: ${CornerStyle};
    }

    > section::after {
      bottom: ${CornerPos};
      right: ${CornerPos};
      border-bottom: ${CornerStyle};
      border-right: ${CornerStyle};
    }

    > section > section > div {
      border: unset !important;
      box-shadow: unset !important;
      height: 4px !important;
      margin: auto;
      bottom: 0 !important;
      right: 0 !important;
      background: ${MAIN_COLOR};
    }

    video {
      top: 0;
      left: 0;
      bottom: 0 !important;
      right: 0 !important;
      margin: auto;
      width: 92% !important;
      height: 92% !important;
    }
  }

  > div:last-child {
    display: flex;
    margin-bottom: 15px;
    > div:first-child {
      margin-right: 8px;
    }
  }

  @media ${device.tabletL} {
    width: 100%;
    height: 100%;
    position: absolute;
  }
`;

export default QrScanner;
