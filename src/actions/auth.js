import {
  LOGGED_IN
} from './action_types'

export const logged_in = (payload) => {
  return {
    type:LOGGED_IN,
    payload
  }
}

export default logged_in
