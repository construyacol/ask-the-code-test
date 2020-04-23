import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../../widgets/loaders'
import LoaderTrade from '../../widgets/loaders/loaderTrade'
import { InputFormCoin, ReadReceiveCoin } from '../../widgets/inputs'

import { ButtonForms } from '../../widgets/buttons/buttons'
import { matchItem, mensaje } from '../../../utils'
import convertCurrencies, { formatToCurrency } from '../../../utils/convert_currency'
import usePrevious from '../../hooks/usePreviousValue'

function SwapView(props) {

  const [value, setValue] = useState()
  const [address, setAddress] = useState()
  const [active, setActive] = useState()
  const [pairId, setPairId] = useState()
  const [totalValue, setTotalValue] = useState()
  const [loaderButton, setLoaderButton] = useState()

  const prevCurrentPair = usePrevious(props.current_pair)

  useEffect(() => {
    getOtherPairs(true)
    const { current_wallet, local_currency, current_pair } = props
    props.actions.getDefaultPair(current_wallet, local_currency, current_pair)
  }, [])

  useEffect(() => {
    if (prevCurrentPair && prevCurrentPair.current_pair && props.current_pair && prevCurrentPair.current_pair.secondary_coin !== props.current_pair.secondary_coin && value) {
      swap()
    }

  })

  const actualizarEstado_coin = async ({ target, preventDefault }) => {
    if (!props.current_pair.secondary_value) { return }
    let _value = target.value
    let { available, current_wallet } = props
    if (current_wallet.currency_type === 'fiat') {
      _value = String(target.value).replace(/,/g, '') || '0'
      if (isNaN(_value) || _value === 'NaN') {
        return preventDefault()
      }
    } else {
      _value = await formatToCurrency(target.value, current_wallet.currency)
      if (isNaN(_value.toNumber()) || _value.toNumber() === 'NaN') { return target.value = null }
    }
    
    setValue(current_wallet.currency_type === 'fiat' ? _value : _value.toNumber())
    setActive(parseFloat(_value) <= parseFloat(available) ? true : false)  }

  const actualizarEstado = (e) => {
    setAddress(e.target.value)
  }


  const getMaxAvailable = e => {
    const _value = e.target.id
    const { available } = props

    setValue(_value)
    setActive(parseFloat(_value) <= parseFloat(available) ? true : false)
  }


  const handleError = msg => {
    mensaje(msg, 'error')
  }


  const finish_swap = async () => {
    const {
      current_wallet,
      current_pair
    } = props

    props.actions.isAppLoading(true)
    await props.actions.get_swaps(current_wallet.id)
    // await props.actions.current_section_params({currentFilter:'swaps'})

    const { pair_id } = current_pair
    // let total_value = await getTotalValue(value)
    let new_swap = await props.actions.add_new_swap(current_wallet.id, pair_id, value)
    // console.log('!!!!!____________________________________________add_new_swap', new_swap)
    if (!new_swap) {
      return handleError('No se ha podio hacer el cambio')
    }

  }


  const getTotalValue = async (_value) => {
    const {
      current_wallet,
      current_pair
    } = props

    const { pair_id } = current_pair
    let totalValue = await convertCurrencies(current_wallet.currency, value, pair_id)
    if (!totalValue) { return false }

    setValue(_value)
    return totalValue.want_to_spend
  }

  const startSwap = async () => {
    setLoaderButton(true)
    await swap()
    props.actions.confirmationModalToggle()
    setLoaderButton(false)
  }


  const swap = async () => {
    const {
      current_wallet,
      current_pair
    } = props

    let query = `{"where":{"id":"${current_pair.pair_id}"}}`
    await props.actions.updateCurrentPair(query)

    const { secondary_coin, pair_id } = current_pair
    const spent_currency_amount = await formatToCurrency(value, current_wallet.currency, true)
    const totalValue = await getTotalValue(value)
    setTotalValue(totalValue)

    props.actions.confirmationModalPayload({
      title: "Confirmando Intercambio",
      txtPrimary: "Confirmar Intercambio",
      txtSecondary: "Cancelar",
      payload: 'aa',
      action: (finish_swap),
      img: "swap",
      type: "swap",
      from: current_wallet.currency.currency,
      to: secondary_coin,
      handleSwap: swap,
      spent: spent_currency_amount,
      bought: totalValue,
      pair_id
    })
  }

  const getOtherPairs = async (initial) => {
    const { current_wallet, currency_pairs } = props
    if (currency_pairs) return false

    const currency = current_wallet && current_wallet.currency.currency

    !initial && props.actions.toggleOtherModal()
    const pairs = await props.actions.getPairs(currency, null, true) || [];
    const _pairs = await props.actions.getPairs(null, currency, true) || [];

    const allPairs = [...pairs, ..._pairs]
    if(allPairs.length < 1 && !initial) {
      props.actions.toggleOtherModal()
    }

    const result = createListPairs(allPairs, currency)

    return props.actions.pairsForAccount(current_wallet.currency.currency, { all_pairs: result }, 'currency')
  }

  const createListPairs = async (allPairs, currency) => {
    const { currencies } = props

    if (!currencies) return false

    return allPairs.map( pair => {
      let name = null
      if(pair.primary_currency.currency === currency) {
        name = pair.secondary_currency.currency
      }

      if(pair.secondary_currency.currency === currency) {
        name = pair.primary_currency.currency
      }

      if(!name) return false

      const match = matchItem(currencies, {primary: name}, 'view')
      if(!match) return false

      return {
        ...match,
        pair_id: pair.id
      }
    })
  }


  const _getTotalValue = (totalValue) => {
    setTotalValue(totalValue)
  }




  const { current_wallet, short_name, loader, current_pair, available } = props
  const { secondary_coin, secondary_value } = current_pair
  let isMovilViewport = window.innerWidth < 768

    return (
    <> {
      !current_wallet ?
      <SimpleLoader
        label="Consultando Billetera"
      />
      :
      <form id="swapForm" className={`SwapView itemWalletView ${isMovilViewport ? 'movil' : ''}`}>

        {
          loader &&
          <LoaderTrade
            label="Procesando tu cambio"
          />
        }

        <div className="WSection1">
          <p className="fuente title soloAd3">Pago con: <span>{current_wallet.currency.currency}</span></p>
          <InputFormCoin
            useFiatInput={current_wallet.currency_type === 'fiat'}
            secondary_value={secondary_value}
            active={active && secondary_coin && available > 0 && value > 0}
            clase={true} //retiro los estilos que vienen por defecto
            placeholder="Escribe la cantidad"
            getMaxAvailable={getMaxAvailable}
            coin={short_name}
            saldoDisponible={available}
            name="name"
            value={value}
            actualizarEstado={actualizarEstado_coin}
          />
        </div>

        {
          !isMovilViewport &&
          <div className="middleSection">
            <i className="fas fa-retweet"></i>
          </div>
        }


        <div className="WSection1">
          <p className="fuente title soloAd3">Recibo:</p>

          <ReadReceiveCoin
            active={(active && secondary_coin) && (available > 0 && value > 0) && totalValue}
            clase={true} //retiro los estilos que vienen por defecto
            placeholder="Total a recibir"
            getMaxAvailable={getMaxAvailable}
            coin={short_name}
            secondary_value={secondary_value}
            getTotalValue={getTotalValue}
            primary_value={value}
            secondary_coin={secondary_coin}
            solo_lectura={true}
            quote_type="primary"
            account_type={current_wallet.currency_type}
            getOtherPairs={getOtherPairs}
            _getTotalValue={_getTotalValue}
            total_value={totalValue}
          />
        </div>

        <div className="WSection3">
          <ButtonForms
            active={(active && secondary_coin) && (available > 0 && value > 0) && totalValue}
            // active={(value>0 && value<=current_wallet.available) ? true : false}
            clases="cenVert"
            ancho="200px"
            type="primary"
            siguiente={startSwap}
            loader={loaderButton}
          >
            Cambiar
              </ButtonForms>
        </div>

      </form>
  }
    </>  )
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props) {
  const { pairsForAccount } = state.ui.current_section.params
  const { user, wallets, all_pairs, balances } = state.modelData
  const { params } = props.match
  const current_wallet = wallets[params.account_id]
  // console.log('Que carajo pasa con el convertidor', pairsForAccount)

  let current_pair = {
    pair_id: (current_wallet && pairsForAccount[current_wallet.id]) && pairsForAccount[current_wallet.id].current_pair.pair_id,
    secondary_coin: current_wallet && pairsForAccount[current_wallet.id] && pairsForAccount[current_wallet.id].current_pair.currency,
    secondary_value: current_wallet && pairsForAccount[current_wallet.id] && pairsForAccount[current_wallet.id].current_pair.currency_value
  }




  // console.log('||||||||||||||||||||||| CURRENT BY STATETOPROPS', current_wallet, pairsForAccount)

  return {
    loader: state.isLoading.loader,
    user: user,
    wallets,
    all_pairs,
    swaps: state.modelData.swaps,
    current_wallet,
    short_name: state.ui.current_section.params.short_name,
    local_pairs: state.modelData.pairs.collections || null,
    quote_type: state.ui.current_section.params.quote_type,
    local_currency: state.modelData.pairs.localCurrency,
    currencies: state.modelData.currencies,
    currency_pairs: !current_wallet ? null : (pairsForAccount[current_wallet.currency.currency] && pairsForAccount[current_wallet.currency.currency].all_pairs),
    // current_pair:current_wallet && pairsForAccount[current_wallet.id] && pairsForAccount[current_wallet.id].current_pair
    current_pair: current_pair,
    available: balances && balances[current_wallet && current_wallet.id] && balances[current_wallet.id].available
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SwapView)
// export default withRouter(DepositView)
