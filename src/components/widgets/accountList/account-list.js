import React from "react";
import withListCreator from "../../withListCreator";
// import styled from 'styled-components'
// import useNavigationKeyActions from "../../../hooks/useNavigationKeyActions";
// import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import { useSelector } from "react-redux";
import useViewport from "../../../hooks/useWindowSize";
import TitleSection from '../../widgets/titleSectionComponent'
import { AccountListWrapper } from '../layoutStyles'
import { isEmpty } from 'lodash'
import { useParams  } from "react-router-dom";
import { AddNewItem } from "../buttons/buttons";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import useAvailableWalletCreator from "../../hooks/useAvailableWalletCreator";
import loadable from "@loadable/component";
import { AccountListSkeletonLoader } from "../skeletons";
import { useCreateWallet } from './cardView'
import FilterAccountList from '../filters/filterAccountList'
import { AccountListViewSkeleton } from "./listView";

// TODO: Eliminar props.items
function AccountList(props) {

  const CardView = loadable(() => import("./cardView"), { fallback: <AccountListSkeletonLoader /> });
  const ListViewComponent = loadable(() => import("./listView"), { fallback: <AccountListViewSkeleton /> });

  const {
    items = [],
    isWithdrawView,
    isWalletsView
  } = props

  const { primary_path } = useParams()
  const { isMovilViewport } = useViewport();
  const [ availableCurrencies ] = useAvailableWalletCreator();
  const { accountListView } = useSelector((state) => state.ui.views);
  const [ createNewWallet ]  = useCreateWallet({...props})
  const idForClickableElement = useKeyActionAsClick(
    true,
    "main-accounts-add-button",
    97
  );

  const isBottonAvailable = !isWalletsView ? true : (isWalletsView && availableCurrencies?.length) ? true : false
  let mainButtonText = isWithdrawView ? "Crear nueva cuenta de retiro" : "Crear nueva billetera";

  return (
    <AccountListWrapper 
      className={`accountListWrapper ${primary_path} ${isEmpty(items) ? 'isEmpty' : ''}`}
      >
      <TitleSection
        className="stickyWallets"
      > 
      {
        isWalletsView &&
          <FilterAccountList
             currentFilterValue={accountListView}
          />
      }
        {(!props.loader && !isMovilViewport) && (
          <AddNewItem
            id={idForClickableElement}
            label={mainButtonText}
            type={`${isBottonAvailable ? "primary" : "disabled"}`}
            handleClick={isBottonAvailable ? createNewWallet : null}
          />
        )}
      </TitleSection>
      {((!props.loader && isMovilViewport) && !isEmpty(items)) && (
          <AddNewItem
            id={idForClickableElement}
            label={mainButtonText}
            type={`${isBottonAvailable ? "secundary" : "disabled"}`}
            handleClick={isBottonAvailable ? createNewWallet : null}
          />
      )}
      
      {
        (!isWithdrawView && ["card"]?.includes(accountListView)) ?
          <CardView {...props} />
        : 
        (!isWithdrawView && ["list"]?.includes(accountListView)) ?
          <ListViewComponent {...props}/>
        :
        <CardView {...props} />
      }
    </AccountListWrapper>
  );
}


export default withListCreator(AccountList);
// export default withListCreator(AccountList);

