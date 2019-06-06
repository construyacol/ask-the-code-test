import React from 'react'
import { Medal } from '../icons'
import { ButtonForms } from '../buttons/buttons.js'
import ConfettiComponent from './confetti'


const SuccessComponentScreen = props => {


    const{
      user_name,
      exit,
      siguiente,
      confetti,
      cta_primary_text,
      cta_secondary,
      title,
      cta_text,
      classes
    } = props

    return(
        <div className="KycLayoutBasicWin" id="callese">
          <h1 className="fuente KycTitles" >Genial {user_name}</h1>
          <Medal size={window.innerWidth>768 ? 190 : 150}/>
          <p className={`KycParra1 ${classes} fuente`} >{title}</p>
          <p className="fuente continueKyc">{cta_text}</p>
          <div className="Kyccontrols">
              <div className="Kcontrols">
                {
                  (window.innerWidth>350 && cta_secondary) &&
                  <ButtonForms
                    active={true}
                    type="secundary"
                    siguiente={cta_secondary ? exit : null}
                  >
                    {/* {window.innerWidth>768 ? 'Lo haré despues': 'Ahora no' } */}
                  Lo haré despues
                </ButtonForms>
                }
                    <ButtonForms
                      active={true}
                      type="primary"
                      siguiente={siguiente}
                    >
                      {cta_primary_text}</ButtonForms>
              </div>
          </div>
          {
            confetti &&
            <ConfettiComponent/>
          }
        </div>
    )


}

export default SuccessComponentScreen
