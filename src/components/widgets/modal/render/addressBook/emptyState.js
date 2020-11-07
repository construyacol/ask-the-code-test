import React from 'react'
import styled from 'styled-components'
import ControlButton from '../../../buttons/controlButton'
import IconSwitch from '../../../icons/iconSwitch'
import { ControlButtonContainer } from '../../../shared-styles'
import useKeyActionAsClick from '../../../../../hooks/useKeyActionAsClick'
import useViewport from  '../../../../../hooks/useWindowSize'



const EmptyState = ({ switchView }) => {

  const idForOpenAddressBook = useKeyActionAsClick(true, 'create-new-account', 65, false, 'onkeyup', true)
  const { isMovilViewport } = useViewport()


  return(
    <EmptyStateContainer>
      <p className="fuente">Aún no tienes cuentas de retiro crypto agregadas.</p>
      <IconSwitch size={200} icon="newAccount" />
      <ControlButtonContainer bottom={50}>
        <ControlButton
          label={`Crear nueva cuenta ${!isMovilViewport && '[A]'}`}
          formValidate
          handleAction={() => switchView('newAccount')}
          id={idForOpenAddressBook}
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
