import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import InputForm from "../../widgets/inputs/inputForm";
import convertCurrencies, { formatToCurrency} from "../../../utils/convert_currency";
import { formatNumber } from "../../../utils";
import usePrevious from "../../hooks/usePreviousValue";
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


function SwapView(props) {

  const [coinsendaServices] = useCoinsendaServices();
  const [value, setValue] = useState(undefined);
  const [active, setActive] = useState(undefined);
  // const [shouldActiveButton, setShouldActiveButton] = useState(true);
  // // const [pairId, setPairId] = useState()
  const [ valueToReceive, setValueToReceive ] = useState();
  const [ loaderButton, setLoaderButton ] = useState();
  const [ exchangeEnabled, setExchangeEnabled ] = useState()
  const [ toastMessage ] = useToastMessage()
  const [ valueForOne, setValueForOne ] = useState()
  // const [minAmountByOrder, setMinAmountByOrder] = useState({
  //   minAmount: 0,
  //   currencyCode: "",
  // });
  // const [valueError, setValueError] = useState();
  const actions = useActions();
  const idForClickeableElement = useKeyActionAsClick(true, "make-swap-button", 13, false);
  const idForClickeableElementPairSelector = useKeyActionAsClick(true, "show-pairs-button", 112, false);

  // const { currentPair } = props;
  const { currentWallet, availableBalance, currencyPairs, currentPair, WalletCurrencyShortName } = useWalletInfo();
  // const prevCurrentPair = usePrevious(currentPair);
  const { isMovilViewport } = useWindowSize();
  const { selectPair, isReady } = usePairSelector({ ...props, actions, currentWallet, currencyPairs });
  const isFiat = currentWallet.currency_type === "fiat";




  useEffect(() => {
    selectPair(true);
    const { local_currency } = props;
    if(!currentPair){
      coinsendaServices.getDefaultPair(currentWallet, local_currency, currentPair);
    }
  }, []);

  useEffect(() => {
    callToSetReceiveValue()
  }, [value, currentPair])

  useEffect(()=>{
    callToSetValueForOne()
  }, [currentPair])


  const callToSetValueForOne = async() => {
    if(!currentPair){return}
    const { id } = currentPair;
    const _valueForOne =  await coinsendaServices.convertCurrencies('1', currentWallet.currency, id)
    const { data: { want_to_spend, to_spend_currency } } = _valueForOne
    const formatValue = formatToCurrency(want_to_spend, to_spend_currency);
    setValueForOne(formatValue.toFormat())
  }



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

  const handleStateSpendInput = (state) => {
    // listener de estado del input de la moneda gastada: "Pago con:" solo se valida si la moneda gastada es la moneda secundaria del par,
    // ya que ya viene validada con el monto mínimo expresado en la misma dentro del modelo pair.exchange...min_amount
    const isSecondaryCurrency = currentWallet.currency.currency === currentPair.secondary_currency.currency
    if(isSecondaryCurrency){
      setExchangeEnabled(state)
    }
  }

  const handleStateBoughtInput = (state) => {
    const isSecondaryCurrency = currentPair.boughtCurrency === currentPair.secondary_currency.currency
    if(isSecondaryCurrency){
      setExchangeEnabled(state)
    }
  }


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
    const newSwap = await coinsendaServices.addNewSwap(currentWallet.id, id, value);
    actions.isAppLoading(false);
    if (!newSwap) {
      return handleError("No se ha podio hacer el cambio");
    }
  };


  const startSwap = async (e) => {
    e && e.preventDefault();
    setLoaderButton(true);
    await swap();
    actions.confirmationModalToggle();
    setLoaderButton(false);
  };


  const swap = async () => {
    const { boughtCurrency, id } = currentPair;
    const spent_currency_amount = await formatToCurrency( value, currentWallet.currency);
    let query = `{"where":{"id":"${id}"}}`;
    await coinsendaServices.updateCurrentPair(query);
    const secureTotalValue = await getReceiveValue(value);
    actions.confirmationModalPayload({
      title: "Confirmando Intercambio",
      txtPrimary: "Confirmar Intercambio",
      txtSecondary: "Cancelar",
      payload: "aa",
      action: confirmSwap,
      img: "swap",
      type: "swap",
      from: currentWallet.currency.currency,
      to: boughtCurrency,
      handleSwap: swap,
      spent: spent_currency_amount.toFormat(),
      bought: secureTotalValue.toFormat(),
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

  const { short_name, loader } = props;
  // const shouldActiveInput = active && secondary_coin && availableBalance > 0 && value > 0;

  if ((!currentPair || currentPair && !currentPair.boughtCurrency) || !currentWallet) {
    return <SwapViewLoader />;
  }
  // console.log('|||||||||||||| valueToReceive :', valueToReceive, !valueToReceive)
  const { boughtCurrency } = currentPair;

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
        handleStatus={handleStateSpendInput}
        setMaxWithActionKey={true}
        label={`Pago con: ${currentWallet.currency.currency}`}
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
        handleStatus={handleStateBoughtInput}
        state={exchangeEnabled}
        isControlled={true}
        label={`Recibo aproximadamente:`}
        disabled={loader}
        readOnly={true}
        SuffixComponent={() => (
          <PairSelect
            id={idForClickeableElementPairSelector}
            selectPair={selectPair}
            secondaryCoin={boughtCurrency}
          />
        )}
      />

      <div>
        <CoinPrice className="fuente2">
          1 {WalletCurrencyShortName} ={" "}
          {!valueForOne ? "Sin Cotización" : valueForOne}{" "}
          {boughtCurrency}
        </CoinPrice>
      </div>

      <ControlButton
        id={idForClickeableElement}
        handleAction={startSwap}
        loader={loaderButton || loader}
        formValidate={(exchangeEnabled === 'good' && valueToReceive) ? true : false}
        label="Cambiar"
      />
    </SwapForm>
  );
}

const PairSelect = ({ selectPair, secondaryCoin, id }) => {

  const showSubfix = window.innerWidth > 900;

  return(
    <div
      id={id}
      className="coinBalance2 fuente2"
      onClick={() => selectPair(false)}
      >
        <div className="coinB2">
          <i className="fas fa-angle-down"></i>
          <p>{secondaryCoin}</p>
          {showSubfix && <span className="subfix-pairs-button">[P]</span>}
          {secondaryCoin && (
            <img
              src={require(`../../../assets/coins/${secondaryCoin}.png`)}
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
  color: gray;
  margin: 0;
  position: absolute;
  @media only screen and (max-width: 768px) {
    font-size: 14px !important;
  }
`;

const SwapForm = styled(OperationForm)`
  grid-template-rows: 1fr ${(props) => (!props.isMovilViewport ? "30px" : "")} 1fr 20px 1fr;
  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

const SwapViewLoader = () => {
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
  const { wallets, all_pairs } = state.modelData;
  const { params } = props.match;
  const current_wallet = wallets[params.account_id];

  return {
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
