import React from "react";
import IconSwitch from "../icons/iconSwitch";
import "./bubble.css";

export default (props) => {
  return (
    <section id="floatSupportMask">
      <div id="floatSupportContainer">
        <a
          className="floatSupport second"
          href="https://wa.me/573117656310"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconSwitch icon="whatsapp" size={35} />
        </a>
        <a
          className="floatSupport second"
          href="https://t.me/Coinsendaoficial"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconSwitch icon="telegram" size={35} />
        </a>
        <div className="floatSupport ">
          <i id="bubbleIcon" className="fas fa-comment-alt"></i>
        </div>
      </div>
    </section>
  );
};
