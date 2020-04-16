import React, { useState } from 'react'
import WithdrawViewState from '../../hooks/withdrawStateHandle'
import IconSwitch from '../../widgets/icons/iconSwitch'
import InputForm from '../../widgets/inputs/inputForm'
import ControlButton from '../../widgets/buttons/controlButton'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'




export const CriptoSupervisor = props => {

  const [ { current_wallet, withdrawProviders } ] = WithdrawViewState()

  return(
    <>
        {
          Object.keys(withdrawProviders).length === 0 ?
            <CriptoViewLoader/>
          :
          !withdrawProviders[current_wallet.currency.currency] ?
            <WithOutProvider current_wallet={current_wallet}/>
          :
            <CriptoView/>
        }
    </>
  )
}





const WithOutProvider = ({current_wallet}) => {
  return(
    <section className="maintanceW">
      <IconSwitch icon="maintence" size={130} color="#989898"/>
      <p className="fuente" >
        Los retiros de {current_wallet.currency.currency} estan fuera de servicio temporalmente, ten paciencia...
      </p>
    </section>
  )
}



export const CriptoView = () => {

  const [ coinsendaServices ] = useCoinsendaServices()
  const [
    {
      current_wallet,
      withdrawProviders,
      withdraw_accounts,
      active_trade_operation,
      loader
    },
    {
     ConfirmationModalToggle,
     ConfirmationModalPayload,
     mensaje,
     isAppLoading
   }, dispatch ] = WithdrawViewState()

  const [ addressState, setAddressState ] = useState()
  const [ amountState, setAmountState ] = useState()
  let movil_viewport = window.innerWidth < 768

  const finish_withdraw = async () => {

    const form = new FormData(document.getElementById('withdrawForm'))
    const amount = form.get('amount')
    const address = form.get('address')
    dispatch(isAppLoading(true))

    let withdraw_account = withdraw_accounts[address]
    // return console.log('|||||||||||||||||||||||||| finish_withdraw ==> ', current_wallet)
    if (!withdraw_account) {
      // si la cuenta no existe, se crea una nueva y se consultan
      withdraw_account = await coinsendaServices.addNewWithdrawAccount({
        currency: current_wallet.currency,
        provider_type: current_wallet.currency.currency,
        label: current_wallet.currency.currency,
        address: address,
        country: current_wallet.country
      }, 'cripto')
      // console.log('NUEVA CUENTA CREADA ==> ', withdraw_account)
      await coinsendaServices.fetchWithdrawAccounts()
    }

    const withdraw = await coinsendaServices.addWithdrawOrder(
      amount,
      current_wallet.id,
      withdrawProviders[current_wallet.currency.currency].id,
      withdraw_account.id,
      withdrawProviders[current_wallet.currency.currency].country
    )
    // return console.log('||||||||||||||||||||||||||||||||||||||||| withdraw', withdraw)

    if (!withdraw) {
      dispatch(isAppLoading(false))
      return dispatch(mensaje('No se ha podido crear la orden de retiro', 'error'))
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = new FormData(document.getElementById('withdrawForm'))
    const amount = form.get('amount')

    dispatch(ConfirmationModalToggle())
    dispatch(ConfirmationModalPayload({
      title: "Esto es importante, estas a punto de...",
      description: `Hacer un retiro de ${amount} ${current_wallet.currency.currency}, una vez confirmado el retiro, este es irreversible, si deseas continuar la operación click en "Confirmar Retiro"`,
      txtPrimary: "Confirmar Retiro",
      txtSecondary: "Cancelar",
      action: (finish_withdraw),
      img: "withdraw"
    }))
  }

  return(
      <form id="withdrawForm" className={`WithdrawView ${!withdrawProviders[current_wallet.currency.currency] ? 'maintance' : ''} itemWalletView ${movil_viewport ? 'movil' : ''}`} onSubmit={handleSubmit}>
        <InputForm
          type="text"
          placeholder="Dirección de retiro"
          name="address"
          handleStatus={setAddressState}
          label={`Ingresa la dirección ${current_wallet.currency.currency}`}
          disabled={loader}
        />
        <InputForm
          type="text"
          placeholder={`${withdrawProviders[current_wallet.currency.currency].provider.min_amount}`}
          name="amount"
          handleStatus={setAmountState}
          label={`Ingresa la cantidad de retiro`}
          disabled={loader}
          // suffix
          // prefix
        />
        <ControlButton
          loader={loader}
          formValidate={!active_trade_operation && ( amountState === 'good' && addressState === 'good')}
          label="Enviar"
        />
      </form>
  )

}


const CriptoViewLoader = ({ withdrawProviders }) => {

  return(
    <>
        CARGANDO
    </>
  )

}
