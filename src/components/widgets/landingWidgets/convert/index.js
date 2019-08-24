import React, { useState, useEffect } from 'react'
import { InputFormConverter } from '../../inputs'
import { connect } from 'react-redux'
import IconSwitch from '../../icons/iconSwitch'
// import { formatToCurrency } from '../../../../services/convert_currency'
import convertCurrencies from '../../../../services/convert_currency'
import '../../../landing_page/css/quoteCurrenciesLanding.css'

const ConvertCurrency = props => {

  // handleChange
  const [ wantSpend, setWantSpend ] = useState(1)
  const [ recieved, setRecieved ] = useState(0)

  useEffect(()=>{
    let e = {
      target:{
        name:'wantSpend',
        value:1
      }
    }
    handleChange(e)
  },[])


  const handleChange = async(e) => {

    let wantSpendFormat
    let convertResult

    switch (e.target.name){
      case 'wantSpend':
      // wantSpendFormat = await formatToCurrency(e.target.value, props.currentPair.primary_currency, true)
        wantSpendFormat = e.target.value
        convertResult = await convertCurrencies(props.currentPair.primary_currency, wantSpendFormat, props.currentPair.id)
        setWantSpend(wantSpendFormat)
        setRecieved(convertResult.want_to_spend === 'NaN' ? 0 : convertResult.want_to_spend)
        break;
      case 'recieved':
      return false
      // wantSpendFormat = await formatToCurrency(e.target.value, props.currentPair.primary_currency, true)
      // convertResult = await convertCurrencies(props.currentPair.primary_currency, wantSpendFormat, props.currentPair.id)
      // setWantSpend(wantSpendFormat)
      // setRecieved(convertResult.want_to_spend)
        // break;
      default:
    }

  }


  // console.log('INIT STATE PAYWITH ======> ', recieved)

  return(
          <div className="InputFormConverter">
            <InputFormConverter
              onChange={handleChange}
              name="wantSpend"
              value={wantSpend}
              icon={props.currentPair && props.currentPair.primary_currency.currency}
              iconPosition="left"
              currency_short_name={props.currentPair && props.currentPair.primary_short_name}
            />

            <IconSwitch
              icon="swap"
              size={30}
              color="#0066AA"
            />

            <InputFormConverter
              onChange={handleChange}
              name="recieved"
              value={recieved}
              icon={props.currentPair && props.currentPair.secondary_currency.currency}
              iconPosition="right"
              currency_short_name={props.currentPair && props.currentPair.secondary_short_name}
            />
          </div>
  )
}

const mapStateToProps = state => {

  return{
    currentPair:state.model_data.pairs.currentPair
  }

}


export default connect(mapStateToProps)(ConvertCurrency)
