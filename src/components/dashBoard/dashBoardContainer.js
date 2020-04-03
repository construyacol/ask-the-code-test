import React, { Suspense, useEffect } from 'react'
import { hotjar } from 'react-hotjar';
import {
  Element,
  Events,
  scrollSpy
} from "react-scroll";
//
import { Route, Switch } from 'react-router-dom'
import WalletContainer from '../wallets/walletContainer'
import QuoteContainer from '../widgets/quote/quoteContainer'
import { connect } from 'react-redux'
// import WitdrawAccountContainer from '../withdrawAccounts/witdrawAccountContainer'
// import SettingsContainer from '../settings/settingsContainer'
// import SecurityCenter from '../securityCenter/securityCenter'
// import ReferralComponent from '../referrals/referralsComponent'
import PanelAlertContainer from '../widgets/panelAlert/panelAlertContainer'
import VideoPlayer from '../widgets/video_player/videoPlayer'
import PropTypes from 'prop-types'
import FreshChat from '../../services/freshChat'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import SimpleLoader from '../widgets/loaders'
import ItemAccount from '../widgets/accountList/item_account'
import { AccountListContainer } from '../widgets/accountList/styles'

import {
  ItemSecurity,
  SecurityLayoutLoader
} from '../securityCenter/styles'
// import styled from 'styled-components'

import './dashboard.css'
import { bindActionCreators } from 'redux';
import actions from '../../actions';


const WitdrawAccountContainer = React.lazy(() => import('../withdrawAccounts/witdrawAccountContainer'))
// const SettingsContainer = React.lazy(() => import('../settings/settingsContainer'))
const SecurityCenter = React.lazy(() => import('../securityCenter/securityCenter'))
const ReferralComponent = React.lazy(() => import('../referrals/referralsComponent'))

const UPDATE_CURRENT_PAIR_INTERVAL_ID = 0
function DashBoardContainer(props) {
  const onMount = async () => {
    hotjar.initialize(1688041, 6);
    await props.action.freshchat_init_user(props.user)
    await FreshChat.user_update(props.user)
    const verification_state = await props.action.get_verification_state()
    if (verification_state === 'accepted') {
      FreshChat.track('user login verified')
    }

    if (!props.user.security_center.authenticator.auth) {
      FreshChat.show_tags(['security', '2factor'], 'article')
    }
    scrollSpy.update();
  }

  const onUnmount = () => {
    clearInterval(UPDATE_CURRENT_PAIR_INTERVAL_ID)
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  useEffect(() => {
    onMount()
    return onUnmount
  }, [])

  return (
    <Element id="containerElement" className="dashBoardLayout">
      <div className="sectionFixedPrice">
        <QuoteContainer />
      </div>
      <div className="containerSection" name="firstInsideContainer">
        <Suspense fallback={<LazyLoaderPage path={props.primary_path} />}>
          <Switch>
            <Route path="/wallets" component={WalletContainer} />
            <Route path="/withdraw_accounts" component={WitdrawAccountContainer} />
            <Route path="/security" component={SecurityCenter} />
            <Route path="/referral" component={ReferralComponent} />
          </Switch>
        </Suspense>

        {
          props.primary_path === 'security' &&
          <>
            <PanelAlertContainer history={props.history} />
            <VideoPlayer />
          </>
        }
      </div>
    </Element>
  )
}

DashBoardContainer.propTypes = {
  activeRoute: PropTypes.string,
  all_pairs: PropTypes.object,
  isAppLoaded: PropTypes.bool,
  current: PropTypes.string,
  loader: PropTypes.bool,
  logOut: PropTypes.func,
  modalConfirmation: PropTypes.bool,
  modalView: PropTypes.string,
  isModalVisible: PropTypes.bool,
  otherModal: PropTypes.bool,
  token: PropTypes.string,
  user: PropTypes.object,
  wallets: PropTypes.object
}




function mapStateToProps(state, props) {

  const { user, wallets, all_pairs } = state.modelData
  const { currentPair } = state.modelData.pairs

  return {
    user,
    primary_path: props.match.params && props.match.params.primary_path,
    currentPair,
    wallets,
    all_pairs
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoardContainer)

const LazyLoaderPage = ({ path }) => {
  const title = path === 'withdraw_accounts' ? 'Cuentas de retiro' : 'Cargando...'
  const LoaderScreen = path === 'withdraw_accounts' ? AccountListLoader : path === 'security' ? SecurityCenterLoader : SimpleLoader

  return (
    <DetailContainerLayout title={title}>
      <LoaderScreen />
    </DetailContainerLayout>
  )
}

const AccountListLoader = () => {

  return (
    <AccountListContainer className="AccountListContainer">
      <ItemAccount loader />
    </AccountListContainer>
  )
}

const SecurityCenterLoader = () => {
  const elements = (window.innerWidth < 768) ? 10 : 5
  const loaderList = new Array(elements).fill({})

  return (
    <>
      {
        loaderList.map((_, key) => {
          return (<SecurityLayoutLoader id="security_loader" className="SecurityLayoutLoader" key={key}>
            <ItemSecurity className="loader ItemSecurity">
              <div className="SCimgItem">
                <div className="SCimgItemCont"></div>
              </div>
              <div className="contentSubItem last">
                <div className="contentSubText">
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <div className="SCcta"></div>
              </div>
            </ItemSecurity>
          </SecurityLayoutLoader>)
        })
      }
    </>
  )
}
