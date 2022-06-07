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
import { LazyLoaderPage } from "../dashBoard/dashboard-skeletons";
import loadable from "@loadable/component";
import { MainContent,  AppContainerLayout} from '../widgets/layoutStyles'
import MobileMenuComponent from '../menu/mobileMenu'
import { AccountListViewSkeleton } from "../widgets/accountList/listView";



const WalletsContainerComponent = loadable(()=> import("../wallets/walletContainer"), {fallback:<AccountListViewSkeleton/>})
const WitdrawAccountContainer = loadable(() => import(/* webpackPrefetch: true */ "../withdrawAccounts/witdrawAccountContainer"), {fallback: <LazyLoaderPage path={"withdraw_accounts"} />});
const ReferralComponent = loadable(() => import("../referrals/referralsComponent"), {fallback: <LazyLoaderPage path={"referral"} />});
const SecurityCenter = loadable(() => import("../securityCenter/securityCenter"), {fallback: <LazyLoaderPage path={"security"} />});

const HomeContainer = () => {

  const subMenuRef = useRef()

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
              <MainContent className={`_contentContainer ${renderProps?.match?.params?.primary_path}`}>
                <Suspense fallback={<LazyLoaderPage path={renderProps?.match?.params?.primary_path} />}>
                  <Switch>
                    <Route path="/wallets" render={renderProps => <WalletsContainerComponent {...renderProps} subMenuRef={subMenuRef}/>} />
                    <Route path="/withdraw_accounts" component={WitdrawAccountContainer} />
                    <Route path="/referral" component={ReferralComponent} />
                    <Route path="/security" component={SecurityCenter} />
                    {/* <Route path="/security" render={() => (<LazyLoaderPage path={"security"} />)} /> */}
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
