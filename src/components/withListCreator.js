import React from "react";
import { useActions } from "../hooks/useActions";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const specialListCreatorSelector = createSelector(
  (state) => state.withdraw_accounts,
  (state) => state.wallets,
  (_, isWithdrawView) => isWithdrawView,
  (withdrawAccounts, wallets, isWithdrawView) => {
    const data = isWithdrawView ? withdrawAccounts : wallets;
    return (
      data &&
      Object.keys(data)
        .filter((key) => {
          return !(isWithdrawView && data[key].currency_type === "crypto");
        })
        .map((key) => {
          return data[key];
        })
    );
  }
);

export default function withListCreator(AsComponent) {
  return React.memo(function (props) {
    const loader = useSelector((state) => state.isLoading.loader);
    const mainListLoader = useSelector((state) => state.ui.loaders.mainList);
    const items = useSelector((state) => specialListCreatorSelector(state.modelData, props.isWithdrawView));
    const actions = useActions();
    const toProps = {
      verificationState: true,
      mainListLoader,
      loader,
    };

    return (
      <AsComponent {...toProps} actions={actions} items={items} {...props} />
    );
  });
}
