import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";

const selectCurrentPair = createSelector(
  (state) => state.storage.pairsForAccount,
  (state) => state.modelData.all_pairs,
  (_, account_id) => account_id,
  (pairsForAccount, all_pairs, account_id) => {
    const currentPair = (account_id && pairsForAccount) && (pairsForAccount[account_id] && pairsForAccount[account_id].current_pair)
    if(currentPair && currentPair.pair_id){
      return all_pairs && all_pairs[currentPair.pair_id]
    }
    return null;
  }
);

const selectCurrentWallet = createSelector(
  (state) => state.modelData.wallets,
  (_, account_id) => account_id,
  (wallets, account_id) => {
    if((account_id && wallets) && wallets[account_id]){
      return wallets[account_id]
    }
    return false
  }
);



const UseSwapInfo = () => {
  const { modelData, storage } = useSelector((state) => state);
  const { wallets } = modelData
  const { account_id } = useParams();
  const currentPair = useSelector((state) => selectCurrentPair(state, account_id));
  const current_wallet = useSelector((state) => selectCurrentWallet(state, account_id));


  return [
    {
      currentPair,
      current_wallet
    }
  ];
};

export default UseSwapInfo;
