import React, { useState, useEffect } from 'react'
import { FiSearch } from "react-icons/fi"
import styled from 'styled-components'
import { ItemList } from './itemList'
import { ControlButtonContainer } from '../../../shared-styles'
import ControlButton from '../../../buttons/controlButton'
import { InputContainer } from '../../../inputs/inputForm'



const AddressBookComponent = ({ withdrawAccounts, switchView, setAddressValue }) => {

  const [ searchList, setSearchList ] = useState([])
  const [ searchValue, setSearchValue ] = useState()

  const handleSearch = e => {

    const value = e && e.target.value || searchValue
    if(e && !e.target.value.length){
      setSearchList([])
      return setSearchValue('')
    }

    const result = withdrawAccounts.filter(withdrawAccount => withdrawAccount.info.label.toLowerCase().includes(value.toLowerCase()) || withdrawAccount.info.address.includes(value));
    const condition = value.length > 1 && result.length < withdrawAccounts.length
    if(condition){
      setSearchValue(value)
      setSearchList(result)
    }else{
      setSearchList([])
      setSearchValue('')
    }
    // console.log(result, condition)
  }

  useEffect(()=>{
    if(searchValue){
      handleSearch()
    }
  }, [withdrawAccounts])

  return(
    <>
      <Blocker id="blocker"/>
      <InputContainers>
        <Input height={52}>
          <IconContainer>
            <FiSearch size={25} color="#cecece"/>
          </IconContainer>
          <input
            id="searchInput"
            type="text"
            className="inputElement"
            placeholder="Buscar dirección"
            onChange={handleSearch}
            autoComplete="off"
          />
        </Input>
      </InputContainers>


      <Title className="fuente">{searchList.length ? `Resultado de la busqueda [${searchList.length}]:` : 'Direcciones'}</Title>
      <ListContainerWrapper>
        <ListContainer id="listContainer" className="fuente" data-title="Direcciones">
          {
            searchList.length ?
              searchList.map((item, index) => {
                return <ItemList key={index} item={item} setAddressValue={setAddressValue}/>
              })
            :
              withdrawAccounts.map((item, index) => {
                return <ItemList key={index} item={item} setAddressValue={setAddressValue}/>
              })
          }
        </ListContainer>
     </ListContainerWrapper>

      <ControlButtonContainer bottom={25}>
        <ControlButton
          label="Crear nueva cuenta"
          formValidate
          handleAction={() => switchView('newAccount')}
        />
      </ControlButtonContainer>
    </>
  )
}


export default AddressBookComponent



const Blocker = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  z-index: 99;
  border-radius: 6px;
  backdrop-filter: blur(1px);
  display: none;

  &.deleting{
   display: block;
  }

`


const InputContainers = styled.div`
  display: grid;
  justify-items: center;
  position: absolute;
  justify-self: center;
  top: -15px;
  width: 100%;
  z-index: 2;
  left: 0;
`


const IconContainer = styled.div`
  position: absolute;
  align-self: center;
  left: 10px;
`


const Input = styled(InputContainer)`
  position: relative;
  max-width: 350px;
  height: ${props => `${props.height}px` || 'auto'};
  overflow: visible;

  ${IconContainer} ~ input {
    padding-left: 45px;
  }

  input{
    font-size: 14px;
  }

  label{
    position: absolute;
    top: -25px;
    left: 0;
    font-size: 15px;
    color: #383838;
  }
`

const Title = styled.p`
  font-weight: bold;
  margin-top: 55px;
  margin-bottom: 20px;
  padding-left: 20px;
`


const ListContainerWrapper = styled.div`
  overflow-x: hidden;
  padding: 0 20px;
  height: 375px;
  position: relative;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #b1b1b1;
  }

  &::after{
    content: "";
    width: 100%;
    height: 15px;
    position: fixed;
    top: 167px;
    left: 0;
    background: linear-gradient(to bottom,white,white,transparent);
    z-index: 2;
    pointer-events: none;
  }

  &::before{
    content: "";
    width: 100%;
    height: 15px;
    position: fixed;
    bottom: 95px;
    left: 0;
    background: linear-gradient(to top,white,white,transparent);
    z-index: 2;
    pointer-events: none;
  }
`



const ListContainer = styled.div`

  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  opacity: 1;
  transition: .15s;
`
