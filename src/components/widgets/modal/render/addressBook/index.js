import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useActions } from '../../../../../hooks/useActions'
import OtherModalLayout from '../../otherModalLayout'
import { createSelector } from 'reselect'
import { useSelector } from "react-redux"
import { setAnimation } from '../../../../../utils'
import WithdrawViewState from '../../../../hooks/withdrawStateHandle'
import PopNotification from '../../../notifications'
import AddressBookCTA from './ctas'
import EmptyState from './emptyState'
import NewAccount from './newAccount'
import AddressBookComponent from './addressBookList'
import HeaderComponent from './header'



const selectWithdrawAccounts = createSelector(
  ({ modelData: { withdraw_accounts } }) => withdraw_accounts,
  (_, provider_type) => provider_type,
  (withdraw_accounts, provider_type) => {
  let res = []
    for (const [_, withdraw_account] of Object.entries(withdraw_accounts)) {
      (withdraw_account.provider_type === provider_type && withdraw_account.account_name.value !== provider_type) && res.push(withdraw_account)
    }
    return res
  }
)


const AddressBook = ({ addressToAdd }) => {

  const actions = useActions()
  const [{ current_wallet }] = WithdrawViewState()
  if(!current_wallet){return actions.renderModal(null)}
  const provider_type = current_wallet.currency.currency
  const withdrawAccounts = useSelector(state => selectWithdrawAccounts(state, provider_type))
  const [ view, setView ] = useState('addressList')

  const cerrar = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      actions.renderModal(null)
    }
  }

  const switchView = async(payload) => {
    await setAnimation('disappear', 'mainContainerAB', 150)
    setView(payload)
    await setAnimation('appear', 'mainContainerAB', 150)
  }

  useEffect(()=>{
    if(addressToAdd){
      switchView('newAccount')
    }
  }, [addressToAdd])



  return(
      <OtherModalLayout on_click={cerrar} >
        <ContainerLayout>
          <HeaderComponent provider_type={provider_type} view={view} switchView={switchView}/>
          <Content id="mainContent">
            <Container id="mainContainerAB">
              {
                (view === 'addressList' && withdrawAccounts.length) ?
                  <AddressBookComponent withdrawAccounts={withdrawAccounts} switchView={switchView}/>
                :
                view === 'newAccount' ?
                  <NewAccount provider_type={provider_type} switchView={switchView} addressToAdd={addressToAdd}/>
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
`
