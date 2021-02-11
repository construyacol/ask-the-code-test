import { createSelector } from "reselect";

const selectWithdrawAccountsByProviderType = createSelector(
  ({ modelData: { withdraw_accounts } }) => withdraw_accounts,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  (_, provider_type) => provider_type,
  (withdraw_accounts, provider_type) => {
    let res = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    for (const [, withdraw_account] of Object.entries(withdraw_accounts)) {
      withdraw_account.provider_type === provider_type &&
        withdraw_account.account_name.value !== provider_type &&
        res.push(withdraw_account);
    }
    return res;
  }
);

export default selectWithdrawAccountsByProviderType;
