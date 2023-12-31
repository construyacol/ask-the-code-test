import { WebService } from "../actions/API/WebService";
import {
  ADD_NEW_SWAP,
  loadLabels,
  // SWAP_URL,
  // PAIRS_URL,
  POST_PAIRS_URL,
  GET_SWAPS_BY_USERS_URL,
  // SWAP_CONVERT_CURRENCIES
} from "../const/const";
import { desNormalizedList, normalized_list } from "../utils";
import normalizeUser from "../schemas";
import loadLocalPairsAction, {
  updateNormalizedDataAction,
  getAllPairsAction,
  searchCurrentPairAction,
  loadLocalCurrencyAction,
  update_item_state,
} from "../actions/dataModelActions";
import { appLoadLabelAction } from "../actions/loader";
import convertCurrencies, { _convertCurrencies } from "../utils/convert_currency";
import { pairsForAccount } from "../actions/uiActions";
import { DEFAULT_CURRENCY } from 'core/config/currencies'
import { isEmpty } from 'lodash'

export class SwapService extends WebService {
  async fetchAllPairs() {
    this.dispatch(appLoadLabelAction(loadLabels.IMPORTANDO_PARES));
    const pairs = await this.pairsRequest();
    if (!pairs) { 
      return;
    }
    // if (await this.isCached("available_pairs", pairs)) {
    //   return pairs;
    // }
    this.dispatch(getAllPairsAction(pairs?.data));
    let updatedUser = {
      id: this.user.id,
      available_pairs: [...pairs?.data],
    };
    let dataNormalized = await normalizeUser(updatedUser);
    this.dispatch(updateNormalizedDataAction(dataNormalized));
    return dataNormalized;
  }

  pairsRequest(query = {}) {
    const body = {
      data:{
        filter:{
          where:{
            ...query,
            visible:true
          }
        }
      }
    }
    return this.Post(POST_PAIRS_URL, body, false);
  } 

  async getPairsByCountry(country, currencies) { 
 
    const localCurrency = await this.getLocalCurrency(country);
    
    if (!localCurrency) {
      return console.log("No se ha encontrado país en getPairsByCountry");
    }
    const pairs = await this.pairsRequest({"secondary_currency": `${localCurrency.currency}`});
    if (!pairs) return;
    if (!isEmpty(currencies)) {  
      const localCurrencies = await this.addSymbolToLocalCollections(pairs?.data, localCurrency.currency, currencies);
      // if (
      //   this.isCached("getPairsByCountry_", localCurrencies, false) &&
      //   this.globalState.modelData.pairs.currentPair
      // ) {
      //   return;
      // }
      await this.dispatch(loadLocalPairsAction(localCurrencies));
      // TODO: Evaluate this
      // if(userCollection){ await get_user_pairs(userCollection, dispatch, pairs)}
      this.dispatch(
        searchCurrentPairAction(
          `${DEFAULT_CURRENCY?.symbol?.toUpperCase()}/${localCurrency.currency.toUpperCase()}`,
          "pair"
        )
      );
      this.dispatch(loadLocalCurrencyAction(localCurrency));
    }
  }



  async convertCurrencies(want_to_spend, to_spend_currency, pair_id) {

    const data = await _convertCurrencies(to_spend_currency, want_to_spend, pair_id);
    // return console.log('||||||||||||||||||||||||||| convertCurrencies : ', data)
    return { data }
    // console.log('||||||||||||||| convertCurrencies: ', data)

    // const user = this.user
    // const body = {
    //   data:{
    //     to_spend_currency,
    //     want_to_spend,
    //     pair_id,
    //     "country":user.country
    //   }
    // }
    // const result = await this.Post(SWAP_CONVERT_CURRENCIES, body);
    // return result
  }

  async getPairs(primary, secondary, all) {
    if (!primary && !secondary) return;

    if (primary || secondary) {
      const query = !secondary ? {"primary_currency": `${primary}`} : {"secondary_currency": `${secondary}`};
      const response = await this.pairsRequest(query);
      if (this.isEmpty(response)) return;
      if (all) {
        return response?.data;
      }
      return response?.data[0];
    }
     
    const query = {"primary_currency": `${primary}`, "secondary_currency": `${secondary}`};
    const response = await this.pairsRequest(query);
    if (this.isEmpty(response)) return;
    return response?.data[0];
  }

  async _getPairs(primary, secondary, all) {
    if (!primary || !secondary) {
      return false;
    }
    let res, query;
    if (primary && !secondary) {
      query = {"primary_currency": `${primary}`};
    }
    if (!primary && secondary) {
      query = {"secondary_currency": `${secondary}`};
    }
    query && (res = await this.pairsRequest(query));
    if (res) {
      if (all) {
        return res?.data;
      }
      return res?.data[0];
    }

    query = {"primary_currency": `${primary}`, "secondary_currency": `${secondary}`};
    res = await this.pairsRequest(query);
    if (this.isEmpty(res)) return;
    return res?.data[0];
  }
 
  // TODO: review this fn:getDefaultPair
  async getDefaultPair(currentWallet, localCurrency, currentPair) {
    if ((currentPair && currentPair.pair_id) || !currentWallet) {
      return false;
    }
    const currency = currentWallet.currency;
    let pair = await this._getPairs(currency, localCurrency);
    !pair && (pair = await this._getPairs(DEFAULT_CURRENCY.currency, currency));
    !pair && (pair = await this._getPairs(currency));
    !pair && (pair = await this._getPairs(null, currency));

    let pair_id = pair.id;

    const data = await convertCurrencies(currentWallet.currency, "1", pair_id);

    if (data) {
      const { to_spend_currency } = data;
      return this.dispatch(
        pairsForAccount(currentWallet.id, {
          current_pair: {
            pair_id,
            currency: to_spend_currency
          },
        })
      );
    }
  }


  async addNewSwap(accountId, pairId, value) {
    const user = this.user;

    const body = {
      data: {
        want_to_spend: value.toString(),
        pair_id: pairId,
        account_from: accountId,
        country: user.country,
      }
    };

    const result = await this.Post(ADD_NEW_SWAP, body);

    if (!result || result === 465) {
      return false;
    }

    const { data } = result;

    return data;
  }

  async completeSwap(swaps, user, completeSwap, updateList) {
    let newSwap = {
      ...swaps[completeSwap.id],
      state: "accepted",
    };

    let updatedSwaps = {
      ...swaps,
      [newSwap.id]: {
        ...newSwap,
      },
    };

    let swapsAsArray = await desNormalizedList(updatedSwaps, user.swaps);

    if (updateList) {
      await updateList(swapsAsArray);
    }

    let updatedUser = {
      id: user.id,
      swaps: [...swapsAsArray],
    };

    let normalizedUser = await normalizeUser(updatedUser);
    await this.dispatch(updateNormalizedDataAction(normalizedUser));
    return normalizedUser;
  } 
 
  async updateCurrentPair(query, currentPair) {
    const body = {
      data:{
        filter:{
          where:query
        }
      }
    }
    const result = await this.Post(POST_PAIRS_URL, body, false);
    // const result = await this.Get(`${PAIRS_URL}${query}`);
    if (!result || result === 465) {
      return;
    }
    if (currentPair) {
      this.dispatch(
        update_item_state({ currentPair: { ...result?.data[0] } }, "pairs")
      );
    } else {
      this.dispatch(
        update_item_state({ [result?.data[0]?.id]: { ...result?.data[0] } }, "all_pairs")
      );
    }
  }

  async get_swaps(accountId, limit = 20, skip = 0) {
    const user = this.user;
    let filter = `{"where":{"or":[{"account_to":"${accountId}"}, {"account_from":"${accountId}"} ] }, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`;
    const finalUrl = `${GET_SWAPS_BY_USERS_URL}/${user.id}/swaps?country=${user.country}&filter=${filter}`;

    let swaps = await this.Get(finalUrl);

    if (!swaps || swaps === 465) {
      return false;
    }

    if (await this.isCached("swaps", swaps)) {
      return swaps;
    }

    let swapResult = [...swaps];

    swapResult = this.parseActivty(swaps, "swaps", accountId);
    await this.dispatch(normalized_list(swapResult, "swaps"));
    await this.updateActivityState(accountId, "swaps", swapResult);

    return swaps;
  }
}
