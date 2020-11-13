import { IncreaseStep, ReduceStep } from "./formActions";
import { show_sound } from "./soundActions";

import { current_section_params } from "./uiActions";

export const FlowAnimationLayoutAction = (
  animation,
  action,
  current_section,
  explicitStep
) => {
  return async (dispatch) => {
    // dispatch(FlowAnimationUi(animation))
    switch (action) {
      case "next":
        // setTimeout(()=>{
        dispatch(IncreaseStep(current_section, explicitStep));
        // }, 130)
        break;
      case "back":
        // setTimeout(()=>{
        dispatch(ReduceStep(current_section, explicitStep));
        // }, 130)
        break;
      default:
        return false;
    }
  };
};

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
