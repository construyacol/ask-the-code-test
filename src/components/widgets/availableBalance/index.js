// import { useSelector } from "react-redux";
import styled from 'styled-components'
import BigNumber from "bignumber.js"
import { formatToCurrency } from "utils/convert_currency";


export default function AvailableBalance ({ handleAction, amount, id, uiCopy, wallet }) {

    const isMovil = window.innerWidth < 768;
    let availableBalance = wallet ? formatToCurrency(amount, wallet?.currency) : BigNumber(amount)

    return (
      <BalanceContainer className="_balanceComponent">
        <p
          id={id}
          className={`fuente2 ${isMovil ? "movil" : ""}`}
          onClick={() => handleAction(availableBalance?.toString() || amount)}
        >
          {isMovil ?  'MÁX' : uiCopy ? `${uiCopy} ${availableBalance?.toFormat()}` : `Disponible: ${availableBalance?.toFormat()}`}
        </p>
      </BalanceContainer>
    );
  };

  const BalanceContainer = styled.div`
  cursor: pointer;
  position: absolute;
  display: flex;
  right: 5px;
  color: var(--paragraph_color);
  height: 100%;
  display: flex;
  align-items: center;
  transition: 0.15s;
  transform: scale(1);
  max-height: 47px;
  align-self: self-end;
  width: max-content;

  &:hover {
    transform: scale(1.005);
    color: #b48728;
  }
`;
