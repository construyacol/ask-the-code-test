import React from 'react'
import InputForm from '../../../widgets/inputs/inputForm'
import { WithdrawForm } from './'
import ControlButton from '../../../widgets/buttons/controlButton'


const CriptoViewLoader = () => {

  return (
    <>
      <WithdrawForm>
        <InputForm skeleton />
        <InputForm skeleton />
        <ControlButton
          formValidate={false}
          label="Enviar"
        />
      </WithdrawForm>
    </>
  )

}

export default CriptoViewLoader
