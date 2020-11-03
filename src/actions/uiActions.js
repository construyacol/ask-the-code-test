import {
  ITEM_QUOTE_ACTIVE,
  MODAL_CONFIRMATION_TOGGLE,
  CONFIRMATION_MODAL_PAYLOAD,
  SECTION_VIEW_TO,
  CURRENT_SECTION_PARAMS,
  PAIRS_FOR_ACCOUNT,
  OTHER_MODAL,
  CURRENT_SECTION_CLEAN,
  FLOW_ANIMATION_LAYOUT,
  FLOW_ANIMATION_OFF,
  ADD_NOTIFICATION,
  CLEAN_NOTIFICATIONS,
  PLAY_VIDEO,
  VERIFICATION_STATE,
  DEFAULT_VIDEO_STATE,
  CLEAN_ITEM_NOTIFICATIONS,
  SOCKET_NOTIFY,
  SET_RENDER_MODAL,
  UPDATE_LOADERS,
} from "./action_types";

export const renderModal = (payload) => {
  // Para que el render modal pueda acceder a los parametros de la ruta, debe estár precedido de una redirección push del history y el render component debe ser
  // llamado con un import dinamico tal como está aplicado en el order_item de activityList, acceder tambien a los parametros de la ruta envolviendo el renderModal del modals-supervisor en un Hoc que sería lo ideal.
  return {
    type: SET_RENDER_MODAL,
    payload: payload,
  };
};

export const socket_notify = (payload, item_type, title) => {
  let payload_array = payload &&
    item_type && [{ ...payload, item_type, title }];
  return {
    type: SOCKET_NOTIFY,
    payload: payload && payload_array,
  };
};

export const verificationStateAction = (payload) => {
  return {
    type: VERIFICATION_STATE,
    payload,
  };
};

export const play_video = (payload) => {
  return {
    type: PLAY_VIDEO,
    payload,
  };
};

export const default_video_state = (payload) => {
  return {
    type: DEFAULT_VIDEO_STATE,
    payload,
  };
};

export const addNotification = (payload, extra, amount) => {
  return {
    type: ADD_NOTIFICATION,
    payload,
    amount: amount,
    extra: extra,
    meta: {
      sound: {
        play: "notification",
      },
    },
  };
};

export const CleanNotifications = (payload) => {
  return {
    type: CLEAN_NOTIFICATIONS,
    payload,
  };
};

export const cleanNotificationItem = (payload, item_clean) => {
  return {
    type: CLEAN_ITEM_NOTIFICATIONS,
    payload,
    item_clean,
  };
};

// export const new_fiat_deposit = (wallet_id, data) =>{
//   // Recibe como parametro un objeto
//   // ej this.props.action.current_section_params({current_wallet:this.state.current_wallet})
//   return{
//     type:NEW_FIAT_DEPOSIT,
//     payload:{
//       wallet_id,
//       data
//     }
//   }
// }

export const FlowAnimationOff = () => {
  return {
    type: FLOW_ANIMATION_OFF,
  };
};

export const FlowAnimationUi = (payload) => {
  // @params
  // nextV    //Avance de sección de forma Vertical
  // backV    //Retroceder sección de forma Vertical
  // nextH    //Avance de sección de forma Horizontal
  // backH    //Retroceder sección de forma Horizontal
  return {
    type: FLOW_ANIMATION_LAYOUT,
    payload,
  };
};

export const toggleOtherModal = () => {
  return {
    type: OTHER_MODAL,
  };
};

export const pairsForAccount = (wallet_id, data) => {
  // Recibe como parametro un objeto
  // ej this.props.action.current_section_params({current_wallet:this.state.current_wallet})
  return {
    type: PAIRS_FOR_ACCOUNT,
    payload: {
      wallet_id,
      data,
    },
  };
};

export const current_section_params = (payload) => {
  // Recibe como parametro un objeto
  // ej this.props.action.current_section_params({current_wallet:this.state.current_wallet})
  return {
    type: CURRENT_SECTION_PARAMS,
    payload,
  };
};

export const cleanCurrentSection = () => {
  return {
    type: CURRENT_SECTION_CLEAN,
  };
};

export const section_view_to = (payload) => {
  return {
    type: SECTION_VIEW_TO,
    payload,
  };
};

// export const HeadRoom = payload => {
//   return{
//     type:HEAD_ROOM,
//     payload
//   }
// }

export const ItemQuoteActive = (payload) => {
  return {
    type: ITEM_QUOTE_ACTIVE,
    payload,
  };
};

export const confirmationModalToggle = (payload) => {
  return {
    type: MODAL_CONFIRMATION_TOGGLE,
    payload,
  };
};

export const confirmationModalPayload = (payload) => {
  return {
    type: CONFIRMATION_MODAL_PAYLOAD,
    payload,
  };
};

export const updateLoadersAction = (payload) => {
  return {
    type: UPDATE_LOADERS,
    payload,
  };
};

// export default HeadRoom
