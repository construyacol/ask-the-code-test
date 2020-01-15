import {
  UPDATE_ACTIVITY,
  UPDATE_PENDING_ACTIVITY
} from '../actions/action_types'


const initialState = {
  activity_for_account:""
}

const storage = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACTIVITY:
      return {
        ...state,
        activity_for_account: {
          ...state.activity_for_account,
          [action.payload.account_id]:{
            ...state.activity_for_account[action.payload.account_id],
            [action.payload.activity_type]:action.payload.activity_list
          }
        }
      }

      case UPDATE_PENDING_ACTIVITY:
      // console.log('||||||||||||||||||||| UPDATE_ACTIVITY ==>', action)
        let activity_label = `pending_${action.payload.activity_type}`
        let new_payload = {
          expandidoMax:action.payload.expandidoMax,
          lastPending:action.payload.lastPending,
          pending:action.payload.pending
        }
        // console.log('UPDATE_PENDING_ACTIVITY', new_payload)
        return {
          ...state,
          activity_for_account: {
            ...state.activity_for_account,
            [action.payload.account_id]:{
              ...state.activity_for_account[action.payload.account_id],
              [activity_label]:new_payload
            }
          }
        }
    default:
      return state
  }
}

export default storage
