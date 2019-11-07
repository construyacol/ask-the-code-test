import React, { Fragment } from 'react'
// import brand3 from '../../../assets/mobile.png'

const LandingMobileSection = props => {

  return(
    <Fragment>
      <div className="backgroundMobileSect">
        <div className="backgroundMap"></div>
      </div>
      <div className="LandingMobileSection">
        {/* <img className="mobileImg" src={brand3} height="540" alt=""/> */}
        <div className="mobileTextSect">
          <h2 className="fuente"> <span> Próximamente podrás operar </span> desde tu dispositivo movil.</h2>
          <p className="fuente">Comprar, vender y cambiar crypto activos nunca fue tan facil, con nuestra aplicación web progresiva podrás operar sin limites y desde cualquier lugar con tu dispositivo movil.</p>
        </div>
      </div>
    </Fragment>
  )

}

export default LandingMobileSection
