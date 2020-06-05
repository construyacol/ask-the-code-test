import React, { useState, useRef } from 'react'
import WithdrawViewState from '../../hooks/withdrawStateHandle'
import IconSwitch from '../../widgets/icons/iconSwitch'
import InputForm from '../../widgets/inputs/inputForm'
import ControlButton from '../../widgets/buttons/controlButton'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'
import Withdraw2FaModal from '../../widgets/modal/render/withdraw2FAModal'
import styled from 'styled-components'



export const CriptoSupervisor = props => {


  const [{ current_wallet, withdrawProviders }] = WithdrawViewState()
  // const [ { current_wallet } ] = WithdrawViewState()
  // const withdrawProviders = {}

  return (
    <>
      {
        Object.keys(withdrawProviders).length === 0 ?
          <CriptoViewLoader />
          :
          !withdrawProviders[current_wallet.currency.currency] ?
            <WithOutProvider current_wallet={current_wallet} />
            :
            <CriptoView />
      }
    </>
  )
}





const WithOutProvider = ({ current_wallet }) => {
  return (
    <section className="maintanceW">
      <IconSwitch icon="maintence" size={130} color="#989898" />
      <p className="fuente" >
        Los retiros de {current_wallet.currency.currency} estan fuera de servicio temporalmente, ten paciencia...
      </p>
    </section>
  )
}



export const CriptoView = () => {

  const [coinsendaServices] = useCoinsendaServices()
  const [
    {
      current_wallet,
      withdrawProviders,
      withdraw_accounts,
      active_trade_operation,
      loader,
      balance,
      user
    },
    {
      confirmationModalToggle,
      confirmationModalPayload,
      mensaje,
      isAppLoading,
      renderModal
    }, dispatch] = WithdrawViewState()

  const [addressState, setAddressState] = useState()
  const [amountState, setAmountState] = useState()
  let movil_viewport = window.innerWidth < 768


  const setTowFaTokenMethod = async (twoFaToken) => {
    dispatch(renderModal(null))
    finish_withdraw(twoFaToken)
  }

  const finish_withdraw = async (twoFaToken) => {

    const form = new FormData(document.getElementById('withdrawForm'))
    const amount = form.get('amount')
    const address = form.get('address')

    if(user.security_center.authenticator.withdraw && !twoFaToken){
      return dispatch(renderModal(() => <Withdraw2FaModal callback={setTowFaTokenMethod}/>))
    }

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

    const withdraw = await coinsendaServices.addWithdrawOrder({
          "data": {
               amount,
              "account_id": current_wallet.id,
              "withdraw_provider_id": withdrawProviders[current_wallet.currency.currency].id,
              "withdraw_account_id": withdraw_account.id,
              "country": user.country
          }
      }, twoFaToken)
    // return console.log('||||||||||||||||||||||||||||||||||||||||| withdraw', withdraw)

    if (!withdraw) {
      dispatch(isAppLoading(false))
      if(twoFaToken){
        return dispatch(mensaje('Al parecer el codigo 2Fa es incorrecto...', 'error'))
      }
      return dispatch(mensaje('No se ha podido crear la orden de retiro', 'error'))
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = new FormData(document.getElementById('withdrawForm'))
    const amount = form.get('amount')

    dispatch(confirmationModalToggle())
    dispatch(confirmationModalPayload({
      title: "Esto es importante, estas a punto de...",
      description: `Hacer un retiro de ${amount} ${current_wallet.currency.currency}, una vez confirmado el retiro, este es irreversible, si deseas continuar la operación click en "Confirmar Retiro"`,
      txtPrimary: "Confirmar Retiro",
      txtSecondary: "Cancelar",
      action: (finish_withdraw),
      img: "withdraw"
    }))
  }

  const handleMaxAvailable = (e) => {
    // TODO: no se debe manajar valores deirecto del DOM
    let amount = document.getElementsByName('amount')[0]
    amount.value = balance.available
    if(amount.value > 0){
      setAmountState('good')
    }
  }


  return (
    <WithdrawForm id="withdrawForm" className={`${movil_viewport ? 'movil' : ''}`} onSubmit={handleSubmit} >
      {/* <form id="withdrawForm" className={`WithdrawView ${!withdrawProviders[current_wallet.currency.currency] ? 'maintance' : ''} itemWalletView ${movil_viewport ? 'movil' : ''}`} onSubmit={handleSubmit}> */}
        <InputForm
          type="text"
          placeholder="Dirección de retiro"
          name="address"
          handleStatus={setAddressState}
          label={`Ingresa la dirección ${current_wallet.currency.currency}`}
          disabled={loader}
          SuffixComponent={() => <IconSwitch
            icon={`${addressState === 'good' ? 'verify' : 'wallet' }`}
            color={`${addressState === 'good' ? 'green' : 'gray' }`}
            size={`${addressState === 'good' ? 22 : 25 }`}  />}
        />

        <InputForm
          type="text"
          placeholder={`${withdrawProviders[current_wallet.currency.currency].provider.min_amount}`}
          name="amount"
          handleStatus={setAmountState}
          label={`Ingresa la cantidad de retiro`}
          disabled={loader}
          state={amountState}
          SuffixComponent={() => <AvailableBalance
            handleAction={handleMaxAvailable}
            amount={balance.available} />}
          // PrefixComponent
        />
        <ControlButton
          loader={loader}
          formValidate={!active_trade_operation && ( amountState === 'good' && addressState === 'good')}
          label="Enviar"
        />
      {/* </form> */}
    </WithdrawForm>
  )

}

export const AvailableBalance = ({ handleAction, amount }) => {
  const isMovil = window.innerWidth < 768

  return (
    <BalanceContainer>
      <p className={`fuente2 ${isMovil ? 'movil' : ''}`} onClick={handleAction} >{isMovil ? 'Disponible:' : 'Saldo disponible:'} {amount}</p>
    </BalanceContainer>
  )
}

export const OperationForm = styled.form`
  width: calc(95% - 50px);
  max-width: calc(700px - 50px);
  height: calc(100% - 50px);
  /* border: 1px solid #c4c4c5; */
  background: #f1f1f1;
  border-radius: 4px;
  padding: 20px 25px 20px 25px;
  display: grid;
  grid-row-gap: 5px;
  position: relative;
`

export const WithdrawForm = styled(OperationForm)`
  grid-template-rows: 40% 1fr 1fr;
  @media (max-width: 768px){
      height: calc(100% - 40px);
      width: 100%;
      grid-template-rows: 1fr 1fr 1fr;
    }
`

const BalanceContainer = styled.div`
  cursor: pointer;
  position: absolute;
  display: flex;
  right: 5px;
  color: gray;
  height: 100%;
  display: flex;
  align-items: center;
  transition: .15s;
  transform: scale(1);
  max-height: 47px;
  align-self: self-end;
  width: max-content;

  .movil{
    font-size: 11px;
  }

  &:hover{
    transform: scale(1.005);
    color: #b48728;
  }
`

const CriptoViewLoader = () => {

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
