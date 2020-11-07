import React, { useState, useEffect } from 'react'
import WithdrawViewState from '../../../hooks/withdrawStateHandle'
import { useSelector } from "react-redux"
import  selectWithdrawAccountsByProviderType from '../../../selectors'
import styled from 'styled-components'
import { ItemList } from '../../../widgets/modal/render/addressBook/itemList'
import useNavigationKeyActions from '../../../../hooks/useNavigationKeyActions';



const AddressTagList = ({show, addressValue, setAddressValue}) => {

  if(!show){return null}

  const [{ current_wallet }] = WithdrawViewState()
  const provider_type = current_wallet && current_wallet.currency.currency
  const withdrawAccounts = useSelector(state => selectWithdrawAccountsByProviderType(state, provider_type))

  const [ searchList, setSearchList ] = useState([])

  // const [setCurrentSelection] = useNavigationKeyActions({
  //     items:withdrawAccounts,
  //     loader: false, // si queremos que los items se sincronicen con el loader del app, pasamos el loader como parametro
  //     uniqueIdForElement: 'account-item-', // el uniqueIdForElement tiene que ser unico para ca instancia de useNavigationKeyActions
  //     modalRestriction: false, // como usaremos useNavigationKeyActions en un modal no es necesario restringir
  //     next: 40, //arrows right and left, si no funcion entonces verificar que no este en uso el keyEvent
  //     prev: 38
  // })

  useEffect(()=>{
      const value = addressValue.replace(/@/g, '')
      const result = withdrawAccounts.filter(withdrawAccount => withdrawAccount.info.label.toLowerCase().includes(value.toLowerCase()))
      if(result.length < withdrawAccounts.length){
        setSearchList(result)
      }
  }, [addressValue])

  useEffect(()=>{
    if(searchList.length === 1){
      setAddressValue(searchList[0].info.address)
      // console.log(searchList, searchList.length)
    }
  }, [searchList])

  const handleEventClick = (e) => {
    if(e.target && e.target.classList && !e.target.classList.contains('search-component')){
      setAddressValue('')
    }
  }

  useEffect(()=>{
    if(!withdrawAccounts.length){return}
    const WIN = window
    WIN.addEventListener('click', handleEventClick)
    return () => WIN.removeEventListener('click', handleEventClick)
  }, [])



  return (
    <SearchComponentWrapper>
      <SearchComponentContainer className="search-component">
        {
          searchList.length ?
            searchList.map((item, index) => {
              return <ItemList
                key={index}
                item={item}
                setAddressValue={setAddressValue}
              />
            })
          :
            withdrawAccounts.map((item, index) => {
              return <ItemList
                key={index}
                item={item}
                setAddressValue={setAddressValue}
                // number={index}
                // setCurrentSelection={setCurrentSelection}
                // focusedId={`account-item-${index}`}

              />
            })
        }
      </SearchComponentContainer>
    </SearchComponentWrapper>
  )
}


export default AddressTagList


const SearchComponentWrapper = styled.section`
  width: 100%;
  height: auto;
  max-height: 310px
  overflow-x: hidden;
  position: absolute;
  top: 105px;
  left: 0;
  z-index: 2;
  background: white;
  border-radius: 4px;
  box-shadow: 5px 5px 9px -3px rgba(0,0,0,0.15);

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #b1b1b1;
  }
`




const SearchComponentContainer = styled.div`
  height: auto;
  width: 100%;
  position: relative;

  ${'' /* &::after{
    content: '';
    top: 0;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: gray;
  } */}

  #cubeContainer, #frontCube, #itemListContainer{
    height: 60px;
  }

  #cubeContainer{
    margin: 12px 0;
  }

  #frontCube{
    #acronymContainer{
      transform: scale(.9);
    }
  }

  i{
    display: none;
  }
`
