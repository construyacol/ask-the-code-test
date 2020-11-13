import { useSelector } from "react-redux";
import { useParams } from "react-router";

export function useWalletInfo() {
  const { balances, wallets } = useSelector(({ modelData }) => modelData);
  const { pairsForAccount } = useSelector(
    ({ ui }) => ui.current_section.params
  );
  const { account_id } = useParams();
  const defaultValue = {
    currentWallet: null,
    availableBalance: null,
    _currentPair: null,
    currencyPairs: null,
  };

  if (!balances || !wallets || !account_id) {
    return defaultValue;
  }

  const currentWallet = wallets[account_id];
  const availableBalance = balances[currentWallet.id].available;
  // let _currentPair = null
  let currencyPairs = null;
  if (pairsForAccount && pairsForAccount[currentWallet.id]) {
    // _currentPair = {
    //     pair_id: pairsForAccount[currentWallet.id].current_pair.pair_id,
    //     secondary_coin: pairsForAccount[currentWallet.id].current_pair.currency,
    //     secondary_value: pairsForAccount[currentWallet.id].current_pair.currency_value,
    //     extended: pairsForAccount[currentWallet.id].current_pair
    // }
    currencyPairs =
      pairsForAccount[currentWallet.currency.currency] &&
      pairsForAccount[currentWallet.currency.currency].all_pairs;
  }

  return { ...defaultValue, currentWallet, availableBalance, currencyPairs };
}
