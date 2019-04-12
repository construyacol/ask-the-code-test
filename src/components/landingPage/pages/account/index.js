import React from 'react';
import { Router, Switch, Route } from 'react-router'
import ProfilePage from '../../components/Profile'
import WalletCop from '../../components/Wallets/Cop'
import WalletBtc from '../../components/Wallets/Btc'
import WalletRef from '../../components/Wallets/Ref'
import Balances from '../../components/Balances'
import Referrals from '../../components/Referrals'
import Faq from '../../components/FAQ'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import { connect } from 'react-redux'
import { fetchWallets } from '../../actions/wallets'
import { fetchDepositCollection } from '../../actions/deposit'
import { fetchWithdrawCollection } from '../../actions/withdraw'
import { fetchOrderCollection } from '../../actions/order'
import { fetchWithdrawProvider } from '../../actions/withdrawProvider'
import { fetchDepositProvider } from '../../actions/depositProvider'

import DashboardDefault from '../../components/Dashboard'
import SideMenu from './SideMenu'
class Dashboard extends React.Component {
  componentDidMount () {
    Promise.all([
      this.props.fetchWallets(this.props.token),
      this.props.fetchOrders(this.props.token),
      this.props.fetchDeposits(this.props.token),
      this.props.fetchWithdraws(this.props.token),
      this.props.fetchWithdrawProvider(this.props.token),
      this.props.fetchDepositProvider(this.props.token)
    ])
    .catch(error => console.log(
      '%c Some fetch failed',
      'color: orange; background-color: #333; padding: 2px'
    ))
  }
  render () {
    return (
      <Grid fluid>
        <Row>
          <SideMenu />
          <Router history={this.props.history}>
            <Switch>
              <Route path="/user/profile" component={ProfilePage} />
              <Route path="/user/wallets/cop" component={WalletCop} />
              <Route path="/user/wallets/btc" component={WalletBtc} />
              <Route path="/user/wallets/ref" component={WalletRef} />
              <Route path="/user/balance" component={Balances} />
              <Route path="/user/referrals" component={Referrals} />
              <Route path="/user/help" component={Faq} />
              <Route path="*" component={DashboardDefault} />
            </Switch>
          </Router>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchWallets: token => dispatch(fetchWallets(token)),
    fetchDeposits: token => dispatch(fetchDepositCollection(token)),
    fetchWithdraws: token => dispatch(fetchWithdrawCollection(token)),
    fetchOrders: token => dispatch(fetchOrderCollection(token)),
    fetchWithdrawProvider: token => dispatch(fetchWithdrawProvider(token)),
    fetchDepositProvider: token => dispatch(fetchDepositProvider(token))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
