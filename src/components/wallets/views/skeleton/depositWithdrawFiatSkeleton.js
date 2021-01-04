import React from 'react'
import { DepositForm } from '../depositCripto'
import ControlButton from "../../../widgets/buttons/controlButton";

const DepositWithdrawFiatSkeleton = props => {

  return(
    <DepositForm className="skeleton DepositView">
      <div className="contIcontSwitch">
        <div className="skeletonDepositIcon"></div>
      </div>

      <div className="contIcontSwitchCont">
        <p className="fuente">
          <span>La mejor manera de iniciar operaciones en coinsenda</span>
          <span> es realizando un deposito/retiro.</span>
        </p>
      </div>
      <ControlButton
        label="Crear dirección de deposito"
      />
    </DepositForm>
  )

}

export default DepositWithdrawFiatSkeleton
