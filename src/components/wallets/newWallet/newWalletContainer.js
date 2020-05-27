import React, { Component, useEffect, useState } from 'react'
import NewWalletLayout from './newWalletLayout'
import { connect } from 'react-redux'
// import { updateFormControl, FormWallet } from '../../../actions'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { matchItem } from '../../../utils'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'





const NewWallet = props => {

  const [ name, setName ] = useState()
  const [ currency, setCurrency ] = useState(props.search.length && props.search[0].currency)
  const [ address, setAddress ] = useState()
  const [ short_currency_name, setShortCurrencyName ] = useState()
  const [ coinsendaServices, ,{
  update_item_state,
  current_section_params
  }, dispatch ] = useCoinsendaServices()

  const update_control_form = (searchMatch) => {
    // if (!searchMatch || props.search.length > 1) {
    //   props.action.UpdateFormControl('wallet', false)
    // }
    // if (name !== "" && props.search.length === 1) {
    //   props.action.UpdateFormControl('wallet', true)
    // }
  }

  const clearCurrency = () => {
    setCurrency(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    props.action.isAppLoading(true)
    siguiente()
    actualizarEstado(event)
    crearWallet()
  }


  const crearWallet = async () => {
    // simulación Endpoint Crear wallet
    const {
      user,
      currencies
    } = props


    let get_currency = await matchItem(currencies, { primary: currency }, 'currency')

    const body = {
      "data": {
        "name": name,
        "description": "description",
        "country": user && user.country,
        "enabled": true,
        "currency": {
          "currency": get_currency[0].currency,
          "is_token": get_currency[0].is_token
        }
      }
    }

    // const wallets = await props.action.create_new_wallet(body)
    const wallets = await coinsendaServices.createWallet(body)


    if (!wallets || wallets === 465 || wallets === 400) {
      props.action.ReduceStep('wallets')
      props.action.isAppLoading(false)
      let msg = !wallets ? 'ERROR DE CONEXIÓN' : 'Al parecer, aún no tenemos soporte para esta moneda'
      return props.action.mensaje(msg, 'error')
    }

    const {
      account
    } = wallets

    // const dep_prov_id = await coinsendaServices.createDepositProvider(account.id, account.country)
    await createDepositProvider(account)
    // si la acción se lleva satisfactoriamente actualizamos el fondo del modal a un color verde
    let msg = `Nueva wallet ${account.currency.currency} creada!`
    props.action.mensaje(msg, 'success')

    await props.action.add_item_state('wallets', { ...account, visible: true })
    await props.action.get_account_balances(props.user)
    // return console.log('=================> CREATE WALLET CURRENCIE=>', wallets)

    props.action.isAppLoading(false)
    props.action.success_sound()
    await props.action.toggleModal()
    await props.action.CleanForm('wallet')

    return props.history.push(`/wallets/deposit/${account.id}`)
  }

  const createDepositProvider = async(account) => {

    const dep_prov_id = await coinsendaServices.createDepositProvider(account.id, account.country)

    if(!dep_prov_id){
      return props.action.isAppLoading(false)
    }
    const deposit_providers = await coinsendaServices.fetchDepositProviders()
    // console.log('||||||||||||||||||||||||||||||||||| createDepositProvider ==> ', deposit_providers)
    const update_wallet = {
      [account.id]:{...account, dep_prov:[dep_prov_id], deposit_provider:deposit_providers[dep_prov_id]}
    }
    await dispatch(update_item_state(update_wallet, 'wallets'))
    // dispatch(current_section_params({
    //   current_wallet:update_wallet[account.id]
    // }))
  }


  const actualizarEstado = async (event) => {
    if (event.target.short_name) {
      await setShortCurrencyName(event.target.short_name)
    }
    const names = event.target.name
    const value = event.target.value
    // update_control_form(value)
    // update_form()
    switch (names) {
      case 'name':
        return setName(value)
      case 'currency':
        return setCurrency(value)
      default:
    }

  }

  const siguiente = () => {
    return props.action.IncreaseStep(props.current)
  }

  const finalizar = (event) => {
    // reiniciamos el estado del formulario(./reducers/form)
    props.action.toggleModal()
    props.action.CleanForm('wallet')
  }

  useEffect(()=>{
    return () => props.action.CurrentForm('wallets')
  }, [])


  let states = {
  name,
  currency,
  address,
  short_currency_name
  }

  return(
      <NewWalletLayout
        clearCurrency={clearCurrency}
        actualizarEstado={actualizarEstado}
        handleSubmit={handleSubmit}
        update_control_form={update_control_form}
        buttonActive={props.buttonActive}
        loader={props.loader}
        finalizar={finalizar}
        step={props.step}
        {...states}
        {...props}
      />
  )

}



function mapStateToProps(state, props) {
  const user = state.modelData.user

  return {
    search: state.form.search_coin,
    form_wallet: state.form.form_wallet,
    buttonActive: state.form.form_control_wallet,
    loader: state.isLoading.loader,
    step: state.form.form_wallet.step,
    current: state.form.current,
    user,
    state:state.modelData,
    currencies:state.modelData.currencies,
    wallets:state.modelData.wallets

  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWallet)
