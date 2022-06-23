import { useSelector } from "react-redux";
import styled from 'styled-components'



export default function AvailableBalance ({ handleAction, amount, id }) {
    const { keyActions } = useSelector((state) => state.ui);
    const isMovil = window.innerWidth < 768;
  
    return (
      <BalanceContainer>
        <p
          id={id}
          className={`fuente2 ${isMovil ? "movil" : ""}`}
          onClick={handleAction}
        >
          {isMovil ? "Disponible:" : `Disponible${keyActions ? '[M]' : ''}:`} {amount}
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

  .movil {
    font-size: 11px;
  }

  &:hover {
    transform: scale(1.005);
    color: #b48728;
  }
`;
