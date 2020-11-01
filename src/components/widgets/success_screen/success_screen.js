import React from 'react'
import { Medal } from '../icons'
import { ButtonForms } from '../buttons/buttons.js'
import ConfettiComponent from './confetti'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'


const SuccessComponentScreen = props => {
  const {
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
  const idForExitButton = useKeyActionAsClick(cta_secondary, 'exit-button-success', 8, false, 'onkeyup', true)
  const idForContinueButton = useKeyActionAsClick(true, 'continue-button-success', 13, false, 'onkeyup', true)

  return (
    <div className="KycLayoutBasicWin" id="callese">
      <h1 className="fuente KycTitles" >Genial {user_name}</h1>
      <Medal size={window.innerWidth > 768 ? 190 : 150} />
      <p className={`KycParra1 ${classes} fuente`} >{title}</p>
      <p className="fuente continueKyc">{cta_text}</p>
      <div className="Kyccontrols">
        <div className="Kcontrols">
          {
            (window.innerWidth > 350 && cta_secondary) &&
            <ButtonForms
              _id={idForExitButton}
              active={true}
              type="secundary"
              siguiente={cta_secondary ? exit : null}
            >
              {/* {window.innerWidth>768 ? 'Lo haré despues': 'Ahora no' } */}
                  Lo haré despues
                </ButtonForms>
          }
          <ButtonForms
            _id={idForContinueButton}
            active={true}
            type="primary"
            siguiente={siguiente}
          >
            {cta_primary_text}</ButtonForms>
        </div>
      </div>
      {
        confetti &&
        <ConfettiComponent />
      }
    </div>
  )


}

export default SuccessComponentScreen
