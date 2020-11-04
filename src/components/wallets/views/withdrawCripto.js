import React, { useState, useEffect, useRef } from 'react'
import WithdrawViewState from '../../hooks/withdrawStateHandle'
import IconSwitch from '../../widgets/icons/iconSwitch'
import InputForm from '../../widgets/inputs/inputForm'
import ControlButton from '../../widgets/buttons/controlButton'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'
import Withdraw2FaModal from '../../widgets/modal/render/withdraw2FAModal'
import styled from 'styled-components'
import { MAIN_COLOR } from '../../referrals/shareStyles'
import { useActions } from '../../../hooks/useActions'
import useToastMessage from '../../../hooks/useToastMessage'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'
import AddressBookCTA from '../../widgets/modal/render/addressBook/ctas'
import { AiOutlineClose } from "react-icons/ai";

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
      isAppLoading,
      renderModal
    }, dispatch] = WithdrawViewState()


  const actions = useActions()
  const [toastMessage] = useToastMessage()

  const [addressState, setAddressState] = useState()
  const [addressValue, setAddressValue] = useState()
  const [amountState, setAmountState] = useState()
  const isValidForm = useRef(false)
  let movil_viewport = window.innerWidth < 768
  const idForClickeableElement = useKeyActionAsClick(true, 'main-deposit-crypto-button', 13, false, 'onkeyup')


  const setTowFaTokenMethod = async (twoFaToken) => {
    dispatch(renderModal(null))
    finish_withdraw(twoFaToken)
  }

  const finish_withdraw = async (twoFaToken) => {

    const form = new FormData(document.getElementById('withdrawForm'))
    const amount = form.get('amount')
    const address = form.get('address')

    if (user.security_center.authenticator.withdraw && !twoFaToken) {
      return dispatch(renderModal(() => <Withdraw2FaModal isWithdraw2fa callback={setTowFaTokenMethod} />))
    }

    dispatch(isAppLoading(true))
    let withdraw_account = withdraw_accounts[address]
    if (!withdraw_account) {
      // si la cuenta no existe, se crea una nueva y se consultan
      withdraw_account = await coinsendaServices.addNewWithdrawAccount({
        currency: current_wallet.currency,
        provider_type: current_wallet.currency.currency,
        label: current_wallet.currency.currency,
        address: address,
        country: current_wallet.country
      }, 'cripto')
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

    if (!withdraw) {
      dispatch(isAppLoading(false))
      if (twoFaToken) {
        return toastMessage('Al parecer el codigo 2Fa es incorrecto...', 'error')
      }
      return toastMessage('No se ha podido crear la orden de retiro', 'error')
    }

  }

  const handleSubmit = (e) => {
    e && e.preventDefault()
    e && e.stopPropagation()

    const form = new FormData(document.getElementById('withdrawForm'))
    const amount = form.get('amount')

    dispatch(confirmationModalToggle())
    window.requestAnimationFrame(() => {
      dispatch(confirmationModalPayload({
        title: "Esto es importante, estas a punto de...",
        description: `Hacer un retiro de ${amount} ${current_wallet.currency.currency}, una vez confirmado el retiro, este es irreversible, si deseas continuar la operación click en "Confirmar Retiro"`,
        txtPrimary: "Confirmar Retiro",
        txtSecondary: "Cancelar",
        action: (finish_withdraw),
        img: "withdraw"
      }))
    })
  }

  const handleMaxAvailable = (e) => {
    // TODO: no se debe manajar valores deirecto del DOM
    let amount = document.getElementsByName('amount')[0]
    amount.value = balance.available
    if (amount.value > 0) {
      setAmountState('good')
    }
  }

  const showQrScanner = async () => {
    renderModal(null)
    const Element = await import('../../qr-scanner')
    actions.renderModal(Element.default)
  }

  useEffect(() => {
    const condition = !active_trade_operation && (amountState === 'good' && addressState === 'good')
    if (isValidForm.current !== condition) {
      isValidForm.current = condition
    }
    if (addressState === 'good') {
      document.getElementsByName('amount')[0].focus()
    }
  }, [active_trade_operation, amountState, addressState])


  const handleChangeAddress = (_, value) => {
    setAddressValue(value)
  }






  const [ addressToAdd, setAddressToAdd ] = useState()
  const [ tagWithdrawAccount, setTagWithdrawAccount ] = useState()

  const deleteTag = () => {
    setTagWithdrawAccount(null)
    setAddressValue("")
  }

  useEffect(()=>{
    // Las cuentas anónimas son aquellas que su label es igual al provider_type de la red monetaria a la que pertenece la cuenta
    setAddressToAdd()
    const provider_type = current_wallet.currency.currency

    if(withdraw_accounts[addressValue] && (withdraw_accounts[addressValue] && withdraw_accounts[addressValue].info.label !== provider_type)){
      // Si la cuenta existe y nó es una cuenta anónima muestre el tag en el input
      setTagWithdrawAccount(withdraw_accounts[addressValue])
    }

    if(addressState === 'good'){
      if(!withdraw_accounts[addressValue] || (withdraw_accounts[addressValue] && withdraw_accounts[addressValue].info.label === provider_type)){
        // Si la cuenta no existe, o si existe pero es una cuenta anónima entonces esta cuenta puede ser agregada
        setAddressToAdd(addressValue)
      }


    }
  }, [addressState, withdraw_accounts, addressValue])





  return (
    <WithdrawForm id="withdrawForm" className={`${movil_viewport ? 'movil' : ''}`} onSubmit={e => e.preventDefault()} >
      {/* <form id="withdrawForm" className={`WithdrawView ${!withdrawProviders[current_wallet.currency.currency] ? 'maintance' : ''} itemWalletView ${movil_viewport ? 'movil' : ''}`} onSubmit={handleSubmit}> */}
      <InputForm
        type="text"
        placeholder="Dirección de retiro"
        name="address"
        handleStatus={setAddressState}
        isControlled
        handleChange={handleChangeAddress}
        value={addressValue}
        label={`Ingresa la dirección ${current_wallet.currency.currency}`}
        disabled={loader || tagWithdrawAccount}
        autoFocus={true}
        SuffixComponent={() => <IconsContainer>
          <IconSwitch
            className="superImposed"
            icon={`${addressState === 'good' ? 'verify' : 'wallet'}`}
            color={`${addressState === 'good' ? 'green' : 'gray'}`}
            size={`${addressState === 'good' ? 22 : 25}`} />
          <IconSwitch
            onClick={showQrScanner}
            icon="qr"
            color="gray"
            size={25} />
        </IconsContainer>}
        AuxComponent={
          [
            ()=> <AddressBookCTA setAddressValue={setAddressValue} addressToAdd={addressToAdd} />,
            () => <SearchComponent/>,
            () => <TagComponent withdrawAccount={tagWithdrawAccount} deleteTag={deleteTag}/>
          ]
        }
      />

      <InputForm
        type="text"
        placeholder={`${withdrawProviders[current_wallet.currency.currency].provider.min_amount}`}
        name="amount"
        handleStatus={setAmountState}
        label={`Ingresa la cantidad de retiro`}
        disabled={loader}
        state={amountState}
        setMaxWithActionKey={true}
        SuffixComponent={({id}) => <AvailableBalance
          id={id}
          handleAction={handleMaxAvailable}
          amount={balance.available} />}
      // PrefixComponent
      />
      <ControlButton
        id={idForClickeableElement}
        loader={loader}
        handleAction={handleSubmit}
        formValidate={!active_trade_operation && (amountState === 'good' && addressState === 'good')}
        label="Enviar"
      />
      {/* </form> */}
    </WithdrawForm>
  )

}


const SearchComponent = props => {
  return (
    <ShowAlert>

    </ShowAlert>
  )
}

const TagComponent = ({ withdrawAccount, deleteTag }) => {

  // console.log('||||||||||||||||||||| withdrawAccount : ', withdrawAccount)

  if(!withdrawAccount){return null}

  const address = withdrawAccount.info.address

  return(
    <>
      <TagBlocker/>
      <TagContainer >
        <LabelTextCont>
          <p className="fuente label_">{withdrawAccount.info.label}</p>
          <AddressContainer data-final-address={address.match(/..........$/g).toString()}>
            <Address className="fuente2 address_">{address}</Address>
          </AddressContainer>
        </LabelTextCont>
        <DeleteButton onClick={deleteTag}>
          <AiOutlineClose size={16} color="white" />
        </DeleteButton>
      </TagContainer>
    </>
  )

}


export const Address = styled.p`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 13px;
`




const LabelTextCont = styled.div`
  height: 60px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  position: relative;
  transition: .3s;
  top: 0;

  p{
    line-height: 30px;
    transition: .15s;
  }

  .address_{
    opacity: 0;
    font-size: 13px;
  }
`

const DeleteButton = styled.div`
  width: 18px;
  height: 18px;
  background: gray;
  justify-self: center;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .15s;
  transform: scale(1);
  cursor: pointer;
  position: relative;
  top: 6px;

  &:hover{
    transform: scale(1.1);
  }
`

const TagBlocker = styled.section`
  content: '';
  position: absolute;
  bottom: 5px;
  width: calc(100% - 2px);
  height: 40px;
  left: 2px;
  ${'' /* background: rgb(255 255 255 / 51%); */}
  background: linear-gradient(to right, rgb(255 255 255), rgb(255 255 255), transparent);
  backdrop-filter: blur(1px);
`

export const AddressContainer = styled.div`
  position: relative;
  width: 100%;
  max-width:200px;
  cursor: pointer;

  &::after{
    transition: .15s;
    content: attr(data-final-address);
    position: absolute;
    right: -75px;
    top: 0;
    color: #505050;
    font-size: 13px;
    line-height: 30px;
    opacity: 0;
  }

  @media (max-width: 768px){
    max-width:100px;
    }
`

const TagContainer = styled.div`

  overflow: hidden;
  position: absolute;
  bottom: 9px;
  left: 12px;
  height: 30px;
  background: #d8d8d8;
  border-radius: 4px;
  display: grid;
  width: auto;
  grid-template-columns: minmax(210px, 275px) 38px;
  cursor: pointer;

  @media (max-width: 768px){
    grid-template-columns: minmax(90px, 180px) 38px;
  }

  &:hover{
    ${LabelTextCont}{
      top: -30px;
      .label_{
        opacity: 0;
      }

      .address_, ${AddressContainer}::after{
        opacity: 1;
      }
    }
  }

  &.disappear{
    transform: translateY(10px);
    opacity: 0;
  }

  &.appear{
    transform: translateY(0);
    opacity: 1;
  }



  ${'' /* &::after{
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: rgb(255 255 255 / 51%);
    backdrop-filter: blur(1px);
  } */}

  p{
    margin: 0;
    padding-left: 15px;
    color: #505050;
  }
`


const ShowAlert = styled.section`
  width: 100%;
  height: 120px;
  background: white;
  position: absolute;
  ${'' /* top: 105px; */}
  top: 205px;
  left: 0;
  z-index: 2;
  display: none;
`

export const AvailableBalance = ({ handleAction, amount, id }) => {
  const isMovil = window.innerWidth < 768

  return (
    <BalanceContainer>
      <p id={id} className={`fuente2 ${isMovil ? 'movil' : ''}`} onClick={handleAction} >{isMovil ? 'Disponible:' : 'Disponible [M]:'} {amount}</p>
    </BalanceContainer>
  )
}

const IconsContainer = styled.div`
  display: flex;
  > div:first-child {
    margin: 0 12px;
  }
  > div:last-child {
    cursor: pointer;
    transition: all 300ms ease;
    &:hover {
      >svg {
        fill: ${MAIN_COLOR} !important;
      }
    }
  }
`

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
