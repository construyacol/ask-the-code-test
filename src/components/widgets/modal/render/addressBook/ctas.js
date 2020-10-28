import React from 'react'
import { useActions } from '../../../../../hooks/useActions'
import styled from 'styled-components'
import AddressBook from './'

const AddressBookCTA = () => {

  const actions = useActions()
  const openAddressBook = async() => {
    actions.renderModal(AddressBook)
  }

  return(
    <AddressBookContainer>
      <p onClick={openAddressBook} className="fuente">Gestionar direcciones >> </p>
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
  p{
    margin: 0;
    font-size: 14px;
    color: #b48728;
    font-weight: bold;
  }
  p:hover{
    text-decoration: underline;
  }
`
