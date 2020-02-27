
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
  UPDATE_ITEM_STATE
} from '../actions/action_types'

const initialState = {
  pairs:{
    local_collections:null,
    all_collections:null,
    user_collection:null,
    lastUpdate:"",
    currentPair:null,
    localCurrency:""
  },
  user:null,
  wallets:null,
  currencies:null,
  balances:{}
}

const data = (state = initialState, action) => {

let user_id
let models

  switch (action.type) {

    case UPDATE_ITEM_STATE:

    // console.log('deposit approve ====================> ', action)
    // alert('//REDUCER: UPDATE_ITEM_STATE')
      return {
        ...state,
        [action.payload.item_type]:{
          ...state[action.payload.item_type],
          ...action.payload.item
        }
      }

    case REDUCE_BALANCE:
    return {
      ...state,
      balances:{
        ...state.balances,
        [action.payload.id]:{
          ...state.balances[action.payload.id],
          // available:parseFloat(state.balances[action.payload.id].available) - parseFloat(action.payload.amount),
          // total:parseFloat(state.balances[action.payload.id].total) - parseFloat(action.payload.amount),
          // reserved:parseFloat(state.balances[action.payload.id].reserved) + parseFloat(action.payload.amount),
          lastAction:'reduce',
          actionAmount:parseFloat(action.payload.amount)
        }
      }
    }

    case ADD_BALANCE:
    return {
      ...state,
      balances:{
        ...state.balances,
        [action.payload.id]:{
          ...state.balances[action.payload.id],
          available:parseFloat(state.balances[action.payload.id].available) + parseFloat(action.payload.amount),
          total:parseFloat(state.balances[action.payload.id].total) + parseFloat(action.payload.amount),
          lastAction:'add',
          actionAmount:parseFloat(action.payload.amount)
        }
      }
    }


    case UPDATE_SWAP_PENDING:
    // console.log('||||||||| NUEVO PENDIENTE', action.payload)
        return {
          ...state,
          swaps:{
            ...action.payload
          }
          }

    case UPDATE_ALL_CURRENCIES:
        return {
          ...state,
          currencies:action.payload
          }

    case RESET_DATA:
      return {
        ...state,
        ...action.payload
      }

    case UPDATE_NORMALIZED_STATE:
    // Actualizamos lista de billeteras de usuario, de momento estoy sirviendo toda la data normalizado para hecer pruebas
          models = action.payload.entities
          user_id = action.payload.result
          // console.log('||||||||||||||  R E S P U E S T A |||||||||||||||||||', models)
          // alert('hijoputa')
      return {
        ...state,
        ...models,
        user_id
      }

    case USER_PAIRS:
      if(!state.pairs.local_collections){return state}

      return {
        ...state,
        pairs:{
          ...state.pairs,
          user_collection:action.payload,
          lastUpdate:new Date()
        }
      }

    case LOCAL_PAIRS:
      return {
        ...state,
        pairs:{
          ...state.pairs,
          local_collections:[
            ...action.payload
          ],
          lastUpdate:new Date()
        }
      }

    case ALL_PAIRS:
      return {
        ...state,
        pairs:{
          ...state.pairs,
          all_collections:[
            ...action.payload
          ],
          lastUpdate:new Date()
        }
      }

    case CURRENT_PAIR:

      let result = []
      if(!state.pairs.local_collections){return state}

      let arreglo = state.pairs.local_collections
          arreglo.filter((item)=>{
                let query = action.payload
                switch (action.prop) {
                  case 'pair':
                      return item.buy_pair.includes(query) && result.push(item)
                  case 'currency':
                      return item.primary_currency.currency.includes(query.toLowerCase()) && result.push(item)
                  default:
                      return false
                }
              })

              if(result.length<1){
                 result.push(arreglo[0])
              }

      return {
          ...state,
          pairs:{
            ...state.pairs,
            currentPair:result[0]
          }
      }



    case LOCAL_CURRENCY:
    // console.log(' =================================>>>    local_currency', action.payload)
      return{
        ...state,
        pairs:{
          ...state.pairs,
          ...action.payload
        }
      }
      case ALL_PAIRS_LANDING:
        return{
          ...state,
          all_pairs:{
            ...action.payload
          }
        }
    default:
      return state
  }

}

export default data
