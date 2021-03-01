import React from "react";
import "../icons.css";

export const BankCoopFinAnt = (props) => {
  return (
    <img
      width={props.size}
      src="data:image/png;base64,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"
      alt=""
    />
  );
};

export default BankCoopFinAnt;
