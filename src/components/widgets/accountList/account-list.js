import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../loaders'
// import ItemWallet from './items'
import ItemAccount from './item_account'
import { AddNewItem } from '../buttons/buttons'
import { withRouter } from "react-router"
import IconSwitch from '../icons/iconSwitch'
import PropTypes from 'prop-types'
import { AccountListContainer } from './styles'

import '../../wallets/views/wallet_views.css'

function AccountList(props) {
  const { path, actions, history } = props
  const [label, setLabel] = useState(`Obteniendo tus ${path === 'wallets' ? 'Billeteras' : 'Cuentas de retiro'}`)
  const [isVerified, setIsVerified] = useState(false)
  const [accountState, setAccountState] = useState('done')
  const [walletId, setWalletId] = useState(false)

  useEffect(() => {
    actions.cleanCurrentSection()
    init()
  }, [])

  const init = async () => {
    const verified = await actions.getUserVerificationStatus('level_1')
    setIsVerified(verified)
  }

  const createNewWallet = () => {
    if (props.verificationState === 'confirmed') {
      return showValidationPrompt()
    }

    if (!isVerified) {
      return callToValidate()
    }
    actions.toggleModal()
  }

  const showValidationPrompt = () => {
    actions.confirmationModalToggle()
    actions.confirmationModalPayload({
      title: "Estamos trabajando en esto...",
      description: "Hemos recibido satisfactoriamente tus datos de verificación, en breve podrás operar en coinsenda.",
      txtPrimary: "Entendido",
      action: false,
      svg: "verified"
    })
  }


  const goToVerification = async () => {
    const verificationState = props.verificationState

    if (verificationState === 'confirmed' || verificationState === 'pending') {
      await actions.ToStep('globalStep', 2)
    }

    if (verificationState === 'rejected') {
      await actions.ToStep('globalStep', 0)
    }

    await history.push(`/security`)
    setTimeout(() => {
      actions.toggleModal()
    }, 0)
  }


  const callToValidate = () => {
    const message = props.path === 'wallets' ? 'billeteras crypto/fiat.' : 'cuentas de retiro fiat.'

    actions.confirmationModalToggle()
    actions.confirmationModalPayload({
      title: "Aún no estas listo para esto...",
      description: `Debes completar el nivel de verificación avanzada para poder agregar ${message}`,
      txtPrimary: "Verificarme",
      txtSecondary: "Cancelar",
      payload: 'account_id',
      action: goToVerification,
      svg: "verified"
    })
  }


  const deleteAccount = async (accountId, type) => {
    setLabel("Eliminando Wallet")
    setAccountState("deleting")
    setWalletId(accountId)
    const accountDeleted = await actions.delete_account(accountId, type)
    let msg = "Wallet eliminada con exito"
    let success = true

    if (accountDeleted === 404 || !accountDeleted) {
      msg = "La wallet no se ha podido eliminar"
      success = false
    }

    actions.exit_sound()
    setLabel("Obteniendo tus Cuentas")
    setAccountState("deleted")
    type === 'withdraw_accounts' ?
      await actions.get_withdraw_accounts(props.user, props.withdrawProviders) :
      await actions.get_list_user_wallets(props.user)

    actions.mensaje(msg, success ? 'success' : 'error')
  }

  const items = props.items
  const isHugeContainer = items > 10
  const styleForHugeContainer = {
    height: 'auto',
  }
  const isWithdrawListStyle = {
    marginBottom: '40px'
  }
 
  return (
    <>
      {
        (items && items.length > 0) ?
          <AccountListContainer style={isHugeContainer ? { ...styleForHugeContainer, ...isWithdrawListStyle } : isWithdrawListStyle} className="AccountListContainer">
            {
              items.map((account, id) => {
                if (!account.visible) { return null }
                return <ItemAccount
                  key={id}
                  account={account}
                  account_type={path}
                  {...props}
                />
              })
            }
          </AccountListContainer>
          :
          props.loader ?
            <SimpleLoader
              color="blue"
              label={label}
            />
            :
            (items.length < 1 && !props.loader) &&
            <AccountsNotFound account_type={path} />
      }

      {
        (!props.loader) &&
        <AddNewItem
          label={`${path === 'withdraw_accounts' ? 'Añadir nueva cuenta de retiro' : 'Añadir nueva billetera'}`}
          type="primary"
          handleClick={createNewWallet}
        />
      }

    </>
  )
}

AccountList.propTypes = {
  all_pairs: PropTypes.object,
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  current_wallet: PropTypes.object,
  items: PropTypes.array,
  loader: PropTypes.bool,
  path: PropTypes.string,
  user: PropTypes.object
}

function mapStateToProps(state, props) {
  const path = props.match.params.primary_path
  const {
    user,
    withdrawProviders
  } = state.modelData
  let withdrawProvidersList = null

  if (path !== 'wallets' && withdrawProviders) {
    withdrawProvidersList = []
    Object.keys(withdrawProviders).map(key => withdrawProvidersList.push(withdrawProviders[key]))
  }

  const items = user[path].map((item_id) => {
    if (path === 'withdraw_accounts' && state.modelData[path][item_id].currency_type === 'crypto') { return false }
    return state.modelData[path][item_id]
  })

  return {
    items,
    path,
    verificationState: state.ui.verification_state,
    withdrawProviders: withdrawProvidersList,
    user: state.modelData.user,
    loader: state.isLoading.loader
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

const AccountsNotFound = ({ account_type }) => {

  return (
    <div className="withdraw_accounts_screen">
      <div className="withdraw_accounts_screen_cont">
        <IconSwitch icon="withdraw_account" size={110} color="#989898" />
        <p id="WalletList2" className="fuente" >
          {
            account_type === 'withdraw_accounts' ?
              'Aún no tienes cuentas de retiro agregadas, añade y gestiona retiros en tu moneda local.'
              :
              'Aún no tienes billeteras agregadas, añade y gestiona Billeteras de Bitcoin, Ethereum, etc... para que puedas hacer retiros y depositos'
          }
        </p>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountList))
