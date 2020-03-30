import React from 'react'
import IconSwitch from '../widgets/icons/iconSwitch'
// import store from '../../'
import './mPrincipal.css'


const MovilMenuComponent = props => {

  // const { user, user_id } = store.getState().modelData
  // const country = user.country
  // const { openSelectCountry, go_to } = props
  const {go_to } = props

  return (
    <div className="MovilMenuComponent">

      <div className="menuMovilItems inactive">
        <p className="menuMovilItemTexts fuente"><i className="far fa-question-circle" ></i> Ayuda</p>
        <i className="fas fa-arrow-right"></i>
      </div>

      <div className="menuMovilItems inactive">
        <p className="menuMovilItemTexts fuente"><i className="fas fa-bell" ></i>Notificaciones</p>
        <i className="fas fa-arrow-right"></i>
      </div>

      <div className="menuMovilItems" onClick={()=>go_to('/referral')}>
        <div className="menuMovilItemTexts fuente"> <IconSwitch icon="referral" size={15} color="white" />Referidos</div>
        <i className="fas fa-arrow-right"></i>
      </div>

      {/* <div className="menuMovilItems" onClick={openSelectCountry}>
        <div className="menuMovilItemTexts fuente" > <IconSwitch icon={country} size={15} color="white" />Cambiar de país</div>
        <i className="fas fa-arrow-right"></i>
      </div> */}

    </div>
  )

}

export default MovilMenuComponent
