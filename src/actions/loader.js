import {
  LOADER
} from './action_types'


export const Loader = (payload) => {
  return {
    type:LOADER,
    payload
  }
}

export default Loader
