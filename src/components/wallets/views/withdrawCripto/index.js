import { useState, useEffect, useRef } from "react";
import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { useActions } from "../../../../hooks/useActions";
import useToastMessage from "../../../../hooks/useToastMessage";
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import WithOutProvider from "./withOutProvider";
import SkeletonWithdrawView from "./skeleton";
import { history } from "../../../../const/const";
import { useSelector } from "react-redux";
import { selectWithConvertToObjectWithCustomIndex } from 'hooks/useTxState'
import { CAPACITOR_PLATFORM } from 'const/const';
import { checkCameraPermission } from 'utils'
import { isEmpty } from 'lodash'
import { getMinAmount } from 'utils/withdrawProvider'
import withEthProvider from 'components/hoc/withEthProvider'
import WithdrawConfirmation from './withdrawConfirmation'
import WithdrawFormComponent from './withdrawForm'


const CriptoSupervisor = (props) => {
  
  const { current_wallet, withdrawProvidersByName } = props;
  
  return (
    <>
      {isEmpty(withdrawProvidersByName) ? (
        <SkeletonWithdrawView />
      ) : !withdrawProvidersByName[current_wallet.currency.currency] ? (
        <WithOutProvider current_wallet={current_wallet} />
      ) : (
        <CriptoView {...props}/>
      )}
    </>
  );
};

export default withEthProvider(CriptoSupervisor)


export const CriptoView = (props) => {

  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
  const {
    current_wallet,
    withdrawProvidersByName,
    withdraw_accounts,
    balance,
    user,
    coinsendaServices,
    active_trade_operation
  } = props;

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
  const [ showModal, setShowModal ] = useState(false)
  const { provider:{ withdrawData:{ fixedCost, timeLeft } }} = props

  const handleChangeAmount = (name, newValue) => {
    setAmountValue(newValue)
  }

  const setTowFaTokenMethod = async (payload) => {
    finish_withdraw(payload);
    actions.renderModal(null);
  };
 
  const finish_withdraw = async (fnProps) => {
      const { twoFaToken = null, cost_information, network_data, gas_limit } = fnProps
      const transactionSecurity = await coinsendaServices.userHasTransactionSecurity(user.id);
      if((transactionSecurity && transactionSecurity["2fa"]?.enabled) && !twoFaToken){
        return actions.renderModal(() => (
          <Withdraw2FaModal isWithdraw2fa callback={setTowFaTokenMethod} {...fnProps} />
        ));
      } 
      actions.isAppLoading(true);
      let withdraw_account = withdraw_accounts[addressValue];
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
      const { error, data } = await coinsendaServices.addWithdrawOrder(bodyRequest, twoFaToken);
      await actions.renderModal(null)
      setShowModal(false)

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
      }
  }

  const handleSubmit = async(e) => {
    e && e.preventDefault();
    e && e.stopPropagation();
    actions.isAppLoading(true);
    const Element = await import("../../../forms/widgets/layout");
    actions.isAppLoading(false);
    if(!Element) return; 
    const Layout = Element.default
    actions.renderModal(() => 
      <Layout 
          // closeControls={isMovilViewport}
          callback={closeModal}
          className="_show"
      >
      </Layout>
    );
    setShowModal(true)
  };

  const closeModal = () => setShowModal(false)

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
        let minAmount = await getMinAmount(withdrawProvider)
        let amountWithCost = fixedCost ? minAmount.plus(fixedCost) : minAmount
        setMinAmount(amountWithCost)
      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawProvidersByName, current_wallet, fixedCost])

  const currencySymbol = currencies ? currencies[current_wallet.currency.currency]?.symbol : current_wallet.currency.currency

  const formProps = {
    setAddressState,
    handleChangeAddress,
    addressValue,
    currencySymbol,
    loader:props.loader,
    tagWithdrawAccount,
    addressState,
    showQrScanner,
    setAddressValue,
    addressToAdd,
    deleteTag,
    minAmount,
    timeLeft,
    setAmountState,
    handleChangeAmount,
    amountState,
    handleMaxAvailable,
    balance,
    amountValue,
    handleSubmit,
    active_trade_operation
  }

  return (
    <>
      <WithdrawFormComponent
        {...formProps}
      />
      {
        showModal ?
          <WithdrawConfirmation 
            amount={amountValue}
            currencySymbol={currencySymbol}
            addressValue={addressValue}
            tagWithdrawAccount={tagWithdrawAccount}
            current_wallet={current_wallet}
            withdrawProvider={withdrawProvidersByName[current_wallet?.currency?.currency]}
            handleAction={finish_withdraw}
            callback={closeModal}
            {...props}
          /> : <></>
      }
    </>
  ); 
};





