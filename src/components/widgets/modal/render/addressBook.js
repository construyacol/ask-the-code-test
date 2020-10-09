import React, { useState } from 'react'
import styled from 'styled-components'
import { useActions } from '../../../../hooks/useActions'
import OtherModalLayout from '../otherModalLayout'
import backImg from './map.png'
import { InputContainer } from '../../inputs/inputForm'
import { FiSearch } from "react-icons/fi";
// import testingComponent from '../../../key-actions-documentation'

const withdrawAccounts = [
    {
      "userId": "5ecdad2dcdfb7400e187066b",
      "currency": {
          "currency": "bitcoin_testnet",
          "is_token": false
      },
      "provider_type": "bitcoin_testnet",
      "visible": true,
      "info": {
          "label": "bitcoin_testnet",
          "address": "36mViVHvqC7Jxsd8u4ZBevCDQj8ugK2ohQssa",
          "country": "colombia"
      },
      "used_counter": 2,
      "id": "5f3bc94880d885001f4e1526",
      "created_at": "2020-08-18T12:27:52.861Z",
      "updated_at": "2020-10-06T14:08:42.856Z"
    },
    {
      "userId": "5ecdad2dcdfb7400e187066b",
      "currency": {
          "currency": "bitcoin_testnet",
          "is_token": false
      },
      "provider_type": "bitcoin_testnet",
      "visible": true,
      "info": {
          "label": "bitcoin_testnet",
          "address": "36mViVHvqC7Jxsd8u4ZBevCDQveej8ugK2ohQ",
          "country": "colombia"
      },
      "used_counter": 2,
      "id": "5f3bc94880d885001f4e1527",
      "created_at": "2020-08-18T12:27:52.861Z",
      "updated_at": "2020-10-06T14:08:42.856Z"
    },
    {
      "userId": "5ecdad2dcdfb7400e187066b",
      "currency": {
          "currency": "bitcoin_testnet",
          "is_token": false
      },
      "provider_type": "bitcoin_testnet",
      "visible": true,
      "info": {
          "label": "Bitfinex colombia",
          "address": "36mViVHvqC7Jxsd8u4ZBevCDQj8ud9f8gK2ohQ",
          "country": "colombia"
      },
      "used_counter": 2,
      "id": "5f3bc94880d885001f4e1528",
      "created_at": "2020-08-18T12:27:52.861Z",
      "updated_at": "2020-10-06T14:08:42.856Z"
    },
    {
      "userId": "5ecdad2dcdfb7400e187066b",
      "currency": {
          "currency": "bitcoin_testnet",
          "is_token": false
      },
      "provider_type": "bitcoin_testnet",
      "visible": true,
      "info": {
          "label": "wallet andres fel gar ex",
          "address": "36mViVHvqC7Jxsd8u4ZBevCDQs0d9j8ugK2ohQ",
          "country": "colombia"
      },
      "used_counter": 2,
      "id": "5f3bc94880d885001f4e1529",
      "created_at": "2020-08-18T12:27:52.861Z",
      "updated_at": "2020-10-06T14:08:42.856Z"
    }
]

const AddressBook = props => {

  const actions = useActions()

  const cerrar = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      actions.renderModal(null)
    }
  }

  const handleAction = () => {

  }

  return(
    <OtherModalLayout on_click={cerrar} >
      <ContainerLayout>
        <HeaderComponent/>
        <AddressBookComponent/>
      </ContainerLayout>
    </OtherModalLayout>
  )
}

const AddressBookComponent = props => {

  const [ recentList, setRecentList ] = useState()

  return(
    <Content>
      {
        recentList &&
        <ListContainer className="fuente" data-title="Reciente">
          <p>proof</p>
        </ListContainer>
      }
      <ListContainer className="fuente" data-title="Direcciones">
        {
          withdrawAccounts.map((item, index) => {
            return <ItemList key={index} item={item}/>
          })
        }
      </ListContainer>
    </Content>
  )
}


const ItemList = ({ item:{info:{ address, label }} }) => {

  const getAcronym = () => {
    let patt1 = /^.|\s./g;
    let result = label.match(patt1);
    return result.toString().replace(/,/g, '').toUpperCase()
  }

  return(
    <ItemListContainer>
      <AcronymContainer>
        <p className="fuente">
          {getAcronym()}
        </p>
      </AcronymContainer>
      <ItemTextContainer>
        <p className="fuente label">{label}</p>
        <AddressContainer data-final-address={address.match(/..........$/g).toString()}>
          <Address className="fuente2 withdrawAddress" >{address}</Address>
        </AddressContainer>
      </ItemTextContainer>
    </ItemListContainer>
  )
}

const AcronymContainer = styled.div`
  width: 45px;
  height: 45px;
  background: #0198FF;
  border-radius: 50%;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .3s;
  p{
    color: white;
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 40px;
  }
`

const ItemListContainer = styled.div`
    align-items: center;
    width: 100%;
    height: 80px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: auto 1fr;
    column-gap: 15px;
    cursor: pointer;
    &:hover{
      .label{
        color: #b48728;
      }
    }

`

const Address = styled.p`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const AddressContainer = styled.div`
  position: relative;
  width: 150px;
  cursor: pointer;

  &::after{
    content:attr(data-final-address);
    position: absolute;
    left: 100%;
    top:0;
    font-size: 12px;
    color: gray;
  }
  &:hover{
    width: auto;
  }
  &:hover::after{
    display: none;
  }
`

const ItemTextContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    max-height: 40px;
    align-content: center;
  .label{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: auto;
    max-width: 200px;
  }
  p{
    margin: 0;
    &.withdrawAddress{
      font-size: 12px;
      color: gray;
      padding-left: 14px;
      position: relative;
      &::before{
        content: '- ';
        position: absolute;
        color: white;
        width: 6px;
        height: 7px;
        border-bottom-style: dotted;
        border-left-style: dotted;
        border-color: gray;
        left: 0px;
        border-bottom-width: 2px;
        border-left-width: 2px;
        top: 2px;
      }
    }
  }
`





const Content = styled.div`
  width: calc(100% - 30px);
  height: calc(100% - 85px);
  padding: 65px 15px 20px
  background: white;
  border-radius: 6px;
`

const ListContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding-top:25px;
  display: grid;
  grid-template-columns: 1fr;
  &::after{
    content: attr(data-title);
    position: absolute;
    top: 0;
    left: 0;
    font-size: 17px;
    font-weight: bold;
  }
`

const HeaderComponent = props => {
  return(
    <Header>
      <p className="fuente titleHead">Agenda</p>
      <InputContainers>
        <Input>
          <IconContainer>
            <FiSearch size={25} color="#cecece"/>
          </IconContainer>
          <input
            type="text"
            className="inputElement"
            placeholder="Buscar dirección"
          />
        </Input>
      </InputContainers>
    </Header>
  )
}

const IconContainer = styled.div`
  position: absolute;
  align-self: center;
  left: 10px;
`

const InputContainers = styled.div`
  display: grid;
  justify-items: center;
  position: absolute;
  justify-self: center;
  bottom: -35px;
  width: 100%;
`

const Input = styled(InputContainer)`
  max-width: 350px;
  input{
    font-size: 14px;
    padding-left: 45px;
  }
`

const ContainerLayout = styled.div`
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 650px;
  display: grid;
  grid-template-rows: 80px 1fr;
`

const Header = styled.div`
  ${'' /* background: #0198FF; */}
  width: 97%;
  height: 100%;
  justify-self: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  position: relative;
  display: grid;
  align-items: center;
  .titleHead{
    margin:0 0 0 15px;
    font-size: 22px;
    color: white;
    font-weight: bold;
  }
  background-image: url(${backImg});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: fixed;
`



const AddressBookCTA = props => {

  const actions = useActions()

  const openAddressBook = async() => {
    // const Element = await import('../../../key-actions-documentation')
    // actions.renderModal(Element.default)
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
