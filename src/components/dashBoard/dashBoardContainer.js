import React, {Component, Fragment} from 'react'
import localForage from 'localforage'

// import DashBoardLayout from './dashBoardLayout.js'
import {
  Element,
  Events,
  scrollSpy
} from "react-scroll";

import { Router, Route, Switch } from 'react-router-dom'
import WalletContainer from '../wallets/walletContainer'
import QuoteContainer from '../widgets/quote/quoteContainer'
import { connect } from 'react-redux'
import SimpleLoader from '../widgets/loaders'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import WitdrawAccountContainer from '../withdrawAccounts/witdrawAccountContainer'
import SettingsContainer from '../settings/settingsContainer'
import SecurityCenter from '../securityCenter/securityCenter'
import ReferralComponent from '../referrals/referralsComponent'
import PanelAlertContainer from '../widgets/panelAlert/panelAlertContainer'
import VideoPlayer from '../widgets/video_player/videoPlayer'
import PropTypes from 'prop-types'
import FreshChat from '../../services/freshChat'


import './dashboard.css'


class DashBoardContainer extends Component{


  async componentDidMount() {

    const restoreId = await localForage.getItem('restoreId')
    await FreshChat.init_user(this.props.user, '4b85e7f7-5161-4c8a-9978-bbc828369603')
    // return false
    await FreshChat.user_update(this.props.user)
    let verification_state = await this.props.action.get_verification_state()
    if(verification_state === 'accepted'){
        FreshChat.track('user login verified')
    }

    if(!this.props.user.security_center.authenticator.auth){
      FreshChat.show_tags(['security', '2factor'], 'article')
    }

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
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }


  render(){
    // console.log('|||||°°°°||||||| Este es el inicio del historial |||||°°°°|||||||', this.props.history)

    return(
      <Router
        history={this.props.history}
        >
          <Element id="containerElement" className="dashBoardLayout">
             <div className="sectionFixedPrice">
               <QuoteContainer/>
             </div>
             <div className="containerSection" name="firstInsideContainer">
                    {
                      !this.props.user ?
                      <DetailContainerLayout history={this.props.history}>
                        <SimpleLoader
                          color="blue"
                          label="Obteniendo datos del usuario"
                        />
                      </DetailContainerLayout>
                      :
                      <Fragment>
                          <Switch>
                            {/* <Route path="/wallets" render={() => <WalletContainer/>} /> */}
                              <Route path="/withdraw" component={WitdrawAccountContainer} />
                              <Route path="/settings" component={SettingsContainer} />
                              <Route path="/security" component={SecurityCenter} />
                              <Route path="/referral" component={ReferralComponent} />
                              <Route path="/wallets" component={WalletContainer} />

                              {/* <Redirect from="/" to="/wallets" /> */}


                              {/* <Route path={["/activity", "/"]} render={() => <ActivityContainer {...this.props}/>} /> */}
                              {/* <Redirect from="/" to="/activity" /> */}
                              {/* <Route exact path={["/activity", "/"]}  component={ActivityContainer}/> */}
                            </Switch>
                      </Fragment>
                    }
                  {
                    this.props.history.location.pathname === '/security' &&
                    <Fragment>
                          <PanelAlertContainer history={this.props.history}/>
                          <VideoPlayer></VideoPlayer>
                    </Fragment>
                  }

             </div>
          </Element>
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
    const { user, user_id } = state.model_data
  return{
    user:user[user_id]
  }
}

export default connect(mapStateToProps) (DashBoardContainer)
