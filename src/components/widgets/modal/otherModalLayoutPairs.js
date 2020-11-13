import React, { useEffect } from "react";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import "./modal.css";
import { IconClose } from "../shared-styles";

const OtherModalLayoutPairs = (props) => {
  const { children, title, close_modal, classes } = props;

  const idForCloseModal = useKeyActionAsClick(
    true,
    "close-modal-button-orders",
    27,
    true,
    "onkeyup",
    true
  );

  const closeModal = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      close_modal && close_modal();
    }
  };

  return (
    <section className={`Modal aparecer`}>
      <div
        className={`modalCont2 ConfirmationModal`}
        data-close_modal={true}
        onClick={closeModal ? closeModal : null}
      >
        <div className={`PairList ${classes === "2auth" ? "auth" : classes}`}>
          <IconClose theme="dark" size={20} />
          <div className="PairListtitle">
            <h1 className="fuente">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
};

export default OtherModalLayoutPairs;
