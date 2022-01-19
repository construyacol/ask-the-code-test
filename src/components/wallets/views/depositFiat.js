import React, { useEffect, useState } from "react";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import styled from "styled-components";
import { OperationForm } from "./withdrawCripto";
import IconSwitch from "../../widgets/icons/iconSwitch";
import ControlButton from "../../widgets/buttons/controlButton";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import { useActions } from '../../../hooks/useActions'



const DepositFiat = (props) => {
  const movil_viewport = window.innerWidth < 768;
  const [ loader, setLoader ] = useState(false)
  const idForMainButton = useKeyActionAsClick(
    true,
    "main-button-deposit",
    13,
    true,
    "onkeyup"
  );
  const [
    ,
    {
      current_wallet,
      ui: {
        current_section: { params },
      },
      modelData: { deposit_providers },
    },
    { FiatDeposit },
    dispatch,
  ] = useCoinsendaServices();

  const actions = useActions()
 
  const atributos = {
    icon: "deposit",
    size: movil_viewport ? 80 : 100,
    color: "#989898",
  };

  useEffect(() => {
    dispatch(FiatDeposit(current_wallet.currency.currency || "usd"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fiat_deposit = async (e) => {
    setLoader(true)
    const Element = await import('../../forms/widgets/fiatDeposit/init')
    const FiatDepositComponent = Element.default
    actions.renderModal(() => <FiatDepositComponent/>)
    
    // await dispatch(FiatDeposit(current_wallet.currency.currency || "usd"));
    // dispatch(toggleModal());
    setLoader(false)
  };
 
  return (
    <DepositForm className="DepositView itemWalletView">
      <div className="contIcontSwitch">
        <IconSwitch {...atributos} />
      </div>

      <div className="contIcontSwitchCont">
        {params.active_trade_operation ? (
          <p className="fuente active_trade_operation">
            Operación de intercambio en proceso, una vez finalice podrás hacer
            depositos.
          </p>
        ) : (
          <p className="fuente">
            Realiza y gestiona depósitos en tu moneda local.
          </p>
        )}
      </div>

      <ControlButton
        id={idForMainButton}
        handleAction={fiat_deposit}
        loader={loader || !deposit_providers}
        formValidate
        label="Realizar un deposito"
      />
    </DepositForm>
  );
};

const DepositForm = styled(OperationForm)`
  @media (max-width: 768px) {
    height: calc(100% - 40px) !important;
    max-height: none !important;
  }
`;

export default DepositFiat;


