import React, { useEffect } from "react";
import WithdrawViewState from "hooks/withdrawStateHandle";
import CriptoSupervisor from "./withdrawCripto";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import FiatView from "./withdrawFiat";
import { checkIfFiat } from 'core/config/currencies';

const WithdrawView = () => {
  const [{ withdraws, current_wallet }] = WithdrawViewState();
  const [coinsendaServices] = useCoinsendaServices();

  useEffect(() => {
    if (!withdraws) {
      coinsendaServices.get_withdraws(current_wallet.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  // return <CriptoSupervisor />
  return (
    <>
      { !checkIfFiat(current_wallet.currency) ? (
        <CriptoSupervisor />
      ) : (
        <FiatView />
      )}
    </>
  );
};

export default WithdrawView;
