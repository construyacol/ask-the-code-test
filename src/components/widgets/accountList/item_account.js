import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
// import backcard from "../../../assets/wallet_coins/back.webp";
import { connect } from "react-redux";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import { LoaderContainer } from "../loaders";
import { useItemsInteractions } from "../../../hooks/useNavigationKeyActions";
import BalanceComponent from "../balance/balance";
import PopNotification from "../notifications";
import SimpleLoader from "../loaders";
import { getCdnPath } from '../../../environment'
import { selectWithConvertToObjectWithCustomIndex } from "hooks/useTxState.js"
import { useSelector } from "react-redux";


import {
  ACta,
  BarIconCont,
  Icon,
  OptionsLayout,
  AccountLayout,
  WalletLayout,
  WithdrawAccountL,
  InputKeyActionHandler,
} from "./styles";

import { withRouter } from "react-router";
import useToastMessage from "../../../hooks/useToastMessage";
import { useActions } from "../../../hooks/useActions";
// import "./item_wallet.css";

const IconSwitch = loadable(() => import("../icons/iconSwitch"));

const ItemAccount = (props) => {

  const [coinsendaServices] = useCoinsendaServices();
  const actions = useActions();
  const [toastMessage] = useToastMessage();
  const [account_state, set_account_state] = useState();
  const [loader, set_loader] = useState(false);
  const [shouldHaveDeleteClassName, setShouldHaveDeleteClassName] = useState(
    false
  );
  const [id_wallet_action, set_id_wallet_action] = useState("");
  const { account_type } = props;
  // 5d3dedf1bb245069d61021bb


  const delete_account_confirmation = (cancelCallback) => {
    if(props.account_type === 'wallets') return;
    actions.confirmationModalToggle();
    actions.confirmationModalPayload({
      title: "Confirmando eliminación de cuenta",
      description:
        "Al eliminar una cuenta de retiro no podrás recuperar los datos asociados a esta. ¿Estás seguro de hacerlo?",
      txtPrimary: "Sí, eliminar cuenta",
      txtSecondary: "Cancelar",
      // payload:props.account.id,
      action: delete_account,
      img: "deletewallet",
      cancelCallback,
      // code:props.account_type
    });
  };

  const [isSelected] = useItemsInteractions({...props, uniqid: props?.account?.id}, {
    // eslint-disable-next-line no-use-before-define
    suprKeyAction: delete_account_confirmation,
    enterKeyAction: () => account_detail(account_type),
  });



  

  const getAccountTransactions = async () => {
    set_loader(true);
    const countAccount = await coinsendaServices.countOfAccountTransactions(props.account.id);
    const { count } = countAccount;
    await actions.update_item_state(
      { [props.account.id]: { ...props.account, count } },
      "wallets"
    );
    if (count < 1) {
      let areThereDeposits = await coinsendaServices.getDepositByAccountId(
        props.account.id
      );
      set_loader(false);
      if (areThereDeposits && areThereDeposits.length) {
        actions.update_item_state(
          { [props.account.id]: { ...props.specifiedWallet, count: 1 } },
          "wallets"
        ); //actualiza el movimiento operacional de la wallet
        return props.history.push(`/wallets/activity/${props.account.id}/deposits`);
      }
      return props.history.push(`/wallets/deposit/${props.account.id}`);
    }
    return props.history.push(`/wallets/activity/${props.account.id}/${props.currentFilter ? props.currentFilter : "deposits"}`
    );
  };

  const account_detail = async (payload) => {

    if (payload !== "wallets") {
      if (props.account.used_counter > 0) {
        return props.history.push(
          `/withdraw_accounts/activity/${props.account.id}/withdraws`
        );
      }
      return;
    }
    if (account_state === "deleting" || account_state === "deleted") {
      return;
    }
    if (props.account.count === undefined) {
      return getAccountTransactions();
    }
    actions.cleanNotificationItem(payload, "account_id");
    if (props.account.count < 1) {
      return props.history.push(`/wallets/deposit/${props.account.id}`);
    }
    return props.history.push(`/wallets/activity/${props.account.id}/${props.currentFilter ? props.currentFilter : "deposits"}`
    );
  };


  const delete_account = async () => {
    set_account_state("deleting");
    set_id_wallet_action(props.account.id);
    const isWallet = props.account_type === "wallets";

    if (isWallet) {
      if (props.balances.total > 0) {
        set_account_state("");
        return toastMessage(
          "Las cuentas con balance no pueden ser eliminadas",
          "error"
        );
      }

      let areThereDeposits = await coinsendaServices.getDepositByAccountId(
        props.account.id,
        '"state":"confirmed"'
      );
      if (areThereDeposits && areThereDeposits.length) {
        set_account_state("");
        return toastMessage(
          "Las cuentas con depositos pendientes no pueden ser eliminadas",
          "error"
        );
      }
    }
    // else if(props.account.used_counter){
    //   setTimeout(()=>set_account_state(''), 700)
    //   return toastMessage('Las cuentas de retiro con movimiento no pueden ser eliminadas...', 'error')
    // }

    let msg = "Cuenta eliminada con éxito";
    let success = true;
    let result = false;
    if (isWallet) {
      result = await coinsendaServices.deleteWallet(props.account);
    } else {
      result = await coinsendaServices.deleteAccount(props.account.id);
    }
    if (result === 404 || result === 465 || !result) {
      msg = "La cuenta no se ha podido eliminar";
      success = false;
      set_account_state("");
      return toastMessage(msg, success ? "success" : "error");
    }
    set_account_state("deleted");
    setTimeout(async () => {
      if (isWallet) {
        await coinsendaServices.getWalletsByUser();
      } else {
        await coinsendaServices.fetchWithdrawAccounts();
      }
    }, 0);
    actions.exit_sound();
    toastMessage(msg, success ? "success" : "error");
  };



  const toProps = {
    handleAction: account_detail,
    set_account_state,
    shouldHaveDeleteClassName:
    shouldHaveDeleteClassName && account_state === "deleted",
    delete_account: delete_account_confirmation,
    account: props.account,
    balances: props.balances,
    actions,
    account_type,
    focusedId: props.focusedId,
    isStatic: props.isStatic,
    history: props.history,
  };

  const isWallet = account_type === "wallets";


  useEffect(() => {
    setShouldHaveDeleteClassName(
      id_wallet_action === props?.account?.id && account_state
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account_state, props?.account?.id]);


  useEffect(() => {
    console.log('loader', loader)
  }, [loader])


  if (props.loader || !props.account) {
    return <LoaderAccount />;
  }

  return (
    <AccountLayout
      className={`AccountLayout  ${shouldHaveDeleteClassName && account_state}`}
    >
      <InputKeyActionHandler
        aria-label="itemFromList"
        name="itemFromList"
        autoComplete="off"
        id={props.focusedId}
      />
      {isWallet ? (
        <Wallet 
          isSelected={isSelected} 
          loaderAccount={loader}
          {...toProps} />
      ) : (
        <WithdrawAccount
          isSelected={isSelected}
          loaderAccount={loader}
          {...toProps}
        />
      )}
    </AccountLayout>
  );
};

const mapStateToProps = (state, props) => {
  const { account } = props;
  const { balances, wallets } = state.modelData;
  const { currentFilter } = state.ui.current_section.params;

  // console.log('||||||||||||||||||||||||||||||| ACCOUNT ITEM ACCOUNT ==> ', account)

  return {
    currentFilter,
    balances: balances && account && balances[account.id],
    specifiedWallet: account && wallets[props.account.id],
  };
};

// ¿Es necesario conectar redux tanto para Wallet como para Withdraw Account?
export default connect(mapStateToProps)(withRouter(ItemAccount));

const Wallet = (props) => {
  const {
    account,
    balances,
    delete_account,
    shouldHaveDeleteClassName,
    isSelected,
    actions,
    focusedId,
    isStatic,
    loaderAccount
  } = props;

  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
  const { name, id, currency } = account;
  const icon =
    account.currency === "cop"
      ? "bank"
      : account.currency === "ethereum"
      ? "ethereum_account"
      : account.currency;

  const currencySymbol = currencies && currencies[currency]?.symbol

  return (
    <WalletLayout
      id={`hoverable${focusedId}`}
      isSelected={isSelected}
      className={`walletLayout ${loaderAccount ? "loading" : ""} ${currency} ${shouldHaveDeleteClassName && "deleted"}`}
      wallet
      inscribed
    >
      {loaderAccount && (
        <LoaderContainer>
          <SimpleLoader loader={2} />
        </LoaderContainer>
      )}

      {!isStatic && actions && (
        <>
          <AccountCta
            handleAction={props.handleAction}
            payload={props.account_type}
            className={`clickeable ${currency}`}
          />
          <OptionsAccount
            account_detail={props.handleAction}
            delete_account={delete_account}
            {...props}
          />
        </>
      )}
      <img src={`${getCdnPath('assets')}wallet_coins/back.webp`} id="backCard" alt="" width="100%" height="100%" />
      <div className="iconWallet">
        <IconSwitch icon={icon} size={195} />
      </div>
      <div className="walletTitleCont IWText">
        <h1 className="IWText fuente tobe_continue">
          {name ? name : "Mi cartera crypto"}
        </h1>
        <PopNotification
          notifier="wallets"
          item_type="account_id"
          id={id}
          type="new"
        />
      </div>
      <p className="IWText fuente IWcurrencyText tobe_continue">
        {currencySymbol}
      </p>
      <>
        {balances ? (
          <BalanceComponent account_id={id} />
        ) : (
          <div className="loadItem">
            <SimpleLoader color="white" />
          </div>
        )}
      </>
    </WalletLayout>
  );
};

const WithdrawAccount = (props) => {
  const {
    account,
    delete_account,
    shouldHaveDeleteClassName,
    actions,
    isSelected,
    focusedId,
    isStatic,
  } = props;
  const { bank_name, id, account_number, inscribed, used_counter, state, provider_type } = account;
  const isEfecty = provider_type === 'efecty_network'
  console.log('Withdraw Account', account)
  return (
    <WithdrawAccountL
      id={`hoverable${focusedId}`}
      isSelected={isSelected}
      className={`withdrawAccount ${shouldHaveDeleteClassName && "deleted"}`}
      inscribed={account.state === 'complete'}
    >
      {!isStatic && actions && (
        <>
          {used_counter > 0 && (
            <AccountCta
              handleAction={props.handleAction}
              payload={props.account_type}
            />
          )}
          <OptionsAccount
            account_detail={props.handleAction}
            delete_account={delete_account}
            {...props}
          />
        </>
      )}
      <img src={`${getCdnPath('assets')}wallet_coins/back.webp`} id="backCard" alt="" width="100%" height="100%" />
      <div className="iconBank">
        <IconSwitch
          icon={(account.bank_name && account.bank_name.value)}
          size={100}
        />
      </div>
      <h1 className="IWText fuente tobe_continue">
        {bank_name.ui_name}{" "}
        <PopNotification
          notifier="withdraw_accounts"
          item_type="account_id"
          id={id}
          type="new"
        />
      </h1>
      {/* account_type */}
      {
        isEfecty &&
        <p className="fuente">{account?.account_type?.ui_name}</p>
      }
      <p className="IWText fuente2 IWLittleTitle">No. {account_number.value}</p>
      <>
        <div className="contSuscribed">
          {state === 'in_progress' ? (
            <div className="contLoader2">
              <SimpleLoader color="white" loader={2} />
            </div>
          ) : state === 'complete' && (
            <i className="far fa-check-circle"></i>
          )}
          <p className="IWText fuente IWLittleTitle">
            {
              state === 'pending' ? 'Pendiente' :
              state === 'in_progress' ? 'En proceso' :
              state === 'complete' ? 'Inscrita' : 'Rechazada'
            }
          </p>
        </div>
        <p
          className="IWText fuente IWLittleTitle"
          style={{ display: !inscribed ? "none" : "flex" }}
        >
          Movimientos: {used_counter}
        </p>
      </>
    </WithdrawAccountL>
  );
};

const LoaderAccount = () => {
  const items = ["uno", "dos", "tres"];
  return (
    <>
      {items.map((e, key) => {
        return (
          <WalletLayout className={`loader ${e}`} key={key}>
            <div />
            <div />
            <div />
            <div />
          </WalletLayout>
        );
      })}
    </>
  );
};

const OptionsAccount = (props) => {
  // console.log('|||||||||||||||||||  redirectGo ==>> ', e.target.dataset && e.target.dataset.address)
  const redirectGo = (e) => {
    if (e.target.dataset && e.target.dataset.address) {
      return props.history.push(
        `/wallets/${e.target.dataset.address}/${props.account.id}`
      );
    }
  };

  
  const { account_type } = props;
  console.log('|||||||||||||||||||||| account_type ===========================> ', account_type)

  return (
    // <div className={`ItemBarra ${account_type} ${(current_view === 'detail') ? 'noVisible' : ''}`} >
    <OptionsLayout className={`OptionsLayout ${account_type}`}>
      {props.account.count ? (
        <>
          <BarIconCont
            account_type={account_type}
            onClick={redirectGo}
            data-address="withdraw"
          >
            <Icon
              className="far fa-arrow-alt-circle-up IdeleteButton tooltip"
              data-address="withdraw"
            >
              <span className="tooltiptext2 fuente" data-address="withdraw">
                Retirar
              </span>
            </Icon>
          </BarIconCont>
          <BarIconCont
            account_type={account_type}
            onClick={redirectGo}
            data-address="deposit"
          >
            <Icon
              className="far fa-arrow-alt-circle-down Ideposit IdeleteButton tooltip"
              data-address="deposit"
            >
              <span className="tooltiptext2 fuente" data-address="deposit">
                Depositar
              </span>
            </Icon>
          </BarIconCont>
        </>
      ) : (
        <>
          <div></div>
          <div></div>
        </>
      )}
      {
        account_type !== 'wallets' &&
          <BarIconCont
            className="retweetCont"
            account_type={account_type}
            onClick={props.delete_account}
          >
            <Icon className="fas fa-trash-alt IdeleteButton tooltip">
              <span className="tooltiptext2 fuente">Borrar</span>
            </Icon>
          </BarIconCont>
      }
    </OptionsLayout>
  );
};

const AccountCta = (props) => {
  const handleAction = () => {
    props.handleAction(props.payload);
  };

  return (
    <ACta className={props.className} onClick={handleAction}></ACta>
    //<div className={`ItemWCta ${(current_view === 'detail' || type === 'withdraw') ? 'noVisible' : ''}`} onClick={this.wallet_detail} ></div>
  );
};
