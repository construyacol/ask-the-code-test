import React, { useEffect, useState } from 'react';
import loadable from '@loadable/component'
import convertCurrencies from '../../utils/convert_currency'

const NumberInput = loadable(() => import('../widgets/inputs/numberInput'))

export default (props) => {

  const { currentPair } = props
  const [convertedCurrency, setConvertedCurrency] = useState()
  const [amount, setAmount] = useState('20000')

  const convert = async (value) => {
    // En este ejemplo utilizamos el convertidor para comprar Bitcoin, es decir, gastamos COP y adquirimos Bitcoin
    let converted_currency = await convertCurrencies(currentPair.secondary_currency, value, currentPair.id, currentPair)
    setConvertedCurrency(converted_currency)
  }

  useEffect(() => {
    convert(amount.replace(/,/g, ''))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPair])

  const handleChange = (e) => {
    const value = String(e.target.value).replace(/,/g, '') || '0'
    if (isNaN(value) || value === 'NaN') {
      return e.preventDefault()
    }
    setAmount(value)
    convert(value)
  }

  let inputStyles = {
    fontSize: '16px'
  }

  return (
    <div className="root-content-items-calc">
      <CalculatorInput
        iconPath={require(`../../assets/prices-modal/ic_cop.svg`)}
        type="text"
        useCustomInput
        value={amount}
        onChange={handleChange}
        autoComplete="off"
        className="numberFont"
        style={inputStyles}
      />
      <div className="exchange-arrows" style={{ backgroundImage: `url(${require(`../../assets/prices-modal/ellipse.svg`)})`}}>
        <img src={require(`../../assets/prices-modal/exchange_arrows.png`)} style={{ margin: '0.5em 1em' }} alt="" />
      </div>
      <CalculatorInput
        iconPath={require(`../../assets/prices-modal/coin_assets/${currentPair.primary_currency.currency}.svg`)}
        type="text"
        defaultValue={convertedCurrency && convertedCurrency.want_to_spend}
        readOnly
        className="numberFont"
        style={inputStyles}
      />
    </div>
  )
}

function CalculatorInput({ iconPath, useCustomInput, ...rest }) {
  return (
    <div className="item-content-calc-number">
      <img src={iconPath} alt="" />
      {useCustomInput ? <NumberInput {...rest} /> : <input {...rest} />}
    </div>
  )
}
