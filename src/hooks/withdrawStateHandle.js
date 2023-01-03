import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import actions from "actions";
import { selectWithdrawProviderByName, selectWithdrawAccountsByAddress } from 'selectors'

const WithdrawViewState = () => {
  
  const dispatch = useDispatch(); 
  const { modelData, ui, isLoading, storage } = useSelector((state) => state);
  // const withdrawProviders = useSelector((state) => selectWithdrawProviderByType(state));
  const withdrawProvidersByName = useSelector((state) => selectWithdrawProviderByName(state));
  const { account_id, path } = useParams();
  const { active_trade_operation } = ui.current_section.params;
  const { wallets, balances, user } = modelData;
  const withdraw_accounts = useSelector((state) => selectWithdrawAccountsByAddress(state, wallets[account_id]));
  const { loader } = isLoading;
  const { activity_for_account } = storage; 
  const current_wallet = account_id && wallets[account_id];

  console.log('withdrawProvidersByName', withdrawProvidersByName)

  return [
    {
      user,
      path,
      current_wallet,
      balance: current_wallet && balances[current_wallet.id],
      // withdrawProviders,
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
