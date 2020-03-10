import React from 'react'
import './style.css'
import currencyLabels from './currency-labels';

const PricesComponent = ({ exchangeBoxRef, change, style, className, data }) => {
  let { currencyLabel, buyPrice, sellPrice } = data;
  currencyLabel = currencyLabels[currencyLabel];

  return (
    <div ref={exchangeBoxRef} style={style} className={`root-footer ${className}`} >
      <ExchangeBox {...{ change, price: sellPrice, type: 'sell', currencyLabel }} />
      <div className="exchange-divider" />
      <ExchangeBox {...{ change, price: buyPrice, type: 'buy', currencyLabel }} />
    </div>
  )

}

const ExchangeBox = ({ change, price, type, currencyLabel }) => (
  <div className="exchange-text-box">
    <label>
      TE {type === 'buy' ? 'COMPRAMOS' : 'VENDEMOS'} <label className="strong">{currencyLabel}</label> A<br />
      <label className='root-content-numbers' style={change ? { color: '#1FE47B' } : {}}>${price}</label>
    </label>
  </div>
)

export default PricesComponent
