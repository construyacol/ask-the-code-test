import { UPDATE_ACTIVITY, UPDATE_PENDING_ACTIVITY } from "./action_types";

export const update_activity = (account_id, activity_type, activity_list) => {
  return {
    type: UPDATE_ACTIVITY,
    payload: {
      account_id,
      activity_type,
      activity_list,
    },
  };
};

export const pending_activity = (payload) => {
  // console.log('Desde el reducer', payload)
  return {
    type: UPDATE_PENDING_ACTIVITY,
    payload,
  };
};

export default update_activity;
