import React, { Component, Fragment } from 'react'
import referral from '../../assets/referrals.png'
import InputForm from '../widgets/inputs'
import { InputButton } from '../widgets/buttons/buttons'

import './referrals.css'

class ReferralComponent extends Component {

  render(){
   let name = 'Mi_nombre_coinsenda'
    return(
      <div className="ReferralComponent">
        <div className="referralCont">

          <div className="textReferral">
            <p className="fuente titleReferr">¡Invita amigos y gana!</p>
            <p className="fuente parraFerrer">Por cada amigo que se registre con tu link de referido ganas el 0.5% de todas las operaciones de compra y venta que tu amigo realice.</p>
          </div>

          <div className="contReferral">
              <img src={referral} alt="" />
              <div className="formControl">
                <InputForm
                  label="Crea el link de referido"
                  placeholder={`Ej: ${name}`}
                  name="referral"
                />

                <InputButton
                  active={true}
                  type="primary"
                  label="Crear Link"
                  action={null}
                />

              </div>
          </div>

        </div>
      </div>
    )
  }

}

export default ReferralComponent
