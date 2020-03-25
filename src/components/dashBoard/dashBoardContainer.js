import React, {Component, Fragment, Suspense} from 'react'
import { hotjar } from 'react-hotjar';

import {
  Element,
  Events,
  scrollSpy
} from "react-scroll";
//
import { Router, Route, Switch } from 'react-router-dom'
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


const WitdrawAccountContainer = React.lazy(() => import('../withdrawAccounts/witdrawAccountContainer'))
// const SettingsContainer = React.lazy(() => import('../settings/settingsContainer'))
const SecurityCenter = React.lazy(() => import('../securityCenter/securityCenter'))
const ReferralComponent = React.lazy(() => import('../referrals/referralsComponent'))



class DashBoardContainer extends Component{

  _updateCurrentPair

  async componentDidMount() {

    // clearInterval(this._updateCurrentPair)
    // this._updateCurrentPair = setInterval(()=>{
    //   let query =`{"where":{"buy_pair":"${this.props.currentPair && this.props.currentPair.buy_pair}"}}`
    //   this.props.action.update_current_pair(query, 'currentPair')
    // }, 45000)

    hotjar.initialize(1688041, 6);
    await this.props.action.freshchat_init_user(this.props.user)
    // return false
    await FreshChat.user_update(this.props.user)
    let verification_state = await this.props.action.get_verification_state()
    if(verification_state === 'accepted'){
        FreshChat.track('user login verified')
    }

    if(!this.props.user.security_center.authenticator.auth){
      FreshChat.show_tags(['security', '2factor'], 'article')
    }

    // console.log('|||||||||||||||||||||||||||||||||||||||||||||||| DashBoardContainer', this.props.action.update_current_pair, this.props)
    // if(this.props.user)
    // console.log('|||||||||||||||||_____________________________________- window.tiggered', verification_state, this.props)
    // console.log('|||||||||||||||||_____________________________________- window.tiggered', this.props, window.fcWidget)
    // FreshChat.track('track_item', {puta:'traqueteada mas hpta a usuario logeado'})
    // Events.scrollEvent.register("begin", function() {
    //   // console.log("begin", arguments);
    // });
    // Events.scrollEvent.register("end", function() {
    //   // console.log("end", arguments);
    // });

    scrollSpy.update();
  }


  componentWillUnmount() {
    clearInterval(this._updateCurrentPair)
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }


  render(){
    // console.log('|||||°°°°||||||| Este es el inicio del historial |||||°°°°|||||||', this.props)

    return(
      <Router
        history={this.props.history}
        >
          <Fragment>
            <Element id="containerElement" className="dashBoardLayout">
               <div className="sectionFixedPrice">
                 <QuoteContainer/>
               </div>
               <div className="containerSection" name="firstInsideContainer">

                        <Suspense fallback={<LazyLoaderPage path={this.props.primary_path}/>}>
                            <Switch>
                                <Route path="/wallets" component={WalletContainer} />
                                <Route path="/withdraw_accounts" render={(props)=>(<WitdrawAccountContainer {...props} {...this.props}/>)} />
                                <Route path="/security" render={(props)=>(<SecurityCenter {...props} {...this.props} />)} />
                                <Route path="/referral" render={(props)=>(<ReferralComponent {...props} {...this.props}/>)} />
                                {/* <Route path="/settings" component={SettingsContainer} /> */}
                                {/* <Route path="/security" render={()=>(<LazyLoaderPage path={this.props.primary_path}/>)}/> */}
                              </Switch>
                        </Suspense>

                      {
                        this.props.primary_path === 'security' &&
                        <Fragment>
                              <PanelAlertContainer history={this.props.history}/>
                              <VideoPlayer></VideoPlayer>
                        </Fragment>
                      }
               </div>
            </Element>
          </Fragment>
      </Router>
    )
  }
}


DashBoardContainer.propTypes = {
  activeRoute:PropTypes.string,
  all_pairs:PropTypes.object,
  app_loaded:PropTypes.bool,
  current:PropTypes.string,
  loader:PropTypes.bool,
  logOut:PropTypes.func,
  modalConfirmation:PropTypes.bool,
  modalView:PropTypes.string,
  modalVisible:PropTypes.bool,
  other_modal:PropTypes.bool,
  token:PropTypes.string,
  user:PropTypes.object,
  wallets:PropTypes.object
}




function mapStateToProps(state, props){

    const { user, user_id } = state.modelData
    const { currentPair } = state.modelData.pairs

  return{
    user:user[user_id],
    primary_path:props.match.params && props.match.params.primary_path,
    currentPair
  }
}

export default connect(mapStateToProps) (DashBoardContainer)



const LazyLoaderPage = ({path}) => {

  let title = path === 'withdraw_accounts' ? 'Cuentas de retiro' : 'Cargando...'
  let LoaderScreen = path === 'withdraw_accounts' ? AccountListLoader : path === 'security' ? SecurityCenterLoader : SimpleLoader

  return(
    <DetailContainerLayout
      title={title}
      >
      <LoaderScreen/>
    </DetailContainerLayout>
  )
}




const AccountListLoader = props => {
  return(
      <AccountListContainer className="AccountListContainer">
        <ItemAccount loader/>
      </AccountListContainer>
  )
}


const SecurityCenterLoader = props => {

  const elements = (window.innerWidth < 768) ? 10 : 5
  const loaderList = new Array(elements).fill({})

  return(
    <Fragment>
      {
        loaderList.map((item, key) => {
          return(<SecurityLayoutLoader id="security_loader" className="SecurityLayoutLoader" key={key}>
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
    </Fragment>
  )
}






//
