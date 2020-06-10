import React, { useState, useEffect } from 'react'
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
import { withRouter } from 'react-router'

const ItemAccount = props => {

  if (props.loader) {
    return (
      <LoaderAccount />
    )
  }

  const [coinsendaServices] = useCoinsendaServices()
  const [account_state, set_account_state] = useState()
  const [loader, set_loader] = useState()
  const [shouldHaveDeleteClassName, setShouldHaveDeleteClassName] = useState(false)
  const [id_wallet_action, set_id_wallet_action] = useState('')
  const { account_type } = props
  // 5d3dedf1bb245069d61021bb

  useEffect(() => {
    setShouldHaveDeleteClassName((id_wallet_action === props.account.id) && account_state)
  }, [account_state, props.account.id])

  const getAccountTransactions = async() => {
    set_loader(true)
    const countAccount = await coinsendaServices.countOfAccountTransactions(props.account.id)
    const { count } = countAccount
    await props.actions.update_item_state({ [props.account.id]: { ...props.account, count } }, 'wallets')
    if(count < 1){
      let areThereDeposits = await coinsendaServices.getDepositByAccountId(props.account.id)
      set_loader(false)
      if(areThereDeposits && areThereDeposits.length){
        // console.log('||||||||||||||| -------------- |||||||||||||||||||||||||||   ARE THERE DEPOSITS :: ', props, props.wallets)
        props.actions.update_item_state({ [props.account.id]: { ...props.wallets[props.account.id], count:1 } }, 'wallets') //actualiza el movimiento operacional de la wallet
        return props.history.push(`/wallets/activity/${props.account.id}/deposits`)
      }
      return props.history.push(`/wallets/deposit/${props.account.id}`)
    }
    return props.history.push(`/wallets/activity/${props.account.id}/${props.currentFilter ? props.currentFilter : 'deposits'}`)
  }


  const account_detail = async (payload) => {
    if(payload !== 'wallets') {
      return props.history.push(`/withdraw_accounts/activity/${props.account.id}`)
    }
    if(account_state === 'deleting' || account_state === 'deleted'){return}
    props.actions.cleanNotificationItem(payload, 'account_id')
    if(props.account.count === undefined){
      return getAccountTransactions()
    }
    if (props.account.count < 1) {
      return props.history.push(`/wallets/deposit/${props.account.id}`)
    }
    return props.history.push(`/wallets/activity/${props.account.id}/${props.currentFilter ? props.currentFilter : 'deposits'}`)
  }

  const delete_account = async () => {
    set_account_state('deleting')
    set_id_wallet_action(props.account.id)
    const isWallet = props.account_type === 'wallets'

    if (isWallet) {
      if(props.balances.total > 0){
        set_account_state('')
        return props.actions.mensaje('Las cuentas con balance no pueden ser eliminadas', 'error')
      }

      let areThereDeposits = await coinsendaServices.getDepositByAccountId(props.account.id, '"state":"confirmed"')
      if(areThereDeposits && areThereDeposits.length){
        set_account_state('')
        return props.actions.mensaje('Las cuentas con depositos pendientes no pueden ser eliminadas', 'error')
      }

    }
    // else if(props.account.used_counter){
    //   setTimeout(()=>set_account_state(''), 700)
    //   return props.actions.mensaje('Las cuentas de retiro con movimiento no pueden ser eliminadas...', 'error')
    // }

    let msg = "Cuenta eliminada con exito"
    let success = true
    let result = false
    if (isWallet) {
      result = await coinsendaServices.deleteWallet(props.account)
    } else {
      result = await await coinsendaServices.deleteWithdrawAccount(props.account.id)
    }
    if (result === 404 || result === 465 || !result) {
      msg = "La cuenta no se ha podido eliminar"
      success = false
      set_account_state('')
      return props.actions.mensaje(msg, success ? 'success' : 'error')
    }
    set_account_state('deleted')
    setTimeout(async () => {
      if (isWallet) {
        await coinsendaServices.getWalletsByUser()
      } else {
        await coinsendaServices.fetchWithdrawAccounts()
      }
    }, 0)
    props.actions.exit_sound()
    props.actions.mensaje(msg, success ? 'success' : 'error')
  }

  // console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||  ItemAccount < ItemAccount ::', reduxState, props)

  return (
    <AccountLayout className={`AccountLayout  ${shouldHaveDeleteClassName && account_state}`}>
      {
        account_type === 'wallets' ?
          <Wallet
            loaderAccount={loader}
            handleAction={account_detail}
            set_account_state={set_account_state}
            shouldHaveDeleteClassName={shouldHaveDeleteClassName && account_state === 'deleted'}
            delete_account={delete_account}
            {...props} />
          :
          <WithdrawAccount
            loaderAccount={loader}
            handleAction={account_detail}
            set_account_state={set_account_state}
            shouldHaveDeleteClassName={shouldHaveDeleteClassName && account_state === 'deleted'}
            delete_account={delete_account}
            {...props} />
      }
    </AccountLayout>
  )

}


const mapStateToProps = (state, props) => {

  const { account } = props
  const { balances, wallets } = state.modelData
  const { currentFilter } = state.ui.current_section.params

  // console.log('||||||||||||||||||||||||||||||| ACCOUNT ITEM ACCOUNT ==> ', account)

  return {
    currentFilter,
    balances: (balances && account) && balances[account.id],
    wallets
  }

}

// ¿Es necesario conectar redux tanto para Wallet como para Withdraw Account?
export default connect(mapStateToProps)(withRouter(ItemAccount))





const Wallet = props => {
  const { account, balances, delete_account, shouldHaveDeleteClassName } = props
  const { name, id, currency } = account
  const icon = account.currency.currency === 'cop' ? 'bank' : account.currency.currency === 'ethereum' ? 'ethereum_account' : account.currency.currency

  // console.log('|||||||||||| WALLET Account ===> ', props)

  return (
    <WalletLayout className={`walletLayout ${props.loaderAccount ? 'loading' : ''} ${currency.currency} ${shouldHaveDeleteClassName && 'deleted'}`} wallet inscribed>

      {
        props.loaderAccount &&
        <LoaderContainer>
          <SimpleLoader loader={2} />
        </LoaderContainer>
      }

      {
        props.actions &&
        <>
          <AccountCta handleAction={props.handleAction} payload={props.account_type} />
          <OptionsAccount
            account_detail={props.handleAction}
            delete_account={delete_account}
            {...props} />
        </>
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
      <>
        {
          balances ?
            <BalanceComponent account_id={id} />
            :
            <div className="loadItem">
              <SimpleLoader color="white" />
            </div>
        }
      </>
    </WalletLayout>
  )

}

const WithdrawAccount = props => {

  const { account, delete_account, shouldHaveDeleteClassName } = props
  const { bank_name, id, account_number, inscribed, used_counter } = account

  return (
    <WithdrawAccountL className={`withdrawAccount ${shouldHaveDeleteClassName && 'deleted'}`} inscribed={account.inscribed}>
      {
        props.actions &&
        <>
          {used_counter && used_counter > 0 && (
            <AccountCta handleAction={props.handleAction} payload={props.account_type} />
          )}
          <OptionsAccount
            account_detail={props.handleAction}
            delete_account={delete_account}
            {...props} />
        </>
      }
      <img src={backcard} id="backCard" alt="" width="100%" height="100%" />
      <div className="iconBank">
        <IconSwitch icon={account.bank_name && account.bank_name.value} size={100} />
      </div>
      <h1 className="IWText fuente tobe_continue">{bank_name.ui_name} <PopNotification notifier='withdraw_accounts' item_type="account_id" id={id} type="new" /></h1>
      <p className="IWText fuente2 IWLittleTitle">No. {account_number.value}</p>
      <>
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
      </>
    </WithdrawAccountL>
  )

}

const LoaderAccount = () => {
  const items = ['uno', 'dos', 'tres']
  return (
    <>
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
    </>
  )
}



const OptionsAccount = props => {
  const delete_account_confirmation = async () => {
    props.actions.confirmationModalToggle()
    props.actions.confirmationModalPayload({
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

  // console.log('|||||||||||||||||||||| OptionsAccount ===========================> ', props.account, props.account.count)

  const { account_type } = props

  return (
    // <div className={`ItemBarra ${account_type} ${(current_view === 'detail') ? 'noVisible' : ''}`} >
    <OptionsLayout className={`OptionsLayout ${account_type}`}>

      {
        props.account.count ?
        <>
        <BarIconCont account_type={account_type} onClick={redirectGo} data-address="withdraw">
          <Icon className="far fa-arrow-alt-circle-up IdeleteButton tooltip" data-address="withdraw">
            <span className="tooltiptext2 fuente" data-address="withdraw">Retirar</span>
          </Icon>
        </BarIconCont>
        <BarIconCont account_type={account_type} onClick={redirectGo} data-address="deposit">
          <Icon className="far fa-arrow-alt-circle-down Ideposit IdeleteButton tooltip" data-address="deposit">
            <span className="tooltiptext2 fuente" data-address="deposit">Depositar</span>
          </Icon>
        </BarIconCont>
        </>
        :
        <>
        <div></div>
        <div></div>
        </>
      }






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
