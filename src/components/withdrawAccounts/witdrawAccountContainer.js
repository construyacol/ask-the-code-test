import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { navigation_components } from '../api/ui/api.json'
import { Router, Route } from 'react-router-dom'
import AccountList from '../widgets/accountList/account-list'
// import SimpleLoader from '../widgets/loaders'
import PropTypes from 'prop-types'
import { AccountListSkeletonLoader } from '../dashBoard/dashboard-container'
import { WalletDetail } from '../wallets/walletContainer'
import ActivityView from '../wallets/views/activity'
import withdrawActivity from '../wallets/views/withdraw-activity'

function WitdrawAccountContainer(props) {

  // userWallets, lo utilozamos para hacer validación de la respuesta del API
  const title = "Mis Cuentas de retiro"

  useEffect(() => {
    props.action.cleanCurrentSection()
    props.action.CurrentForm('bank')
  }, [])

  const { items_menu } = navigation_components.wallets
  const { withdraw_accounts, isAppLoaded, data, history } = props

  // console.log('||||||||||||||||||||||||||||||||| withdraw_accounts ', withdraw_accounts)

  return (
    <Router
      history={history}
    >

      <Route path={["/:primary_path/:path/:account_id/", "/:primary_path"]} render={routeProps => (
        <DetailContainerLayout
          items_menu={items_menu}
          title={title}
          {...props}
          {...routeProps}
        >
          <Route strict path="/:primary_path/:path/:account_id/:tx_path" component={(renderProps) => (
            <WalletDetail wallets={data} {...renderProps} />
          )} />
          <>
            <Route exact path="/:primary_path" component={() => (
              <>
                {
                  !withdraw_accounts ?
                    <AccountListSkeletonLoader />
                    :
                    (isAppLoaded && withdraw_accounts) &&
                    <AccountList isWithdrawView data={data} />
                }
              </>
            )} />
            <Route strict path={["/:primary_path/:path/:account_id/:tx_path"]} component={withdrawActivity} />
          </>
        </DetailContainerLayout>
      )} />

    </Router>
  )
}

WitdrawAccountContainer.propTypes = {
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  current_wallet: PropTypes.object,
  user: PropTypes.object,
  withdraw_accounts: PropTypes.array
}

function mapStateToProps({ modelData, ui, isLoading }) {
  const {
    user
  } = modelData

  const {
    isAppLoaded
  } = isLoading

  return {
    withdraw_accounts: user.withdraw_accounts,
    user,
    current_wallet: ui.current_section.params.current_wallet,
    currencies: modelData.currencies || null,
    isAppLoaded,
    data: modelData.withdraw_accounts
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WitdrawAccountContainer)
