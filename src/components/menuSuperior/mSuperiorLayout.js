import React, { useState } from "react";
import loadable from "@loadable/component";
import { Link } from "react-router-dom";
// import { SelectCountryButton } from '../widgets/buttons/buttons'
import { useActions } from "../../hooks/useActions";
// import { getCdnPath } from '../../environment'
import "./mSuperior.css";


const Coinsenda = loadable(() => import("../widgets/icons/logos/coinsenda"));
const SimpleLoader = loadable(() => import("../widgets/loaders"));
const PricesComponent = loadable(() => import("../Prices/PricesComponent"));

const MenuSuperiorLayout = (props) => {
  let compra = "Te compramos a:";
  let venta = "Te vendemos a:";
  const actions = useActions();

  const { 
    // headRoomClass,
    // item_quote,
    movil,
    currentPair,
    sell_price,
    buy_price,
    mouseOver,
    // openSelectCountry,
    loggedIn,
    toggle_menu,
    back_method,
    match,
  } = props;

  const [ itemQuote, setItemQuote ] = useState({buy:true, sell:false})
 
  const showPrices = async () => {
    const PricesModal = await import("../widgets/prices");
    if (!PricesModal) {
      return;
    }
    actions.renderModal(PricesModal.default);
  };

  let view = "detail";

  let path = match.params.path;
  const { primary_path } = match.params;
  // console.log(' - - - - MenuSuperiorLayout - - - -- - :::', primary_path)

  let currency = currentPair
    ? currentPair.primary_currency.currency
    : "coinsenda";

    // console.log('||||||||||||||||||||  itemQuote ==> ', itemQuote)
    // debugger

  return (
    <section className={`MenuSuperiorLayout fuente `}>
      <div className="contDinamic">
        <div className="contenedorLogoSenda">
          <div className="contLogos" style={{ top: path ? "-100%" : "0%" }}>
            <div className="contItemLogo">
              <Coinsenda size={30} color="white" />
            </div>
            <div className="contItemLogo">
              <Link
                to={`/${
                  primary_path === "referral" ? "wallets" : primary_path
                }`}
                className="DCBack"
                aria-label="back"
                style={{ display: view === "detail" ? "" : "none" }}
                onClick={back_method}
              >
                <i className="fas fa-arrow-left"></i>
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`containerMenuSuperior`}
          id="mSuperior"
          onMouseOver={mouseOver}
        >
          {loggedIn ? (
            <div className="capsuleMenu1">
              {window.innerWidth > 768 ? (
                <div className="itemSup closeSesi pricesButton_" onClick={showPrices}>
                  <p>Ver precios</p>
                  <i className="fas fa-tags"></i>
                </div>
              ) : (
                <>
                  <div
                    className="itemSup burgerMen"
                    onClick={toggle_menu}
                  >
                    <i className="fas fa-bars"></i>
                  </div>
                </>
              )}
              {!currentPair ? (
              <div className="cagando">
                <SimpleLoader color="green" grid="Msuperior" />
              </div>
            ) : (
              <>
                <div className={`cotization ${movil ? "movil" : "desktop"}`}>
                  {!movil ? (
                    <PricesComponent
                      change={true}
                      data={{
                        currencyLabel: currency,
                        buyPrice: buy_price,
                        sellPrice: sell_price,
                      }}
                    />
                  ) : (
                    <>
                      <p
                        className={`buy ${movil ? "movil" : "desktop"}`}
                        style={{display: itemQuote.buy || !movil ? "flex" : "none"}}
                        onClick={() => setItemQuote(prevState => { return { buy:!prevState.buy, sell:!prevState.sell }}) }
                      >
                        {venta}
                        <span>
                          <code className="monto">${sell_price}</code>
                          <i
                            className="Qventa fas fa-angle-double-up"
                            style={{ display: movil ? "initial" : "none" }}
                          ></i>
                        </span>
                      </p>
                      <p
                        className={`sell ${movil ? "movil" : "desktop"}`}
                        style={{ display: itemQuote.sell || !movil ? "flex" : "none" }}
                        onClick={() => setItemQuote(prevState => { return { buy:!prevState.buy, sell:!prevState.sell }}) }
                      >
                        {compra}
                        <span>
                          <code className="monto">${buy_price}</code>
                          <i
                            className="Qventa fas fa-angle-double-down"
                            style={{ display: movil ? "initial" : "none" }}
                          ></i>
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
            </div>
          ) : (
            <div className="loggedInFalse"></div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuSuperiorLayout;
