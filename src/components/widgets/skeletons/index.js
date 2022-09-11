import React from "react";
import loadable from "@loadable/component";
import { ReferralComponentAsSkeleton } from "components/referrals/referralsComponent";

import { AccountListContainer } from "../accountList/styles";
// import { ItemSecurity, SecurityLayoutLoader } from "components/securityCenter/styles";
import TitleSection from '../titleSectionComponent'
// import "./dashboard.css";
import { 
  AccountListWrapper, 
  // SecurityCenterLayout 
} from '../layoutStyles'
import SettingSkeleton from 'components/settings/skeleton'

const ItemAccount = loadable(() => import("../accountList/item_account"));
const SimpleLoader = loadable(() => import("../loaders"));
 
export const LazyLoaderPage = ({ path }) => {
  // const title = path === "withdraw_accounts" ? "Cuentas de retiro" : "Cargando...";
  const LoaderScreen =
      path === "withdraw_accounts"
      ? AccountListSkeletonLoader
      : path === "referral"
      ? ReferralComponentAsSkeleton
      : path === "settings"
      ? SettingSkeleton
      : SimpleLoader;

  return (
      <LoaderScreen />
  )
};

export const AccountListSkeletonLoader = () => {
  return (
    <AccountListWrapper className="accountListWrapper">
      <TitleSection skeleton/>
      <AccountListContainer className="AccountListContainer">
        <ItemAccount loader />
      </AccountListContainer>
    </AccountListWrapper> 
  );
};

// export const SecurityCenterSkeletonLoader = ({ tittleOff }) => {
//   const loaderList = new Array(2).fill({});

//   return (
//     <SecurityCenterLayout>
//     {
//       !tittleOff &&
//         <TitleSection skeleton/>
//     }
//       {loaderList.map((_, key) => {
//         return (
          
//         );
//       })}
//     </SecurityCenterLayout>
//   );
// };
