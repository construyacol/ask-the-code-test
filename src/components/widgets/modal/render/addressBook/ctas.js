import React, { useState, useEffect } from 'react'
import { useActions } from '../../../../../hooks/useActions'
import styled from 'styled-components'
import AddressBook from './'
import { atentionAnimation } from '../../../animations'
import useKeyActionAsClick from '../../../../../hooks/useKeyActionAsClick'
import useViewport from  '../../../../../hooks/useWindowSize'




const AddressBookCTA = ({ addressToAdd, setAddressValue }) => {

  const idForCreateNewAccount = useKeyActionAsClick(true, 'open-address-book', 65, false, 'onkeyup')
  const { isMovilViewport } = useViewport()
  const actions = useActions()

  const openAddressBook = async() => {
    actions.renderModal(() => <AddressBook setAddressValue={setAddressValue} addressToAdd={addressToAdd}/>)
  }

  return(
    <AddressBookContainer className={`${addressToAdd ? 'addressToAdd' : ''} `} id={idForCreateNewAccount} onClick={openAddressBook}>
      <p className="fuente">{!isMovilViewport && '[A] '}{addressToAdd ? `+ Agregar cuenta de retiro` : 'Gestionar direcciones >>'}</p>
    </AddressBookContainer>
  )
}

export default AddressBookCTA

const AddressBookContainer = styled.div`
  position: absolute;
  height: 25px;
  right: 0;
  bottom: -35px;
  cursor: pointer;
  display: flex;

  p{
    margin: 0;
    font-size: 14px;
    color: #b48728;
    font-weight: bold;
  }
  p:hover{
    text-decoration: underline;
  }

  &.addressToAdd{
    animation: ${atentionAnimation} 1s forwards, blurs 1s linear 1s infinite;
  }

  @keyframes blurs{
    0%{
      text-shadow: 0px 1px 8px rgba(255, 173, 0, 0);
      transform: scale(1);
    }
    50%{
      text-shadow: 0px 1px 8px rgba(255, 173, 0, .7);
      transform: scale(1.03);
    }
    100%{
      transform: scale(1);
      text-shadow: 0px 1px 8px rgba(255, 173, 0, 0);
    }
  }
`
