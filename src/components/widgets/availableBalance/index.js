// import { useSelector } from "react-redux";
import styled from 'styled-components'
import { formatToCurrency } from "utils/convert_currency";


export default function AvailableBalance ({ handleAction, amount, id, copyText = "MAX", wallet }) {

    // const { keyActions } = useSelector((state) => state.ui);
    const isMovil = window.innerWidth < 768;
    const finalAmount = wallet ? formatToCurrency(amount, wallet?.currency)?.toFormat() : amount

    return (
      <BalanceContainer className="_balanceComponent">
        <p
          id={id}
          className={`fuente2 ${isMovil ? "movil" : ""}`}
          onClick={handleAction}
        >
          {isMovil ?  copyText : `${copyText}: ${finalAmount}`}
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
