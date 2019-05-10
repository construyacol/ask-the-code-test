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
ADD_BALANCE
} from './action_types'


export const ManageBalanceAction = (account_id, action, amount) => {

  switch (action) {
    case 'reduce':
      return {
        type:REDUCE_BALANCE,
        payload:{
          id:account_id,
          amount:amount
        }
      }
    default:
      return {
        type:ADD_BALANCE,
        payload:{
          id:account_id,
          amount:amount
        }
      }
  }
}



export const UpdatePendingSwap = (payload) => {
  return {
    type:UPDATE_SWAP_PENDING,
    payload:payload
  }
}

export const UpdateAllCurrencies = (payload) => {
  return {
    type:UPDATE_ALL_CURRENCIES,
    payload:payload
  }
}

export const reset_model_data = payload => {
  return{
    type:RESET_DATA,
    payload
  }
}

export const Update_normalized_state = payload => {
  return{
    type:UPDATE_NORMALIZED_STATE,
    payload
  }
}

export const LocalPairs = payload => {
  return{
    type:LOCAL_PAIRS,
    payload:payload
  }
}


export const AllPairs = payload => {
  return{
    type:ALL_PAIRS,
    payload:payload
  }
}

export const UserPairs = payload => {
  return{
    type:USER_PAIRS,
    payload:payload
  }
}

export const SearchCurrentPair = (payload, prop) => {

  return{
    type:CURRENT_PAIR,
    payload,
    prop
  }
}

export const LocalCurrency = payload => {
  return{
    type:LOCAL_CURRENCY,
    payload
  }
}



export default LocalPairs
