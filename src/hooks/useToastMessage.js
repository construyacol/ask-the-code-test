import { useDispatch } from "react-redux";
import { toast } from "../utils";
import { toast_sound } from "./../actions/soundActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const dispatch = useDispatch();

  const toastMessage = (msg, type, position) => {
    setTimeout(() => {
      dispatch(toast_sound());
    }, 300);

    toast(msg, type, position);
  };
  return [toastMessage];
}
