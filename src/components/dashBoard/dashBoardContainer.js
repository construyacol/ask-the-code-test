import React, {Component, Fragment} from 'react'
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

import './dashboard.css'


class DashBoardContainer extends Component{


  init_user_freshChat = async(user) => {
    // var restoreId = RESTOREID //Which need to be fetched from your DB
      var restoreId

      await window.fcWidget.init({
        token: "516c4588-f5f6-409f-8972-ffd3ec9aede5",
        host: "https://wchat.freshchat.com",
        externalId: '223312322332',
        restoreId: restoreId ? restoreId : null
      });

      window.fcWidget.user.get(function(resp) {
        var status = resp && resp.status,
            data = resp && resp.data;
        if (status !== 200) {
          window.fcWidget.user.setProperties({
            firstName:user.name,
            lastName:user.surname,
            email: "erickOspina7@hotmail.com",
            phone:user.phone
          });
          console.log('||||||||| _______________________ init_user_freshChat: ', resp, window.fcWidget)

          window.fcWidget.on('user:created', function(resp) {
            // El usuario se crea cuando inicia el chat
            var status = resp && resp.status,
                data = resp && resp.data;
                console.log('___________ user:created', resp)
            if (status === 200) {
              if (data.restoreId) {
                console.log('___________ restoreId', data.restoreId)
                // Update restoreId in your database
              }
            }
          });
        }
      });
  }



  componentDidMount() {

    // console.log('________________________|||||||||| DATOS USUARIOS ||||||||||_______:', window.fcWidget, this.props.user)
      // window.fcWidget.setExternalId(this.props.user.id);
      // window.fcWidget.user.setFirstName(this.props.user.name);
      // window.fcWidget.user.setLastName(this.props.user.surname);
      // window.fcWidget.user.setEmail(this.props.user.email);

      // window.fcWidget.init({
      //   token: "516c4588-f5f6-409f-8972-ffd3ec9aede5",
      //   host: "https://wchat.freshchat.com",
      //   // externalId: this.props.user.id,     // user’s id unique to your system
      //   externalId:'123',     // user’s id unique to your system
      //   restoreId:'123',
      //   firstName: this.props.user.name,              // user’s first name
      //   lastName:this.props.user.surname,                // user’s last name
      //   email: "erickOspina7@hotmail.com",    // user’s email address
      //   phone: this.props.user.phone,            // phone number without country code
      //   phoneCountryCode: "+57"          // phone’s country code
      // })

    this.init_user_freshChat(this.props.user)

    Events.scrollEvent.register("begin", function() {
      // console.log("begin", arguments);
    });
    Events.scrollEvent.register("end", function() {
      // console.log("end", arguments);
    });
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
