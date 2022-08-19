import React, { useEffect } from "react";
import WithdrawViewState from "hooks/withdrawStateHandle";
import { CriptoSupervisor } from "./withdrawCripto";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import FiatView from "./withdrawFiat";

const WithdrawView = () => {
  const [{ withdraws, current_wallet }] = WithdrawViewState();
  const [coinsendaServices] = useCoinsendaServices();

  useEffect(() => {
    if (!withdraws) {
      coinsendaServices.get_withdraws(current_wallet.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {current_wallet.currency_type === "crypto" ? (
        <CriptoSupervisor />
      ) : (
        <FiatView />
      )}
    </>
  );
};

export default WithdrawView;
