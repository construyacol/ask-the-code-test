import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { navigation_components } from '../api/ui/api.json'
import { Router, Switch, Route } from 'react-router-dom'
import AccountList from '../widgets/accountList/item_account_list'
import ItemWallet from '../widgets/accountList/items'
// import SimpleLoader from '../widgets/loaders'
import PropTypes from 'prop-types'
import { AccountListLoader } from '../dashBoard/dashBoardContainer'

class WitdrawAccountContainer extends Component {

  // userWallets, lo utilozamos para hacer validación de la respuesta del API

  state = {
    title: "Mis Cuentas de retiro",
  }

  componentDidMount() {
    this.props.action.CurrentForm('bank')
  }

  componentWillUnmount() {
    this.props.action.current_section_clean()
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
    const { withdraw_accounts, isAppLoaded } = this.props

    console.log('||||||||||||||||||||||||||||||||| withdraw_accounts ', withdraw_accounts)

    return (
      <Router
        history={this.props.history}
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
                <AccountListLoader />
                :
                (isAppLoaded && withdraw_accounts) &&
                <Route exact path="/:primary_path" component={renderProps => (<AccountList {...renderProps} isWithdrawList={true} />)} />
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

function mapStateToProps(state) {
  const {
    user
  } = state.modelData

  const {
    isAppLoaded
  } = state.isLoading

  return {
    withdraw_accounts: user.withdraw_accounts,
    user: user,
    current_wallet: state.ui.current_section.params.current_wallet,
    currencies: state.modelData.currencies || null,
    isAppLoaded
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WitdrawAccountContainer)
