import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import WithdrawViewState from "hooks/withdrawStateHandle";
import IconSwitch from "../../../widgets/icons/iconSwitch";
import InputForm from "../../../widgets/inputs/inputForm";
import ControlButton from "../../../widgets/buttons/controlButton";
import { useCoinsendaServices } from "../../../../services/useCoinsendaServices";
import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { useActions } from "../../../../hooks/useActions";
import useToastMessage from "../../../../hooks/useToastMessage";
import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";
import AddressBookCTA from "../../../widgets/modal/render/addressBook/ctas";
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import WithOutProvider from "./withOutProvider";
import SkeletonWithdrawView from "./skeleton";
import AddressTagList from "./addressTagList";
import TagItem from "./tagItem";
import { MAIN_COLOR, history } from "../../../../const/const";
import { useSelector } from "react-redux";
import { selectWithConvertToObjectWithCustomIndex } from 'hooks/useTxState'
import { CAPACITOR_PLATFORM } from 'const/const';
import { checkCameraPermission } from 'utils'
import AvailableBalance from '../../../widgets/availableBalance'
import { isEmpty } from 'lodash'
import { getMinAmount } from 'utils/withdrawProvider'



export const CriptoSupervisor = () => {
  
  const [{ current_wallet, withdrawProvidersByName }] = WithdrawViewState();
  
  return (
    <>
      {isEmpty(withdrawProvidersByName) ? (
        <SkeletonWithdrawView />
      ) : !withdrawProvidersByName[current_wallet.currency.currency] ? (
        <WithOutProvider current_wallet={current_wallet} />
      ) : (
        <CriptoView />
      )}
    </>
  );
};


export const CriptoView = () => {

  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
  const [ coinsendaServices ] = useCoinsendaServices();
  const [
    {
      current_wallet,
      withdrawProvidersByName,
      withdraw_accounts,
      active_trade_operation,
      loader,
      balance,
      user
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
  const [minAmount, setMinAmount] = useState(0)
  const [tagWithdrawAccount, setTagWithdrawAccount] = useState();
  const isValidForm = useRef(false);

  let movil_viewport = window.innerWidth < 768;
  const idForClickeableElement = useKeyActionAsClick(true, "main-deposit-crypto-button", 13, false, "onkeyup");

  const handleChangeAmount = (name, newValue) => {
    setAmountValue(newValue)
  }

  const setTowFaTokenMethod = async (payload) => {
    finish_withdraw(payload);
    actions.renderModal(null);
  };
 
  const finish_withdraw = async (fnProps) => {
      const { twoFaToken = null, cost_information, network_data, gas_limit } = fnProps
      // const form = new FormData(document.getElementById("withdrawForm"));
      // const amount = form.get("amount");
      const transactionSecurity = await coinsendaServices.userHasTransactionSecurity(user.id);
      if((transactionSecurity && transactionSecurity["2fa"]?.enabled) && !twoFaToken){
        return actions.renderModal(() => (
          <Withdraw2FaModal isWithdraw2fa callback={setTowFaTokenMethod} {...fnProps} />
        ));
      } 

      actions.isAppLoading(true);
      let withdraw_account = withdraw_accounts[addressValue];
      console.log('finish_withdraw', addressValue, withdraw_accounts)
      if (!withdraw_account) { 
        // si la cuenta no existe, se crea una nueva y se consultan
        withdraw_account = await coinsendaServices.addNewWithdrawAccount({ 
            currency: current_wallet.currency,
            provider_type: withdrawProvidersByName[current_wallet.currency.currency]?.provider_type,
            label: current_wallet.currency.currency,
            address: addressValue.trim(),
            country: current_wallet.country,
          },
          "cripto"
        );
        await coinsendaServices.fetchWithdrawAccounts();
      }

      sessionStorage.setItem(`withdrawInProcessFrom${current_wallet?.id}`, current_wallet.id );

      let bodyRequest = {
        data: { 
          amount:amountValue,
          account_id: current_wallet.id,
          withdraw_provider_id:withdrawProvidersByName[current_wallet.currency.currency].id,
          withdraw_account_id: withdraw_account.id,
          cost_information,
          country: user.country,
        }
      }

      if(current_wallet?.currency?.currency?.includes('eth')) {
        bodyRequest.data.network_data = network_data
        bodyRequest.data.cost_information.gas_limit = gas_limit
      }

      console.log('bodyRequest', bodyRequest)
      // debugger
      // return

      const { error, data } = await coinsendaServices.addWithdrawOrder(bodyRequest, twoFaToken);
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
      }, 8000)   

      if (!error) {
        actions.isAppLoading(false);
        return toastMessage(error?.message, "error");
        // if (twoFaToken) {
        // }
        // return toastMessage("No se ha podido crear la orden de retiro", "error");
      }
  }

  const handleSubmit = async(e) => {
    e && e.preventDefault();
    e && e.stopPropagation();

    // const form = new FormData(document.getElementById("withdrawForm"));
    // const amount = form.get("amount");
    const currencySymbol = currencies ? currencies[current_wallet.currency.currency]?.symbol : current_wallet.currency.currency
    actions.isAppLoading(true);
    const Element = await import("./withdrawConfirmation/");
    actions.isAppLoading(false);
    if(!Element) return; 
    const WithdrawConfirmation = Element.default
    actions.renderModal(() => 
      <WithdrawConfirmation 
        amount={amountValue}
        currencySymbol={currencySymbol}
        addressValue={addressValue}
        tagWithdrawAccount={tagWithdrawAccount}
        current_wallet={current_wallet}
        withdrawProvider={withdrawProvidersByName[current_wallet?.currency?.currency]}
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

  const showQrScanner = async () => {
    if (CAPACITOR_PLATFORM !== 'web' && await checkCameraPermission()) {
      const { text, cancelled } = await BarcodeScanner.scan();
      if (!!!cancelled) setAddressValue(text);
    } else if (CAPACITOR_PLATFORM === 'web') {
      actions.renderModal(null);
      const Element = await import("../../../widgets/qr-scanner"); 
      const RenderComponent = Element.default
      actions.renderModal(() => <RenderComponent onScan={setAddressValue} />);
    }
  };


  const handleChangeAddress = (_, value) => {
    setAddressValue(value.replace(/[^@a-zA-Z0-9]/g, ""));
  };

  const deleteTag = () => {
    setTagWithdrawAccount(null);
    setAddressValue("");
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


  useEffect(() => {
    // Las cuentas anónimas son aquellas que su label es igual al provider_type de la red monetaria a la que pertenece la cuenta
    setAddressToAdd();
    const provider_type = current_wallet.currency.currency;
    console.log('addressValue', addressValue, withdraw_accounts)
    
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


  useEffect(() => {
    const withdrawProvider = withdrawProvidersByName[current_wallet.currency.currency]
    if(withdrawProvider){
      (async() => {
        const minAmount = await getMinAmount(withdrawProvider)
        setMinAmount(minAmount.toFormat())
      })()
    }
  }, [withdrawProvidersByName, current_wallet])

  const currencySymbol = currencies ? currencies[current_wallet.currency.currency]?.symbol : current_wallet.currency.currency

  return (
    <WithdrawForm
      id="withdrawForm"
      className={`${movil_viewport ? "movil" : ""}`}
      onSubmit={(e) => e.preventDefault()}
    >
      {/* <form id="withdrawForm" className={`WithdrawView ${!withdrawProvidersByName[current_wallet.currency.currency] ? 'maintance' : ''} itemWalletView ${movil_viewport ? 'movil' : ''}`} onSubmit={handleSubmit}> */}
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
        placeholder={minAmount}
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
  background: var(--secondary_background);
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

