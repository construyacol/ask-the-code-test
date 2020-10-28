import React from 'react'
import styled from 'styled-components'
import ControlButton from '../../../buttons/controlButton'
import IconSwitch from '../../../icons/iconSwitch'
import { ControlButtonContainer } from '../../../shared-styles'

const EmptyState = ({ switchView }) => {

  return(
    <EmptyStateContainer>
      <p className="fuente">Aún no tienes cuentas de retiro crypto agregadas.</p>
      <IconSwitch size={200} icon="newAccount" />
      <ControlButtonContainer bottom={50}>
        <ControlButton
          label="Crear nueva cuenta"
          formValidate
          handleAction={() => switchView('newAccount')}
        />
      </ControlButtonContainer>
    </EmptyStateContainer>
  )
}

export default EmptyState

const EmptyStateContainer = styled.section`
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: auto auto;
  max-height: 300px;
  padding-top: 70px;
  row-gap: 50px;

  p{
    max-width: 300px;
    text-align: center;
    color: dimgrey;
  }

`
