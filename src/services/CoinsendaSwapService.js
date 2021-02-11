import { WebService } from "../actions/API/WebService";
import {
  ADD_NEW_SWAP,
  loadLabels,
  SWAP_URL,
  PAIRS_URL,
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

export class SwapService extends WebService {
  async fetchAllPairs() {
    this.dispatch(appLoadLabelAction(loadLabels.IMPORTANDO_PARES));
    const pairs = await this.Get(`${SWAP_URL}pairs`);
    if (!pairs) {
      return;
    }

    if (await this.isCached("available_pairs", pairs)) {
      return pairs;
    }

    this.dispatch(getAllPairsAction(pairs));
    let updatedUser = {
      id: this.user.id,
      available_pairs: [...pairs],
    };

    let dataNormalized = await normalizeUser(updatedUser);
    this.dispatch(updateNormalizedDataAction(dataNormalized));
    return dataNormalized;
  }

  pairsRequest(query) {
    const requestCompleteUrl = `${PAIRS_URL}${query}`;
    return this.Get(requestCompleteUrl);
  }

  async getPairsByCountry(country, currencies) {
    const localCurrency = await this.getLocalCurrency(country);

    if (!localCurrency) {
      return console.log("No se ha encontrado país en getPairsByCountry");
    }
    const pairs = await this.pairsRequest(
      `{"where": {"secondary_currency.currency": "${localCurrency.currency}"}}`
    );
    if (!pairs) return;
    if (currencies) {
      const localCurrencies = await this.addSymbolToLocalCollections(
        pairs,
        localCurrency.currency,
        currencies
      );

      if (
        this.isCached("getPairsByCountry_", localCurrencies, false) &&
        this.globalState.modelData.pairs.currentPair
      ) {
        return;
      }

      await this.dispatch(loadLocalPairsAction(localCurrencies));

      // TODO: Evaluate this
      // if(userCollection){ await get_user_pairs(userCollection, dispatch, pairs)}

      this.dispatch(
        searchCurrentPairAction(
          `BTC/${localCurrency.currency.toUpperCase()}`,
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
    // const result = await this.Post(SWAP_CONVERT_CURRENCIES, body, user.userToken);
    // return result
  }


  async getPairs(primary, secondary, all) {
    if (!primary && !secondary) return;

    if (primary || secondary) {
      const query = !secondary
        ? `{"where": {"primary_currency.currency": "${primary}"}}`
        : `{"where": {"secondary_currency.currency": "${secondary}"}}`;
      const response = await this.pairsRequest(query);
      if (this.isEmpty(response)) return;
      if (all) {
        return response;
      }
      return response[0];
    }
    const query = `{"where": {"primary_currency.currency": "${primary}", "secondary_currency.currency": "${secondary}"}}`;
    const response = await this.pairsRequest(query);
    if (this.isEmpty(response)) return;
    return response[0];
  }

  async _getPairs(primary, secondary, all) {
    if (!primary || !secondary) {
      return false;
    }
    let res, query;
    if (primary && !secondary) {
      query = `{"where": {"primary_currency.currency": "${primary}"}}`;
    }
    if (!primary && secondary) {
      query = `{"where": {"secondary_currency.currency": "${secondary}"}}`;
    }
    query && (res = await this.pairsRequest(query));
    if (res) {
      if (all) {
        return res;
      }
      return res[0];
    }

    query = `{"where": {"primary_currency.currency": "${primary}", "secondary_currency.currency": "${secondary}"}}`;
    res = await this.pairsRequest(query);
    if (this.isEmpty(res)) return;
    return res[0];
  }

  // TODO: review this fn:getDefaultPair
  async getDefaultPair(currentWallet, localCurrency, currentPair) {
    if ((currentPair && currentPair.pair_id) || !currentWallet) {
      return false;
    }
    const currency = currentWallet.currency.currency;
    let pair = await this._getPairs(currency, localCurrency);
    !pair && (pair = await this._getPairs("bitcoin", currency));
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
            currency: to_spend_currency.currency
          },
        })
      );
    }
  }




  async addNewSwap(accountId, pairId, value) {
    const user = this.user;

    const body = {
      // "access_token":user.userToken,
      data: {
        want_to_spend: value.toString(),
        pair_id: pairId,
        account_from: accountId,
        country: user.country,
      },
    };

    const result = await this.Post(ADD_NEW_SWAP, body, user.userToken);

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
    const result = await this.Get(`${PAIRS_URL}${query}`);
    if (!result || result === 465) {
      return;
    }
    if (currentPair) {
      this.dispatch(
        update_item_state({ currentPair: { ...result[0] } }, "pairs")
      );
    } else {
      this.dispatch(
        update_item_state({ [result[0].id]: { ...result[0] } }, "all_pairs")
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
