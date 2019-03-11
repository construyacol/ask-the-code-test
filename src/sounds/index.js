import new_transaction from './success.mp3'
import success from './success2.mp3'
import exit from './exit.mp3'
import good_action from './good.mp3'
import toast from './toast.mp3'
import confirm from './good.mp3'
import ticket from './good.mp3'
import ticket_rejected from './rejected.mp3'
import ticket_canceled from './canceled.mp3'
import add_coin from './coin.mp3'
import notification from './notification.mp3'


export const soundData = {
  notification,
  new_transaction:{ 
    src:[new_transaction],
    volume:0.2
  },
  confirm_transaction:{
    src:[confirm],
    volume:1
  },
  ticket:{
    src:[ticket],
    volume:0.5
  },
  ticket_rejected:{
    src:[ticket_rejected],
    volume:0.5
  },
  ticket_canceled:{
    src:[ticket_canceled],
    volume:0.6
  },
  success:{
    src:[success],
    volume:0.2
  },
  exit:{
    src:[exit],
    volume:0.2
  },
  toast:{
    src:[toast],
    volume:0.8
  },
  good_action,
  add_coin
}

export default soundData
