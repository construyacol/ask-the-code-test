import React, { useEffect, useState } from "react";
import CriptoSupervisor from "./depositCripto";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import DepositFiat from "./depositFiat";

const DepositView = () => {
  const [, { current_wallet }] = useCoinsendaServices();

  return (
    <>
      {current_wallet.currency_type === "crypto" ? (
        <CriptoSupervisor />
      ) : (
        <DepositFiat />
      )}
    </>
  );
};

export default DepositView;
