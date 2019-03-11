import {
  LOADER
} from '../actions/action_types'

const initialState = {
  loader:false
}

const isLoading = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        loader: action.payload
      }
    default:
      return state
  }
}

export default isLoading
