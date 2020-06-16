import React from 'react'
import KycBasicContainer from './basic/kyc_basic_container'
import KycAvancedContainer from './avanced/kyc_avanced_container'
import KycFinancialComponent from './financial/kyc_financial'
import SuccessComponentScreen from '../widgets/success_screen/success_screen'
import './kyc.css'

const KycLayout = (props) =>{

 const { globalStep, validate_personal_kyc, validate_financial_kyc, identity_success } = props
 // console.log('||||||||||||| KycBasicContainer init_state - - - ', init_state)
 // let level = user.verification_level

 // console.log( '||||||||||||||||||||||||||||||||||| CURRENT FORM =>', props)
  return(
    <section className="KycLayoutMom">
      <div className={`KycLayoutCarousel ${(globalStep === 0) ? 'globalStep0': globalStep === 1 ? 'globalStep1' : 'globalStep2'}`} style={{display:globalStep<3 ? 'grid' : 'none'}} >

          {
            (props.user.security_center.kyc.basic !== 'accepted' && props.user.security_center.kyc.basic !== 'confirmed') ?
            <KycBasicContainer
              validate_personal_kyc={validate_personal_kyc}
              {...props}
            />
            :
            <div></div>
          }

              <SuccessComponentScreen {...props}
                title="Haz completado de forma exitosa el proceso de verificación básica"
                cta_text="¿Quieres continuar con el proceso de verifiación avanzada?"
                confetti={(globalStep === 0 || globalStep === 1) ? true : false}
                cta_secondary={true}
                cta_primary_text='Continuar verificación'
                user_name={props.user.name}
              />

          <div className="KycLayout" >
            {
              !identity_success &&
              <p className="fuente KycTitle" >Verificación Avanzada</p>
            }

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
