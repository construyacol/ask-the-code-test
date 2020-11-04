import React from 'react'
import IconSwitch from '../../../widgets/icons/iconSwitch'


const WithOutProvider = ({ current_wallet }) => {
  return (
    <section className="maintanceW">
      <IconSwitch icon="maintence" size={130} color="#989898" />
      <p className="fuente" >
        Los retiros de {current_wallet.currency.currency} estan fuera de servicio temporalmente, ten paciencia...
      </p>
    </section>
  )
}

export default WithOutProvider
