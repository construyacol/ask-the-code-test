import React, { Component} from 'react'
import IconSwitch from '../icons/iconSwitch'

import './swapAnimation.css'

class SwapAnimation extends Component {


  render(){

    const{
      from,
      to,
      colorIcon
    } = this.props
// manejar un estado donde me cambie el atributo icon en 90 grados para aparecer el siguiente simbolo vectorizado en la animación
  // console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| SWAP ANIMATION', this.props);

    return(
      <div className="SwapAnimation">
        <div className="portaDivisas">
          <div className="contCurrencieSwap">
              <div className="FromCurrency">
                <IconSwitch icon={from || 'bitcoin'} size={20}/>
              </div>
              <div className="ToCurrency">
                <IconSwitch icon={to || 'bitcoin'} size={20}/>
              </div>
          </div>
        </div>

        <div className="transacSwapAnim">
          <IconSwitch icon="transaction" size={20} color={colorIcon} />
        </div>

      </div>
    )
  }
}


export default SwapAnimation
