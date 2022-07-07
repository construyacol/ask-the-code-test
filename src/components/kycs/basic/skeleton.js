import React from 'react'
import '../kyc.css'

const KycSkeleton = () => {

  return(
    <div className="KycLayout">
      <p className="fuente KycTitle KycTitless loader"></p>
      <div id="kycPrime" className="containerInputComponent2">
        <div className="inputLabelsCont loader"></div>
        <div className="inputContainer3 loader">
          <p></p>
        </div>
        <div className="InputContainerT loader"></div>
      </div>
    </div>
  )

}

export default KycSkeleton
