import React, {Component, Fragment} from 'react'
// import DashBoardLayout from './dashBoardLayout.js'
import {
  Link,
  Element,
  Events,
  scrollSpy
} from "react-scroll";

import { Router, Route, Switch, Redirect } from 'react-router-dom'
import WalletContainer from '../wallets/walletContainer'
import QuoteContainer from '../widgets/quote/quoteContainer'
import { connect } from 'react-redux'
import SimpleLoader from '../widgets/loaders'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import WitdrawAccountContainer from '../withdrawAccounts/witdrawAccountContainer'
import ActivityContainer from '../activity/activityContainer'
import SettingsContainer from '../settings/settingsContainer'
import SecurityCenter from '../securityCenter/securityCenter'

import './dashboard.css'


class DashBoardContainer extends Component{

  componentDidMount() {
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

  // WalletContainer = () =>{
  //
  // }


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
                    {/* los componentes solo se podrán mostrar si tenemos el modelo de usuario cargado, este es llamado actualmente en homeContainer */}
                    {
                      !this.props.user ?
                      <DetailContainerLayout>
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
                              <Route strict path={["/wallets", "/"]} component={WalletContainer} />
                              {/* <Route path={["/activity", "/"]} render={() => <ActivityContainer {...this.props}/>} /> */}



                              {/* <Redirect from="/" to="/activity" /> */}
                              {/* <Route exact path={["/activity", "/"]}  component={ActivityContainer}/> */}
                            </Switch>
                      </Fragment>
                    }
             </div>
          </Element>
      </Router>
    )
  }
}

function mapStateToProps(state, props){
  return{
    user:state.model_data.user ? state.model_data.user : null
  }
}

export default connect(mapStateToProps) (DashBoardContainer)
