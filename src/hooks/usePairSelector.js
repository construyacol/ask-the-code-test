import { useState } from "react";
import { matchItem } from "../utils";
import { useCoinsendaServices } from "../services/useCoinsendaServices";
import { useSelector } from "react-redux";


export function usePairSelector(props) {
  const { currentWallet, currencyPairs } = props;
  const [isReady, setIsReady] = useState(false);
  const [coinsendaServices] = useCoinsendaServices();
  const { currencies } = useSelector((state) => state.modelData);

  // useEffect(()=>{
  //     selectPair(true)
  // }, [props.currencies])

  const selectPair = async (initial) => {
    setIsReady(false);
    let currency = currentWallet && currentWallet.currency;
    let all_pairs = [];

    !initial && props.actions.toggleOtherModal();
    if (currencyPairs) {
      return false;
    } 

    let pairs = await coinsendaServices.getPairs(currency, null, true);
    if (pairs) {
      all_pairs = [...pairs];
    }
    let pairs2 = await coinsendaServices.getPairs(null, currency, true);
    if (pairs2) {
      all_pairs = [...all_pairs, ...pairs2];
    }

    if (all_pairs.length < 1) {
      return !initial && props.actions.toggleOtherModal();
    }
    let pairs_result = await createListPairs(all_pairs, currency);
    setIsReady(true);
    return props.actions.pairsForAccount(
      currentWallet.currency,
      { all_pairs: pairs_result },
      "currency"
    );
  };

  const createListPairs = async (allPairs, currency) => {

    if (!currencies) return false;

    let name = null;
    let result = []

    await allPairs.forEach(async(pair) => {
      if (pair.primary_currency === currency) {
        name = pair.secondary_currency;
      }

      if (pair.secondary_currency === currency) {
        name = pair.primary_currency;
      }

      if (!name) return false;

      const match = await matchItem(currencies, { primary: name }, "view");
      if (!match) return false;

      result.push({
        ...match,
        pair_id: pair.id,
      })
    })

    return result
  };

  return { selectPair, isReady };
}
