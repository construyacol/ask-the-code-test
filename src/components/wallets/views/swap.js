import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js'
import LoaderTrade from '../../widgets/loaders/loaderTrade'
import InputForm from '../../widgets/inputs/inputForm'
import { mensaje, formatNumber } from '../../../utils'
import convertCurrencies, { formatToCurrency } from '../../../utils/convert_currency'
import usePrevious from '../../hooks/usePreviousValue'
import useWindowSize from '../../../hooks/useWindowSize'
import { useWalletInfo } from '../../../hooks/useWalletInfo'
import styled from 'styled-components'
import ControlButton from '../../widgets/buttons/controlButton'
import { usePairSelector } from '../../../hooks/usePairSelector'
import { useActions } from '../../../hooks/useActions'
import { AvailableBalance, OperationForm } from './withdrawCripto'

function SwapView(props) {
  const [value, setValue] = useState(undefined)
  const [active, setActive] = useState(undefined)
  // const [pairId, setPairId] = useState()
  const [totalValue, setTotalValue] = useState()
  const [loaderButton, setLoaderButton] = useState()
  const [minAmountByOrder, setMinAmountByOrder] = useState({
    minAmount: 0,
    currencyCode: ""
  })
  const [valueError, setValueError] = useState()
  const actions = useActions()

  const { currentPair } = props
  const { currentWallet, availableBalance, currencyPairs } = useWalletInfo()
  const prevCurrentPair = usePrevious(currentPair)
  const { isMovilViewport } = useWindowSize()
  const { selectPair, isReady } = usePairSelector({ ...props, actions, currentWallet, currencyPairs })
  const isFiat = currentWallet.currency_type === 'fiat'

  useEffect(() => {
    selectPair(true)
    const { local_currency } = props
    actions.getDefaultPair(currentWallet, local_currency, currentPair)
  }, [])

  useEffect(() => {
    if (currentPair && currentPair.pair_id) {
      const _minAmountByOrder = props.all_pairs[currentPair.pair_id].exchange.min_order
      setMinAmountByOrder({
        currencyCode: _minAmountByOrder.currency.currency,
        minAmount: _minAmountByOrder.min_amount
      })
    } else {
      setMinAmountByOrder({
        minAmount: 0,
        currencyCode: ""
      })
    }
    if (value && prevCurrentPair && prevCurrentPair.current_pair) {
      if (prevCurrentPair.current_pair.secondary_coin !== currentPair.secondary_coin) {
        swap()
      }
    }
  }, [currentPair])

  useEffect(() => {
    callToSetTotalValue()
    callToShouldActiveButton()
  }, [value, currentPair, isReady])

  useEffect(() => {
    if (currentPair && currentPair.secondary_coin) {
      const conditionForText = currentPair.secondary_coin === minAmountByOrder.currencyCode
      let actualValue = (conditionForText ? totalValue : value) || ''
      actualValue = new BigNumber(actualValue.replace(/,/g, ''))
      if (actualValue.isLessThan(minAmountByOrder.minAmount)) {
        let text = ''
        if (conditionForText) {
          text = `a recibir (${minAmountByOrder.minAmount} ${minAmountByOrder.currencyCode.toUpperCase()})`
        } else {
          text = `(${minAmountByOrder.minAmount} ${minAmountByOrder.currencyCode.toUpperCase()})`
        }
        setValueError({
          text: `Error: El monto a pagar es menor que el valor mínimo ${text}`
        })
      } else {
        setValueError(null)
      }
    }
  }, [totalValue, value, currentPair])

  const callToSetTotalValue = async () => {
    const totalValue = value ? await getTotalValue() : undefined
    setTotalValue(totalValue)
  }

  const callToShouldActiveButton = async () => {
    const formatValue = await formatToCurrency(value, currentWallet.currency)
    setActive(formatValue.isLessThanOrEqualTo(availableBalance))
  }

  const handleChangeBuyAmount = (name, newValue, setInputState) => {
    if (newValue !== '' && newValue !== '0' && !valueError && active) {
      setInputState('good')
    } else {
      setInputState('bad')
    }
  }

  const handleChangeSellAmount = async (name, newValue, setInputState, isOnlyTypingValidation = false) => {
    if (!currentPair.secondary_value) return
    if (newValue === '') return setValue(undefined)
    newValue = String(newValue).replace(/[^0-9,.]/g, '').replace(/,/g, '')

    const formatedValue = await formatToCurrency(newValue, currentWallet.currency)
    const isGood = formatedValue.isGreaterThan(0) && formatedValue.isLessThanOrEqualTo(availableBalance)

    setInputState(isGood ? 'good' : 'bad')

    if (isOnlyTypingValidation) return

    const valueAfterDot = newValue.split(".")

    // limit to only one "."
    if (valueAfterDot.length > 2) {
      document.getElementsByName(name)[0].value = valueAfterDot[0] + "."
      return
    }

    let shouldSetElement = true
    if (valueAfterDot[1] === '' || RegExp('^[0]+$').test(valueAfterDot[1])) {
      shouldSetElement = false
    }

    const element = shouldSetElement ? document.getElementsByName(name)[0] : {}

    if (isNaN(formatedValue) || formatedValue === 'NaN' || formatedValue.toNumber() === 0) {
      return window.requestAnimationFrame(() => {
        if (formatedValue.toNumber() === 0) {
          setValue(0)
        }
        element.value = isFiat ? formatNumber(newValue) : newValue
      })
    }

    window.requestAnimationFrame(() => {
      element.value = isFiat ? formatNumber(formatedValue.toString()) : formatedValue.toString()
      setValue(formatedValue.toString())
    })
  }

  const handleError = msg => {
    mensaje(msg, 'error')
  }

  const confirmSwap = async () => {
    actions.isAppLoading(true)

    await actions.get_swaps(currentWallet.id)

    const { pair_id } = currentPair
    const newSwap = await actions.addNewSwap(currentWallet.id, pair_id, value)
    if (!newSwap) {
      return handleError('No se ha podio hacer el cambio')
    }
  }

  const getTotalValue = async () => {
    const { pair_id } = currentPair
    if (value === undefined) return undefined
    const totalValue = await convertCurrencies(currentWallet.currency, value, pair_id)
    if (!totalValue) { return false }
    return totalValue.want_to_spend
  }

  const startSwap = async (e) => {
    e.preventDefault()
    setLoaderButton(true)
    await swap()
    actions.confirmationModalToggle()
    setLoaderButton(false)
  }


  const swap = async () => {
    const { secondary_coin, pair_id } = currentPair
    let query = `{"where":{"id":"${pair_id}"}}`
    await actions.updateCurrentPair(query)

    const spent_currency_amount = await formatToCurrency(value, currentWallet.currency, true)
    const secureTotalValue = await getTotalValue(value)

    actions.confirmationModalPayload({
      title: "Confirmando Intercambio",
      txtPrimary: "Confirmar Intercambio",
      txtSecondary: "Cancelar",
      payload: 'aa',
      action: (confirmSwap),
      img: "swap",
      type: "swap",
      from: currentWallet.currency.currency,
      to: secondary_coin,
      handleSwap: swap,
      spent: spent_currency_amount,
      bought: secureTotalValue,
      pair_id
    })
  }

  const handleMaxAvailable = (e) => {
    window.requestAnimationFrame(() => {
      const amount = document.getElementsByName('sell-amount')[0]
      amount.value = isFiat ? formatNumber(availableBalance) : availableBalance
      setValue(availableBalance)
    })
  }

  const { short_name, loader } = props
  const { secondary_coin, secondary_value } = currentPair

  const shouldActiveInput = (active && secondary_coin) && (availableBalance > 0 && value > 0)

  if (!currentWallet || !currentPair || !secondary_coin) {
    return (
      <SwapViewLoader />
    )
  }

  return (
    <SwapForm id="swapForm" className={`${isMovilViewport ? 'movil' : ''}`} onSubmit={startSwap}>

      {
        loader &&
        <LoaderTrade
          label="Procesando tu cambio"
        />
      }

      <InputForm
        classes="fuente2"
        type="text"
        placeholder="Escribe la cantidad"
        name="sell-amount"
        value={value}
        handleChange={handleChangeSellAmount}
        label={`Pago con: ${currentWallet.currency.currency}`}
        disabled={loader}
        customError={valueError}
        SuffixComponent={() => <AvailableBalance
          handleAction={handleMaxAvailable}
          amount={isFiat ? formatNumber(availableBalance) : availableBalance} />}
      />

      {
        !isMovilViewport &&
        <div className="middleSection">
          <i className="fas fa-retweet"></i>
        </div>
      }

      <InputForm
        classes="fuente2"
        type="text"
        placeholder="Total a recibir"
        name="buy-amount"
        value={totalValue}
        handleChange={handleChangeBuyAmount}
        isControlled={true}
        label={`Total a recibir:`}
        disabled={loader}
        readOnly={true}
        SuffixComponent={() => <PairSelect
          selectPair={selectPair}
          secondaryCoin={secondary_coin}
        />}
      />

      <div>
        <CoinPrice>1 {short_name} = {!secondary_value ? 'Sin Cotización' : secondary_value} {secondary_coin}</CoinPrice>
      </div>

      <ControlButton
        loader={loaderButton}
        formValidate={shouldActiveInput && totalValue && totalValue !== '0' && !valueError}
        label="Cambiar"
      />
    </SwapForm>

  )
}

const PairSelect = ({ selectPair, secondaryCoin }) => (
  <div className="coinBalance2 fuente2" onClick={() => selectPair(false)} >
    <div className="coinB2">
      <i className="fas fa-angle-down"></i>
      <p>{secondaryCoin}</p>
      {
        secondaryCoin &&
        <img src={require(`../../../assets/coins/${secondaryCoin}.png`)} alt="" width="30" />
      }
    </div>
  </div>
)


const CoinPrice = styled.p`
  color: gray;
  margin: 0;
  position: absolute;
  @media only screen and (max-width: 768px) {
    font-size: 14px !important;
  }
`

const SwapForm = styled(OperationForm)`
  grid-template-rows: 1fr 30px 1fr 20px 1fr;
`

const SwapViewLoader = () => {

  return (
    <SwapForm>
      <InputForm skeleton />
      <div></div>
      <InputForm skeleton />
      <div></div>
      <ControlButton
        formValidate={false}
        label="Enviar"
      />
    </SwapForm>
  )
}

function mapStateToProps(state, props) {
  const { pairsForAccount } = state.ui.current_section.params
  const { wallets, all_pairs } = state.modelData
  const { params } = props.match
  const current_wallet = wallets[params.account_id]

  const currentPair = {
    pair_id: (current_wallet && pairsForAccount[current_wallet.id]) && pairsForAccount[current_wallet.id].current_pair.pair_id,
    secondary_coin: current_wallet && pairsForAccount[current_wallet.id] && pairsForAccount[current_wallet.id].current_pair.currency,
    secondary_value: current_wallet && pairsForAccount[current_wallet.id] && pairsForAccount[current_wallet.id].current_pair.currency_value
  }

  return {
    loader: state.isLoading.loader,
    all_pairs,
    short_name: state.ui.current_section.params.short_name,
    local_currency: state.modelData.pairs.localCurrency,
    currencies: state.modelData.currencies,
    currentPair
  }
}
export default connect(mapStateToProps)(SwapView)
