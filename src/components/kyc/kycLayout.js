import React, {Fragment} from 'react'
import KycBasicContainer from './basic/kyc_basic_container'
import KycAvancedContainer from './avanced/kyc_avanced_container'
import finish from '../../assets/kombat.gif'
import SimpleLoader from '../widgets/loaders'
import { ButtonForms } from '../widgets/buttons/buttons.js'
import { Medal } from '../widgets/icons'
import ConfettiComponent from './basic/confetti'
import './kyc.css'

const KycLayout = (props) =>{

 const { globalStep, validate_personal_kyc, loader, siguiente, exit, user,
   kyc_data_basic, init_state, form_kyc_basic, validate_identity_kyc } = props

 // console.log('||||||||||||| KycBasicContainer init_state - - - ', init_state)
 // let level = user.verification_level
 let name = form_kyc_basic && form_kyc_basic.data_state  && form_kyc_basic.data_state.name



  return(
    <section className="KycLayoutMom">
      {/* <div className={`KycLayoutCarousel globalStep0`} > */}
      <div className={`KycLayoutCarousel ${(globalStep === 0) ? 'globalStep0': globalStep === 1 ? 'globalStep1' : 'globalStep2'}`} >

              <KycBasicContainer
                validate_personal_kyc={validate_personal_kyc}
                {...props}
              />

          <div className="KycLayoutBasicWin" id="callese">
            <h1 className="fuente KycTitles" >Espectacular {name}</h1>
            <Medal size={190}/>
            <p className="KycParra1 fuente" >Haz completado de forma exitosa el proceso de verificación basica</p>
            <p className="fuente continueKyc" >¿Quieres continuar con el proceso de <b> verifiación avanzada</b>?</p>
            <div className="Kyccontrols">
                <div className="Kcontrols">
                  {
                    window.innerWidth>350 &&
                    <ButtonForms
                      active={true}
                      type="secundary"
                      siguiente={exit}
                    >{window.innerWidth>768 ? 'Lo haré despues': 'No' }</ButtonForms>
                  }
                      <ButtonForms
                        active={true}
                        type="primary"
                        siguiente={siguiente}
                      >{window.innerWidth>768 ? 'Continuar verificación': 'Continuar' }</ButtonForms>
                </div>
            </div>
            {
              (globalStep === 0 ||  globalStep === 1) &&
              <ConfettiComponent/>
            }

          </div>


          <div className="KycLayout" >
            <p className="fuente KycTitle" >Verificación Avanzada</p>
            {
              (globalStep > 1) &&
              <KycAvancedContainer
                {...props}
              />
            }
          </div>

      </div>
    </section>
  )
}

export default KycLayout
