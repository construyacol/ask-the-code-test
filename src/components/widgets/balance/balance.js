import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import { formatToCurrency } from "../../../utils/convert_currency";
import sleep from "../../../utils/sleep";

import "./index.css";

const BalanceComponent = ({ balance, currency, currency_type }) => {
  const [current_amount, set_current_amount] = useState("0");
  const [actionType, setActionType] = useState("");
  const [animation, setAnimation] = useState("");
  const prevBalance = useRef(balance);

  useEffect(() => {
    prevBalance.current = balance;
    let current_amount = formatToCurrency(balance.available, currency);
    set_current_amount(current_amount.toFormat());
  }, []);

  useEffect(() => {
    if (
      balance &&
      prevBalance.current &&
      JSON.stringify(balance) !== JSON.stringify(prevBalance.current)
    ) {
      prevBalance.current = balance;
      exec_operation(balance);
    }
  }, [balance]);

  const exec_operation = async (balance) => {
    const { lastAction, actionAmount, available } = balance;

    if (actionAmount) {
      // el actionAmount es la cantidad a reducir o sumar de la operación, solo con fines de dar feedback visual al usuario, no es indispensable para su funcionalidad
      const actionAmountFormat = formatToCurrency(actionAmount, currency);
      await play_animation("Out");
      setActionType(lastAction);
      set_current_amount(actionAmountFormat.toFormat());
      await play_animation("In");
    }

    actionAmount && (await sleep(500));
    actionAmount && (await play_animation("Out"));
    const availableAmount = formatToCurrency(available, currency);
    setActionType("");
    set_current_amount(availableAmount.toFormat());
    actionAmount && (await play_animation("In"));
  };

  const play_animation = async (anim) => {
    setAnimation(anim);
    await sleep(250);
  };

  return (
    <div className="BalanceComponent wallet">
      <p className="fuente title balanceTitle">Balance </p>

      <div className={`displayCont itt ${animation}`}>
        <p className={`textin fuente2 ${actionType}`}>
          {actionType === "reduce" ? "-" : actionType === "add" ? "+" : ""}
          {currency_type === "fiat" ? `$${current_amount}` : current_amount}
        </p>
      </div>
    </div>
  );
};

function mapStateToProps(state, props) {
  const { balances, user } = state.modelData;

  const { account_id } = props;

  return {
    balance: balances && balances[account_id],
    user: user,
    currency_type: state.modelData.wallets[account_id].currency_type,
    currency: state.modelData.wallets[account_id].currency,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(BalanceComponent));
