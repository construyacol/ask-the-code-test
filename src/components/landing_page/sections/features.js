import React from 'react'
import IconSwitch from '../../widgets/icons/iconSwitch'
import '../css/features.css'

const FeaturesContainer = props => {

  return(
    <div id="FeaturesContainer">

      <div className="Fitem ones">
        <div className="Fcabeza">
          <IconSwitch
            icon="atentionHours"
            size={55}
            color="#088ee8"
          />
        </div>
        <h3 className="fuente FTitle">Operamos las 24 horas.</h3>
        <p className="fuente FBody">¡Compra y vende en pesos colombianos cuando quieras!</p>
      </div>

      <div className="Fitem twos">
        <div className="Fcabeza">
          <IconSwitch
            icon="aboutYou"
            size={55}
            color="#088ee8"
          />
        </div>
        <h3 className="fuente FTitle">Pensamos en tí.</h3>
        <p className="fuente FBody">Brindamos una atención rápida, segura y personalizada para que te sientas comodo siempre.</p>
      </div>

      <div className="Fitem threes">
        <div className="Fcabeza">
          <IconSwitch
            icon="atumedida"
            size={55}
            color="#088ee8"
          />
        </div>
        <h3 className="fuente FTitle">Hecho a tu medida</h3>
        <p className="fuente FBody">Compra en efectivo o transferencia bancaria, utilizando multiples metodos de pago.</p>
      </div>

    </div>
  )

}

export default FeaturesContainer
