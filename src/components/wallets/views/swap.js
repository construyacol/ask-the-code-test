/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// import BigNumber from "bignumber.js";
import InputForm from "../../widgets/inputs/inputForm";
import { formatToCurrency} from "../../../utils/convert_currency";
import { formatNumber } from "../../../utils";
// import usePrevious from "../../hooks/usePreviousValue";
import useWindowSize from "../../../hooks/useWindowSize";
import { useWalletInfo } from "../../../hooks/useWalletInfo";
import styled from "styled-components";
import ControlButton from "../../widgets/buttons/controlButton";
import { usePairSelector } from "../../../hooks/usePairSelector";
import { useActions } from "../../../hooks/useActions";
import { AvailableBalance, OperationForm } from "./withdrawCripto";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import useToastMessage from '../../../hooks/useToastMessage'
// import UseTxState from "../../hooks/useTxState";
import { getCdnPath } from '../../../environment'
import { useFormatCurrency } from "../../hooks/useFormatCurrency";
import { useSelector } from "react-redux";



function SwapView(props) {

  const [coinsendaServices] = useCoinsendaServices();
  const [value, setValue] = useState(undefined);
  const [, formatCurrency] = useFormatCurrency();
  const [ valueToReceive, setValueToReceive ] = useState();
  const [ loaderButton, setLoaderButton ] = useState();
  const [ exchangeEnabled, setExchangeEnabled ] = useState()
  const [ toastMessage ] = useToastMessage()
  const [ valueForOnePrimaryCurrency, setValueForOnePrimaryCurrency ] = useState()
 
  const actions = useActions();
  const idForClickeableElement = useKeyActionAsClick(true, "make-swap-button", 13, false);
  const idForClickeableElementPairSelector = useKeyActionAsClick(true, "show-pairs-button", 112, false);

  const {
    currentWallet,
    availableBalance,
    currencyPairs,
    currentPair,
    currencies
  } = useWalletInfo();
  const { isMovilViewport } = useWindowSize();
  const { selectPair } = usePairSelector({ ...props, actions, currentWallet, currencyPairs });
  const isFiat = currentWallet.currency_type === "fiat";


  useEffect(() => {
    selectPair(true);
    const { local_currency } = props;
    if(!currentPair){
      coinsendaServices.getDefaultPair(currentWallet, local_currency, currentPair);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    callToSetReceiveValue()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, currentPair])


  const currentPairId = currentPair?.id

  const setDefaultValue = () => {
    let spendInput = document.querySelector('[name="spend-amount"]');
    if(spendInput && value){
      spendInput.value = null
      setValue("0");
    }
  }
  
  useEffect(() => {
    setDefaultValue()
  }, [currentPairId])


  async function getValueForOnePrimaryCurrency() {
    const { sell_price, secondary_currency, primary_currency } = currentPair;
    const finalString = `1 ${currencies[primary_currency?.currency]?.symbol || primary_currency.currency} = ${await formatCurrency(sell_price, secondary_currency)} ${secondary_currency.currency.toUpperCase()}`;
    setValueForOnePrimaryCurrency(finalString);
  }


  useEffect(() => {
    if(currentPair && currencies){
      getValueForOnePrimaryCurrency()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPair, currencies])



  const callToSetReceiveValue = async () => {
    const _valueToReceive = value ? await getReceiveValue() : undefined;
    if(!_valueToReceive){return}
    // console.log('||||||||||||||||||| _valueToReceive', _valueToReceive.toFormat(), _valueToReceive.toNumber())
    if (isNaN(_valueToReceive.toNumber()) || _valueToReceive.toNumber() === "NaN") {
      return setValueToReceive(0);
    }
    setValueToReceive(_valueToReceive.toFormat());
  };


  const getReceiveValue = async () => {
    const { id } = currentPair;
    if (value === undefined) return undefined;
    const result = await coinsendaServices.convertCurrencies(value, currentWallet.currency, id)
    if(!result){return console.log('No se pudo calcular la cantidad a recibir')}
    const { data: { want_to_spend, to_spend_currency } } = result
    const formatValue = formatToCurrency(want_to_spend, to_spend_currency);
    return formatValue
  }

  const handleStatus = state => {
    setExchangeEnabled(state)
  }

  // const handleStateSpendInput = (state) => {
  //   // listener de estado del input de la moneda gastada: "Pago con:" solo se valida si la moneda gastada es la moneda secundaria del par,
  //   // ya que ya viene validada con el monto mínimo expresado en la misma dentro del modelo pair.exchange...min_amount
  //   const isSecondaryCurrency = currentWallet.currency.currency === currentPair.secondary_currency.currency
  //   if(isSecondaryCurrency){
  //     setExchangeEnabled(state)
  //   }
  // }

  // const handleStateBoughtInput = (state) => {
  //   const isSecondaryCurrency = currentPair.boughtCurrency === currentPair.secondary_currency.currency
  //   if(isSecondaryCurrency){
  //     setExchangeEnabled(state)
  //   }
  // }


  const handleChangeSpendAmount = async (name, newValue) => {
    setValue(newValue.toString().replace(/,/g, ""))
  };

  const handleError = (msg) => {
    toastMessage(msg, "error");
  };

  const confirmSwap = async () => {
    actions.isAppLoading(true);
    if (!props.order_list) {
      await coinsendaServices.get_swaps(currentWallet.id);
    }
    const { id } = currentPair;
    const boughtCurrency = props.pairsForAccount[currentWallet.id] && props.pairsForAccount[currentWallet.id].current_pair.currency //Localizamos la moneda comprada
    const thisAccountToExist = await getAccountToExist(boughtCurrency) //verificamos que haya una cuenta para la moneda comprada existente
    if(!thisAccountToExist){
      await createAccount(boughtCurrency);
    }
    const newSwap = await coinsendaServices.addNewSwap(currentWallet.id, id, value);
    if (!newSwap) {
      actions.isAppLoading(false);
      return handleError("No se ha podio hacer el cambio");
    }
  };

  const createAccount = async(boughtCurrency) => {
    const res = await coinsendaServices.createAccountAndInsertDepositProvider({
      data: {
        currency:currencies[boughtCurrency].currency,
        enabled: true,
        short_currency:{
          currency:currencies[boughtCurrency].currency,
          is_token:currencies[boughtCurrency].is_token
        },
      }
    });
    return res
  }

  const getAccountToExist = async(boughtCurrency) => {
    for (var [ , wallet] of Object.entries(props.wallets)) {
      if(wallet.currency.currency === boughtCurrency){
        return wallet
      }
    }
  }


  const startSwap = async (e) => {
    e && e.preventDefault();
    setLoaderButton(true);
    await swap();
    actions.confirmationModalToggle();
    setLoaderButton(false);
  };


  const swap = async () => {

    const { secondary_currency, id } = currentPair;
    const spent_currency_amount = await formatToCurrency( value, currentWallet.currency);
    // let query = `{"where":{"id":"${id}"}}`;
    // await coinsendaServices.updateCurrentPair(query);
    await coinsendaServices.updateCurrentPair({id});

    const secureTotalValue = await getReceiveValue(value);
    const from = currencies ? currencies[currentWallet.currency.currency]?.symbol.toUpperCase() : currentWallet.currency.currency.toUpperCase()
    const to = currencies ? currencies[boughtCurrency]?.symbol.toUpperCase() : boughtCurrency.toUpperCase()
    const isFiat = currencies && currencies[secondary_currency.currency].currency_type === 'fiat'

    actions.confirmationModalPayload({
      title: "Confirmación de intercambio",
      txtPrimary: "Confirmar cambio",
      txtSecondary: "Cancelar",
      payload: "aa",
      action: confirmSwap,
      img: "swap",
      type: "swap",
      from,
      to,
      handleSwap: swap,
      spent: `${isFiat ? '$' : ''} ${spent_currency_amount.toFormat()}`,
      bought: `${secureTotalValue.toFormat()}`,
      id,
    });
  };


  const handleMaxAvailable = (e) => {
    window.requestAnimationFrame(async() => {
      const amount = document.getElementsByName("spend-amount")[0];
      let amountValue = formatToCurrency(availableBalance, currentWallet.currency);
      amount.value = amountValue.toFormat();
      setValue(availableBalance);
    });
  };

  const { loader } = props;
  // const shouldActiveInput = active && secondary_coin && availableBalance > 0 && value > 0;

  if ((!currentPair || (currentPair && !currentPair.boughtCurrency)) || !currentWallet) {
    return <SkeletonSwapView />;
  }
  const { boughtCurrency } = currentPair;


  const spentCurrencySymbol = currencies ? currencies[currentWallet?.currency?.currency]?.symbol : currentWallet?.currency?.currency?.toUpperCase()


  return (
    <SwapForm
      onSubmit={(e) => e.preventDefault()}
      isMovilViewport={isMovilViewport}
      id="swapForm"
      className={`${isMovilViewport ? "movil" : ""}`}
    >
      <InputForm
        classes="fuente2" 
        type="text"
        placeholder={isMovilViewport ? `Monto` : `Escribe la cantidad`}
        name="spend-amount"
        value={value}
        handleChange={handleChangeSpendAmount}
        handleStatus={handleStatus}
        setMaxWithActionKey={true}
        label={`Pago con ${spentCurrencySymbol}`}
        disabled={loader}
        autoFocus={true}
        autoComplete="off"
        SuffixComponent={({ id }) => (
          <AvailableBalance
            id={id}
            handleAction={handleMaxAvailable}
            amount={isFiat ? formatNumber(availableBalance) : availableBalance}
          />
        )}
      />

      {!isMovilViewport && (
        <div className="middleSection">
          <i className="fas fa-retweet"></i>
        </div>
      )}

      <InputForm
        classes="fuente2"
        type="text"
        placeholder="0"
        name="bought-amount"
        value={valueToReceive}
        state={exchangeEnabled}
        isControlled={true}
        label={`Recibo apróximadamente`}
        disabled={loader}
        readOnly={true}
        SuffixComponent={() => (
          <PairSelect
            id={idForClickeableElementPairSelector}
            selectPair={selectPair}
            secondaryCoin={boughtCurrency}
            currencies={currencies}
          />
        )}
      />

      <div>
        <CoinPrice className="fuente2">
          {valueForOnePrimaryCurrency}
        </CoinPrice>
      </div>

      <ControlButton
        id={idForClickeableElement}
        handleAction={startSwap}
        loader={loaderButton || loader}
        formValidate={(exchangeEnabled === 'good' && valueToReceive) ? true : false}
        label="Realizar intercambio"
      />
    </SwapForm>
  );
}

const PairSelect = ({ selectPair, secondaryCoin, id, currencies }) => {

  const showSubfix = window.innerWidth > 900;
  const { keyActions } = useSelector((state) => state.ui);


  const boughtCurrencySymbol = currencies ? currencies[secondaryCoin]?.symbol : secondaryCoin



  return(
    <div
      id={id}
      className="coinBalance2 fuente2"
      onClick={() => selectPair(false)}
      >
        <div className="coinB2">
          <i className="fas fa-angle-down"></i>
          <p>{boughtCurrencySymbol || '...'}</p>
          {(showSubfix && keyActions) && <span className="subfix-pairs-button">[P]</span>}
          { boughtCurrencySymbol  && (
            <img
              src={`${getCdnPath('assets')}coins/${secondaryCoin === 'cop' ? 'cop.svg' : `${secondaryCoin}.png`}`}
              alt=""
              width="30"
            />
          )}
        </div>
      </div>
  )
}
;

const CoinPrice = styled.p`
  color: var(--paragraph_color);
  margin: 0;
  position: absolute;
  @media only screen and (max-width: 768px) {
    font-size: 14px !important;
  }
`;

const SwapForm = styled(OperationForm)`
  grid-template-rows: 1fr ${(props) => (!props.isMovilViewport ? "30px" : "")} 1fr 20px 1fr;
  @media (max-width: 768px) {
    padding: 20px 0px;
    width: 100%;
  }
`;

export const SkeletonSwapView = () => {
  return (
    <SwapForm>
      <InputForm skeleton />
      <div></div>
      <InputForm skeleton />
      <div></div>
      <ControlButton formValidate={false} label="Enviar" />
    </SwapForm>
  );
};

function mapStateToProps(state, props) {
  const { pairsForAccount } = state.storage;
  const { wallets, all_pairs, user } = state.modelData;
  const { params } = props.match;
  const current_wallet = wallets[params.account_id];

  return {
    user,
    wallets,
    pairsForAccount,
    loader: state.isLoading.loader,
    all_pairs,
    short_name: state.ui.current_section.params.short_name,
    local_currency: state.modelData.pairs.localCurrency,
    order_list:
      state.storage.activity_for_account[current_wallet.id] &&
      state.storage.activity_for_account[current_wallet.id].swaps,
  };

}
export default connect(mapStateToProps)(SwapView);
