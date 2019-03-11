import React, {Fragment} from 'react'
import KycBasicContainer from './basic/kyc_basic_container'
import KycAvancedContainer from './avanced/kyc_avanced_container'
import finish from '../../assets/kombat.gif'
import SimpleLoader from '../widgets/loaders'
import { ButtonForms } from '../widgets/buttons/buttons.js'
import './kyc.css'

const KycLayout = (props) =>{

 const { globalStep, nextKyc, loader, siguiente, exit } = props

  return(
    <section className="KycLayoutMom">
      <div className={`KycLayoutCarousel ${globalStep === 0 ? 'globalStep0': globalStep === 1 ? 'globalStep1' : 'globalStep2' }`} >

        {
          loader  ?
              <SimpleLoader/>
          :
          <div className="KycLayout" >
            <p className="fuente KycTitle" >Verificación Basica</p>
              <KycBasicContainer
                nextKyc={nextKyc}
              />
          </div>
        }

          <div className="KycLayoutBasicWin">
            <img src={finish} alt="" height="200"/>
            <h1 className="fuente KycTitles" >Espectacular Andrés</h1>
            <p className="KycParra1" >Haz completado de forma exitosa el proceso de verificación basica</p>
            <div className="Kyccontrols">
                <p className="fuente" >¿Quieres continuar con el proceso de verifiación avanzado?</p>
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
          </div>


          <div className="KycLayout" >
            <p className="fuente KycTitle" >Verificación Avanzada</p>
            {
              globalStep > 1 &&
              <KycAvancedContainer/>
            }
          </div>

      </div>
    </section>

  )
}

export default KycLayout
