import {
  LOADER,
  IS_APP_LOADED,
  APP_LOAD_LABEL
} from '../actions/action_types'

const initialState = {
  loader:false,
  isAppLoaded:false,
  app_load_label:"Iniciando"
}

const isLoading = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        loader: action.payload
      }
    case IS_APP_LOADED:
      return{
        ...state,
        isAppLoaded:action.payload
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
