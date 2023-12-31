/* eslint-disable react-hooks/exhaustive-deps */
// import BigNumber from "bignumber.js";
// import usePrevious from "../../hooks/usePreviousValue";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import InputForm from "../../widgets/inputs/inputForm";
import { formatToCurrency} from "../../../utils/convert_currency";
// import { formatNumber } from "../../../utils";
import useWindowSize from "../../../hooks/useWindowSize";
import { useWalletInfo } from "../../../hooks/useWalletInfo";
import styled from "styled-components";
import ControlButton from "../../widgets/buttons/controlButton";
import { usePairSelector } from "../../../hooks/usePairSelector";
import { useActions } from "../../../hooks/useActions";
import { OperationForm } from '../styles'
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import useToastMessage from '../../../hooks/useToastMessage'
import { getCdnPath } from '../../../environment'
import { useFormatCurrency } from "hooks/useFormatCurrency";
import { useSelector } from "react-redux";
import AvailableBalance from '../../widgets/availableBalance'
import { CURRENCY_INDEX_IMG } from 'core/config/currencies' 
import { checkIfFiat, parseSymbolCurrency } from 'core/config/currencies';

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
    const { buy_price, secondary_currency, primary_currency } = currentPair;
    const finalString = `1 ${currencies[primary_currency]?.symbol || primary_currency} = ${await formatCurrency(buy_price, secondary_currency)} ${parseSymbolCurrency(secondary_currency)?.toUpperCase()}`;
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
  //   const isSecondaryCurrency = currentWallet.currency === currentPair.secondary_currency
  //   if(isSecondaryCurrency){
  //     setExchangeEnabled(state)
  //   }
  // }

  // const handleStateBoughtInput = (state) => {
  //   const isSecondaryCurrency = currentPair.boughtCurrency === currentPair.secondary_currency
  //   if(isSecondaryCurrency){
  //     setExchangeEnabled(state)
  //   }
  // }

  const handleChangeSpendAmount = async (name, newValue) => {
    // console.log('handleChangeSpendAmount', newValue)
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
    const newSwap = await coinsendaServices.addNewSwap(currentWallet.id, id, formatToCurrency(value, currentWallet.currency));
    if (!newSwap) {
      actions.isAppLoading(false);
      return handleError("No se ha podio hacer el cambio");
    }
  };

  const createAccount = async(boughtCurrency) => {
    const res = await coinsendaServices.createAccountAndInsertDepositProvider({ currency:boughtCurrency });
    return res
  }

  const getAccountToExist = async(boughtCurrency) => {
    for (let [ , wallet] of Object.entries(props.wallets)) {
      console.log('walletxist', boughtCurrency, wallet.currency)
      if(wallet.currency === boughtCurrency)return wallet;
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

    const { id } = currentPair;
    const spent_currency_amount = formatToCurrency(value, currentWallet.currency);
    await coinsendaServices.updateCurrentPair({id});

    const secureTotalValue = await getReceiveValue(value);
    const from = currencies ? parseSymbolCurrency(currencies[currentWallet.currency]?.symbol).toUpperCase() : parseSymbolCurrency(currentWallet.currency)?.toUpperCase()
    const to = currencies ? parseSymbolCurrency(currencies[boughtCurrency]?.symbol).toUpperCase() : parseSymbolCurrency(boughtCurrency)?.toUpperCase()
    const isFiat = checkIfFiat(currentWallet?.currency)
    
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
      setValue(amountValue.toString());
    });
  };

  const { loader } = props;
  // const shouldActiveInput = active && secondary_coin && availableBalance > 0 && value > 0;

  if ((!currentPair || (currentPair && !currentPair.boughtCurrency)) || !currentWallet) {
    return <SkeletonSwapView />;
  }
  const { boughtCurrency } = currentPair;


  const spentCurrencySymbol = currencies ? currencies[currentWallet?.currency]?.symbol : currentWallet?.currency?.toUpperCase()

// console.log('exchangeEnabled', exchangeEnabled)

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
        inputMode="numeric"
        placeholder={isMovilViewport ? `Monto` : `Escribe la cantidad`}
        name="spend-amount"
        value={value}
        handleChange={handleChangeSpendAmount}
        handleStatus={handleStatus}
        setMaxWithActionKey={true} 
        label={`Pago con ${parseSymbolCurrency(spentCurrencySymbol)}`}
        disabled={loader}
        autoFocus={true}
        autoComplete="off"
        SuffixComponent={({ id }) => (
          <AvailableBalance
            id={id}
            handleAction={handleMaxAvailable}
            amount={availableBalance}
            wallet={currentWallet}
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
 



const PairSelect = ({ selectPair = () => null, secondaryCoin, id, currencies }) => {

  const showSubfix = window.innerWidth > 900;
  const { keyActions } = useSelector((state) => state.ui);

  const boughtCurrencySymbol = currencies ? currencies[secondaryCoin]?.symbol : secondaryCoin
  const imgCoin = CURRENCY_INDEX_IMG[secondaryCoin] || secondaryCoin

  return(
    <PairSelectContainer
      id={id}
      className="coinBalance2 fuente2"
      onClick={() => selectPair(false)}
      >
        <div>
          <i className="fas fa-angle-down"></i>
          <p>{parseSymbolCurrency(boughtCurrencySymbol) || '...'}</p>
          {(showSubfix && keyActions) && <span className="subfix-pairs-button">[P]</span>}
          { boughtCurrencySymbol  && (
            <img
              src={`${getCdnPath('assets')}coins/${secondaryCoin === 'cop' ? 'cop.svg' : `${imgCoin}.png`}`}
              alt=""
              width="30"
            />
          )}
        </div>
      </PairSelectContainer>
  )
}

const PairSelectContainer = styled.div`
  cursor: pointer;
  position: absolute;
  display: flex;
  right: 5px;
  color: gray;
  height: 100%;
  display: flex;
  align-items: center;
  transition: 0.15s;
  transform: scale(1);
  &:hover{
    color: #b48728;
  }

  div:first-child{
    display: flex;
    align-items: center;
    width: auto;
    min-width: 70px;
    position: relative;
    height: 60%;
    border-left: 1px solid gray;
    padding-left: 14px;
    justify-content: space-between;
    column-gap: 5px;
  }

`


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

  .middleSection{
    font-size: 26px;
    align-items: center;
    justify-content: center;
    display: flex;
    position: relative;
    i{
      position: absolute;
      bottom: -15px;
      color: var(--paragraph_color);
    }
  }

  @media (max-width: 768px) {
    background:transparent;
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
