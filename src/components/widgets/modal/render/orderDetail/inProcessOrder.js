import { useState, Fragment, useEffect } from "react";
import styled from "styled-components";
import { AiOutlineUpload } from "react-icons/ai";
import { PaymentProof } from "./paymentProof";
import UseTxState from "hooks/useTxState";
import SimpleLoader from "../../../loaders";
import { readFile, img_compressor, includesAnyImageMime } from "../../../../../utils";
import OrderStatus from "./orderStatus";
import DetailGenerator from "./detailGenerator";
import { OnlySkeletonAnimation } from "../../../loaders/skeleton";
import IconSwitch from "../../../icons/iconSwitch";
import { AiOutlineClockCircle } from "react-icons/ai";
import ConfirmationCounter from "./confirmationCounter";
import useViewport from "../../../../../hooks/useWindowSize";
import { useSelector } from "react-redux";
import {
   device, 
   BIOMETRIC_FIAT_LITMIT_AMOUNT 
} from "../../../../../const/const";
import { isEmpty } from 'lodash'
import { 
  IconClose, 
  UploadContainer,
  UploadText,
  UploadMiddle,
  UploadTextMiddle,
  Buttom,
  DropZoneContainer
} from "../../../shared-styles";
import { useFormatCurrency } from "hooks/useFormatCurrency";
import { BottomSection } from './'
import useKeyActionAsClick from "../../../../../hooks/useKeyActionAsClick";
import { CAPACITOR_PLATFORM } from 'const/const'
import { checkCameraPermission } from 'utils'
// import { selectDepositProvsByCurrency } from 'selectors'
import { selectDepositAccountsByNetwork } from 'selectors'
import { PseCTA } from 'components/forms/widgets/fiatDeposit/success'
import moment from "moment";
import { checkIfFiat, parseSymbolCurrency } from 'core/config/currencies';

import "moment/locale/es";
moment.locale("es"); 

const InProcessOrder = ({ onErrorCatch }) => {

  const { currentOrder } = UseTxState();
  const depositProviders = useSelector(({modelData:{ deposit_providers }}) => deposit_providers);
  const depositAccountsByProvType = useSelector((state) => selectDepositAccountsByNetwork(state, currentOrder?.currency));

  const depositProvider = depositProviders[currentOrder?.deposit_provider_id]
  const depositAccount = depositProvider ? depositAccountsByProvType[depositProvider?.provider_type] : {};

  if (!currentOrder || !currentOrder.currency) return onErrorCatch();

  let props = {
    depositAccountsByProvType,
    order:currentOrder,
    depositAccount,
    depositProvider
    // depositProviders,
  }
  console.log('currentOrder', currentOrder)

  return (
    <>
      {depositProviders[currentOrder?.deposit_provider_id]?.currency_type === 'fiat' || (checkIfFiat(currentOrder.currency) && currentOrder?.info?.is_internal) ? (
        <FiatOrder {...props} />
      ) : (
        <CryptoOrder {...props} />
      )}
    </> 
  );
};

export default InProcessOrder;

const CryptoOrder = ({ order, depositProvider, depositAccount }) => {

  const { tx_path } = UseTxState();
  const { isTabletOrMovilViewport } = useViewport();
  let confirmations = Number(order?.confirmations || 0)
  let totalConfirmations = 0
  if(depositAccount) totalConfirmations = Number(depositAccount?.confirmations)

  return (
    <InProcessOrderContainer className="_inProcessOrderContainer">
      <IconClose theme="dark" size={20} />
      <OrderContainer className="_inProcessOrder">
        <TopSection>
          <IconSwitch
            className="TitleIconOrder"
            size={35}
            icon={order.currency || "cop"}
          />
          <TitleContainer>
            <Text className="fuente">{getTitle(tx_path)}</Text>
            <Currency className="fuente">{parseSymbolCurrency(order.currency)}</Currency>
          </TitleContainer>
          <DateIdContainter>
            <Text className="fuente2">#{order.id}</Text>
            <DateText className="fuente2">
              {moment(order.updated_at).format("LL")}
            </DateText>
          </DateIdContainter>
        </TopSection>
 
        {isTabletOrMovilViewport && <OrderStatus order={order} depositProvider={depositProvider} movil />}

        <MiddleSection state={order.state}>
          <DetailGenerator
            order={order}
            title={`${getState(order, tx_path)}`}
            TitleSuffix={() => <GetIcon order={order} />}
          />
        </MiddleSection>
  
        {
          (tx_path === "deposits" && !order?.info?.is_internal) ? (
            <BottomSectionContainer className={`crypto`}>
              <UploadComponent 
                title="TX ID - Confirmaciones" 
                depositAccount={depositAccount}
                order={order}
              />
              <ConfirmationCounter
                confirmations={confirmations}
                total_confirmations={totalConfirmations}
              />
            </BottomSectionContainer>)
          :
            <BottomSection colorState={"var(--paragraph_color)"} currentOrder={order} tx_path={tx_path} />
        }
      </OrderContainer>

      {!isTabletOrMovilViewport && <OrderStatus order={order} depositProvider={depositProvider} />}
    </InProcessOrderContainer>
  );
};

const FiatOrder = (props) => {

  const { order, depositProvider, depositAccount } = props
  
  const [onDrag, setOnDrag] = useState(false);
  const [imgSrc, setImgSrc] = useState(false);
  const { actions, tx_path, coinsendaServices } = UseTxState();
  const { isTabletOrMovilViewport } = useViewport();
  const [ , , toBigNumber ] = useFormatCurrency()
  const { osDevice } = useSelector((state) => state?.ui);

  const dragOver = (event) => {
    event.preventDefault();
    if (!onDrag) {
      setOnDrag(!onDrag);
    }
  };

  const dragLeave = (event) => {
    event.preventDefault();
    if (onDrag) {
      setOnDrag(!onDrag);
    } 
  };

  const goFileLoader = async (e) => {
      setOnDrag(false); 
      let dataBase64
      if (CAPACITOR_PLATFORM !== 'web' && await checkCameraPermission(['camera', 'photos'])) {
        try {
          const { Camera, CameraResultType } = await import("@capacitor/camera");
          const image = await Camera.getPhoto({
            quality: 70,
            resultType: CameraResultType.Base64,
            // source:CameraSource.Camera,
            promptLabelHeader:"Tomar imagen desde...",
            promptLabelPicture:"Cámara",
            promptLabelPhoto:"Galería"
          });
          dataBase64 = `data:image/png;base64, ${image?.base64String}`
        }catch (error) {
          return console.log('getCameraPhoto err => ', error?.message)
          // return goFileLoader(e)
        }  
      }else{
        if (isEmpty(e.target.files)) return; 
        const data = e.target.files[0];
        const file = await img_compressor(data, 0.25);
        dataBase64 = await readFile(file);
        const isAnImage = includesAnyImageMime(dataBase64.split(",")[1])
        if(!isAnImage) return alert('Solo se aceptan imagenes');
      }
      setImgSrc(dataBase64);
      actions.isAppLoading(true);
      const { user } = coinsendaServices.globalState.modelData
      const orderAmount = await toBigNumber(order.amount, order.currency) 
      const limitAmount = await toBigNumber(BIOMETRIC_FIAT_LITMIT_AMOUNT, order.currency)
      if(user.security_center?.transactionSecurity?.biometric?.enabled && orderAmount.isGreaterThanOrEqualTo(limitAmount)){
        const Element = await import("../../../../forms/widgets/biometricKycComponent/init");
        if(!Element) return;
        const BiometricKyc = Element.default
        return actions.renderModal(() => <BiometricKyc orderData={{order, paymentProof:dataBase64}} />);
      }
      sessionStorage.setItem(`depositOrder_${order?.id}`, JSON.stringify({orderId:order.id, paymentProof:dataBase64}));
      await coinsendaServices.confirmDepositOrder(order.id, dataBase64); 
      // let confirmation = await coinsendaServices.confirmDepositOrder(order.id, dataBase64); 
      setTimeout(async() => {
        if(sessionStorage.getItem(`depositOrder_${order?.id}`)){
          sessionStorage.removeItem(`depositOrder_${order?.id}`)
          await coinsendaServices.get_deposits(order?.account_id)
          await coinsendaServices.updateActivityState(order?.account_id, "deposits");
          actions.isAppLoading(false);
        }
      }, 5000)   
  };

  useEffect(() => {
    let thisIsAnOrderInProcess = JSON.parse(sessionStorage.getItem(`depositOrder_${order?.id}`))
      console.log('thisIsAnOrderInProcess', thisIsAnOrderInProcess)
      if(thisIsAnOrderInProcess){
      const { paymentProof } = thisIsAnOrderInProcess
      setImgSrc(paymentProof);
      actions.isAppLoading(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

 
  console.log('||||||||||||||||| order', order)
  // const currencyType = (depositProvider?.currency_type === 'fiat' || (checkIfFiat(order?.currency) && order?.info?.is_internal)) ? 'fiat' : 'crypto'

  return (
    <InProcessOrderContainer>
      <IconClose theme="dark" size={20} />
      <OrderContainer onDragOver={dragOver} className={`${osDevice}`}>
        {onDrag && !imgSrc && order.state === "pending" && (
          <DropZoneComponent
            dragLeave={dragLeave}
            goFileLoader={goFileLoader}
            depositAccount={depositAccount}
            order={order}
          /> 
        )} 
        <TopSection>
          <IconSwitch
            className="TitleIconOrder"
            size={35}
            icon={order.currency || "cop"}
          />
          <TitleContainer>
            <Text className="fuente">{getTitle(tx_path)}</Text>
            <Currency className="fuente">{parseSymbolCurrency(order.currency)}</Currency>
          </TitleContainer>
          <DateIdContainter>
            <Text className="fuente2">#{order.id}</Text>
            <DateText className="fuente2">
              {moment(order.updated_at).format("LL")}
            </DateText>
          </DateIdContainter>
        </TopSection>

        {isTabletOrMovilViewport && <OrderStatus order={order} depositProvider={depositProvider} movil />}

        <MiddleSection state={order.state}>
          <DetailGenerator
            order={order}
            title={`${getState(order, tx_path)}`}
            TitleSuffix={() => <GetIcon order={order} />}
          />
        </MiddleSection>

        {
          (tx_path === "deposits" && !order?.info?.is_internal) ? (
          <BottomSectionContainer>
            <UploadComponent
              imgSrc={imgSrc}
              goFileLoader={goFileLoader}
              setImgSrc={setImgSrc}
              depositAccount={depositAccount}
              order={order}
            />
          </BottomSectionContainer>)
          :  
          <BottomSection colorState={"var(--paragraph_color)"} currentOrder={order} tx_path={tx_path} />
        }

      </OrderContainer>

      {!isTabletOrMovilViewport && <OrderStatus order={order} depositProvider={depositProvider} />}
    </InProcessOrderContainer>
  );
};

const DropZoneComponent = ({ dragLeave, order, goFileLoader, depositAccount }) => {
  return (
    <DropZoneContainer>
      <input
        id="TFileUpload"
        type="file"
        // accept="image/png,image/jpeg"
        onChange={goFileLoader}
        onDragLeave={dragLeave}
        capture="user" 
        accept="image/*"
      />
      <UploadComponent
        unButtom
        title="Suelta aquí el archivo que quieres subir..."
        depositAccount={depositAccount}
        order={order}
      />
    </DropZoneContainer>
  );
};

const UploadComponent = ({ order, unButtom, title, goFileLoader, imgSrc, depositAccount, ...props}) => {
  // const { currentOrder } = UseTxState();
  const idForFileUpload = useKeyActionAsClick(
    true,
    "TFileUpload",
    13,
    true,
    "onkeyup",
    true
  );

  const isPseDeposit = depositAccount?.name === 'pse'
  
  const INPUT_FILE_PROPS = {
    type:"file",
    accept:"image/png,image/jpeg",
    onChange:goFileLoader,
    id:idForFileUpload
  }

  const INPUT_BUTTON_PROPS = {
    type:"button",
    onClick:goFileLoader
  }

  const inputProps = CAPACITOR_PLATFORM !== 'web' ? INPUT_BUTTON_PROPS : INPUT_FILE_PROPS

  return ( 
    <UploadContainer
      className={`${imgSrc || order.state === "confirmed" ? "loaded" : "unload"}`}
    >
      {
        !imgSrc && order.state !== "confirmed" ? (
        <Fragment>
          <AiOutlineUpload size={45} color="var(--paragraph_color)" />
          <UploadText className="fuente">
            {title || "Arrastra el comprobante que quieres subir"}
          </UploadText>
          {!unButtom && (
            <Fragment>
              <UploadMiddle>
                <UploadTextMiddle className="fuente">
                  o selecciona un archivo
                </UploadTextMiddle>
                <hr />
              </UploadMiddle>

              <Buttom>
                <input
                  {...inputProps}
                />
                <Text style={{ color: "white" }} className="fuente">
                  Subir comprobante
                </Text>
              </Buttom>
            </Fragment>
          )}
        </Fragment>
      ) : (
        <Fragment>
          <UploadMiddle className="titleSection payment fuente">
            <UploadTextMiddle className="titleSection">
               {title ? title : isPseDeposit ? 'Depósito realizado por PSE' :'Comprobante de pago'}
            </UploadTextMiddle>
            <hr />
          </UploadMiddle>
          {
            isPseDeposit ?
            <PseCTA 
              depositAccount={{provider_type:"pse"}}
              depositOrder={order}
            >
              <PaymentProof/>
            </PseCTA>
            :
            <PaymentProof payload={imgSrc} />
          }
        </Fragment>
      )}
    </UploadContainer>
  );
};

const getTitle = (tx_path) => {
  return tx_path === "deposits" ? "Depósito" : "Envío";
};

const GetIcon = ({ order }) => {
  const coloIcon = order.state === "pending" ? "#ff8660" : "#1cb179";
  const RenderIcon =
    order.state === "pending"
      ? AiOutlineClockCircle
      : order.state === "confirmed" &&
        (() => <SimpleLoader loader={2} color={coloIcon} justify="center" />);

  return (
    <IconContainer>
      <RenderIcon size={25} color={coloIcon} />
    </IconContainer>
  );
};

const getState = ({ state, currency }, txType) => {
  const currencyType = checkIfFiat(currency) ? 'fiat' : 'crypto'
  switch (currencyType) {
    case "fiat":
      return state === "pending"
        ? "Pendiente"
        : state === "confirmed" && checkIfFiat(currency) && txType === 'deposits'
        ? "Estamos comprobando tu depósito"
        : state === "confirmed" && checkIfFiat(currency) && txType === 'withdraws'
        ? "Estamos procesando tu Envío"
        : "En proceso de aceptación...";
    case "crypto":
      return state === "pending" ? "Pendiente" : "Confirmando en blockchain...";
    default:
  }
};

const IconContainer = styled.div`
  position: relative;
  width: 25px;
  height: 25px;
  display: grid;
`;



// const ImgContainer = styled.div`
//   width: 80px;
//   height: 55px;
//   position: relative;
//   border: 3px solid #0198ff;
//   border-radius: 4px;
//   background: white;
//   display: grid;
//   align-items: center;
//   &.loader::after {
//     content: "";
//     width: 100%;
//     position: absolute;
//     height: 100%;
//     background: rgba(255, 255, 255, 0.8);
//   }
//   .lds-roller {
//     z-index: 2;
//   }
// `;

// const Img = styled.img`
//   width: 80px;
//   height: 55px;
//   border-radius: 3px;
// `;

// const ProgressBar = styled.span`
//   height: 4px;
//   width: 100%;
//   background: #c5c5c5;
//   transition: 0.3s;
//   position: relative;
//   ::after {
//     content: "";
//     width: ${(props) => props.progresed};
//     background: #0198ff;
//     height: 100%;
//     position: absolute;
//     transition: 3s;
//     left: 0;
//     top: 0;
//   }
// `;

export const Text = styled.p`
  margin: 0;
`;

// const PaymentTitle = styled(Text)`
//   text-align: center;
//   font-size: 14px;
//   color: gray;
// `;

// const PaymentProofDetail = styled.div`
//   width: 100%;
//   display: grid;
//   grid-template-rows: auto auto auto;
//   row-gap: 10px;
//   justify-items: center;
//   align-items: center;
//   padding-top: 40px;
// `;


export const Section = styled.div``;

const BottomSectionContainer = styled(Section)`
  height: auto;
  display: grid;
  justify-items: center;
  align-items: center;

  &.crypto {
    position: relative;
  }
`;

const DateIdContainter = styled.div`
  display: flex;
  grid-area: dateIdContainter;
  ${Text} {
    font-size: 12px;
    color: var(--paragraph_color);
  }
`;

const DateText = styled(Text)`
  margin-left: 9px !important;
  padding-left: 7px;
  border-left: 1px solid gray;
`;

const TitleContainer = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
  grid-area: titleContainer;
  ${Text} {
    font-size: 20px;
  }
`;

const Currency = styled(Text)`
  margin-left: 7px !important;
  text-transform: uppercase;
`;

// const Icon = styled.span`
//   width: 35px;
//   height: 35px;
//   border-radius: 50%;
//   background: #c3c3c3;
//   grid-area: icon;
//   ${"" /* box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.1); */}
// `;

const MiddleSection = styled(Section)`
  background: white;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  ::after {
    content: "";
    position: absolute;
    height: 7px;
    background: ${(props) =>
      props.state === "pending" ? "#ff8660" : "#1cb179"};
    top: 0;
    width: 100%;
    ${(props) => props.state === "confirmed" && OnlySkeletonAnimation}
  }
  .withTitle {
    padding-top: 55px !important;
  }
`;

const TopSection = styled(Section)`
  display: grid;
  align-items: center;
  grid-template-rows: auto auto;
  column-gap: 12px;
  row-gap: 5px;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "icon titleContainer"
    "icon dateIdContainter";
  span {
    margin-right: 15px;
  }

  .TitleIconOrder {
    grid-area: icon;
  }
`;

// const Container = styled.section`
//   width: 100vw;
//   height: 100vh;
//   background: #000000ba;
//   display: grid;
//   align-items: center;
//   justify-items: center;
// `;

const OrderContainer = styled.div`
  background: #eeeeee;
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap: 30px;
  position: relative;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;

  @media (max-width: 768px) {
          padding-bottom: 50px !important; 
        &.ioSystem{
          padding-bottom: 100px !important; 
        }
    }

  @media ${device.tablet} {
    grid-template-rows: auto auto 1fr auto;
  }

  
`;

const InProcessOrderContainer = styled.section`
  #TFileUpload {
    position: absolute;
    z-index: 4;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  p {
    margin: 0;
  }

  ${OrderContainer} {
    padding: 30px 40px;
  }

  position: relative;
  width: 1000px;
  height: auto;
  min-height: 750px;
  background: white;
  display: grid;
  border-radius: 6px;
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.1);
  grid-template-columns: 1fr 400px;

  @media ${device.laptop} {
    width: 100%;
    max-width:1000px;
  }

  @media ${device.tabletL} {
    grid-template-columns: 1fr;
    position: absolute;
    top: 10px;
  }

  @media ${device.tablet} {
    ${OrderContainer} {
      padding: 30px 15px;
    }
  }
`;
