import { show_sound } from "./soundActions";
import { current_section_params } from "./uiActions";



export const add_new_transaction_animation = () => {
  return async (dispatch) => {
    dispatch(current_section_params({ new_order_style: true }));
    setTimeout(() => {
      dispatch(current_section_params({ new_order_style: false }));
    }, 1000);
    setTimeout(() => {
      dispatch(show_sound());
    }, 550);
  };
};
