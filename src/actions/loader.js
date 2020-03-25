import {
  LOADER,
  APP_LOADED,
  APP_LOAD_LABEL
} from './action_types'


export const Loader = (payload) => {
  return {
    type: LOADER,
    payload
  }
}

export const app_loaded = (payload) => {
  return {
    type: APP_LOADED,
    payload
  }
}

export const appLoadLabelAction = (payload) => {
  return {
    type: APP_LOAD_LABEL,
    payload
  }
}



export default Loader
