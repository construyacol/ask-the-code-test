import {
  LOGGED_IN, SET_AUTH_DATA
} from './action_types'

export const logged_in = (payload) => {
  return {
    type:LOGGED_IN,
    payload
  }
}

export const setAuthData = (payload) => {
  return {
    type:SET_AUTH_DATA,
    payload
  }
}
