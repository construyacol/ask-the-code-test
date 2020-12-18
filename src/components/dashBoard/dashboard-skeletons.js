import React from "react";
import loadable from "@loadable/component";
import { ReferralComponentAsSkeleton } from "../referrals/referralsComponent";
import { AccountListContainer } from "../widgets/accountList/styles";
import { ItemSecurity, SecurityLayoutLoader } from "../securityCenter/styles";
import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import "./dashboard.css";

const ItemAccount = loadable(() =>
  import("../widgets/accountList/item_account")
);
const SimpleLoader = loadable(() => import("../widgets/loaders"));

export const LazyLoaderPage = ({ path }) => {
  const title =
    path === "withdraw_accounts" ? "Cuentas de retiro" : "Cargando...";
  const LoaderScreen =
    path === "withdraw_accounts"
      ? AccountListSkeletonLoader
      : path === "referral"
      ? ReferralComponentAsSkeleton
      : path === "security"
      ? SecurityCenterSkeletonLoader
      : SimpleLoader;

  return (
    <DetailContainerLayout title={title}>
      <LoaderScreen />
    </DetailContainerLayout>
  );
};

export const AccountListSkeletonLoader = () => {
  return (
    <AccountListContainer className="AccountListContainer">
      <ItemAccount loader />
    </AccountListContainer>
  );
};

const SecurityCenterSkeletonLoader = () => {
  const elements = window.innerWidth < 768 ? 10 : 5;
  const loaderList = new Array(elements).fill({});

  return (
    <>
      {loaderList.map((_, key) => {
        return (
          <SecurityLayoutLoader
            id="security_loader"
            className="SecurityLayoutLoader"
            key={key}
          >
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
          </SecurityLayoutLoader>
        );
      })}
    </>
  );
};
