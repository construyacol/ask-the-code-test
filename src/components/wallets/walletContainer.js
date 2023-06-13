import React, { useEffect } from "react";
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
import { AccountListViewSkeleton } from "../widgets/accountList/listView";
import SkeletonDepositView from './views/depositCripto/skeleton'
import { SkeletonSwapView } from './views/swap'
import SkeletonWithdrawView from "./views/withdrawCripto/skeleton";
import { AccountDetailLayout, AccountDetailContainer } from '../widgets/layoutStyles'
import TitleSection, { SubTitleSection } from '../widgets/titleSectionComponent'
import SubMenuComponent from '../menu/subMenu'
import HeaderAccount from '../widgets/headerAccount'
import ActivityFilters from "../widgets/activityList/filters";
// import { useSelector } from "react-redux";
import useViewport from '../../hooks/useWindowSize'
import { parseQueryString } from '../../utils' 
// import 'components/wallets/views/wallet_views.css'
// import { SubscribeDepositsButton } from 'core/components/molecules'
import { isEmpty } from 'lodash'
// import { funcDebounces } from 'utils'
// import sleep from "utils/sleep";
import useSubscribeDepositHook from 'hooks/useSubscribeToNewDeposits'
import { checkIfFiat } from 'core/config/currencies';
import { useSelector } from "react-redux";
import { serveModelsByCustomProps } from 'selectors'
import { getExportByName } from 'utils'


const LazyWithdrawView = loadable(() => import("./views/withdraw"), { fallback: <SkeletonWithdrawView/> });
const LazyAccountList = loadable(() => import("../widgets/accountList/account-list"), { fallback: <AccountListViewSkeleton /> });
const LazySwapView = loadable(() => import("./views/swap"), { fallback: <SkeletonSwapView/> });
const LazyDepositView = loadable(() => import("./views/deposit"), { fallback: <SkeletonDepositView/> });

// const SubscribeDepositsButton = loadable(() => import(/* webpackPrefetch: true */ "core/components/molecules"));
const SubscribeButton = loadable(() => import("core/components/molecules").then(getExportByName("SubscribeDepositsButton")));

function WalletContainer(props) {

  const pairCollectionByCurrency = useSelector(({ modelData:{ pairs:{ local_collections } } }) => serveModelsByCustomProps(local_collections, 'primary_currency'));
  useEffect(() => { 
    return () => {
      props.action.section_view_to("initial");
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
          <AccountDetail {...props} {...routeProps} pairCollectionByCurrency={pairCollectionByCurrency} />
        )}
      />
      <Route
        strict
        path="/:primary_path/:path/:account_id/:tx_path"
        render={(routeProps) => (
          <AccountDetail {...props} {...routeProps} pairCollectionByCurrency={pairCollectionByCurrency} />
        )}
      />
    </>
  );
}




  
export const AccountDetail = (props) => {

  const { match: { params }, pairCollectionByCurrency, action } = props;
  const { handleSubscribeToNewDeposits } = useSubscribeDepositHook()
  const currentWallet = props?.wallets[params?.account_id]
  let hasActivity = currentWallet?.count > 0

  const { currentPair } = useSelector(({ modelData:{ pairs } }) => pairs)
 
  useEffect(() => {
    let hasDepProvs = !isEmpty(currentWallet?.dep_prov)
    let condition1 = hasDepProvs && ["activity"].includes(params?.path)
    // let condition1 = hasDepProvs && ["deposits"].includes(params?.tx_path)
    let condition2 = hasDepProvs && (!hasActivity && ["deposit"].includes(params?.path))
    // let condition2 = hasDepProvs && ["deposit"].includes(params?.path)
    if(condition1 || condition2) handleSubscribeToNewDeposits(currentWallet)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.path, params?.tx_path])

  useEffect(() => {
    if(currentPair?.primary_currency !== currentWallet?.currency) action.searchCurrentPairAction(pairCollectionByCurrency[currentWallet?.currency]?.buy_pair, "pair");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currencyType = checkIfFiat(currentWallet?.currency) ? 'fiat' : 'crypto'

  return( 
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
              className={`account-detail ${parseQueryString()} ${params?.tx_path} ${currencyType}`}
              titleKey={params?.path}
              {...props} 
            >
              {/* {((["deposits"].includes(params?.tx_path) || (!hasActivity && ["deposit"].includes(params?.path))) && !checkIfFiat(currentWallet?.currency)) && <SubscribeButton wallet={currentWallet}/>} */}
              {((["deposits"].includes(params?.tx_path) || ["deposit"].includes(params?.path)) && !checkIfFiat(currentWallet?.currency)) && <SubscribeButton wallet={currentWallet}/>}
              <RenderAuxComponent {...props} />
            </TitleSection> 
            <AccountDetailContainer className={`_accountDetailContainer ${params?.path} ${currencyType} ${parseQueryString()}`}>
              <SwitchView {...props} />
            </AccountDetailContainer>
          </AccountDetailLayout>
  );
};




const RenderAuxComponent = (props) => {
  const { isMovilViewport } = useViewport()
  const { params:{ path, primary_path } } = props.match;
  const Views = {
    activity:isMovilViewport ? null : <ActivityFilters view={primary_path}/>,
    // deposit:<p>putita</p>
  };

  return Views[path] || null;
};


// TODO: review re-rendered on this component every time, no performance here
const SwitchView = (props) => {
  const { params:{ path, tx_path } } = props.match;
  const Views = {
    deposit: <LazyDepositView {...props} />, 
    withdraw: <LazyWithdrawView {...props} />,
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
  const { user, wallets, deposit_providers } = modelData;

  const { isAppLoaded } = isLoading;

  return {
    user,
    wallets,
    isAppLoaded,
    deposit_providers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer);
