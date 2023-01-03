import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
// import { OperationForm } from "./withdrawCripto";
import { OperationForm } from '../styles'
import QRCode from "qrcode";
// import { SentryCaptureException } from "../../../utils";
import IconSwitch from "../../widgets/icons/iconSwitch";
import CopyContainer from "../../widgets/copy/copyContainer";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import ControlButton from "../../widgets/buttons/controlButton";
import { skeleton } from "../../widgets/loaders/skeleton";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import { useWalletInfo } from "../../../hooks/useWalletInfo";
// import DepositWithdrawFiatSkeleton from './skeleton/depositWithdrawFiatSkeleton'
// import { StageSkeleton } from 'components/forms/widgets/stageManager'
import { SelectListSkeleton } from 'components/forms/widgets/selectListComponent'
// import { AddressContainer, Address } from 'components/widgets/modal/render/addressBook/itemList'
import useTruncatedAddress from 'hooks/useTruncatedAddress'
import useViewport from 'hooks/useViewport'
import { SupportDepositChains } from 'components/widgets/supportChain'
import { isEmpty } from 'lodash'

 
const CriptoSupervisor = (props) => {

  const [ , { current_wallet, modelData: { deposit_providers } } ] = useCoinsendaServices();

  return (
    <>
      {!deposit_providers || Object.keys(deposit_providers).length === 0 ? (
        <SkeletonDepositView/>
      ) : current_wallet.dep_prov.length < 1 ? (
        <AddDepositProviderCripto />
      ) : (
        <CriptoView/>
      )}
    </>
  );
};

const ContAddress = styled.section`
  display: grid;
  justify-items: center;
  grid-template-rows: 30px 50px 1fr 40px 40px;
  align-items: center;
  width: 100%;
  height: 100%;
  row-gap: 15px;

  .address{
    display: flex;
    column-gap:7px;
  }

  strong{
    text-transform: uppercase;
  }

  p{
    margin: 0 !important;
    color: var(--paragraph_color); 
  }

  .soloAd,
  .soloAd2 {
    max-width: 700px;
    width: 100%;
    text-align: left;
    font-size: 14px;
    line-height: 20px;
  }
  .soloAd{
    color:--var(paragraph_color);
    span{
      text-transform: capitalize;
    }
  }
  .soloAd2 {
    font-size: 16px !important;
    text-align: left;
  }
  .qrContainer {
    height: 180px;
    width: 180px;
    position: relative;
  }

`

export const SkeletonDepositView = () => {

  const { currentWallet } = useWalletInfo();

  return (
    <>
      {
        currentWallet.currency_type === 'crypto' ?
          <DepositForm className="skeleton">
            <ContAddress className="contAddress">
              <p id="soloAd2" className="fuente title soloAd2"></p>
              <p className="fuente soloAd"></p>
              <div className="qrContainer">{/* <QrProtector visible/> */}</div>
              <p className="fuente title dirDep"></p>
              <p className="verifyAddress"></p>
            </ContAddress>
          </DepositForm>
          :
          <SelectListSkeleton/>
      }
    </> 
  );
};

const AddDepositProviderCripto = () => {
  const [
    coinsendaServices,
    {
      current_wallet,
      isLoading: { loader },
    },
    { isAppLoading },
    dispatch,
  ] = useCoinsendaServices();
  const idForMainButton = useKeyActionAsClick(
    true,
    "main-button-deposit",
    13,
    true
  );

  const movil_viewport = window.innerWidth < 768;

  const atributos = {
    icon: "deposit_crypto",
    size: movil_viewport ? 80 : 100,
    color: "var(--paragraph_color)",
  };

  const createDepositProvider = async (e) => {
    e.preventDefault();
    dispatch(isAppLoading(true));
    await coinsendaServices.createAndInsertDepositProvider(current_wallet);
    dispatch(isAppLoading(false));
  };

  return (
    <DepositForm className="DepositView">
      <div className="contIcontSwitch">
        <IconSwitch {...atributos} />
      </div>

      <p className="fuente">
        Esta Billetera aún no tiene dirección de depósito, creala ahora e inicia
        operaciones con esta cuenta.
      </p>

      <div className="contButtons deposit">
        <ControlButton
          id={idForMainButton}
          handleAction={createDepositProvider}
          loader={loader}
          formValidate
          label="Crear dirección de depósito"
        />
      </div>
    </DepositForm>
  );
};

// let INTERVAL;

const CriptoView = () => {
  const [
    coinsendaServices,
    {
      current_wallet,
      // modelData: { deposit_providers },
      ui:{ osDevice } 
    },
  ] = useCoinsendaServices();
  const { isMobile } = useViewport()
  const [qrState, setQrState] = useState(true);
  const [qrError, setQrError] = useState();
  const [address, setAddress] = useState();
  const [ depositProviders, setProvider ] = useState({ current:{}, providers:{} })

  // const { subscribeToNewDeposits } = useSubscribeDepositHook()
 
  useEffect(() => {
    if (!isEmpty(depositProviders.current)) {
      (async () => {
        setQrState(true)
        setAddress('')
        const provider = depositProviders.current;
        const {
          account: {
            account_id: { account_id },
          }
        } = provider;
        const validateAddress = await coinsendaServices.validateAddress(account_id);
        if (!validateAddress) {
          const errorMsg = `Dirección invalida`;
          setQrError(true);
          return console.log(errorMsg);
        }
        setQrState(await QRCode.toDataURL(account_id)); //WALLET ADDRESS
        setAddress(account_id);
      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositProviders.current]);
  
  const truncatedAddres = useTruncatedAddress(address || '')
  const addressValue = isMobile ? truncatedAddres : address

  return ( 
    <>
    <SupportDepositChains callback={setProvider}/>
    <DepositForm>
      {
        current_wallet.currency.includes("eth") &&
          <EtherDisclaimer className="fuente">
            No enviar con menos de 70 mil gas
          </EtherDisclaimer>
      }
      <ContAddress className={`contAddress ${osDevice}`}>
        <p id="soloAd2" className="fuente title soloAd2">
          Importante:
        </p>
        <p className="fuente soloAd">
          Envía solo <strong className="fuente2">{current_wallet.currency} {current_wallet.currency === 'usdt' && "(ERC-20)"}</strong>  a esta Billetera. El
          envío de cualquier otra Criptomoneda a esta dirección puede resultar en la
          pérdida de tu depósito.{" "}
        </p>

        <div className="qrContainer">
          <QrProtector visible={qrState} invalid={qrError} />
          {typeof qrState === "string" && (
            <img id="qrDesposit" className="itemFuera" src={qrState} alt="" />
          )}
        </div>
        <p className="fuente title dirDep">Dirección de depósito:</p>

        <div className="fuente address">
        <p className="fuente2">
          {
            qrError
              ? "Dirección invalida, contacta con soporte"
              : qrState === true
              ? "XXXXXX- Verificando dirección -XXXXXX"
              : addressValue
          }
        </p>
          <CopyContainer
              valueToCopy={address}
              onlyIcon={true}
              color="black"
            />

          {/* <AddressContainer
            data-final-address={address.match(/..........$/g).toString()}
          > 
            <Address className="fuente2 withdrawAddress">
            
            </Address>
          </AddressContainer> */}
        </div>

      </ContAddress>
    </DepositForm>
    </>
  );
};

const QrProtector = ({ visible, invalid }) => (
  <QrProtectorCont
    className={`qrProtector ${visible === true ? "active" : ""} ${
      invalid ? "error" : ""
    }`}
  >
    <IconSwitch icon="qr" size={35} color="black" />
  </QrProtectorCont>
);



const EtherDisclaimer = styled.div`
  right: 0px;
  top: 0px;
  padding: 5px 10px;
  background: #ebebeb;
  border-radius: 4px;
  font-size: 13px;
  color: var(--paragraph_color);
  position:absolute;
`


const qrScan = keyframes`
    0% {
      transform: translateY(90px);
    }
    50% {
      transform: translateY(-90px);
    }
    100% {
      transform: translateY(90px);
    }
`;

const qrScanOpacity = keyframes`
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
`;



const QrProtectorCont = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    overflow: hidden;
    opacity: 0;
    display: grid;
    align-items: center;
    justify-items: center;
    transition: 0.3s;
    &.active{
      opacity: 0.99;
    }
    &::after {
    content: "";
    width: 100%;
    height: 5px;
    background: #37ed7d;
    position: absolute;
    transition: 0.3s;
    animation-name: ${qrScan}, ${qrScanOpacity};
    animation-duration: 1.3s, 0.6s;
    animation-iteration-count: infinite;
  }
  &.error::after {
    background: red;
    animation-duration: 0.3s, 0.1s;
  }
`

export const DepositForm = styled(OperationForm)`
  background: transparent;
  &.DepositView{
    grid-template-rows: 50% 25% 1fr;
    grid-template-columns: 1fr !important;
    p {
      text-align: center;
      margin: 0 !important;
      max-width: 400px;
      justify-self: center;
      color: var(--paragraph_color); 
    }
    .contIcontSwitch {
      display: grid;
      align-items: center;
      justify-items: center;
    }
    .contButtons {
      align-self: center;
      justify-items: center;
      display:grid;
    }   
    &.skeleton{
      justify-items:center;
    }
  }

  .qrContainer {
    transform: scale(0.9);
  }

  .ioSystem{
    padding-bottom: 150px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: calc(100% - 40px);
    padding: 20px 0;
    background: transparent;

    .WithdrawView, .SwapView, .DepositView, #swapForm{
      background-color: transparent;
    }

    .qrContainer {
      transform: scale(0.8);
    }
  }
  &.skeleton .soloAd2,
  &.skeleton .soloAd,
  &.skeleton .dirDep,
  &.skeleton .verifyAddress {
    background: var(--skeleton_color);
    width: 100%;
    border-radius: 3px;
    height: 15px;
    align-self: center;
    left: 15px;
  }

  &.skeleton .soloAd2 {
    max-width: 150px;
    justify-self: flex-start;
  }

  &.skeleton .soloAd {
    max-width: 400px;
    justify-self: flex-start;
  }

  &.skeleton .dirDep {
    max-width: 250px;
  }

  &.skeleton .verifyAddress {
    max-width: 350px;
  }

  &.skeleton .qrContainer {
    background: var(--skeleton_color);
    border-radius: 6px;
  }

  &.skeleton p span{
    background: #bfbfbf;
    color: #bfbfbf;
    line-height: 1.6em;
  }

  &.skeleton .skeletonDepositIcon{
    width: 90px;
    height: 100px;
    border-radius: 6px;
    background: #bfbfbf;
  }

  &.skeleton {
    animation-name: ${skeleton};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    opacity: 0.5;
  }
`;

export default CriptoSupervisor;
