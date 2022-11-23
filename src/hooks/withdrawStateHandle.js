import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import actions from "actions";
import { createSelector } from "reselect";

const selectWithdrawProviderByType = createSelector(
  (state) => state.modelData.withdrawProviders,
  (withdrawProviders) => {
    let result = {};
    for (let provider_id in withdrawProviders) {
      result = {
        ...result,
        [withdrawProviders[provider_id].provider_type]:withdrawProviders[provider_id]
      };
    }
    return result;
  }
);

const selectWithdrawProviderByName = createSelector(
  (state) => state.modelData.withdrawProviders,
  (withdrawProviders) => {
    let result = {};
    for (let provider_id in withdrawProviders) {
      result = {
        ...result,
        [withdrawProviders[provider_id].name]:withdrawProviders[provider_id]
      };
    }
    return result;
  }
);


const selectWithdrawAccountsByAddress = createSelector(
  (state) => state.modelData.withdraw_accounts,
  (_, current_wallet) => current_wallet,
  (withdraw_accounts, current_wallet) => {
    let result = {};
    for (let w_account_id in withdraw_accounts) {
      let address = withdraw_accounts[w_account_id].info && withdraw_accounts[w_account_id].info.address
      if (current_wallet && current_wallet.currency.currency === withdraw_accounts[w_account_id].provider_type && address) {
        result = {
          ...result,
          [address]: withdraw_accounts[w_account_id]
        };
      }
    }
    return result;
  }
);

const WithdrawViewState = () => {

  const dispatch = useDispatch();
  const { modelData, ui, isLoading, storage } = useSelector((state) => state);
  const withdrawProviders = useSelector((state) => selectWithdrawProviderByType(state));
  const withdrawProvidersByName = useSelector((state) => selectWithdrawProviderByName(state));
  const { account_id, path } = useParams();
  const { active_trade_operation } = ui.current_section.params;
  const { wallets, balances, user } = modelData;
  const withdraw_accounts = useSelector((state) => selectWithdrawAccountsByAddress(state, wallets[account_id]));
  const { loader } = isLoading;
  const { activity_for_account } = storage;
  const current_wallet = account_id && wallets[account_id];

  return [
    {
      user,
      path,
      current_wallet,
      balance: current_wallet && balances[current_wallet.id],
      withdrawProviders,
      withdrawProvidersByName,
      withdraw_accounts,
      active_trade_operation,
      loader,
      withdraws:
        account_id &&
        activity_for_account[account_id] &&
        activity_for_account[account_id].withdraws,
    },
    actions,
    dispatch,
  ];
};

export default WithdrawViewState;
