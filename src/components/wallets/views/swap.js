import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import SimpleLoader from '../../widgets/loaders'
import LoaderTrade from '../../widgets/loaders/loaderTrade'
import InputForm from '../../widgets/inputs/inputForm'
import { mensaje } from '../../../utils'
import convertCurrencies, { formatToCurrency } from '../../../utils/convert_currency'
import usePrevious from '../../hooks/usePreviousValue'
import useWindowSize from '../../../hooks/useWindowSize'
import { useWalletInfo } from '../../../hooks/useWalletInfo'
import styled from 'styled-components'
import ControlButton from '../../widgets/buttons/controlButton'
import { usePairSelector } from '../../../hooks/usePairSelector'
import { useActions } from '../../../hooks/useActions'
import { AvailableBalance } from './withdrawCripto'

function SwapView(props) {
  const [value, setValue] = useState()
  const [active, setActive] = useState()
  // const [pairId, setPairId] = useState()
  const [totalValue, setTotalValue] = useState()
  // const [loaderButton, setLoaderButton] = useState()

  const { currentPair } = props
  const { currentWallet, availableBalance, currencyPairs } = useWalletInfo()
  const prevCurrentPair = usePrevious(currentPair)
  const { isMovilViewport } = useWindowSize()
  const actions = useActions()
  const { selectPair } = usePairSelector({ ...props, actions, currentWallet, currencyPairs })

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
  }, [value, currentPair])

  const callToSetTotalValue = async () => {
    const totalValue = value ? await getTotalValue() : null
    const element = document.getElementsByName('buy-amount')[0]
    if (element) {
      element.value = totalValue ? `${totalValue} ${secondary_coin}`: null
    }
    setTotalValue(totalValue)
  }

  const handleChange = async (newValue) => {
    if (!currentPair.secondary_value) return
    const _isNaN = isNaN(newValue) || newValue === 'NaN'

    if (_isNaN) {
      return
    }

    if (currentWallet.currency_type === 'fiat') {
      newValue = String(newValue).replace(/,/g, '') || '0'
    } else {
      newValue = await formatToCurrency(newValue, currentWallet.currency)
    }

    setValue(currentWallet.currency_type === 'fiat' ? newValue : newValue.toNumber())
    setActive(parseFloat(newValue) <= parseFloat(availableBalance) ? true : false)
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
    let totalValue = await convertCurrencies(currentWallet.currency, value, pair_id)
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
    const totalValue = await getTotalValue(value)
    setTotalValue(totalValue)

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
      bought: totalValue,
      pair_id
    })
  }

  const handleMaxAvailable = (e) => {
    const amount = document.getElementsByName('sell-amount')[0]
    amount.value = availableBalance
  }

  const { short_name, loader } = props
  const { secondary_coin, secondary_value } = currentPair

  const shouldActiveInput = (active && secondary_coin) && (availableBalance > 0 && value > 0)

  if (!currentWallet) {
    return (
      <SimpleLoader
        label="Consultando Billetera"
      />
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
        handleStatus={() => null}
        handleChange={handleChange}
        label={`Pago con: ${currentWallet.currency.currency}`}
        disabled={loader}
        SuffixComponent={() => <AvailableBalance
          handleAction={handleMaxAvailable}
          amount={availableBalance} />}
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
        handleStatus={() => null}
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
        formValidate={shouldActiveInput && totalValue}
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
