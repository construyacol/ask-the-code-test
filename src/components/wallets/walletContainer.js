import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { Switch, Route } from 'react-router-dom'
import DepositView from './views/deposit'
import ActivityView from './views/activity'
import WithdrawView from './views/withdraw'
import SwapView from './views/swap'
import AccountList from '../widgets/accountList/item_account_list'
import ItemAccount from '../widgets/accountList/item_account'
// import ItemAccount from './item_account'
import { useCoinsendaServices } from '../../services/MainService'

import SimpleLoader from '../widgets/loaders'
import PropTypes from 'prop-types'
import { matchItem } from '../../utils'

function WalletContainer(props) {

  const staticState = {
    title: "Mis billeteras",
    userWallets: true, //solo lo uso para validar si se estan haciendo consultas al API
  }

  const [ coinsendaServices ] = useCoinsendaServices()

  const getShortCurrency = async (wallet) => {
    if (props.currencies && wallet) {
      const currencies = props.currencies
      const currency_source = wallet.currency.currency
      const currency = await matchItem(currencies, { primary: currency_source }, 'view')
      return props.action.current_section_params({
        short_name: currency.code
      })
    }
  }

  //
  useEffect(() => {

    let initServices = async() => {
      await coinsendaServices.fetchAllPairs()
      await coinsendaServices.fetchAllCurrencies()
      await coinsendaServices.getPairsByCountry(props.user.country)
      if(!props.deposit_providers){await coinsendaServices.fetchDepositProviders()}  //TODO: to refactor, at the moment it is temporary
      if(!props.withdrawProviders){await coinsendaServices.fetchWithdrawProviders()}  //TODO: to refactor, at the moment it is temporary
      if(!props.withdraw_accounts){await coinsendaServices.fetchWithdrawAccounts()}  //TODO: to refactor, at the moment it is temporary
    }

    initServices()

    const path = props.match.path.replace('/', '')
    props.action.CurrentForm(path)
    return () => {
      props.action.section_view_to('initial')
      props.action.current_section_clean()
    }
  }, [])

  return (
    <Switch>
      <Route path={["/:primary_path/:path/:account_id/", "/:primary_path"]} render={routeProps => (
        <DetailContainerLayout
          {...props}
          {...routeProps}
        >
          <Route strict path="/:primary_path/:path/:account_id" component={(renderProps) => (<WalletDetail {...props} {...renderProps} />)} />
          {
            !props.isAppLoaded ?
              <SimpleLoader />
              :
              <>
                <Route exact path="/:primary_path" component={AccountList} />
                <Route strict path="/:primary_path/:path/:account_id/:tx_path" component={ActivityView} />
                <Route exact path="/:primary_path/:path/:account_id" component={SwitchView} />
              </>
          }
        </DetailContainerLayout>
      )} />
    </Switch>
  )

}

const WalletDetail = props => {
  const {
    wallets,
    match: { params }
  } = props

  return (
    <section className="WalletContainer">
      <ItemAccount
        key={params.account_id}
        account={wallets[params.account_id]}
        account_type={params.primary_path}
      />
    </section>
  )
}

// TODO: review re-rendered on this component every time, no performance here
const SwitchView = props => {
  const { params } = props.match
  const Views = {
    deposit: (<DepositView {...props} />),
    withdraw: (<WithdrawView {...props} />),
    swap: <SwapView {...props} />
  }

  return Views[params.path]
}


WalletContainer.propTypes = {
  all_pairs: PropTypes.object,
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  user: PropTypes.object,
  deposit_providers: PropTypes.object, //TODO: to refactor, at the moment it is temporary
  withdrawProviders: PropTypes.object, //TODO: to refactor, at the moment it is temporary
  withdraw_accounts: PropTypes.object, //TODO: to refactor, at the moment it is temporary
}

function mapStateToProps({ modelData, isLoading }) {
  const {
    user,
    all_pairs,
    wallets,
    deposit_providers, //TODO: to refactor, at the moment it is temporary
    withdrawProviders, //TODO: to refactor, at the moment it is temporary
    withdraw_accounts //TODO: to refactor, at the moment it is temporary
  } = modelData

  const {
    isAppLoaded
  } = isLoading

  return {
    all_pairs,
    user: user,
    currencies: modelData.currencies || null,
    wallets,
    isAppLoaded,
    deposit_providers, //TODO: to refactor, at the moment it is temporary
    withdrawProviders, //TODO: to refactor, at the moment it is temporary
    withdraw_accounts, //TODO: to refactor, at the moment it is temporary

  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)
