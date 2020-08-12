import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../loaders'
import ItemAccount from './item_account'
import { AddNewItem2, AddNewItem } from '../buttons/buttons'
import { withRouter } from "react-router"
import IconSwitch from '../icons/iconSwitch'
import PropTypes from 'prop-types'
import { AccountListContainer } from './styles'

import '../../wallets/views/wallet_views.css'

class AccountList extends Component {

  state = {
    label: `Obteniendo tus ${this.props.path === 'wallets' ? 'Billeteras' : 'Cuentas de retiro'}`,
    account_state: "done",
    id_wallet_action: null,
    verified: false,
    state_verification: null
  }

  componentDidMount() {
    this.props.action.current_section_clean()
    this.init_component()
  }

  init_component = async () => {
    let state_verification = await this.props.action.get_verification_state()
    this.setState({ state_verification })
    let verified = await this.props.action.user_verification_status('level_1')
    await this.setState({ verified })
  }

  new_wallet = () => {

    if (this.state.state_verification === 'confirmed') {
      return this.wait_for_validate()
    }

    if (!this.state.verified) {
      return this.wanna_validate()
    }
    this.props.action.ToggleModal()
  }

  no_action = () => { }

  wait_for_validate = () => {
    this.props.action.confirmationModalToggle()
    this.props.action.confirmationModalPayload({
      title: "Estamos trabajando en esto...",
      description: "Hemos recibido satisfactoriamente tus datos de verificación, en breve podrás operar en coinsenda.",
      txtPrimary: "Entendido",
      action: this.no_action,
      svg: "verified"
    })
  }

  goto_verification = async () => {
    // await this.props.action.section_view_to('initial')
    // console.log('|||||| goto_verification ======>', this.props.user)

    let verification_state = await this.props.action.get_verification_state()


    if (verification_state === 'confirmed' || verification_state === 'pending') {
      await this.props.action.ToStep('globalStep', 2)
    }


    if (verification_state === 'rejected') {
      await this.props.action.ToStep('globalStep', 0)
    }

    await this.props.history.push(`/security`)
    setTimeout(() => {
      this.props.action.ToggleModal()
    }, 0)
  }


  wanna_validate = () => {
    let message = this.props.path === 'wallets' ? 'billeteras crypto/fiat.' :
      this.props.path === 'withdraw_accounts' ? ' cuentas de retiro fiat.' : ''

    this.props.action.confirmationModalToggle()
    this.props.action.confirmationModalPayload({
      title: "Aún no estas listo para esto...",
      description: `Debes completar el nivel de verificación avanzada para poder agregar ${message}`,
      txtPrimary: "Verificarme",
      txtSecondary: "Cancelar",
      payload: 'account_id',
      action: (this.goto_verification),
      svg: "verified"
    })
  }

  render() {

    const {
      path
    } = this.props

    const item_list = this.props.item_list
    const isHugeContainer = item_list > 10
    const styleForHugeContainer = {
      height: 'auto',
    }
    const isWithdrawListStyle = {
      marginBottom: '40px'
    }

    return (
      <Fragment>
        {
          (item_list && item_list.length > 0) ?
            <AccountListContainer style={isHugeContainer ? {...styleForHugeContainer, ...isWithdrawListStyle} : isWithdrawListStyle} className="AccountListContainer">
              {
                item_list.map((account, id) => {
                  if (!account.visible) { return null }
                  return <ItemAccount
                    key={id}
                    account={account}
                    account_type={path}
                    actions
                    {...this.props}
                  />
                })
              }
            </AccountListContainer>
            :
            this.props.loader ?
              <SimpleLoader
                color="blue"
                label={this.state.label}
              />
              :
              (item_list.length < 1 && !this.props.loader) &&
              <AccountsNotFound account_type={path} />
        }

        {
          (!this.props.loader && path === 'wallets') ?
          <AddNewItem2
            label={`${path === 'withdraw_accounts' ? 'Añadir nueva cuenta de retiro' : 'Añadir nueva billetera'}`}
            type="primary"
            handleClick={this.new_wallet}
          />
          :
          (!this.props.loader) &&
          <AddNewItem
            label={`${path === 'withdraw_accounts' ? 'Añadir nueva cuenta de retiro' : 'Añadir nueva billetera'}`}
            type="primary"
            handleClick={this.new_wallet}
          />
        }

      </Fragment>
    )
  }
}




AccountList.propTypes = {
  all_pairs: PropTypes.object,
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  current_wallet: PropTypes.object,
  deposit_providers: PropTypes.object,
  have_items: PropTypes.number,
  item_list: PropTypes.array,
  loader: PropTypes.bool,
  path: PropTypes.string,
  user: PropTypes.object
}




function mapStateToProps(state, props) {


  let path = props.match.params.primary_path

  const {
    user,
    withdrawProviders
  } = state.modelData

  // console.log(path, user, withdrawProviders)
  let withdraw_provider_list = null

  if(path !== 'wallets' && withdrawProviders) {
    withdraw_provider_list = []
    Object.keys(withdrawProviders).map(key => withdraw_provider_list.push(withdrawProviders[key]))
  }

  let item_list = []


  item_list = user[path].map((item_id) => {
    if (path === 'withdraw_accounts' && state.modelData[path][item_id].currency_type === 'crypto') { return false }
    return state.modelData[path][item_id]
  })

  return {
    item_list: item_list,
    path,
    have_items: user[path] && user[path].length,
    deposit_providers: path !== 'wallets' ? null : state.modelData.deposit_providers,
    withdrawProviders: withdraw_provider_list,
    user: state.modelData.user,
    loader: state.isLoading.loader
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountList))







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
