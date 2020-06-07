import React from 'react'
import IconSwitch from '../widgets/icons/iconSwitch'
import useViewport from '../../hooks/useWindowSize'
import './mPrincipal.css'


const MovilMenuComponent = props => {

  const { navigateTo } = props
  const { isMovilViewport } = useViewport()

  return (
    <div className="MovilMenuComponent">

      {
        isMovilViewport &&
      <>
      <div className="menuMovilItems inactive">
        <p className="menuMovilItemTexts fuente"><i className="far fa-question-circle" ></i> Ayuda</p>
        <i className="fas fa-arrow-right"></i>
      </div>

      <div className="menuMovilItems inactive">
        <p className="menuMovilItemTexts fuente"><i className="fas fa-bell" ></i>Notificaciones</p>
        <i className="fas fa-arrow-right"></i>
      </div>
      </>
      }

      {/* <div className="menuMovilItems" onClick={() => navigateTo('/referral')}>
        <div className="menuMovilItemTexts fuente"> <IconSwitch icon="referral" size={15} color="white" />Billeteras</div>
        <i className="fas fa-arrow-right"></i>
      </div>

      <div className="menuMovilItems inactive" onClick={() => navigateTo('/referral')}>
        <div className="menuMovilItemTexts fuente"> <IconSwitch icon="referral" size={15} color="white" />Cuentas de retiro</div>
        <i className="fas fa-arrow-right"></i>
      </div>
      <div className="menuMovilItems inactive" onClick={() => navigateTo('/referral')}>
      <div className="menuMovilItemTexts fuente"> <IconSwitch icon="referral" size={15} color="white" />Centro de seguridad</div>
      <i className="fas fa-arrow-right"></i>
    </div> */}

      <div className="menuMovilItems inactive" onClick={() => navigateTo('/referral')}>
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
