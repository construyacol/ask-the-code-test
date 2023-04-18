import { useEffect, useState } from "react";
import loadable from "@loadable/component";
import QRCode from "qrcode";
import CopyContainer from "../../../widgets/copy/copyContainer";
import useTruncatedAddress from 'hooks/useTruncatedAddress'
import useViewport from 'hooks/useViewport'
import { isEmpty } from 'lodash'
import { copy } from "utils";
import { getExportByName } from 'utils'
import { replaceTo, REPLACE_TO_CURRENCY_CONFIG } from 'core/config/currencies';
import {
    ContAddress,
    IconProviderTypeCont,
    EtherDisclaimer,
    QrProtectorCont,
    DepositForm
} from './styles'
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { QR_CONFIG } from 'const/qr'
import { useWalletInfo } from 'hooks/useWalletInfo'


const IconSwitch = loadable(() => import("components/widgets/icons/iconSwitch"));
const SelectDepositNetwork = loadable(() => import("components/wallets/views/selectNetwork").then(getExportByName("SelectDepositNetwork")), {fallback:<div></div>});
const AvailableDepositNetwork = loadable(() => import("components/widgets/supportChain").then(getExportByName("AvailableDepositNetwork")), {fallback:<div></div>});


const CriptoView = (props) => {

  const { currentWallet } = useWalletInfo();

    const [
      coinsendaServices,
      {
        modelData: { user },
        ui:{ osDevice } 
      },
    ] = useCoinsendaServices();
    const { isMobile } = useViewport()
    const [qrState, setQrState] = useState(true);
    const [qrError, setQrError] = useState();
    const [address, setAddress] = useState();
    const [ depositProviders, setProvider ] = useState({ current:{}, providers:{} })
  
    // const { subscribeToNewDeposits } = useSubscribeDepositHook()

    const setAddresValue = async(value) => {
        setQrState(await QRCode.toDataURL(value, QR_CONFIG)); 
        setAddress(value);
    }
   
    useEffect(() => {
      if (!isEmpty(depositProviders.current)) {
        (async () => {
            setQrState(true)
            setAddress('')
            setQrError(false);
            const provider = depositProviders.current;
            if(provider?.provider_type === 'internal_network') return setAddresValue(user?.email)
            if(!provider?.account?.account_id)return
            const {
                account: {
                account_id: { account_id },
                }
            } = provider;

            
            // if(typeof qrState === "string")return;
            const validateAddress = await coinsendaServices.validateAddress(account_id);
            if (!validateAddress) {
                const errorMsg = `Dirección invalida`;
                setQrError(true);
                return console.log(errorMsg);
            }
            setAddresValue(account_id)
        })()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositProviders?.current?.id]);
    
    const truncatedAddres = useTruncatedAddress(address || '')
    const addressValue = isMobile ? truncatedAddres : address
  
    if(isEmpty(depositProviders.current)){
      return<SelectDepositNetwork uiName={`Selecciona la red por la que deseas depositar ${currentWallet?.currency?.toUpperCase()}`} callback={setProvider}/>
    }
   
    return (  
      <> 
      {props?.children}
      { 
         !isEmpty(depositProviders.current) ?
            <AvailableDepositNetwork currentNetwork={depositProviders.current} callback={setProvider}/>
         :
            <div></div>
      }
      <DepositForm className="depositForm">
            { 
              currentWallet.currency.includes("eth") &&
                <EtherDisclaimer className="fuente">
                No enviar con menos de 70 mil gas
                </EtherDisclaimer>
            }
        <ContAddress className={`contAddress ${osDevice}`}>

          <DisclaimerMessage
            current_wallet={currentWallet}
            depositProviders={depositProviders}
          />

          <div className="qrContainer">
            <QrProtector visible={qrState} invalid={qrError} />
            <IconProviderTypeCont>
              <IconSwitch 
                icon={depositProviders?.current?.icon || depositProviders?.current?.provider_type} 
                size={22}
                color="var(--primary)"
            />
            </IconProviderTypeCont>
            {typeof qrState === "string" && (
              <img id="qrDesposit" className="itemFuera" src={qrState} alt="" />
            )}
          </div>
          
          <div className="div_deposit--address">
            <p className="fuente dirDep">Dirección de depósito:</p>
            <div className="fuente address">
              <p className="fuente2" onClick={copy} data-copy={address} style={{cursor:"pointer"}}>
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
            </div> 
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
    <IconSwitch icon="qr" size={30} color="black" />
    </QrProtectorCont>
);



const DefaultDisclaimer = ({ current_wallet, currencyName, user_friendly, depositProviders }) => (
   <p className="fuente soloAd">
      Envía solo <strong className={`fuente2 protocol ${current_wallet.currency}`}> {currencyName} {`( ${user_friendly?.token_protocol || user_friendly?.network} )`}</strong> de la red <strong className="uppercase fuente2">{depositProviders?.current?.provider_type}</strong> a esta dirección.  
      Cualquier otra criptomoneda o envío desde otra red podría resultar en la pérdida de tu depósito.{" "}
   </p>
)

const InternalDisclaimer = ({ current_wallet, currencyName }) => (
   <p className="fuente soloAd">
      Recibe <strong className={`fuente2 protocol ${current_wallet.currency}`}>{currencyName}</strong> de forma instantánea y gratuita por la <strong className={`fuente2 protocol ${current_wallet.currency}`}>red de Coinsenda</strong> utilizando tu correo electrónico como dirección de depósito.
   </p>
)

const DISCLAIMER_COMPONENTS = {
   internal_network:InternalDisclaimer,
   default:DefaultDisclaimer
}

const DisclaimerMessage = (props) => {
   const { current_wallet, depositProviders } = props
   const user_friendly = depositProviders?.current?.user_friendly
   const currencyName = REPLACE_TO_CURRENCY_CONFIG[current_wallet?.currency] ? replaceTo(current_wallet?.currency, REPLACE_TO_CURRENCY_CONFIG[current_wallet?.currency]) : current_wallet?.currency
   const RenderDisclaimer = DISCLAIMER_COMPONENTS[depositProviders?.current?.provider_type] || DISCLAIMER_COMPONENTS?.default
   return<RenderDisclaimer user_friendly={user_friendly} currencyName={currencyName} {...props} />
}


  export default CriptoView