import {
  LOGGED_IN
} from '../actions/action_types'

const initialState = {
  loggedIn:false
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        loggedIn: action.payload
      }
    default:
      return state
  }
}

export default auth
