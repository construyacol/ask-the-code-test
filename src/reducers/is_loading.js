import {
  LOADER,
  APP_LOADED,
  APP_LOAD_LABEL
} from '../actions/action_types'

const initialState = {
  loader:false,
  app_loaded:false,
  app_load_label:"epale"
}

const isLoading = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        loader: action.payload
      }
    case APP_LOADED:
      return{
        ...state,
        app_loaded:action.payload
      }
    case APP_LOAD_LABEL:
      return{
        ...state,
        app_load_label:action.payload
      }
    default:
      return state
  }
}

export default isLoading
