import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const PriceWidget = ({buyPrice, sellPrice, classes}) => {
  return (
    <ul className={classes}>
      <li role="presentation">
        <span className="text-center">
          <span className="price-label">Precio Compra</span>
          <br />$ {buyPrice.toLocaleString()}
        </span>
      </li>
      <li role="presentation">
        <span className="text-center">
          <span className="price-label">Precio Venta</span>
          <br />$ {sellPrice.toLocaleString()}
        </span>
      </li>
    </ul>
  )
}
PriceWidget.propTypes = {
  buyPrice: PropTypes.number.isRequired,
  sellPrice: PropTypes.number.isRequired
}
const mapPairsToProps = state => {
  return {
    sellPrice: state.pairs.selling,
    buyPrice: state.pairs.buying
  }
}

export default connect(mapPairsToProps)(PriceWidget)
