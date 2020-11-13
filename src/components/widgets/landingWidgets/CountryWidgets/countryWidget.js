import React, { useState, useEffect, Fragment } from "react";
import CountrySelector from "./countrySelector";
import QuoteContainer from "../../quote/quoteContainer";
import { connect } from "react-redux";
import SimpleLoader from "../../loaders";
import { formatToCurrency } from "../../../../services/convert_currency";
import "./countryWidget.css";

const CountryWidgetComponent = (props) => {
  const [movil] = useState(window.innerWidth < 768 ? true : false);
  const [sellPrice, setSellPrice] = useState();
  const [buyPrice, setBuyPrice] = useState();
  const [quoteView, setQuoteView] = useState("buy");

  useEffect(() => {
    if (props.pairs.currentPair) {
      const formatToCurrencyValue = async () => {
        const {
          buy_price,
          sell_price,
          secondary_currency,
        } = props.pairs.currentPair;
        let format_sell_price = await formatToCurrency(
          sell_price,
          secondary_currency,
          true
        );
        setSellPrice(format_sell_price);
        let format_buy_price = await formatToCurrency(
          buy_price,
          secondary_currency,
          true
        );
        setBuyPrice(format_buy_price);
      };
      formatToCurrencyValue();
    }
  });

  const toggleQuoteMovil = (e) => {
    const { quote } = e.target.dataset;
    setQuoteView(quote);
  };

  return (
    <section id="CountryWidgetComponent">
      <CountrySelector />
      <div className="countryQuotePrice">
        {props.pairs.currentPair && (
          <Fragment>
            {!movil ? (
              <Fragment>
                <div className="buy cQuote" style={{ display: "grid" }}>
                  <p className="fuente">
                    Te compramos {props.pairs.currentPair.primaryShortName} a:
                  </p>
                  <h1 className="fuente2">
                    ${sellPrice}
                    <span className="fuente">
                      {props.pairs.currentPair.secondaryShortName}{" "}
                      <i
                        className="Qventa fas fa-angle-double-up"
                        style={{ display: movil ? "initial" : "none" }}
                      ></i>
                    </span>
                  </h1>
                </div>

                <div className="buy cQuote" style={{ display: "grid" }}>
                  <p className="fuente">
                    Te vendemos {props.pairs.currentPair.primaryShortName} a:
                  </p>
                  <h1 className="fuente2">
                    ${buyPrice}
                    <span className="fuente">
                      {props.pairs.currentPair.secondaryShortName}{" "}
                      <i
                        className="Qventa fas fa-angle-double-up"
                        style={{ display: movil ? "initial" : "none" }}
                      ></i>
                    </span>
                  </h1>
                </div>
              </Fragment>
            ) : (
              <div className="quoteMovil">
                <div className="buy cQuote" style={{ display: "grid" }}>
                  <h1 className="fuente2">
                    {quoteView === "buy" ? `$${sellPrice}` : `$${buyPrice}`}
                    <span className="fuente">
                      {props.pairs.currentPair.secondaryShortName}
                    </span>
                  </h1>
                </div>
                <div className="controlQuoteMovil">
                  <p
                    data-quote="buy"
                    onClick={toggleQuoteMovil}
                    className={`controlQItem fuente ${
                      quoteView === "buy" ? "active" : ""
                    }`}
                  >
                    Te compramos a:
                  </p>
                  <p
                    data-quote="sell"
                    onClick={toggleQuoteMovil}
                    className={`controlQItem fuente ${
                      quoteView !== "buy" ? "active" : ""
                    }`}
                  >
                    Te Vendemos a:
                  </p>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </div>

      <div className="countryGraphPrice">
        {props.pairs.currentPair ? (
          <QuoteContainer landingView={true} />
        ) : (
          <div className="countryGraphPriceLoader">
            <SimpleLoader label="Cargando Precios" />
          </div>
        )}
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    pairs: state.modelData.pairs,
  };
};

export default connect(mapStateToProps)(CountryWidgetComponent);
