import React from "react";
import loadable from "@loadable/component";
import NumberBox from "./number-box";

const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));

const ReferralCounter = ({ loading }) => {
  return (
    <NumberBox
      loading={loading}
      textCss="grid-area: mid-right;"
      Icon={(props) => (
        <IconSwitch {...props} withoutwrapper={true} icon="referral" />
      )}
      quantity={"500 R"}
      definition="Referidos"
      highlight
      responsive={true}
    />
  );
};

export default ReferralCounter;
