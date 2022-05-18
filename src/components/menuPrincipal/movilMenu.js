import React from "react";
import useViewport from "../../hooks/useWindowSize";
import "./mPrincipal.css";

const MovilMenuComponent = (props) => {
  const { isMovilViewport } = useViewport();
  const showPrices = async () => {
    const PricesModal = await import("../widgets/prices");
    if (!PricesModal) {
      return;
    }
    props.actions.renderModal(PricesModal.default);
    
    setTimeout(() => props.close_menu_principal(), 500) 
    // debugger
  };

  return (
    <div className="MovilMenuComponent">
      {isMovilViewport && (
        <>
          <div className="menuMovilItems active" onClick={() => showPrices()}>
              <p className="menuMovilItemTexts fuente active">
                <i className="fas fa-tags"></i> Ver precios
              </p>
              <i className="fas fa-arrow-right"></i>
          </div>
        </>
      )}
    </div>
  );
};

export default MovilMenuComponent;
