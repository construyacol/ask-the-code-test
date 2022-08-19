import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import SimpleLoader from "../loaders";
import ItemAccount from "./item_account";
import { AddNewItem } from "../buttons/buttons";
import PropTypes from "prop-types";
import { AccountListContainer } from "./styles";
import withListCreator from "../../withListCreator";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import useNavigationKeyActions from "../../../hooks/useNavigationKeyActions";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import useViewport from "../../../hooks/useWindowSize";
import useAvailableWalletCreator from "hooks/useAvailableWalletCreator";
import { useSelector } from "react-redux";
// import TitleSection from '../../widgets/titleSectionComponent'
// import { AccountListWrapper } from '../layoutStyles'
import { isEmpty } from 'lodash'
import { useActions } from "../../../hooks/useActions";


const IconSwitch = loadable(() => import("../icons/iconSwitch"));
const NewWalletComponent = loadable(() => import("../../forms/widgets/newWallet/init"));














export const useCreateWallet = (props) => {

  const actions = useActions()
  const [isVerified, setIsVerified] = useState(false);
  const [ coinsendaService ] = useCoinsendaServices();

  const createNewWallet = () => {
    if (props.verificationState === "confirmed") {
      return showValidationPrompt();
    }
    if (!isVerified) {
      return callToValidate();
    }
    if(props.isWalletsView){
      return actions.renderModal(NewWalletComponent);
    }
  };

  const showValidationPrompt = () => {
    actions.confirmationModalToggle();
    actions.confirmationModalPayload({
      title: "Estamos trabajando en esto...",
      description:
        "Hemos recibido satisfactoriamente tus datos de verificación, en breve podrás operar en coinsenda.",
      txtPrimary: "Entendido",
      action: false,
      svg: "verified",
    });
  };

  const callToValidate = () => {
    actions.confirmationModalToggle();
    actions.confirmationModalPayload({
      title: "Estamos trabajando en esto...",
      description:
        "Hemos recibido satisfactoriamente tus datos de verificación, en breve podrás operar en coinsenda.",
      txtPrimary: "Entendido",
      action: false,
      svg: "verified",
    });
  };


  useEffect(() => {
    // actions.cleanCurrentSection()
    const verified = coinsendaService.getUserVerificationStatus("level_1");
    setIsVerified(verified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return [ createNewWallet ]
}















function CardView(props) {
    
  const {
    isWalletsView,
    isWithdrawView,
    mainListLoader,
    // actions,
  } = props;

  const items = props.items || [];
  const label = `Obteniendo tus ${isWalletsView ? "Billeteras" : "Cuentas de retiro"}`;
  const [ availableCurrencies ] = useAvailableWalletCreator();
  const { keyActions } = useSelector((state) => state.ui);
  const { isMovilViewport, isLaptopViewport } = useViewport();

  const [ createNewWallet ]  = useCreateWallet({ 
    isWalletsView,
    ...props
  })

  const [setCurrentSelection] = useNavigationKeyActions({
    items,
    loader: mainListLoader,
    uniqueIdForElement: "accountItem",
    default: -1,
  }); 

  const idForClickableElement = useKeyActionAsClick(
    true,
    "main-accounts-add-button",
    97
  );



  const isHugeContainer = items > 10;
  const styleForHugeContainer = {
    // height: 'auto',
  };
  const isWithdrawListStyle = {
    // marginBottom: '40px'
  };

  let mainButtonText = isWithdrawView ? "Crear nueva cuenta de retiro" : "Crear nueva billetera";
  mainButtonText = !isMovilViewport ? `${mainButtonText} ${keyActions ? '[A]' : ''}` : mainButtonText;

  const isBottonAvailable = !isWalletsView ? true : (isWalletsView && availableCurrencies?.length) ? true : false
  // const path = props?.match?.params?.primary_path

  // console.log('||||||||||  isBottonAvailable  ===> ', isBottonAvailable, createNewWallet)

  return (
    <>
      {(items && !isEmpty(items)) ? (
        <AccountListContainer
          style={
            isHugeContainer
              ? { ...styleForHugeContainer, ...isWithdrawListStyle }
              : isWithdrawListStyle
          }
          className={`AccountListContainer ${(items?.length > 3 && isLaptopViewport) ? 'contet-center' : ''}`}
        >
          {items.map((account, id) => {
            if (!account || !account.visible) {
              return null;
            }
            return (
              <ItemAccount
                key={id}
                setCurrentSelection={setCurrentSelection}
                number={id}
                focusedId={`accountItem${id}`}
                account={account}
                account_type={isWalletsView ? "wallets" : "withdraw_accounts"}
                loader={props.loader}
              />
            ); 
          })}
        </AccountListContainer>
      ) 
      : props.loader ? (
        <SimpleLoader color="blue" label={label} />
      ) : (
        isEmpty(items) &&
        !props.loader && (
          <>
            <EmptyStateAccountList
              account_type={isWalletsView ? "wallets" : "withdraw_accounts"}
            />
            {
              isMovilViewport &&
                <AddNewItem
                  id={idForClickableElement}
                  label={mainButtonText}
                  type={`${isBottonAvailable ? "primary" : "disabled"}`}
                  handleClick={isBottonAvailable ? createNewWallet : null}
                />
            }
          </>
        )
      )}
    </>
  );
}

CardView.propTypes = {
  all_pairs: PropTypes.object,
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  current_wallet: PropTypes.object,
  items: PropTypes.array,
  loader: PropTypes.bool,
};

const EmptyStateAccountList = ({ account_type, AuxComponent }) => {
  const { isMovilViewport } = useViewport();
  return (
    <div className="withdraw_accounts_screen">
      <div className="withdraw_accounts_screen_cont">
        <p id="WalletList2" className="fuente">
          {account_type === "withdraw_accounts"
            ? "Aún no tienes cuentas de retiro agregadas, crea multiples cuentas y gestiona retiros en tu moneda local."
            : "Aún no tienes billeteras agregadas, crea y gestiona Billeteras de BTC y COP para que puedas hacer depósitos, intercambios y retiros."}
        </p>
        {
          AuxComponent && <AuxComponent/>
        }
        <IconSwitch size={isMovilViewport ? 220 : 330} icon="newAccount" />
      </div>
    </div>
  );
};

export default withListCreator(CardView);
