import React, {Fragment} from 'react'
import KycBasicContainer from './basic/kyc_basic_container'
import KycAvancedContainer from './avanced/kyc_avanced_container'
import finish from '../../assets/kombat.gif'
import SimpleLoader from '../widgets/loaders'
import { ButtonForms } from '../widgets/buttons/buttons.js'
import { Medal } from '../widgets/icons'
import ConfettiComponent from './basic/confetti'
import KycFinancialComponent from './financial/kyc_financial'
import SuccessComponentScreen from './success_screen'
import './kyc.css'

const KycLayout = (props) =>{

 const { globalStep, validate_personal_kyc, loader, siguiente, exit, user,
   kyc_data_basic, init_state, form_kyc_basic, validate_identity_kyc, validate_financial_kyc } = props
 // console.log('||||||||||||| KycBasicContainer init_state - - - ', init_state)
 // let level = user.verification_level
 let name = form_kyc_basic && form_kyc_basic.data_state  && form_kyc_basic.data_state.name



  return(
    <section className="KycLayoutMom">
      <div className={`KycLayoutCarousel ${(globalStep === 0) ? 'globalStep0': globalStep === 1 ? 'globalStep1' : 'globalStep2'}`} style={{display:globalStep<3 ? 'grid' : 'none'}} >

              <KycBasicContainer
                validate_personal_kyc={validate_personal_kyc}
                {...props}
              />

              <SuccessComponentScreen {...props}
                title="Haz completado de forma exitosa el proceso de verificación basica"
                cta_text="¿Quieres continuar con el proceso de verifiación avanzada?"
                confetti={(globalStep === 0 || globalStep === 1) ? true : false}
                cta_secondary={true}
                cta_primary_text='Continuar verificación'
                user_name={props.user.name}
              />

          <div className="KycLayout" >
            <p className="fuente KycTitle" >Verificación Avanzada</p>
            {
              (globalStep === 2) &&
              <KycAvancedContainer
                {...props}
              />
            }
          </div>

      </div>

      {
        globalStep === 3 &&
        <div className="KycLayout" style={{display:globalStep>2 ? 'grid' : 'none'}}>
          <p className="fuente KycTitle financial" >Verificación Financiera</p>
            <KycFinancialComponent {...props} validate_financial_kyc={validate_financial_kyc}/>
        </div>
      }

    </section>
  )
}

export default KycLayout
