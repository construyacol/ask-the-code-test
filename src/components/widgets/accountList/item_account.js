import React, { useState, Fragment } from 'react'
// import styled, { css } from 'styled-components'
import backcard from '../../../assets/wallet_coins/back.png'
import IconSwitch from '../icons/iconSwitch'
import PopNotification from '../notifications'
import SimpleLoader from '../loaders'
import BalanceComponent from '../balance/balance'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'
import { LoaderContainer } from '../loaders'

import {
  ACta,
  BarIconCont,
  Icon,
  OptionsLayout,
  AccountLayout,
  WalletLayout,
  WithdrawAccountL
} from './styles'

import './item_wallet.css'




const ItemAccount = props => {


  if (props.loader) {
    return (
      <LoaderAccount />
    )
  }

  // 5d3dedf1bb245069d61021bb

  const getAccountTransactions = async() => {
    set_loader(true)
    const countAccount = await coinsendaServices.countOfAccountTransactions(props.account.id)
    const { count } = countAccount
    await props.action.update_item_state({ [props.account.id]: { ...props.account, count } }, 'wallets')
    if(count < 1){
      let areThereDeposits = await coinsendaServices.getDepositByAccountId(props.account.id)
      set_loader(false)
      if(areThereDeposits && areThereDeposits.length){
        return props.history.push(`/wallets/activity/${props.account.id}/deposits`)
      }
      return props.history.push(`/wallets/deposit/${props.account.id}`)
    }
    return props.history.push(`/wallets/activity/${props.account.id}/${props.currentFilter ? props.currentFilter : 'deposits'}`)
  }


  const account_detail = async (payload) => {
    props.action.CleanItemNotifications(payload, 'account_id')
    if(props.account.count === undefined){
      return getAccountTransactions()
    }
    if(props.account.count < 1){
      return props.history.push(`/wallets/deposit/${props.account.id}`)
    }
    return props.history.push(`/wallets/activity/${props.account.id}/${props.currentFilter ? props.currentFilter : 'deposits'}`)
  }

  const [ coinsendaServices ] = useCoinsendaServices()
  const [account_state, set_account_state] = useState()
  const [loader, set_loader] = useState()
  const [id_wallet_action, set_id_wallet_action] = useState()
  let id_trigger = id_wallet_action === props.account.id
  const { account_type } = props

  // console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||  ItemAccount < ItemAccount ::', reduxState, props)

  return (
    <AccountLayout className={`AccountLayout  ${account_state === 'deleting' && id_trigger ? 'deleting' : account_state === 'deleted' && id_trigger ? 'deleted' : ''}`}>
      {
        account_type === 'wallets' ?
          <Wallet
            loaderAccount={loader}
            handleAction={account_detail}
            set_id_wallet_action={set_id_wallet_action}
            set_account_state={set_account_state}
            account_state={account_state}
            id_trigger={id_trigger}
            {...props} />
          :
          <WithdrawAccount
            loaderAccount={loader}
            set_id_wallet_action={set_id_wallet_action}
            set_account_state={set_account_state}
            account_state={account_state}
            id_trigger={id_trigger}
            {...props} />
      }
    </AccountLayout>
  )

}


const mapStateToProps = (state, props) => {

  const { account } = props
  const { balances } = state.modelData
  const { currentFilter } = state.ui.current_section.params

  // console.log('||||||||||||||||||||||||||||||| ACCOUNT ITEM ACCOUNT ==> ', account)

  return {
    currentFilter,
    balances: (balances && account) && balances[account.id],
  }

}

// ¿Es necesario conectar redux tanto para Wallet como para Withdraw Account?
export default connect(mapStateToProps)(ItemAccount)







const Wallet = props => {


  const { account, balances, account_state, id_trigger, set_id_wallet_action, set_account_state } = props
  const { name, id, currency } = account
  let icon = account.currency.currency === 'cop' ? 'bank' : account.currency.currency === 'ethereum' ? 'ethereum_account' : account.currency.currency
  // console.log('|||||||||||||||||||||||||||||||||||||||||| Wallet detail ', balances)
  // let notifier_type = type === 'trade' ? 'wallets' : type
  // console.log('|||||||||||| WALLETS  ===> ', account)

  const delete_account = async () => {
    if(balances.total > 0){return props.action.mensaje('Las cuentas con balance no pueden ser eliminadas', 'error')}
    set_account_state('deleting')
    set_id_wallet_action(id)
    let account_deleted = await props.action.delete_account(account)
    // console.log('°|||||||||||||||||°°°°°°°°°°°°°°°°°°°°°°° DELETE WALLET AFTER ===> ', account_deleted)
    let msg = "Cuenta eliminada con exito"
    let success = true
    if (!account_deleted) {
      msg = "La cuenta no se ha podido eliminar"
      success = false
    }
    setTimeout(() => {
      set_account_state('deleted')
      props.action.get_list_user_wallets(props.user)
    }, 300)
    props.action.exit_sound()
    props.action.mensaje(msg, success ? 'success' : 'error')
  }

  // console.log('|||||||||||| WALLET Account ===> ', props)

  return (
    <WalletLayout className={`walletLayout ${props.loaderAccount ? 'loading' : ''} ${currency.currency} ${account_state === 'deleted' && id_trigger ? 'deleted' : ''}`} wallet inscribed>

      {
        props.loaderAccount &&
        <LoaderContainer>
          <SimpleLoader loader={2} />
        </LoaderContainer>
      }

      {
        props.actions &&
        <Fragment>
          <AccountCta handleAction={props.handleAction} payload={props.account_type} />
          <OptionsAccount
            delete_account={delete_account}
            {...props} />
        </Fragment>
      }
      <img src={backcard} id="backCard" alt="" width="100%" height="100%" />
      <div className="iconWallet">
        <IconSwitch icon={icon} size={195} />
      </div>
      <div className="walletTitleCont IWText">
        <h1 className="IWText fuente tobe_continue">{name ? name : 'Mi cartera crypto'}</h1>
        <PopNotification notifier='wallets' item_type="account_id" id={id} type="new" />
      </div>
      <p className="IWText fuente IWcurrencyText tobe_continue">{currency.currency}</p>
      <Fragment>
        {
          balances ?
            <BalanceComponent account_id={id} />
            :
            <div className="loadItem">
              <SimpleLoader color="white" />
            </div>
        }
      </Fragment>
    </WalletLayout>
  )

}








const WithdrawAccount = props => {

  const { account, account_state, id_trigger } = props
  const { bank_name, id, account_number, inscribed, used_counter } = account


  const delete_account = async (account_id) => {
    const { set_id_wallet_action, set_account_state } = props
    set_account_state('deleting')
    set_id_wallet_action(id)
    let account_deleted = await props.action.delete_withdraw_account(id)
    let msg = "Cuenta eliminada con exito"
    let success = true
    if (account_deleted === 404 || account_deleted === 465 || !account_deleted) {
      msg = "La cuenta no se ha podido eliminar"
      success = false
      set_account_state('CancelDeleting')
      return props.action.mensaje(msg, success ? 'success' : 'error')
    }
    // console.log('||||||||||||||||||| DELETE ACCOUNT ==> ', account_deleted)
    props.action.exit_sound()
    set_account_state('deleted')
    await props.action.get_withdraw_accounts(props.user, props.withdrawProviders)
    props.action.mensaje(msg, success ? 'success' : 'error')
  }

  // console.log('|||||||||||| Withdraw Account delete_account ===> ', account_state)


  return (
    <WithdrawAccountL className={`withdrawAccount ${account_state === 'deleted' && id_trigger ? 'deleted' : ''}`} inscribed={account.inscribed}>
      <OptionsAccount
        delete_account={delete_account}
        {...props} />
      <img src={backcard} id="backCard" alt="" width="100%" height="100%" />
      <div className="iconBank">
        <IconSwitch icon={account.bank_name && account.bank_name.value} size={100} />
      </div>
      <h1 className="IWText fuente tobe_continue">{bank_name.ui_name} <PopNotification notifier='withdraw_accounts' item_type="account_id" id={id} type="new" /></h1>
      <p className="IWText fuente2 IWLittleTitle">No. {account_number.value}</p>
      <Fragment>
        <div className="contSuscribed">
          {
            !inscribed ?
              <div className="contLoader2">
                <SimpleLoader color="white" loader={2} />
              </div>
              :
              <i className="far fa-check-circle"></i>
          }
          <p className="IWText fuente IWLittleTitle">{inscribed ? 'inscrita' : 'Inscribiendo'}</p>
        </div>
        <p className="IWText fuente IWLittleTitle" style={{ display: !inscribed ? 'none' : 'flex' }}>Movimientos: {used_counter}</p>
      </Fragment>
    </WithdrawAccountL>
  )

}

const LoaderAccount = () => {
  const items = ['uno', 'dos', 'tres']
  return (
    <Fragment>
      {
        items.map((e, key) => {
          return <WalletLayout className={`loader ${e}`} key={key}>
            <div />
            <div />
            <div />
            <div />
          </WalletLayout>
        })
      }
    </Fragment>
  )
}



const OptionsAccount = props => {


  const delete_account_confirmation = async () => {
    props.action.ConfirmationModalToggle()
    props.action.ConfirmationModalPayload({
      title: "Esto es importante, estas a punto de...",
      description: "Eliminar una cuenta, una vez hecho esto, no podrás recuperar los datos asociados a esta.",
      txtPrimary: "Eliminar",
      txtSecondary: "Cancelar",
      // payload:props.account.id,
      action: (props.delete_account),
      img: "deletewallet",
      // code:props.account_type
    })
  }

  // console.log('|||||||||||||||||||  redirectGo ==>> ', e.target.dataset && e.target.dataset.address)
  const redirectGo = (e) => {
    if (e.target.dataset && e.target.dataset.address) {
      return props.history.push(`/wallets/${e.target.dataset.address}/${props.account.id}`)
    }
  }

  // console.log('|||||||||||||||||||||| OptionsAccount ===========================> ', props)

  const { account_type } = props

  return (
    // <div className={`ItemBarra ${account_type} ${(current_view === 'detail') ? 'noVisible' : ''}`} >
    <OptionsLayout className={`OptionsLayout ${account_type}`}>

      {/* onClick={this.withdraw} */}
      <BarIconCont account_type={account_type} onClick={redirectGo} data-address="withdraw">
        <Icon className="far fa-arrow-alt-circle-up IdeleteButton tooltip" data-address="withdraw">
          <span className="tooltiptext2 fuente" data-address="withdraw">Retirar</span>
        </Icon>
      </BarIconCont>


      {/* onClick={this.depositar} */}
      <BarIconCont account_type={account_type} onClick={redirectGo} data-address="deposit">
        <Icon className="far fa-arrow-alt-circle-down Ideposit IdeleteButton tooltip" data-address="deposit">
          <span className="tooltiptext2 fuente" data-address="deposit">Depositar</span>
        </Icon>
      </BarIconCont>



      {/* onClick={this.delete_this_account} */}
      <BarIconCont className="retweetCont" account_type={account_type} onClick={delete_account_confirmation}>
        <Icon className="fas fa-trash-alt IdeleteButton tooltip">
          <span className="tooltiptext2 fuente">Borrar</span>
        </Icon>
      </BarIconCont>

    </OptionsLayout>

  )

}


const AccountCta = props => {

  const handleAction = () => {
    props.handleAction(props.payload)
  }

  return (
    <ACta onClick={handleAction}></ACta>
    //<div className={`ItemWCta ${(current_view === 'detail' || type === 'withdraw') ? 'noVisible' : ''}`} onClick={this.wallet_detail} ></div>
  )

}
