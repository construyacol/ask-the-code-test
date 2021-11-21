import React, { useEffect, useState } from "react";
import IconSwitch from "../icons/iconSwitch";

import "./swapAnimation.css";

// class SwapAnimation extends Component {
const SwapAnimation = (props) => {
  const { from, to, colorIcon } = props;

  const [fromCoin, setFromCoin] = useState();
  const [toCoin, setToCoin] = useState();

  useEffect(() => {
    if (from && to) {
      setTimeout(() => {
        setFromCoin(from);
        setToCoin(to);
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  // manejar un estado donde me cambie el atributo icon en 90 grados para aparecer el siguiente simbolo vectorizado en la animación

  return (
    <div className="SwapAnimation">
      <div className="portaDivisas">
        {fromCoin && toCoin && (
          <div className="contCurrencieSwap">
            <div className="FromCurrency">
              <IconSwitch icon={fromCoin} size={20} />
            </div>
            <div className="ToCurrency">
              <IconSwitch icon={toCoin} size={20} />
            </div>
          </div>
        )}
      </div>

      <div className="transacSwapAnim">
        <IconSwitch icon="transaction" size={20} color={colorIcon} />
      </div>
    </div>
  );
};

export default SwapAnimation;
