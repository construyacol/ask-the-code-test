import React, { Component } from 'react'
import IconSwitch from '../icons/iconSwitch'

import './termo.css'

class LimitTermometer extends Component {

  // recibe
   // limite
   // cantidad

   componentDidMount(){
     // const {
     //   amount,
     //   max_amount
     // } = props
     //
     // let limit = (amount*100)/max_amount
     // let units = (limit/100)

   }

  render(){

    const {
      limit,
      orders
    } = this.props

    return(
      <section className="LimitTermometer">
        {
          orders>1 &&
          <div className="flag" title="Cantidad de ordenes">
            <div className="contFlag">
              <IconSwitch icon="tag" size={35} color="#ff1100"/>
              <p className="fuentePrin">{orders}</p>
            </div>
          </div>
        }
        <OrderLimit amount={limit} />
      </section>
    )

  }

}

export default LimitTermometer

const OrderLimit = props =>{

  const {
    amount
  } = props

  return(
    <div className="OLlimit" style={{height:`${amount>100 ? '100' : amount}%`}}>
      <div className="OrderLimit"></div>
    </div>
  )
}
