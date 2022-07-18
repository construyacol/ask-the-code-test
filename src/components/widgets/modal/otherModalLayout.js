import React from "react";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import "./modal.css";
import { CAPACITOR_PLATFORM } from 'const/const'

const OtherModalLayout = (props) => {
  const {
    children,
    // close_modal,
    on_click,
    onkeydown,
    id = "render-modal-close-button",
    className,
    disable = false
  } = props;

  const idForCloseButton = useKeyActionAsClick(
      true,
      id,
      27,
      false,
      onkeydown ? "onkeydown" : "onkeyup",
      true
    );


  return (
    <section className={`${className || ''} Modal aparecer ${CAPACITOR_PLATFORM === 'ios' && 'ios-notch-fix'}`}>
      <div
        id={(on_click && !disable) ? idForCloseButton : ''}
        className={`modalCont3 ConfirmationModal socketNotifyPers`}
        data-close_modal={true}
        onClick={on_click ? on_click : null}
      >
        {children}
      </div>
    </section>
  );
};

export default OtherModalLayout;
