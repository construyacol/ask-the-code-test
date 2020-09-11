import React, { useState, useEffect } from 'react'
import SimpleLoader from '../loaders'
import ItemAccount from './item_account'
import { AddNewItem } from '../buttons/buttons'
import IconSwitch from '../icons/iconSwitch'
import PropTypes from 'prop-types'
import { AccountListContainer } from './styles'
import withListCreator from '../../withListCreator'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'

import '../../wallets/views/wallet_views.css'

function AccountList(props) {
  const { isWalletsView, isWithdrawView, actions, history } = props
  const label = `Obteniendo tus ${isWalletsView ? 'Billeteras' : 'Cuentas de retiro'}`
  const [coinsendaService] = useCoinsendaServices()
  const [isVerified, setIsVerified] = useState(false)
  const [currentSelection, setCurrentSelection] = useState(-1)

  useEffect(() => {
    // actions.cleanCurrentSection()
    const verified = coinsendaService.getUserVerificationStatus('level_1')
    setIsVerified(verified)
  }, [])

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
    const message = isWalletsView ? 'billeteras crypto/fiat.' : 'cuentas de retiro fiat.'

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

  const items = props.items || []
  const isHugeContainer = items > 10
  const styleForHugeContainer = {
    // height: 'auto',
  }
  const isWithdrawListStyle = {
    // marginBottom: '40px'
  }

  useEffect(() => {
    if(items.length > 0) {
      const el = document.getElementById(`elementFocusable${0}`)
          el && el.focus()
    }
  }, [items])

  useEffect(() => {
    window.onkeydown = false
    if(!window.onkeydown && items && items.length > 0) {
      window.onkeydown = (event) => {
        const length = items.length - 1
        if(event.keyCode === 37) {
          const elementId = currentSelection < 0 ? length : currentSelection - 1
          const el = document.getElementById(`elementFocusable${Math.max(0, elementId)}`)
          el && el.focus()
        } 
        if(event.keyCode === 39 || (event.keyCode === 13 && currentSelection < 0)) {
          const elementId = currentSelection < 0 ? 0 : currentSelection + 1
          const el = document.getElementById(`elementFocusable${Math.min(length, elementId)}`)
          el && el.focus()
        }
      }
      return () => {
        window.onkeydown = false
      }
    }
  }, [window.onkeydown, items])

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
                  setCurrentSelection={setCurrentSelection}
                  number={id}
                  focusedId={`elementFocusable${id}`}
                  account={account}
                  account_type={isWalletsView ? 'wallets' : 'withdraw_accounts'}
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
            <AccountsNotFound account_type={isWalletsView ? 'wallets' : 'withdraw_accounts'} />
      }

      {
        (!props.loader) &&
        <AddNewItem
          label={`${isWithdrawView ? 'Añadir nueva cuenta de retiro' : 'Añadir nueva billetera'}`}
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

export default React.memo(withListCreator(AccountList))
