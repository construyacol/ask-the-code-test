import { useState, useEffect, useRef } from "react";
import Withdraw2FaModal from "../../../widgets/modal/render/withdraw2FAModal";
import { useActions } from "../../../../hooks/useActions";
import useToastMessage from "../../../../hooks/useToastMessage";
// import WithOutProvider from "./withOutProvider";
import SkeletonWithdrawView from "./skeleton";
import { history } from "../../../../const/const";
import { useSelector } from "react-redux";
import { selectWithConvertToObjectWithCustomIndex } from 'hooks/useTxState'
import { getExportByName } from 'utils'

import { isEmpty } from 'lodash'
import withCryptoProvider from 'components/hoc/withCryptoProvider'
import WithdrawFormComponent from './withdrawForm'
import { CriptoWithdrawForm } from 'components/forms/widgets/sharedStyles'
import PanelHelper from './panelHelper'
import useViewport from 'hooks/useViewport'
import loadable from "@loadable/component";
import OtherModalLayout from "components/widgets/modal/otherModalLayout";
import { createProviderInfoNeeded } from 'utils/withdrawProvider'

  
const AvailableWithdrawNetwork = loadable(() => import("components/widgets/supportChain").then(getExportByName("AvailableWithdrawNetwork")), {fallback:<div></div>});
const SelectWithdrawNetwork = loadable(() => import("components/wallets/views/selectNetwork").then(getExportByName("SelectWithdrawNetwork")), {fallback:<div></div>});
 
 
const CriptoSupervisor = (props) => { 
  const { withdrawProvidersByName } = props;
  return (
    <>
      {
       isEmpty(withdrawProvidersByName) ? 
        <SkeletonWithdrawView /> 
       : 
       <>
          <CriptoView {...props}/>
       </>
      }
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
    user,
    coinsendaServices,
    active_trade_operation,
    provider,
    withdrawProviders,
    provider:{  
      withdrawData, 
      setWithdrawData, 
      setNetworkProvider,
      ethers:{ getNetworkData, gas_limit } 
    },
    priority:{ currentPriority }
  } = props

  const actions = useActions();
  const { isMobile } = useViewport()
  const [ withdrawConfirmed, setWithdrawConfirmed ] = useState(false)
  const [toastMessage] = useToastMessage();
  const [addressState, setAddressState] = useState();
  const [addressValue, setAddressValue] = useState();
  const [amountState, setAmountState] = useState();
  const [addressToAdd, setAddressToAdd] = useState();
  const [tagWithdrawAccount, setTagWithdrawAccount] = useState();
  const isValidForm = useRef(false);
  const [ isOpenPanel, setIsOpenPanel ] = useState(isMobile ? false : true)

  const { amount } = withdrawData

  const closeWithdrawConfirmed = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      setWithdrawConfirmed(false)
      actions.renderModal(null);
    }
  };
 

  const createWithdraw = async() => {
    if(!isMobile && !withdrawConfirmed){
      setWithdrawConfirmed(true)
      return actions.renderModal(() => (
        <OtherModalLayout on_click={closeWithdrawConfirmed}>
        </OtherModalLayout>
      ));
    }
    await finish_withdraw({ cost_information:{ cost_id:currentPriority }, gas_limit })
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
      setWithdrawConfirmed(false)
      actions.isAppLoading(false); 
      return actions.renderModal(() => (
        <Withdraw2FaModal isWithdraw2fa callback={setTowFaTokenMethod} {...fnProps} />
      ));
    } 

    let withdraw_account = withdraw_accounts[addressValue];

    if (!withdraw_account) { 
      const body = {
        data:{
          country:current_wallet?.country,
          currency: current_wallet.currency,
          provider_type: withdrawProvider?.provider_type,
          internal:withdrawProvider?.internal || false,
          info_needed:createProviderInfoNeeded({ accountLabel:current_wallet.currency, accountAddress:addressValue, provider_type:withdrawProvider?.provider_type })
        }
      }
      const { data } = await coinsendaServices.createWithdrawAccount(body);
      withdraw_account = data
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

    if(withdrawData?.isEthereum) {
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

  const handleMaxAvailable = (available) => {
    let amountEl = document.getElementsByName("amount")[0];
    amountEl.value = available
    setWithdrawData(prevState => ({...prevState, amount:available}))
    if (amountEl.value > 0) {
      setAmountState("good");
    }
  };
  
  const handleChangeAddress = (_, value) => {
    setAddressValue(value);
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
    if (addressState === "good" && withdrawProviders?.current?.provider_type !== 'internal_network') {
      document.getElementsByName("amount")[0].focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active_trade_operation, amountState, addressState]);


  useEffect(() => {
    // Las cuentas anónimas son aquellas que su label es igual al provider_type de la red monetaria a la que pertenece la cuenta
    setAddressToAdd();
    const provider_type = current_wallet.currency;
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

  // Se resetea el valor del input de dirección cuando se cambia red
  useEffect(() => {
    if(!isEmpty(withdrawProviders) && !history.location.search){
      setAddressState()
      setAddressValue()
    }
  }, [withdrawProviders])

  const currencySymbol = currencies ? currencies[current_wallet.currency]?.symbol : current_wallet.currency

  const formProps = {
    setAddressState,
    handleChangeAddress,
    addressValue,
    currencySymbol,
    tagWithdrawAccount,
    addressState,
    setAddressValue,
    addressToAdd,
    deleteTag,
    setAmountState,
    handleChangeAmount,
    amountState,
    handleMaxAvailable,
    amountValue:amount,
    active_trade_operation,
    current_wallet,
    priority:props.priority,
    setIsOpenPanel,
    isMobile,
    provider,
    withdrawProviders,
    setNetworkProvider
  }

  const panelHProps = {
    currencySymbol,
    createWithdraw,
    amountState,
    addressState,
    isOpenPanel,
    setIsOpenPanel,
    addressValue,
    withdrawConfirmed,
    isMobile,
  } 

  if(isEmpty(withdrawProviders.current)){
    return<SelectWithdrawNetwork uiName={`Selecciona la red por la que deseas enviar ${current_wallet?.currency?.toUpperCase()}`} callback={setNetworkProvider}/>
  }

  return ( 
    <> 
      {props?.children}
      <AvailableWithdrawNetwork currentNetwork={withdrawProviders.current} callback={setNetworkProvider}/>
      <CriptoWithdrawForm>  
        <WithdrawFormComponent
          {...formProps}
        />
          <PanelHelper
            {...props} 
            {...panelHProps}
          />
      </CriptoWithdrawForm>
    </>
  ); 
};


