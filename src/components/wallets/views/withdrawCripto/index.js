import { useState, useEffect, useRef } from "react";
import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { useActions } from "../../../../hooks/useActions";
import useToastMessage from "../../../../hooks/useToastMessage";
import WithOutProvider from "./withOutProvider";
import SkeletonWithdrawView from "./skeleton";
import { history } from "../../../../const/const";
import { useSelector } from "react-redux";
import { selectWithConvertToObjectWithCustomIndex } from 'hooks/useTxState'
import { CAPACITOR_PLATFORM } from 'const/const';
import { checkCameraPermission } from 'utils'
import { isEmpty } from 'lodash'
import { getMinAmount } from 'utils/withdrawProvider'
import withCryptoProvider from 'components/hoc/withCryptoProvider'
import WithdrawFormComponent from './withdrawForm'
import { formatToCurrency } from "utils/convert_currency";
import { CriptoWithdrawForm } from 'components/forms/widgets/sharedStyles'
import PanelHelper from './panelHelper'
import useViewport from 'hooks/useViewport'



const CriptoSupervisor = (props) => { 
  const { current_wallet, withdrawProvidersByName, withdrawProvider } = props;
  return (
    <>
      {isEmpty(withdrawProvidersByName) ? (
        <SkeletonWithdrawView />
      ) : !withdrawProvider ? (
        <WithOutProvider current_wallet={current_wallet} />
      ) : (
        <CriptoView {...props}/>
      )}
    </>
  );
};


export default withCryptoProvider(CriptoSupervisor)


export const CriptoView = (props) => {
  const currencies = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))
  const {
    current_wallet,
    withdrawProvider,
    withdraw_accounts,
    balance,
    user,
    coinsendaServices,
    active_trade_operation,
  } = props

  const actions = useActions();
  const { isMobile } = useViewport()
  const [toastMessage] = useToastMessage();
  const [addressState, setAddressState] = useState();
  const [addressValue, setAddressValue] = useState();
  const [amountState, setAmountState] = useState();
  const [addressToAdd, setAddressToAdd] = useState();
  const [minAmount, setMinAmount] = useState(0)
  const [tagWithdrawAccount, setTagWithdrawAccount] = useState();
  const isValidForm = useRef(false);
  const [ isOpenPanel, setIsOpenPanel ] = useState(isMobile ? false : true)


  const { 
    provider:{ 
      withdrawData, 
      setWithdrawData, 
      getNetworkData 
    },
    priority:{ currentPriority },
  } = props

  const { 
    fixedCost, 
    amount,
    gas_limit
  } = withdrawData

  const createWithdraw = async() => {
    // setLoader(true)
    await finish_withdraw({ cost_information:{ cost_id:currentPriority }, gas_limit })
    // setLoader(false)
  }

  const handleChangeAmount = (name, newValue) => setWithdrawData(prevState => ({...prevState, amount:newValue}))
  const setTowFaTokenMethod = async (payload) => {
    finish_withdraw(payload);
    actions.renderModal(null);
  };
 
  const finish_withdraw = async (fnProps) => {
    const { twoFaToken = null, cost_information, gas_limit } = fnProps
    actions.isAppLoading(true);
    const transactionSecurity = await coinsendaServices.userHasTransactionSecurity(user.id);
    if((transactionSecurity && transactionSecurity["2fa"]?.enabled) && !twoFaToken){
      // setShowModal(false)
      actions.isAppLoading(false);
      return actions.renderModal(() => (
        <Withdraw2FaModal isWithdraw2fa callback={setTowFaTokenMethod} {...fnProps} />
      ));
    } 
    let withdraw_account = withdraw_accounts[addressValue];
    if (!withdraw_account) { 
      // si la cuenta no existe, se crea una nueva y se consultan
      withdraw_account = await coinsendaServices.addNewWithdrawAccount({ 
          currency: current_wallet.currency,
          provider_type: withdrawProvider?.provider_type,
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
        amount:withdrawData?.withdrawAmount?.toString(),
        account_id: current_wallet.id,
        withdraw_provider_id:withdrawProvider.id,
        withdraw_account_id: withdraw_account.id,
        cost_information,
        country: user.country,
      }
    }
    if(current_wallet?.currency?.currency?.includes('eth')) {
      const network_data = await getNetworkData()
      bodyRequest.data.network_data = network_data
      bodyRequest.data.cost_information.gas_limit = gas_limit
    }
    const { error, data } = await coinsendaServices.addWithdrawOrder(bodyRequest, twoFaToken);
    await actions.renderModal(null)
    if (error) {
      actions.isAppLoading(false);
      return toastMessage(error?.message, "error");
    }
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
  }

  const handleMaxAvailable = (e) => {
    // TODO: refactor amountEl to reference DOM with useRef
    let amountEl = document.getElementsByName("amount")[0];
    const finalAmount = current_wallet ? formatToCurrency(balance.available, current_wallet?.currency)?.toFormat() : balance.available
    amountEl.value = finalAmount
    setWithdrawData(prevState => ({...prevState, amount:finalAmount}))
    if (amountEl.value > 0) {
      setAmountState("good");
    }
  };
  

  const showQrScanner = async () => {
    if (CAPACITOR_PLATFORM !== 'web' && await checkCameraPermission()) {
      // const { BarcodeScanner } = await import('@awesome-cordova-plugins/barcode-scanner');
      // const { text, cancelled } = await BarcodeScanner.scan();
      // // console.log('BarcodeScanner', text, cancelled )
      // if (!!!cancelled) setAddressValue(text);
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
    // console.log('addressValue', addressValue, withdraw_accounts)
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
    if(withdrawProvider){
      (async() => {
        let minAmount = await getMinAmount(withdrawProvider)
        // let minAmountWithCost = fixedCost ? minAmount.plus(fixedCost) : minAmount
        // const finalValue = current_wallet ? formatToCurrency(minAmountWithCost, current_wallet?.currency) : minAmountWithCost
        const finalValue = current_wallet ? formatToCurrency(minAmount, current_wallet?.currency) : minAmount
        setMinAmount(finalValue)
      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawProvider, current_wallet, fixedCost])

  const currencySymbol = currencies ? currencies[current_wallet.currency.currency]?.symbol : current_wallet.currency.currency

  const formProps = {
    setAddressState,
    handleChangeAddress,
    addressValue,
    currencySymbol,
    tagWithdrawAccount,
    addressState,
    showQrScanner,
    setAddressValue,
    addressToAdd,
    deleteTag,
    minAmount,
    setAmountState,
    handleChangeAmount,
    amountState,
    handleMaxAvailable,
    balance,
    amountValue:amount,
    active_trade_operation,
    current_wallet,
    priority:props.priority,
    setIsOpenPanel,
    isMobile
  }

  const panelHProps = {
    currencySymbol,
    createWithdraw,
    amountState,
    addressState,
    isOpenPanel,
    setIsOpenPanel,
    addressValue
  }

 
  return (
    <CriptoWithdrawForm>
      <WithdrawFormComponent
        {...formProps}
      />
      <PanelHelper
        {...panelHProps}
        {...props}
      />
    </CriptoWithdrawForm>
  ); 
};


