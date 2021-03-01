import React from "react";
import "../icons.css";

export const BankColteFinanciera = (props) => {
  return (
    <img
      width={props.size}
      src="data:image/png;base64,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"
      alt=""
    />
  );
};

export default BankColteFinanciera;
