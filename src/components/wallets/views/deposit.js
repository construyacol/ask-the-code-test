import React from "react";
import CriptoSupervisor from "./depositCripto";
import DepositFiat from "./depositFiat";
import { checkIfFiat } from 'core/config/currencies';
import { useWalletInfo } from 'hooks/useWalletInfo'

const DepositView = () => {
  const { currentWallet } = useWalletInfo();
  return (
    <>
      {!checkIfFiat(currentWallet?.currency) ? (
        <CriptoSupervisor/>
      ) : (
        <DepositFiat />
      )}
    </>
  );
};

export default DepositView;
