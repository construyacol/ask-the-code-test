import React from 'react'
import CountryWidgetComponent from '../../widgets/landingWidgets/CountryWidgets/countryWidget'
import { connect } from 'react-redux'
import ConvertContainer from '../../widgets/landingWidgets/convert'
import '../css/quoteCurrenciesLanding.css'

const QuoteCurrenciesLanding = props => {

  const {
    quoteComponentActive
  } = props

  return(
    <section id="QuoteCurrenciesLanding" className={`QuoteCurrenciesLanding ${quoteComponentActive ? 'active' : ''}`}>
        <CountryWidgetComponent/>
        {
          props.currentPair &&
          <ConvertContainer/>
        }
    </section>
  )
}


const mapStateToProps = state => {

  return{
    currentPair:state.model_data.pairs.currentPair
  }

}


export default connect(mapStateToProps)(QuoteCurrenciesLanding)
