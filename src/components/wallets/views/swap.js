import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import SimpleLoader from '../../widgets/loaders'
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
import { AvailableBalance, WithdrawForm } from './withdrawCripto'

function SwapView(props) {
  const [value, setValue] = useState(undefined)
  const [active, setActive] = useState(undefined)
  // const [pairId, setPairId] = useState()
  const [totalValue, setTotalValue] = useState()
  // const [loaderButton, setLoaderButton] = useState()

  const { currentPair } = props
  const { currentWallet, availableBalance, currencyPairs } = useWalletInfo()
  const prevCurrentPair = usePrevious(currentPair)
  const { isMovilViewport } = useWindowSize()
  const actions = useActions()
  const { selectPair, isReady } = usePairSelector({ ...props, actions, currentWallet, currencyPairs })
  const isFiat = currentWallet.currency_type === 'fiat'

  useEffect(() => {
    selectPair(true)
    const { local_currency } = props
    actions.getDefaultPair(currentWallet, local_currency, currentPair)
  }, [])

  useEffect(() => {
    if (value && prevCurrentPair && prevCurrentPair.current_pair) {
      if (prevCurrentPair.current_pair.secondary_coin !== currentPair.secondary_coin) {
        swap()
      }
    }
  })

  useEffect(() => {
    callToSetTotalValue()
    callToShouldActiveButton()
  }, [value, currentPair, isReady])

  const callToSetTotalValue = async () => {
    const totalValue = value ? await getTotalValue() : undefined
    setTotalValue(totalValue)
  }

  const callToShouldActiveButton = async () => {
    const formatValue = await formatToCurrency(value, currentWallet.currency)
    setActive(formatValue.isLessThanOrEqualTo(availableBalance))
  }

  const handleChange = async (name, newValue) => {
    if (!currentPair.secondary_value) return
    if (newValue === '') return setValue(undefined)
    const valueAfterDot = newValue.split(".")

    // limit to only one "."
    if(valueAfterDot.length > 2) {
      document.getElementsByName(name)[0].value = valueAfterDot[0] + "."
      return 
    }
    
    let shouldSetElement = true
    if (valueAfterDot[1] === '' || RegExp('^[0]+$').test(valueAfterDot[1])) {
      shouldSetElement = false
    }

    newValue = String(newValue).replace(/[^0-9,.]/g, '').replace(/,/g, '')
    const formatedValue = await formatToCurrency(newValue, currentWallet.currency)
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
    await swap()
    actions.confirmationModalToggle()
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
    <form id="swapForm" className={`SwapView itemWalletView ${isMovilViewport ? 'movil' : ''}`} onSubmit={startSwap}>

      {
        loader &&
        <LoaderTrade
          label="Procesando tu cambio"
        />
      }

      <InputForm
        type="text"
        placeholder="Escribe la cantidad"
        name="sell-amount"
        handleChange={handleChange}
        label={`Pago con: ${currentWallet.currency.currency}`}
        disabled={loader}
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
        type="text"
        placeholder="Total a recibir"
        name="buy-amount"
        value={totalValue}
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
        {
          !totalValue &&
          <CoinPrice>1 {short_name} = {!secondary_value ? 'Sin Cotización' : secondary_value} {secondary_coin}</CoinPrice>
        }
      </div>

      <ControlButton
        loader={loader}
        formValidate={shouldActiveInput && totalValue && totalValue !== '0'}
        label="Cambiar"
      />
    </form>

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

const SwapViewLoader = () => {

  return (
    <>
      <WithdrawForm>
        <InputForm skeleton />
        <InputForm skeleton />
        <ControlButton
          formValidate={false}
          label="Enviar"
        />
      </WithdrawForm>
    </>
  )
}

function mapStateToProps(state, props) {
  const { pairsForAccount } = state.ui.current_section.params
  const { user, wallets, all_pairs } = state.modelData
  const { params } = props.match
  const current_wallet = wallets[params.account_id]
  const currentPair = {
    pair_id: (current_wallet && pairsForAccount[current_wallet.id]) && pairsForAccount[current_wallet.id].current_pair.pair_id,
    secondary_coin: current_wallet && pairsForAccount[current_wallet.id] && pairsForAccount[current_wallet.id].current_pair.currency,
    secondary_value: current_wallet && pairsForAccount[current_wallet.id] && pairsForAccount[current_wallet.id].current_pair.currency_value
  }

  return {
    loader: state.isLoading.loader,
    user,
    wallets,
    all_pairs,
    short_name: state.ui.current_section.params.short_name,
    local_currency: state.modelData.pairs.localCurrency,
    currencies: state.modelData.currencies,
    currentPair
  }
}
export default connect(mapStateToProps)(SwapView)
