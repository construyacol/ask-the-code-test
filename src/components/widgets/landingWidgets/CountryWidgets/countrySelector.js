import React, { Fragment } from 'react'
import IconSwitch from '../../icons/iconSwitch'
import { connect } from 'react-redux'


const CountrySelector = props => {

  return(
    <Fragment>
      <div id="CountrySelector"></div>
      <div id="CountrySelectorButton">
        <div className="CountrySelectorButtonimg">
          <IconSwitch size={50} icon="colombia" />
        </div>
        {/* <p className="fuente">{props.country || 'País actual'} <i className="fas fa-angle-down"></i></p> */}
        <p className="fuente">{props.country || 'País actual'}</p>
      </div>
    </Fragment>
  )

}

const mapStateToProps = state => {

  return{
    country:state.model_data.pairs.country
  }

}

export default connect(mapStateToProps)(CountrySelector)
