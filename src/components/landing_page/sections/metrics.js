import React from 'react'
import IconSwitch from '../../widgets/icons/iconSwitch'
import brand from '../../../assets/brand/criptoi.png'
import brand2 from '../../../assets/brand/cryptoDirectorio.jpg'
import brand3 from '../../../assets/brand/diariobitcoin.jpg'

import '../css/sections.css'

const MetricsContainer = props => {




  return(
    <div id="MetricsContainer">
      <h2 className="titleSections fuente colorTitleLanding">Haz parte de la <span className="fuente">revolución financiera</span> y camina de nuestro lado</h2>


      <div className="contMetricElem">
        <div className="MetricsContent">
          <div className="backgroundIMGmetric"></div>
          <div className="contMetricStructure">
            <div className="metricItem">
              <div className="metricC">
                <IconSwitch
                  icon="team"
                  size={window.innerWidth<768 ? 80 : 120}
                  color="white"
                />
                <p className="metricText fuente2">13.000</p>
                <p className="metricLabel fuente">Usuarios</p>
              </div>
            </div>
            <div className="metricItem">
              <div className="metricItem">
                <div className="metricC">
                  <IconSwitch
                    icon="swap"
                    size={window.innerWidth<768 ? 60 : 80}
                    color="white"
                  />
                  <p className="metricText fuente2">150.000</p>
                  <p className="metricLabel fuente">Operaciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="brandPress">
          <div className="brandPressCont">
            <img src={brand} height="35px" alt=""/>
            <img src={brand2} height="35px" alt=""/>
            <img src={brand3} height="35px" alt=""/>
          </div>
        </div>
      </div>

    </div>
  )

}

export default MetricsContainer
