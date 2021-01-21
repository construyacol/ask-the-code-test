import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import NumberBox from "./number-box";

const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));

const ReferralCounter = ({ loading, referral}) => {

  const [ referreds, setReferreds ] = useState(0)

  useEffect(()=>{
    if(referral && referral.referreds && referral.referreds){
      setReferreds(2)
      // setReferreds(referral.referreds.length)
    }
  }, [referral && referral.referreds && referral.referreds])

  return (
    <NumberBox
      loading={loading}
      textCss="grid-area: mid-right;"
      Icon={(props) => (
        <IconSwitch {...props} withoutwrapper={true} icon="referral" />
      )}
      quantity={`${referreds} R`}
      definition="Referidos"
      highlight={referreds > 0}
      responsive={true}
    />
  );
};

export default ReferralCounter;
