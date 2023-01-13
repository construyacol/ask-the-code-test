import React, { Suspense, useRef } from "react";
// import loadable from "@loadable/component";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { HomeLayout } from "./homeLayout";
// import MenuPrincipalContainer from "../menuPrincipal/menu-principal-container";
// import MenuSuperiorContainer from "../menuSuperior/menuSuperiorContainer";
import MainMenuComponent from '../menu/mainMenu'
// import DashBoardContainer from "../dashBoard/dashboard-container";
// import { doLogout } from "../utils";
import withHandleError from "../withHandleError";
import SideMenuComponent from '../menu/sideMenu'
import { LazyLoaderPage } from "components/widgets/skeletons";
import loadable from "@loadable/component";
import { MainContent,  AppContainerLayout} from '../widgets/layoutStyles'
import MobileMenuComponent from '../menu/mobileMenu'
import { AccountListViewSkeleton } from "../widgets/accountList/listView";
import { parseQueryString } from '../../utils'
import { isSafari } from '../../utils'
import useFreshChat from 'services/FreshChat' 

// import { postLocalNotification } from 'utils'


const WalletsContainerComponent = loadable(()=> import("../wallets/walletContainer"), {fallback:<AccountListViewSkeleton/>})
const ReferralComponent = loadable(() => import("pages/referrals"), {fallback: <LazyLoaderPage path={"referral"} />});
const SettingsComponent = loadable(() => import("pages/settings"), {fallback: <LazyLoaderPage path={"settings"} />});

const HomeContainer = () => {
 
  const subMenuRef = useRef()
  useFreshChat()


  return (
    <Route
        path={["/:primary_path/:path", "/:primary_path"]}
        render={(renderProps) => (
          <HomeLayout>
            <SideMenuComponent {...renderProps}/>
            <AppContainerLayout 
              className={`appContainer ${renderProps?.match?.params?.path ? 'secondLayer' : ''}`}
              id="scrollElement"
              >
              <MainMenuComponent {...renderProps}/>
              <MobileMenuComponent/>
              <MainContent className={`_contentContainer ${isSafari()} ${renderProps?.match?.params?.primary_path} ${parseQueryString()}`}>
                <Suspense fallback={<LazyLoaderPage path={renderProps?.match?.params?.primary_path} />}>
                  <Switch> 
                    <Route path="/wallets" render={renderProps => <WalletsContainerComponent {...renderProps} subMenuRef={subMenuRef}/>} />
                    <Route path={["/referral"]} component={ReferralComponent} />
                    <Route path={["/settings/:settings_path", "/settings"]} component={SettingsComponent} />
                    {/* <Route path={["/settings/:settings_path", "/settings"]} render={() => (<LazyLoaderPage path={"settings"} />)} /> */}
                  </Switch>
                </Suspense>
              </MainContent>
            </AppContainerLayout>
          </HomeLayout>
        )}
      />
  );
};


HomeContainer.propTypes = {
  loader: PropTypes.bool,
  isSomeModalRendered: PropTypes.bool,
};

function mapStateToProps({ isLoading }) {
  return {
    loader: isLoading.loader,
  };
}

export default withHandleError(connect(mapStateToProps)(HomeContainer));
