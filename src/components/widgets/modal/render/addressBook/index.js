import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useActions } from '../../../../../hooks/useActions'
import OtherModalLayout from '../../otherModalLayout'
import { useSelector } from "react-redux"
import { setAnimation } from '../../../../../utils'
import WithdrawViewState from '../../../../hooks/withdrawStateHandle'
import PopNotification from '../../../notifications'
import AddressBookCTA from './ctas'
import EmptyState from './emptyState'
import NewAccount from './newAccount'
import AddressBookComponent from './addressBookList'
import HeaderComponent from './header'
import { swing_in_bottom_bck } from '../../../animations'
import  selectWithdrawAccountsByProviderType from '../../../../selectors'
import { IconBackContainer } from '../../../shared-styles'
import { AiOutlineClose } from "react-icons/ai"


const AddressBook = ({ addressToAdd, setAddressValue }) => {

  const actions = useActions()
  const [{ current_wallet, path }] = WithdrawViewState()
  const provider_type = current_wallet && current_wallet.currency.currency
  const withdrawAccounts = useSelector(state => selectWithdrawAccountsByProviderType(state, provider_type))
  const [view, setView] = useState('addressList')

  const cerrar = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      actions.renderModal(null)
    }
  }

  const switchView = async (payload) => {
    await setAnimation('disappear', 'mainContainerAB', 150)
    setView(payload)
    await setAnimation('appear', 'mainContainerAB', 150)
  }

  useEffect(() => {
    if (addressToAdd) {
      switchView('newAccount')
    }
  }, [addressToAdd])

  if (!current_wallet || path !== 'withdraw') {
    cerrar()
    return <></>
  }

  useEffect(()=>{
    const appearTransition = async() => {
      await setAnimation('appear', 'containerLayout', 700)
      const element = document.getElementById('containerLayout')
      element && element.classList.add('keepOpacity')
    }

    appearTransition()
  }, [])

  return (
    // Dato de onkeydown y otros events.
    // No pueden ser reutilizados, lo puse en false(onkeydown), porque estaba siendo utilizado por el useNavigationKeyActions
    <OtherModalLayout id="close-button-with-OtherModalLayout" onkeydown={false} on_click={cerrar} >
      <ContainerLayout id="containerLayout">
        <IconClose color="dark" opacity=".9" size="30px" onClick={() => actions.renderModal(null)}>
          <AiOutlineClose color="white" size={20} />
        </IconClose>
        <HeaderComponent provider_type={provider_type} view={view} switchView={switchView} />
        <Content id="mainContent">
          <Container id="mainContainerAB">
            {
              (view === 'addressList' && withdrawAccounts.length) ?
                <AddressBookComponent withdrawAccounts={withdrawAccounts} switchView={switchView} setAddressValue={setAddressValue} />
                :
                view === 'newAccount' ?
                  <NewAccount provider_type={provider_type} switchView={switchView} addressToAdd={addressToAdd} />
                  :
                  <EmptyState switchView={switchView}></EmptyState>
            }
          </Container>
        </Content>
      </ContainerLayout>
    </OtherModalLayout>
  )
}

export default AddressBook



const IconClose = styled(IconBackContainer)`
  z-index: 2;
  right: 5px;
  top: -36px;
  position: absolute;
  cursor: pointer;
`


const Container = styled.div`

  width: calc(100% - 2px);
  height: calc(100% - 2px);
  padding: 1px;
  transition:.15s;

  &.disappear{
    transform: translateY(22px);
    opacity: 0;
  }

  &.appear{
    transform: translateY(0px);
    opacity: 1;
  }
`

const Content = styled.div`

  width: 100%;
  height: 100%;
  background: white;
  border-radius: 6px;
  position: relative;

`


const ContainerLayout = styled.div`
  width: 100%;
  max-width: 400px;
  height: 650px;
  display: grid;
  grid-template-rows: 80px 1fr;
  transform-style: preserve-3d;
  opacity: 0;

  &.appear{
    -webkit-animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
    animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
  }

  &.keepOpacity{
    opacity: 1;
  }

  }

`
