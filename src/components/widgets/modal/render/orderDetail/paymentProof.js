import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CropImg from "../../../cropimg";
import UseTxState from "../../../../hooks/useTxState";
import QRCode from "qrcode";
import SimpleLoader from "../../../loaders";
import { MdContentCopy } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { copy } from "../../../../../utils";
import useToastMessage from "../../../../../hooks/useToastMessage";
import Zoom from "react-medium-image-zoom";
import { BLOCKCHAIN_EXPLORER_URL } from '../../../../../const/const'
import "react-medium-image-zoom/dist/styles.css";

const PaymentProofComponent = ({ imgSrc, setImgSrc, order_id }) => {
  const [activeSection, setActiveSection] = useState(true);
  const { coinsendaServices, actions } = UseTxState();
  const [toastMessage] = useToastMessage();

  const subirImg = async ({ base64 }) => {
    setImgSrc(base64);
    setActiveSection(null);
    actions.isAppLoading(true);
    let confirmation = await coinsendaServices.confirmDepositOrder(
      order_id,
      base64
    );
    if (!confirmation) {
      actions.isAppLoading(false);
      toastMessage("El deposito No se ha confirmado", "error");
      setImgSrc(null);
    }
  };

  const cancelarSubidaImg = () => {
    setActiveSection(null);
    setImgSrc(null);
  };

  useEffect(() => {
    let element = document.getElementById("close-button-with-OtherModalLayout");
    if (activeSection) {
      if (element) {
        element.scrollTo(0, 0);
        element.classList.add("inactive");
      }
    }
    return () => {
      if (element) {
        element.classList.remove("inactive");
      }
    };
  }, [activeSection]);

  return (
    <OverflowContainer>
      <Container className={`${activeSection ? "activated" : ""}`}>
        <CropImg
          imageSrc={imgSrc}
          subirImg={subirImg}
          cancelarSubidaImg={cancelarSubidaImg}
        />
      </Container>
    </OverflowContainer>
  );
};

// const CropEdit = styled.div`
//   width: 100%;
//   height: 50px;
//   background: #f5f5f5;
//   border-radius: 4px;
//   box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.1);
// `;

// const ImgContainer = styled.div`
//   width: 100%;
//   max-width: 550px;
//   background: rgba(255, 255, 255, 0.4);
//   border-radius: 6px;
// `;

const OverflowContainer = styled.section`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  display: grid;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 100vh;
  }
`;

const Container = styled.div`
  padding: 50px;
  background: #232c35;
  transition: 0.3s;
  transform: translateX(100%);
  display: grid;
  grid-template-rows: 1fr;
  row-gap: 20px;
  justify-items: center;

  .App {
    height: 100% !important;
    width: 100%;
  }

  .ImgCropcontrols {
    background: transparent !important;
  }

  &.activated {
    animation-name: activated;
    animation-duration: 0.8s;
    animation-fill-mode: forwards;
  }

  @keyframes activated {
    0% {
      transform: translateX(100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0%);
    }
  }
`;
 
export default PaymentProofComponent;

export const PaymentProof = ({ payload }) => {
  // console.log('PaymentProof', payload)
  const {
    // primary_path,
    coinsendaServices,
    actions,
    // currencies,
    currentOrder,
    loader,
    tx_path,
  } = UseTxState();
  const [imgProof, setImgProof] = useState(payload);
  const [txId, setTxId] = useState();
  const [urlExplorer, setUrlExplorer] = useState();
  let orderDate = new Date(currentOrder?.created_at)
  let showFromDate = new Date('2022-03-12T00:00:00')
  let showPaymentProof = currentOrder.currency_type === "crypto" || (orderDate > showFromDate && currentOrder.currency_type === "fiat")


  const getPaymentProof = async (currentOrder) => {
    // alert('getpayment')
    if (currentOrder.paymentProof) {
      // alert('tiene pp')
      const { proof_of_payment } = currentOrder.paymentProof;
      // console.log(`${BLOCKCHAIN_EXPLORER_URL[currentOrder.currency.currency]}tx/${proof_of_payment.proof}`)
      setImgProof(
        currentOrder.currency_type === "fiat"
          ? `data:image/png;base64, ${proof_of_payment.raw}`
          : await QRCode.toDataURL(`${BLOCKCHAIN_EXPLORER_URL[currentOrder.currency.currency]}${proof_of_payment.proof}`)
      );
      if (currentOrder.currency_type === "crypto") {
        setTxId(proof_of_payment.proof);
        setUrlExplorer(`${BLOCKCHAIN_EXPLORER_URL[currentOrder.currency.currency]}${proof_of_payment.proof}`);
      }
    } else if (currentOrder.proof) {
      setImgProof(await QRCode.toDataURL(`${BLOCKCHAIN_EXPLORER_URL[currentOrder.currency.currency]}${currentOrder.proof}`));
      setTxId(currentOrder.proof);
      setUrlExplorer(`${BLOCKCHAIN_EXPLORER_URL[currentOrder.currency.currency]}${currentOrder.proof}`);
    }
  };

  useEffect(() => {
    if (
      !currentOrder.paymentProof &&
      currentOrder.state !== "pending" &&
      tx_path === "deposits"
    ) {
      const getData = async () => {
        const PP = showPaymentProof && await coinsendaServices.getDepositById(currentOrder.id);
        if (!PP) {
          return;
        }
        // const { proof_of_payment } = PP.paymentProof;
        let updateOrder = {
          [PP.id]: { ...PP },
        };
        actions.update_item_state(updateOrder, "deposits");
        getPaymentProof(PP);
      };
      getData();
    } else {
      getPaymentProof(currentOrder);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imgProof !== payload) {
      setImgProof(payload);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  const openBlockchain = () => {
    window.open(urlExplorer, "_blank");
  };
 
  return (
    <>
      <PaymentProofContainer
        className={`paymentProofCont ${currentOrder.currency_type} ${currentOrder.state}`}
      > 
        {
          !showPaymentProof && <p className="orderLimitDate" >No disponible</p>
        }

        {
          (showPaymentProof && (!imgProof || loader)) && (
          <LoaderContainer>
            <SimpleLoader loader={2} justify="center" color="#206f65" />
          </LoaderContainer>
        )}
        
        {(showPaymentProof && imgProof) && (
          <ProofContainer>
            <Zoom>
              <img src={imgProof} width="100%" height="90px" alt="" />
            </Zoom>
            {currentOrder.currency_type === "crypto" && (
              <HoverProof>
                <IconContainer
                  className="tooltip"
                  data-copy={txId}
                  onClick={copy}
                >
                  <MdContentCopy size={16} />
                  <span className="tooltiptext fuente">Copiar</span>
                </IconContainer>

                <IconContainer className="tooltip" onClick={openBlockchain}>
                  <BsUpload size={20} />
                  <span className="tooltiptext fuente">Ver en Blockchain</span>
                </IconContainer>
              </HoverProof>
            )}
          </ProofContainer>
        )}
      </PaymentProofContainer>

      {/* {imgProof && (
      <FiatPaymentProofZoom state={currentOrder.state}>
        <ProofCont>
          <img src={imgProof} width="100%" alt="" />
        </ProofCont>
      </FiatPaymentProofZoom>
    )} */}
    </>
  );
};

// const ProofCont = styled.div`
//   width: 90%;
//   height: 90%;
//   justify-self: center;
//   align-self: center;
//   display: grid;
//   align-items: center;
//   overflow: hidden;
//   img {
//     border-radius: 4px;
//   }
// `;

const FiatPaymentProofZoom = styled.div`
  position: absolute;
  width: calc(100% - 20px);
  height: ${(props) =>
    props.state === "confirmed" ? "calc(100% - 230px)" : "calc(100% - 170px)"};
  background: #eeeeee;
  top: 10px;
  justify-self: center;
  border-radius: 3px;
  display: none;
`;

const PaymentProofContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  align-self: center;
  display: grid;
  align-items: center;
  justify-items: center;
  max-height: 100px;
  max-width: 110px;
  position: relative;
  justify-self: start;

  .orderLimitDate{
    color:white;
    text-align:center;
  }

  img {
    border-radius: 3px;
    max-width: 100px;
    min-width: 90%;
  }
  &.accepted,
  &.confirmed {
    background: #206f65;
    padding: 0 5px;
  }
  &.rejected,
  &.canceled {
    background: gray;
    opacity: 0.5;
  }

  &.fiat.accepted:hover
    ~ ${FiatPaymentProofZoom},
    &.fiat.confirmed:hover
    ~ ${FiatPaymentProofZoom} {
    display: grid;
  }

  &.fiat {
    cursor: pointer;
  }
`;

const LoaderContainer = styled.div`
  width: 90%;
  height: 90%;
  background: white;
  opacity: 0.6;
  border-radius: 3px;
  display: grid;
  align-items: center;
  justify-items: center;
  position: absolute;
  justify-self: center;
  align-self: center;
  z-index: 1;
`;



const HoverProof = styled.div`
  position: absolute;
  height: 100%;
  width: calc(100% - 20px);
  top: 0;
  transition: 0.15s !important;
  align-items: baseline;
  display: grid;
  padding: 0 10px;
  justify-items: center;
  grid-template-columns: repeat(2, 1fr);
  transform: translateX(100%);
`;

const ProofContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  align-items: center;
  justify-items: center;

  :hover ${HoverProof} {
    opacity: 1;
  }
  button {
    cursor: pointer;
  }
`;

const IconContainer = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 3px;
  border: 1px solid gray;
  display: grid !important;
  align-items: center;
  justify-items: center;
  position: relative;
  align-self: flex-start;

  ::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .tooltiptext {
    padding-left: 4px !important;
    padding-right: 4px !important;
    width: auto !important;
    min-width: 60px !important;
  }

  i,
  svg {
    color: gray;
  }

  :hover {
    i,
    svg {
      color: #0c96fa;
    }
  }
`;
