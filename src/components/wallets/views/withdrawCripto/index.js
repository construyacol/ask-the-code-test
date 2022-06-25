import React, { useState, useEffect, useRef } from "react";
import WithdrawViewState from "../../../hooks/withdrawStateHandle";
import IconSwitch from "../../../widgets/icons/iconSwitch";
import InputForm from "../../../widgets/inputs/inputForm";
import ControlButton from "../../../widgets/buttons/controlButton";
import { useCoinsendaServices } from "../../../../services/useCoinsendaServices";
import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import styled from "styled-components";
import { useActions } from "../../../../hooks/useActions";
import useToastMessage from "../../../../hooks/useToastMessage";
import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";
import AddressBookCTA from "../../../widgets/modal/render/addressBook/ctas";
// import { AiOutlineClose } from "react-icons/ai"; 
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { Camera } from '@capacitor/camera';
import { NativeSettings,IOSSettings, AndroidSettings } from 'capacitor-native-settings';
import WithOutProvider from "./withOutProvider";
import SkeletonWithdrawView from "./skeleton";
import AddressTagList from "./addressTagList";
import TagItem from "./tagItem";
import { MAIN_COLOR, history } from "../../../../const/const";
import { useSelector } from "react-redux";
import { selectWithConvertToObjectWithCustomIndex } from '../../../hooks/useTxState'
import { CAPACITOR_PLATFORM } from '../../../utils';

import AvailableBalance from '../../../widgets/availableBalance'


export const CriptoSupervisor = (props) => {
  const [{ current_wallet, withdrawProviders }] = WithdrawViewState();
  // const [ { current_wallet } ] = WithdrawViewState()
  // const withdrawProviders = {}

  return (
    <>
      {Object.keys(withdrawProviders).length === 0 ? (
        <SkeletonWithdrawView />
      ) : !withdrawProviders[current_wallet.currency.currency] ? (
        <WithOutProvider current_wallet={current_wallet} />
      ) : (
        <CriptoView />
      )}
    </>
  );
};

export const CriptoView = () => {

  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))

  const [coinsendaServices] = useCoinsendaServices();
  const [
    {
      current_wallet,
      withdrawProviders,
      withdraw_accounts,
      active_trade_operation,
      loader,
      balance,
      user,
    },
    // { confirmationModalToggle, confirmationModalPayload, isAppLoading },
  ] = WithdrawViewState();

  const actions = useActions();
  const [toastMessage] = useToastMessage();

  const [addressState, setAddressState] = useState();
  const [addressValue, setAddressValue] = useState();
  const [amountState, setAmountState] = useState();
  const [amountValue, setAmountValue] = useState();
  const [addressToAdd, setAddressToAdd] = useState();
  const [tagWithdrawAccount, setTagWithdrawAccount] = useState();
  const isValidForm = useRef(false);

  let movil_viewport = window.innerWidth < 768;
  const idForClickeableElement = useKeyActionAsClick(true, "main-deposit-crypto-button", 13, false, "onkeyup");

  const handleChangeAmount = (name, newValue) => {
    setAmountValue(newValue)
  }

  const setTowFaTokenMethod = async (twoFaToken) => {
    finish_withdraw(twoFaToken);
    actions.renderModal(null);
  };

  const finish_withdraw = async (twoFaToken = null) => {
    const form = new FormData(document.getElementById("withdrawForm"));
    const amount = form.get("amount");

    const transactionSecurity = await coinsendaServices.userHasTransactionSecurity(user.id);
    if((transactionSecurity && transactionSecurity["2fa"]?.enabled) && !twoFaToken){
    // if (user.security_center.authenticator.withdraw && !twoFaToken) {
      return actions.renderModal(() => (
        <Withdraw2FaModal isWithdraw2fa callback={setTowFaTokenMethod} />
      ));
    } 

    actions.isAppLoading(true);
    let withdraw_account = withdraw_accounts[addressValue];
    if (!withdraw_account) {
      // si la cuenta no existe, se crea una nueva y se consultan
      withdraw_account = await coinsendaServices.addNewWithdrawAccount({
          currency: current_wallet.currency,
          provider_type: current_wallet.currency.currency,
          label: current_wallet.currency.currency,
          address: addressValue,
          country: current_wallet.country,
        },
        "cripto"
      );
      await coinsendaServices.fetchWithdrawAccounts();
    }

    sessionStorage.setItem(`withdrawInProcessFrom${current_wallet?.id}`, current_wallet.id );
    const { error, data } = await coinsendaServices.addWithdrawOrder(
      {
        data: { 
          amount,
          account_id: current_wallet.id,
          withdraw_provider_id:withdrawProviders[current_wallet.currency.currency].id,
          withdraw_account_id: withdraw_account.id,
          country: user.country,
        },
      },
      twoFaToken
    );

    await actions.renderModal(null)


    setTimeout(async() => {
      if(sessionStorage.getItem(`withdrawInProcessFrom${current_wallet?.id}`)){
        sessionStorage.removeItem(`withdrawInProcessFrom${current_wallet?.id}`)
        actions.isAppLoading(false);
        await coinsendaServices.addUpdateWithdraw(data?.id, "confirmed");
        await coinsendaServices.get_withdraws(current_wallet?.id)
        await coinsendaServices.updateActivityState(current_wallet?.account_id, "withdraws");
        await coinsendaServices.getWalletsByUser(true);
        history.push(`/wallets/activity/${current_wallet.id}/withdraws`);
      }
    }, 5000)   


    if (!error) {
      actions.isAppLoading(false);
      return toastMessage(error?.message, "error");
      // if (twoFaToken) {
      // }
      // return toastMessage("No se ha podido crear la orden de retiro", "error");
    }

  };

  const handleSubmit = async(e) => {
    e && e.preventDefault();
    e && e.stopPropagation();

    const form = new FormData(document.getElementById("withdrawForm"));
    const amount = form.get("amount");
    const currencySymbol = currencies ? currencies[current_wallet.currency.currency]?.symbol : current_wallet.currency.currency
    actions.isAppLoading(true);
    const Element = await import("./withdrawConfirmation/");
    actions.isAppLoading(false);
    if(!Element) return; 
    const WithdrawConfirmation = Element.default
    actions.renderModal(() => 
      <WithdrawConfirmation 
        amount={amount}
        currencySymbol={currencySymbol}
        addressValue={addressValue}
        tagWithdrawAccount={tagWithdrawAccount}
        current_wallet={current_wallet}
        withdrawProvider={withdrawProviders[current_wallet?.currency?.currency]}
        handleAction={finish_withdraw}
      />);

    // actions.confirmationModalToggle();
    // window.requestAnimationFrame(() => {
    //   actions.confirmationModalPayload({
    //     title: "Confirmación de retiro",
    //     description: () => <p style={{display:'initial'}}>¿Estás seguro deseas realizar un retiro de <span style={{fontWeight:"bold"}} className="fuente2">{amount} {cSymbol}</span>?, una vez confirmado el retiro, este es irreversible </p>,
    //     txtPrimary: "Confirmar Retiro",
    //     txtSecondary: "Cancelar",
    //     action: finish_withdraw,
    //     img: "withdraw",
    //   });
    // });
  };

  const handleMaxAvailable = (e) => {
    // TODO: no se debe manejar valores directo del DOM
    let amount = document.getElementsByName("amount")[0];
    amount.value = balance.available
    setAmountValue(balance.available)
    if (amount.value > 0) {
      setAmountState("good");
    }
  };


  const checkPermission = async () => {
    try {
      let result = await Camera.checkPermissions()
      if (result.camera === 'granted') {
        return true;
      }
      if (result.camera === 'denied') {
        NativeSettings.open({
          optionAndroid: AndroidSettings.ApplicationDetails, 
          optionIOS: IOSSettings.App
        })
        result = await Camera.requestPermissions(['camera']);
      } else {
        result = await Camera.requestPermissions(['camera']);
      }
      if (result.camera === 'denied') {
        throw new Error("Camera permissions no granted")
      }
      return result.camera === 'granted';
    } catch (e) {
      toastMessage('Necesitas darle permisos a la app para usar la camara como scanner', 'error');
      return false;
    }
  };

  const showQrScanner = async () => {
    if (CAPACITOR_PLATFORM !== 'web' && await checkPermission()) {
      const { text, cancelled } = await BarcodeScanner.scan();
      if (!!!cancelled) setAddressValue(text?.split(':')[1]);
    } else if (CAPACITOR_PLATFORM === 'web') {
      actions.renderModal(null);
      const Element = await import("../../../qr-scanner");
      const RenderComponent = Element.default
      actions.renderModal(() => <RenderComponent onScan={setAddressValue} />);
    }
  };

  useEffect(() => {
    const condition = !active_trade_operation && amountState === "good" && addressState === "good";
    if (isValidForm.current !== condition) {
      isValidForm.current = condition;
    }
    if (addressState === "good") {
      document.getElementsByName("amount")[0].focus();
    }
  }, [active_trade_operation, amountState, addressState]);

  const handleChangeAddress = (_, value) => {
    setAddressValue(value);
  };



  const deleteTag = () => {
    setTagWithdrawAccount(null);
    setAddressValue("");
  };

  useEffect(() => {
    // Las cuentas anónimas son aquellas que su label es igual al provider_type de la red monetaria a la que pertenece la cuenta
    setAddressToAdd();
    const provider_type = current_wallet.currency.currency;

    if (withdraw_accounts[addressValue] && withdraw_accounts[addressValue] && withdraw_accounts[addressValue].info.label !== provider_type) {
      // Si la cuenta existe y nó es una cuenta anónima muestre el tag en el input
      setTagWithdrawAccount(withdraw_accounts[addressValue]);
    }else{
      setTagWithdrawAccount(null)
    }

    if (addressState === "good") {
      if (!withdraw_accounts[addressValue] || (withdraw_accounts[addressValue] && withdraw_accounts[addressValue].info.label === provider_type)) {
        // Si la cuenta no existe, o si existe pero es una cuenta anónima entonces esta cuenta puede ser agregada
        setAddressToAdd(addressValue);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressState, withdraw_accounts, addressValue]);

  // console.log('|||||||||||||||||||||||||||  addressState ===> ', addressState)

  const currencySymbol = currencies ? currencies[current_wallet.currency.currency]?.symbol : current_wallet.currency.currency

  return (
    <WithdrawForm
      id="withdrawForm"
      className={`${movil_viewport ? "movil" : ""}`}
      onSubmit={(e) => e.preventDefault()}
    >
      {/* <form id="withdrawForm" className={`WithdrawView ${!withdrawProviders[current_wallet.currency.currency] ? 'maintance' : ''} itemWalletView ${movil_viewport ? 'movil' : ''}`} onSubmit={handleSubmit}> */}
      <InputForm
        type="text"
        placeholder={"Escribe @ para ver tu lista de direcciones..."}
        name="address"
        handleStatus={setAddressState}
        isControlled
        handleChange={handleChangeAddress}
        value={addressValue}
        label={`Ingresa la dirección ${currencySymbol}`}
        disabled={loader || tagWithdrawAccount}
        autoFocus={true}
        SuffixComponent={() => (
          <IconsContainer>
            <IconSwitch
              className="superImposed"
              icon={`${addressState === "good" ? "verify" : "wallet"}`}
              color={`${addressState === "good" ? "green" : "gray"}`}
              size={`${addressState === "good" ? 22 : 25}`}
            />
            <IconSwitch
              onClick={showQrScanner}
              icon="qr"
              color="gray"
              size={25}
            />
          </IconsContainer>
        )}
        AuxComponent={[
          () => (<AddressBookCTA setAddressValue={setAddressValue} addressToAdd={addressToAdd} />),
          () => (<AddressTagList addressState={addressState} show={addressValue && addressValue.match(/^@/g)} addressValue={addressValue} setAddressValue={setAddressValue}/>),
          () => (<TagItem withdrawAccount={tagWithdrawAccount} deleteTag={deleteTag}/>)
        ]}
      />

      <InputForm 
        type="number" 
        placeholder={`${withdrawProviders[current_wallet.currency.currency].provider.min_amount}`}
        name="amount"
        handleStatus={setAmountState}
        handleChange={handleChangeAmount}
        label={`Ingresa la cantidad del retiro`}
        disabled={loader}
        state={amountState}
        setMaxWithActionKey={true}
        value={amountValue}
        SuffixComponent={({ id }) => (
          <AvailableBalance 
            id={id}
            handleAction={handleMaxAvailable}
            amount={balance.available}
          />
        )}
        // PrefixComponent
      />
      <ControlButton
        id={idForClickeableElement}
        loader={loader}
        handleAction={handleSubmit}
        formValidate={
          !active_trade_operation &&
          amountState === "good" &&
          addressState === "good"
        }
        label="Enviar"
      />
      {/* </form> */}
    </WithdrawForm>
  ); 
};


const IconsContainer = styled.div`
  display: flex;
  > div:first-child {
    margin: 0 12px;
  }
  > div:last-child {
    cursor: pointer;
    transition: all 300ms ease;
    &:hover {
      > svg {
        fill: ${MAIN_COLOR} !important;
      }
    }
  }
`;

export const OperationForm = styled.form`
  width: calc(95% - 50px);
  max-width: calc(700px - 50px);
  height: calc(100% - 50px);
  border-radius: 4px;
  padding: 20px 25px 20px 25px;
  display: grid;
  grid-row-gap: 5px;
  position: relative;
  max-height: 450px;
  background: #f3f3f3;
  border-radius: 8px;
  padding: 30px;
  width: calc(95% - 60px);
  height: calc(100% - 60px);
`;

export const WithdrawForm = styled(OperationForm)`
  grid-template-rows: 40% 1fr 1fr;
  @media (max-width: 768px) {
    height: calc(100% - 40px);
    width: 100%;
    padding: 20px 0;
    background: transparent;
    grid-template-rows: 1fr 1fr 1fr;
  }
`;

