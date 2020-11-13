import React from "react";
import NumberBox from "./number-box";
import { Handshake } from "../widgets/icons";

const ReferralCounter = ({ loading }) => {
  return (
    <NumberBox
      loading={loading}
      textCss="grid-area: mid-right;"
      Icon={Handshake}
      quantity={"500 R"}
      definition="Referidos"
      highlight
      responsive={true}
    />
  );
};

export default ReferralCounter;
