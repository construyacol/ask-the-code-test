import React from "react";
import CriptoSupervisor from "./depositCripto";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import DepositFiat from "./depositFiat";
import { checkIfFiat } from 'core/config/currencies';

const DepositView = () => {
  const [, { current_wallet }] = useCoinsendaServices();

  return (
    <>
      {!checkIfFiat(current_wallet?.currency) ? (
        <CriptoSupervisor/>
      ) : (
        <DepositFiat />
      )}
    </>
  );
};

export default DepositView;
