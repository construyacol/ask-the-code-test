// import {
// UPDATE_KYC_PICTURE
// } from './action_types'

export function ticket_canceled() {
  return {
    type: 'TICKET_CANCELED_SOUND_EFFECT',
    meta: {
      sound: {
        play :'ticket_canceled'
      }
    }
  }
}

export function notification() {
  return {
    type: 'ADD_NOTIFICATION',
    meta: {
      sound: {
        play :'notification'
      }
    }
  }
}


export function ticket_rejected() {
  return {
    type: 'TICKET_REJ_SOUND_EFFECT',
    meta: {
      sound: {
        play :'ticket_rejected'
      }
    }
  }
}

export function ticket() {
  return {
    type: 'TICKET_SOUND_EFFECT',
    meta: {
      sound: {
        play :'ticket'
      }
    }
  }
}

export function show_sound() {
  return {
    type: 'SHOW_SOUND_EFFECT',
    meta: {
      sound: {
        play :'new_transaction'
      }
    }
  }
}

export function confirm_sound() {
  return {
    type: 'CONFIRM_SOUND_EFFECT',
    meta: {
      sound: {
        play :'confirm_transaction'
      }
    }
  }
}

export function success_sound() {
  return {
    type: 'SUCCESS_SOUND_EFFECT',
    meta: {
      sound: {
        play :'success'
      }
    }
  }
}


export function exit_sound() {
  return {
    type: 'EXIT_SOUND_EFFECT',
    meta: {
      sound: {
        play :'exit'
      }
    }
  }
}


export function toast_sound() {
  return {
    type: 'TOAST_SOUND_EFFECT',
    meta: {
      sound: {
        play :'toast'
      }
    }
  }
}

export function add_coin_sound() {
  return {
    type: 'ADD_COIN_SOUND',
    meta: {
      sound: {
        play :'add_coin'
      }
    }
  }
}

export default show_sound
