import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { createSelector } from "reselect";
import { selectCurrentWallet } from 'selectors'
import { selectWithConvertToObjectWithCustomIndex } from 'hooks/useTxState'


const selectCurrentPair = createSelector(
  (state) => state.storage.pairsForAccount,
  (state) => state.modelData.all_pairs,
  (_, account_id) => account_id, 
  (pairsForAccount, all_pairs, account_id) => {
    const currentPair = (account_id && pairsForAccount) && (pairsForAccount[account_id] && pairsForAccount[account_id].current_pair)
    if(currentPair && currentPair.pair_id){
      return {
        ...all_pairs[currentPair.pair_id],
        boughtCurrency:pairsForAccount[account_id].current_pair.currency
      }
    }
    return null;
  }
);

const selectWalletCurrencyShortName = createSelector(
  (state) => state.modelData.currencies,
  (_, currentWallet) => currentWallet,
  (currencies, currentWallet) => {
    if(!currentWallet) return;
    if(!currencies) return;
    for (let currency of currencies) {
      if(currency.currency.includes(currentWallet.currency)){
        return currency.symbol
      }
    }
  }
);


export function useWalletInfo() {

  const { modelData, storage } = useSelector((state) => state);
  const { pairsForAccount } = storage;
  const { balances, wallets } = modelData
  const { account_id } = useParams();
  const currentPair = useSelector((state) => selectCurrentPair(state, account_id));
  const currentWallet = useSelector((state) => selectCurrentWallet(state, account_id));
  const WalletCurrencyShortName = useSelector((state) => selectWalletCurrencyShortName(state, currentWallet));
  const currenciesByCurrencyIndex = useSelector((state) => selectWithConvertToObjectWithCustomIndex(state))

  const defaultValue = {
    currentWallet: null,
    availableBalance: null,
    currentPair: null,
    currencyPairs: null,
    currencies:null,
    modelData:{}
  };

  if (!balances || !wallets || !account_id) {
    return defaultValue;
  }

  const availableBalance = balances[currentWallet.id].available;
  // let _currentPair = null
  let currencyPairs = null;
  if (pairsForAccount && pairsForAccount[currentWallet.id]) {
    currencyPairs = pairsForAccount[currentWallet.currency] && pairsForAccount[currentWallet.currency].all_pairs;
  }

  return {
    ...defaultValue,
    currentWallet,
    availableBalance,
    currencyPairs,
    currentPair,
    WalletCurrencyShortName,
    currencies:currenciesByCurrencyIndex,
    modelData
   };
}
