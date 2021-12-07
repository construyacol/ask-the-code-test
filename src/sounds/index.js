import { getCdnPath } from '../environment'

export const soundData = {
  notification: {
    src: [`${getCdnPath('assets')}sounds/notification.mp3`],
    volume: 0.2,
  },
  new_transaction: {
    src: [`${getCdnPath('assets')}sounds/success.mp3`],
    volume: 0.2,
  },
  confirm_transaction: {
    src: [`${getCdnPath('assets')}sounds/good.mp3`],
    volume: 1,
  },
  ticket: {
    src: [`${getCdnPath('assets')}sounds/good.mp3`],
    volume: 0.4,
  },
  ticket_rejected: {
    src: [`${getCdnPath('assets')}sounds/rejected.mp3`],
    volume: 0.4,
  },
  ticket_canceled: {
    src: [`${getCdnPath('assets')}sounds/canceled.mp3`],
    volume: 0.6,
  },
  success: {
    src: [`${getCdnPath('assets')}sounds/success2.mp3`],
    volume: 0.2,
  },
  exit: {
    src: [`${getCdnPath('assets')}sounds/exit.mp3`],
    volume: 0.2,
  },
  toast: {
    src: [`${getCdnPath('assets')}sounds/toast.mp3`],
    volume: 0.4,
  },
  good_action: {
    src: [`${getCdnPath('assets')}sounds/good.mp3`],
    volume: 0.4,
  },
  add_coin: {
    src: [`${getCdnPath('assets')}sounds/coin.mp3`],
    volume: 0.4,
  }
};

export default soundData;
