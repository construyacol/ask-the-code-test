import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { navigation_components } from '../api/ui/api.json'
import { Router, Switch, Route } from 'react-router-dom'
import AccountList from '../widgets/accountList/account-list'
import ItemWallet from '../widgets/accountList/items'
// import SimpleLoader from '../widgets/loaders'
import PropTypes from 'prop-types'
import { AccountListSkeletonLoader } from '../dashBoard/dashboard-container'

class WitdrawAccountContainer extends Component {

  // userWallets, lo utilozamos para hacer validación de la respuesta del API

  state = {
    title: "Mis Cuentas de retiro",
  }

  componentDidMount() {
    this.props.action.CurrentForm('bank')
  }

  componentWillUnmount() {
    this.props.action.cleanCurrentSection()
  }

  wallet_detail = props => {

    return (
      <>
        {
          this.props.current_wallet &&
          <section className="WalletContainer">
            <ItemWallet
              wallet={this.props.current_wallet}
              history={props.history}
            />
          </section>
        }
      </>
    )
  }


  render() {
    const { items_menu } = navigation_components.wallet
    const { title } = this.state
    const { withdraw_accounts, isAppLoaded, data, history } = this.props

    // console.log('||||||||||||||||||||||||||||||||| withdraw_accounts ', withdraw_accounts)

    return (
      <Router
        history={history}
      >
        <Switch>
          <DetailContainerLayout
            items_menu={items_menu}
            title={title}
            {...this.props}
            {...this.state}
          >
            {
              !withdraw_accounts ?
                <AccountListSkeletonLoader />
                :
                (isAppLoaded && withdraw_accounts) &&
                <AccountList isWithdrawView data={data} />
            }
          </DetailContainerLayout>
        </Switch>
      </Router>
    )
  }
}

WitdrawAccountContainer.propTypes = {
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  current_wallet: PropTypes.object,
  user: PropTypes.object,
  withdraw_accounts: PropTypes.array
}

function mapStateToProps({ modelData, ui, isLoading}) {
  const {
    user
  } = modelData

  const {
    isAppLoaded
  } = isLoading

  return {
    withdraw_accounts: user.withdraw_accounts,
    user: user,
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
