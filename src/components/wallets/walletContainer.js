import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import loadable from "@loadable/component";
import actions from "../../actions";
import { bindActionCreators } from "redux";
// import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import { Route } from "react-router-dom";
// import ItemAccount from "../widgets/accountList/item_account";
// import SimpleLoader from "../widgets/loaders";
import ActivityView from "./views/activity";
import PropTypes from "prop-types";
import { AccountListSkeletonLoader } from "../dashBoard/dashboard-skeletons";
import { SkeletonDepositView } from './views/depositCripto'
import { SkeletonSwapView } from './views/swap'
import SkeletonWithdrawView from "./views/withdrawCripto/skeleton";
import "./views/wallet_views.css";
import { AccountDetailLayout, AccountDetailContainer } from '../widgets/layoutStyles'
import TitleSection, { SubTitleSection } from '../widgets/titleSectionComponent'
import SubMenuComponent from '../menu/subMenu'

import { useWalletInfo } from "../../hooks/useWalletInfo";
import styled from 'styled-components'
import BalanceComponent from "../widgets/balance/balance";

// import useViewport from '../../hooks/useWindowSize'

const LazyWithdrawView = loadable(() => import("./views/withdraw"), { fallback: <SkeletonWithdrawView/> });
const LazyAccountList = loadable(() => import("../widgets/accountList/account-list"), { fallback: <AccountListSkeletonLoader /> });
const LazySwapView = loadable(() => import("./views/swap"), { fallback: <SkeletonSwapView/> });
const LazyDepositView = loadable(() => import("./views/deposit"), { fallback: <SkeletonDepositView/> });

function WalletContainer(props) {
  // const actionDispatch = useActions()
  useEffect(() => {
    const path = props.match.path.replace("/", "");
    props.action.CurrentForm(path);
    return () => {
      props.action.section_view_to("initial");
      // props.action.cleanCurrentSection()
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Route
        exact
        path="/:primary_path"
        render={(routeProps) => <LazyAccountList {...routeProps} isWalletsView />}
      />
      <Route 
        exact
        path={"/:primary_path/:path/:account_id"}
        render={(routeProps) => (
          <AccountDetail {...props} {...routeProps} />
        )}
      />
      <Route
        strict
        path="/:primary_path/:path/:account_id/:tx_path"
        render={(routeProps) => (
          <AccountDetail {...props} {...routeProps} />
        )}
      />
    </>
  );
}


export const HeaderAccount = (props) => {
  return(
    <HeaderContainer>
      {props.children}
      <MainComponent/>
    </HeaderContainer>
  )
}

export const MainComponent = () => {

  const { currentWallet } = useWalletInfo()
  const balanceTextWidth = useRef({clientWidth:50})

  return(
    <HeaderMainContainer className="_accountHeaderMainContainer">
        <IconAccount className={`_${currentWallet?.currency?.currency}`}/>
        <LabelContainer className="_header__labelContainer">
          <AccountLabel>{currentWallet?.name || 'Mi billetera'}</AccountLabel>
          <CurrencyLabel>{currentWallet?.currency?.currency || '-'}</CurrencyLabel>
        </LabelContainer>
        <BalanceContainer 
          className="_accountBalanceContainer"
          balanceWidth={`${balanceTextWidth?.current?.clientWidth}px`}
        >
          <HR/>
          <BalanceComponent 
            account_id={currentWallet?.id} 
            textBalanceRef={balanceTextWidth}
          />
        </BalanceContainer>
    </HeaderMainContainer>
  )
}

export const HR = styled.div`
  height: 40px;
  width: 1px;
  background: #cdcdcd;
  align-self: center;
`

export const BalanceContainer = styled.div`
  min-width: 50px;
  display:flex;
  column-gap: 15px;
  p{
    color: var(--paragraph_color);
  }

  .balanceTitle{
    margin:0;
    color: #9d9d9d;
    font-size: 13px !important;
    text-transform: uppercase;
  }

  .BalanceComponent{
    grid-template-rows: auto 1fr !important;
    width:${props => props.balanceWidth};
  }

  .textin{
    text-shadow: none;
    font-size:23px;
    width: max-content;
  }
`

export const IconAccount = styled.div`
  height:42px;
  width:42px;
  border-radius:4px;
  border: 1px solid #d1d1d1;
  background: linear-gradient(to right,#11998e,#38ef7d);
  &._bitcoin{
    background: linear-gradient(to right,#f9a847, #f98900);
  }
`

export const P = styled.p`
  font-family: "Raleway", sans-serif;
  margin:0;
`

export const AccountLabel = styled(P)`
  color: var(--paragraph_color);
  font-size: 18px;
  font-weight: 600;
`

export const CurrencyLabel = styled(P)`
    text-transform: uppercase;
    color: #9d9d9d;
    font-size: 13px;
`


export const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 3px;
  padding-right:10px;
`

export const HeaderMainContainer = styled.div`
  height: 100%;
  width: auto;
  min-width:200px;
  display: flex;
  place-self: flex-end;
  align-items: center;
  column-gap: 15px;
  ${'' /* background: #e3e3e3; */}

  ${'' /* _accountHeaderMainContainer */}
`

export const HeaderContainer = styled.div`
  heigth: auto;
  min-heigth:80px;
  display:grid;
  grid-template-columns:auto 1fr;
`
 
export const AccountDetail = (props) => {

  const { match: { params } } = props;
  // const { isMovilViewport } = useViewport()

  return ( 
          <AccountDetailLayout className="_accountDetailLayout">
            <HeaderAccount>
              <SubTitleSection  
                titleKey="Volver a billeteras"
                iconClass="fas fa-arrow-left"
                handleAction={() => props?.history?.push(`/${params?.primary_path}`)}
              />
            </HeaderAccount>
            <SubMenuComponent
              targetList="wallets"
            />
            <TitleSection
              className="accoun-detail"
              titleKey={params?.path}
            />
            
            <AccountDetailContainer className="_accountDetailContainer">
              <SwitchView {...props} />
            </AccountDetailContainer>

          </AccountDetailLayout>
  );
};

// TODO: review re-rendered on this component every time, no performance here
const SwitchView = (props) => {
  const { params:{ path, tx_path } } = props.match;
  const Views = {
    // deposit: <SkeletonDepositView {...props} />,
    deposit: <LazyDepositView {...props} />,
    withdraw: <LazyWithdrawView {...props} />,
    // withdraw: <SkeletonWithdrawView {...props} />,
    swap: <LazySwapView {...props} />,
    activity:<ActivityView {...props} />

  };

  if(tx_path)return Views["activity"];
  return Views[path];
};

WalletContainer.propTypes = {
  isAppLoaded: PropTypes.bool,
  currencies: PropTypes.array,
  user: PropTypes.object,
};

function mapStateToProps({ modelData, isLoading }) {
  const { user, wallets } = modelData;

  const { isAppLoaded } = isLoading;

  return {
    user,
    wallets,
    isAppLoaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer);
