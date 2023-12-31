import {
  ALL_PAIRS,
  CURRENT_PAIR,
  LOCAL_CURRENCY,
  USER_PAIRS,
  UPDATE_NORMALIZED_STATE,
  RESET_DATA,
  UPDATE_ALL_CURRENCIES,
  LOCAL_PAIRS,
  UPDATE_SWAP_PENDING,
  REDUCE_BALANCE,
  ADD_BALANCE,
  ALL_PAIRS_LANDING,
  UPDATE_ITEM_STATE,
  SET_SESSION_RESTORE,
} from "./action_types";

export const update_item_state = (item, item_type) => {
  // console.log('|||||||||||          ||||||||||||||||||||||             ||||||||||||||        update_item_state', item_type, item)
  // @params
  // item:object => ex: normalized_object: {item_id:{}}
  // item_type:string => ex: users

  let payload = {
    item,
    item_type,
  };

  // console.log('=========> update_item_state', payload)

  return {
    type: UPDATE_ITEM_STATE,
    payload,
  };
};

export const set_session_restore = (payload) => {
  return {
    type: SET_SESSION_RESTORE,
    payload,
  };
};

export const manageBalanceAction = (account_id, action, amount) => {
  switch (action) {
    case "reduce":
      return {
        type: REDUCE_BALANCE,
        payload: {
          id: account_id,
          amount: amount,
        },
      };
    default:
      return {
        type: ADD_BALANCE,
        payload: {
          id: account_id,
          amount: amount,
        },
      };
  }
};

export const all_pairs_landing = (payload) => {
  return {
    type: ALL_PAIRS_LANDING,
    payload,
  };
};

export const UpdatePendingSwap = (payload) => {
  return {
    type: UPDATE_SWAP_PENDING,
    payload: payload,
  };
};

export const updateAllCurrenciesAction = (payload) => {
  return {
    type: UPDATE_ALL_CURRENCIES,
    payload: payload,
  };
};

export const resetModelData = (payload) => {
  return {
    type: RESET_DATA,
    payload,
  };
};

export const updateNormalizedDataAction = (payload) => {
  return {
    type: UPDATE_NORMALIZED_STATE,
    payload,
  };
};

export const loadLocalPairsAction = (payload) => {
  return {
    type: LOCAL_PAIRS,
    payload: payload,
  };
};

export const getAllPairsAction = (payload) => {
  return {
    type: ALL_PAIRS,
    payload: payload,
  };
};

export const UserPairs = (payload) => {
  return {
    type: USER_PAIRS,
    payload: payload,
  };
};

export const searchCurrentPairAction = (payload, prop) => {
  return {
    type: CURRENT_PAIR,
    payload,
    prop,
  };
};

export const loadLocalCurrencyAction = (payload) => {
  return {
    type: LOCAL_CURRENCY,
    payload,
  };
};

export default loadLocalPairsAction;
