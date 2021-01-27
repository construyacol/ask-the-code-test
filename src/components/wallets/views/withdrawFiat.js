import React from "react";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import WithdrawViewState from "../../hooks/withdrawStateHandle";
import ControlButton from "../../widgets/buttons/controlButton";
import IconSwitch from "../../widgets/icons/iconSwitch";

const FiatView = (props) => {
  const [
    { active_trade_operation, current_wallet, loader },
    { current_section_params, toggleModal },
    dispatch,
  ] = WithdrawViewState();
  const idForMainButton = useKeyActionAsClick(
    true,
    "main-button-withdraw",
    13,
    true,
    "onkeyup"
  );

  let movil_viewport = window.innerWidth < 768;

  const atributos = {
    icon: "withdraw2",
    size: movil_viewport ? 80 : 100,
    color: "#989898",
  };

  const handleSubmit = (e) => {
    dispatch(current_section_params({ currentFilter: "withdraws" }));
    dispatch(toggleModal());
  };

  return (
    <section
      id=""
      className={`DepositView itemWalletView ${
        movil_viewport ? "movil" : ""
      } withdrawView`}
    >
      <div className="contIcontSwitch">
        <IconSwitch {...atributos} />
      </div>

      <div className="contIcontSwitchCont">
        {active_trade_operation ? (
          <p className="fuente active_trade_operation">
            Operación de intercambio en proceso, una vez finalice podrás hacer
            retiros.
          </p>
        ) : (
          <p className="fuente">
            Gestiona y realiza retiros en tu moneda local <span style={{textTransform:"capitalize"}}>(
            {current_wallet.currency.currency})</span>, desde Coinsenda a tu cuenta
            bancaria.
          </p>
        )}
      </div>

      <ControlButton
        loader={loader}
        // loader={loader || Object.keys(withdraw_accounts).length === 0}
        id={idForMainButton}
        formValidate={!active_trade_operation}
        label="Realizar un retiro"
        handleAction={handleSubmit}
      />
    </section>
  );
};

export default FiatView;
