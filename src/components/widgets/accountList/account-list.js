import React, { useState, useEffect } from "react";
import SimpleLoader from "../loaders";
import ItemAccount from "./item_account";
import { AddNewItem } from "../buttons/buttons";
import IconSwitch from "../icons/iconSwitch";
import PropTypes from "prop-types";
import { AccountListContainer } from "./styles";
import withListCreator from "../../withListCreator";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";

import "../../wallets/views/wallet_views.css";
import useNavigationKeyActions from "../../../hooks/useNavigationKeyActions";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";

function AccountList(props) {
  const {
    isWalletsView,
    isWithdrawView,
    actions,
    history,
    mainListLoader,
  } = props;
  const items = props.items || [];
  const label = `Obteniendo tus ${
    isWalletsView ? "Billeteras" : "Cuentas de retiro"
  }`;
  const [coinsendaService] = useCoinsendaServices();
  const [isVerified, setIsVerified] = useState(false);
  const [setCurrentSelection] = useNavigationKeyActions({
    items,
    loader: mainListLoader,
    uniqueIdForElement: "accountItem",
    default: -1,
  });
  const isDesktop = window.innerWidth > 900;
  // 97 keyCode for A
  const idForClickableElement = useKeyActionAsClick(
    true,
    "main-accounts-add-button",
    97
  );

  useEffect(() => {
    // actions.cleanCurrentSection()
    const verified = coinsendaService.getUserVerificationStatus("level_1");
    setIsVerified(verified);
  }, []);

  const createNewWallet = () => {
    if (props.verificationState === "confirmed") {
      return showValidationPrompt();
    }

    if (!isVerified) {
      return callToValidate();
    }
    actions.toggleModal();
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

  const goToVerification = async () => {
    const verificationState = props.verificationState;

    if (verificationState === "confirmed" || verificationState === "pending") {
      await actions.ToStep("globalStep", 2);
    }

    if (verificationState === "rejected") {
      await actions.ToStep("globalStep", 0);
    }

    await history.push(`/security`);
    setTimeout(() => {
      actions.toggleModal();
    }, 0);
  };

  const callToValidate = () => {
    const message = isWalletsView
      ? "billeteras crypto/fiat."
      : "cuentas de retiro fiat.";

    actions.confirmationModalToggle();
    actions.confirmationModalPayload({
      title: "Aún no estas listo para esto...",
      description: `Debes completar el nivel de verificación avanzada para poder agregar ${message}`,
      txtPrimary: "Verificarme",
      txtSecondary: "Cancelar",
      payload: "account_id",
      action: goToVerification,
      svg: "verified",
    });
  };
  const isHugeContainer = items > 10;
  const styleForHugeContainer = {
    // height: 'auto',
  };
  const isWithdrawListStyle = {
    // marginBottom: '40px'
  };

  let mainButtonText = isWithdrawView
    ? "Añadir nueva cuenta de retiro"
    : "Añadir nueva billetera";
  mainButtonText = isDesktop ? `${mainButtonText} [A]` : mainButtonText;

  return (
    <>
      {items && items.length > 0 ? (
        <AccountListContainer
          style={
            isHugeContainer
              ? { ...styleForHugeContainer, ...isWithdrawListStyle }
              : isWithdrawListStyle
          }
          className="AccountListContainer"
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
      ) : props.loader ? (
        <SimpleLoader color="blue" label={label} />
      ) : (
        items.length < 1 &&
        !props.loader && (
          <AccountsNotFound
            account_type={isWalletsView ? "wallets" : "withdraw_accounts"}
          />
        )
      )}

      {!props.loader && (
        <AddNewItem
          id={idForClickableElement}
          label={mainButtonText}
          type="primary"
          handleClick={createNewWallet}
        />
      )}
    </>
  );
}

AccountList.propTypes = {
  all_pairs: PropTypes.object,
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  current_wallet: PropTypes.object,
  items: PropTypes.array,
  loader: PropTypes.bool,
};

const AccountsNotFound = ({ account_type }) => {
  return (
    <div className="withdraw_accounts_screen">
      <div className="withdraw_accounts_screen_cont">
        <p id="WalletList2" className="fuente">
          {account_type === "withdraw_accounts"
            ? "Aún no tienes cuentas de retiro agregadas, añade y gestiona retiros en tu moneda local."
            : "Aún no tienes billeteras agregadas, añade y gestiona Billeteras de Bitcoin, Ethereum, etc... para que puedas hacer retiros y depositos"}
        </p>
        <IconSwitch size={350} icon="newAccount" />
      </div>
    </div>
  );
};

export default withListCreator(AccountList);
