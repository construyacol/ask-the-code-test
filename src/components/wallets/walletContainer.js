import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { Route } from 'react-router-dom'
import DepositView from './views/deposit'
import ActivityView from './views/activity'
// import WithdrawView from './views/withdraw'
import WithdrawView from './views/withdraw'
import SwapView from './views/swap'
import AccountList from '../widgets/accountList/account-list'
import ItemAccount from '../widgets/accountList/item_account'
import SimpleLoader from '../widgets/loaders'
import PropTypes from 'prop-types'



function WalletContainer(props) {

  useEffect(() => {
    const path = props.match.path.replace('/', '')
    props.action.CurrentForm(path)
    return () => {
      props.action.section_view_to('initial')
      // props.action.cleanCurrentSection()
    }
  }, [])

  return (
    <Route path={["/:primary_path/:path/:account_id/", "/:primary_path"]} render={routeProps => (
      <DetailContainerLayout
        {...props}
        {...routeProps}
      >
        <Route strict path="/:primary_path/:path/:account_id" render={({ match }) => (
          <WalletDetail wallets={props.wallets} match={match} />
        )} />
        {
          !props.isAppLoaded ?
            <SimpleLoader />
            :
            <>
              <Route exact path="/:primary_path" render={() => (<AccountList {...routeProps} isWalletsView />)} />
              <Route strict path="/:primary_path/:path/:account_id/:tx_path" component={ActivityView} />
              <Route exact path="/:primary_path/:path/:account_id" render={() => <SwitchView {...routeProps} />} />
            </>
        }
      </DetailContainerLayout>
    )} />
  )

}

export const WalletDetail = props => {
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
        isStatic={true}
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
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  user: PropTypes.object,
}

function mapStateToProps({ modelData, isLoading }) {
  const {
    user,
    wallets,
  } = modelData

  const {
    isAppLoaded
  } = isLoading

  return {
    user,
    wallets,
    isAppLoaded,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)
