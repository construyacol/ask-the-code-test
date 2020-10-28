import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useActions } from '../../../../hooks/useActions'
import OtherModalLayout from '../otherModalLayout'
import backImg from './map.png'
import InputForm from '../../inputs/inputForm'
import { InputContainer } from '../../inputs/inputForm'
import { FiSearch } from "react-icons/fi"
import { Icon, Front, Top, CubeObject } from '../../shared-styles'
import { createSelector } from 'reselect'
import { useSelector } from "react-redux"
import ControlButton from '../../buttons/controlButton'
import { setAnimation } from '../../../../utils'
import IconSwitch from '../../icons/iconSwitch'
import WithdrawViewState from '../../../hooks/withdrawStateHandle'
import { MdKeyboardArrowLeft } from "react-icons/md"
import { useCoinsendaServices } from '../../../../services/useCoinsendaServices'
import useToastMessage from '../../../../hooks/useToastMessage'
import PopNotification from '../../notifications'
import SimpleLoader from '../../loaders'

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


const AddressBook = () => {

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
                  <NewAccount provider_type={provider_type} switchView={switchView}/>
                :
                  <div onClick={()=>switchView('newAccount')}>Empty State</div>
              }
           </Container>
          </Content>
        </ContainerLayout>
      </OtherModalLayout>
  )
}




const NewAccount = ({ provider_type, switchView }) => {

  const [ addressState, setAddressState ] = useState()
  const [ addressValue, setAddressValue ] = useState()
  const [ nameState, setNameState ] = useState()
  const [ loader, setLoader ] = useState()


  const [coinsendaServices, _, actions, dispatch] = useCoinsendaServices()
  const [{ withdraw_accounts, current_wallet }] = WithdrawViewState()
  const [ toastMessage ] = useToastMessage()


  const handleSubmit = async(e) => {
    e && e.preventDefault()

    setLoader(true)
    const form = new FormData(document.getElementById('newAccount'))
    const label = form.get('name-account')
    const address = form.get('address-account')
    const thisAccountExist = withdraw_accounts[address]
    if(thisAccountExist && thisAccountExist.info.label === provider_type){
      // Si la cuenta existe y su label es igual al provider_type, es una cuenta anónima, por lo tanto se oculta la misma para crear una cuenta asociada al nuevo label
      const hideAccount = await coinsendaServices.deleteAccount(thisAccountExist.id)
      if(!hideAccount){
        toastMessage('No se pudo ocultar la cuenta anónima', 'error')
        return setLoader(false)
      }
    }else if(thisAccountExist && thisAccountExist.info.label !== provider_type){
      toastMessage('Esta cuenta de retiro ya existe', 'error')
      return setLoader(false)
    }

    const newWithdrawAccount = await coinsendaServices.addNewWithdrawAccount({
      currency:current_wallet.currency,
      provider_type:provider_type,
      label,
      address,
      country:current_wallet.country
    }, 'cripto')

    if(!newWithdrawAccount){
      toastMessage('No se pudo crear la cuenta', 'error')
      return setLoader(false)
    }
    // idNewAccount
    // console.log('||||||||||||||||||| newWithdrawAccount::', newWithdrawAccount)
    await toastMessage('¡La cuenta ha sido creada con éxito!', 'success')
    await coinsendaServices.fetchWithdrawAccounts()
    await dispatch(actions.success_sound())
    await switchView('addressList')
    let idNewAccount = document.getElementById(newWithdrawAccount.id)
    idNewAccount.classList.add('shower')


  }

  return(
      <NewAccountContainer>
        <ProviderTypeIcon>
          <IconSwitch icon={provider_type} size={45}/>
          <p className="fuente">{provider_type}</p>
        </ProviderTypeIcon>
        {/* <Form onSubmit={e => e.preventDefault()}> */}
        <Form id="newAccount" onSubmit={handleSubmit}>
            <InputForm
              classes="fuente"
              type="text"
              name="name-account"
              label="Nombre de la cuenta"
              autoFocus={true}
              autoComplete="off"
              handleStatus={setNameState}
            />

            <InputForm
              classes="fuente2"
              type="text"
              name="address-account"
              label={`Dirección ${provider_type}`}
              handleStatus={setAddressState}
              autoComplete="off"
              isControlled
              handleChange={(_, value) => setAddressValue(value)}
              value={addressValue}
              SuffixComponent={()=> <IconSwitch
                icon={`${addressState === 'good' ? 'verify' : 'wallet'}`}
                color={`${addressState === 'good' ? 'green' : 'gray'}`}
                size={`${addressState === 'good' ? 22 : 25}`} />}
            />
        <ControlButtonContainer bottom={0}>
          <ControlButton
            label="Crear"
            formValidate={addressState === 'good' && nameState === 'good'}
            // formValidate
            // handleAction={handleSubmit}
            loader={loader}
          />
        </ControlButtonContainer>
        </Form>
      </NewAccountContainer>
  )
}



const Form = styled.form`
  position: relative;
`

const ProviderTypeIcon = styled.div`
    height: 100px;
    justify-self:center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const NewAccountContainer = styled.div`

  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 10px;
  padding: 40px 22px;
  height: calc(100% - 80px);

  .labelText{
    font-size: 15px;
  }

  input{
    font-size: 14px;
  }
`

const HeaderComponent = ({ provider_type, view, switchView }) => {

  const getTittle = view => {
    switch (view) {
      case 'newAccount':
        return `Creando nueva cuenta`
      default:
        return `Agenda ${provider_type}`
    }
  }

  const goBack = () => {
    return switchView('addressList')
  }

  return(
    <Header>
      <section>
        <WindowControl state={`${view === 'addressList' ? 'close' : 'open'}`} onClick={goBack}>
          <div>
            <MdKeyboardArrowLeft size={27} color="white"/>
          </div>
        </WindowControl>
        <p className="fuente titleHead">{getTittle(view)}</p>
      </section>
    </Header>
  )
}

const WindowControl = styled.div`
  div{
    width: 35px;
    height: 35px;
    background: rgb(255, 255, 255, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }
  overflow: hidden;
  width: 0;
  transition: .2s;
  width: ${props => props.state === 'open' ? '45px' : '0px'};
  opacity: ${props => props.state === 'open' ? '1' : '0'};
  cursor:pointer;

`

const AddressBookComponent = ({ withdrawAccounts, switchView }) => {

  const [ searchList, setSearchList ] = useState([])
  const [ searchValue, setSearchValue ] = useState()

  const handleSearch = e => {

    const value = e && e.target.value || searchValue
    console.log(e && !e.target.value.length)

    if(e && !e.target.value.length){
      setSearchList([])
      return setSearchValue('')
    }

    const result = withdrawAccounts.filter(withdrawAccount => withdrawAccount.info.label.includes(value) || withdrawAccount.info.address.includes(value));
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
            autocomplete="off"
          />
        </Input>
      </InputContainers>


      <Title className="fuente">{searchList.length ? `Resultado de la busqueda [${searchList.length}]:` : 'Direcciones'}</Title>
      <ListContainerWrapper>
        <ListContainer id="listContainer" className="fuente" data-title="Direcciones">
          {
            searchList.length ?
              searchList.map((item, index) => {
                return <ItemList key={index} item={item}/>
              })
            :
              withdrawAccounts.map((item, index) => {
                return <ItemList key={index} item={item}/>
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


const Title = styled.p`
  font-weight: bold;
  margin-top: 55px;
  margin-bottom: 20px;
  padding-left: 20px;
`



const ControlButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  display: grid;
  bottom: ${props => `${props.bottom}px`}

  #controlsContainer{
    transform: scale(.95);
  }
`

const ItemList = ({ item:{ id, info:{ address, label }}}) => {

  const getAcronym = () => {
    let patt1 = /^.|\s./g;
    let result = label.match(patt1);
    return result.toString().replace(/,/g, '').toUpperCase()
  }

  const [ deleting, setDeleting ] = useState('')
  const [coinsendaServices, _, actions, dispatch] = useCoinsendaServices()
  const [ toastMessage ] = useToastMessage()

  const setDeletingState = payload => {
    setDeleting(payload)
    setTimeout(()=>{setDeleting('')}, 300)
  }


  const deleteItem = async e => {

    if(!e.target.dataset.action){return}

    const blockerActive = document.getElementById(`blocker`);
    const searchInput = document.getElementById(`searchInput`);

    switch (e.target.dataset.action) {
      case 'open':
        blockerActive.classList.add('deleting')
        searchInput.setAttribute('disabled', true)
      return setDeleting('rotate')

      case 'close':
        blockerActive.classList.remove('deleting')
        searchInput.removeAttribute('disabled')
      return setDeletingState('unrotate')

      case 'delete':
        const loaderDeleteItem = document.getElementById(`loader_${id}`)
        loaderDeleteItem.classList.add('deleting')
        const deletedAccount = await coinsendaServices.deleteAccount(id)
        if(!deletedAccount){
          loaderDeleteItem.classList.remove('deleting')
          blockerActive.classList.remove('deleting')
          return toastMessage(':( La cuenta no ha podido ser eliminada', 'error')
        }
        await coinsendaServices.fetchWithdrawAccounts()
        searchInput.removeAttribute('disabled')
        loaderDeleteItem.classList.remove('deleting')
        blockerActive.classList.remove('deleting')
        setDeletingState('unrotate')
        dispatch(actions.success_sound())
        return toastMessage('¡La cuenta ha sido eliminada con éxito!', 'success')
      default:
        return setDeletingState('unrotate')

    }

  }


  return(
    <CubeObject className={`${deleting}`}>
      <Front>
        <ItemListContainer>
          <AcronymContainer>
            <p className="fuente">
              {getAcronym()}
            </p>
          </AcronymContainer>
          <ItemTextContainer>
            <div>
              <p className="fuente label">{label}</p>
              <NewElement id={id} className="fuente">Nuevo</NewElement>
            </div>
            <AddressContainer data-final-address={address.match(/..........$/g).toString()}>
              <Address className="fuente2 withdrawAddress" >{address}</Address>
            </AddressContainer>
          </ItemTextContainer>
          <DeleteButton>
            <Icon className="fas fa-trash-alt tooltip" data-action="open" onClick={deleteItem}>
              <span className="tooltiptext fuente">Eliminar</span>
            </Icon>
          </DeleteButton>
        </ItemListContainer>
      </Front>
      <Top>
        <DeleteComponent
          itemId={id}
          handleAction={deleteItem}
        />
      </Top>
    </CubeObject>
  )

}

const NewElement = styled.p`
  font-size: 12px;
  color: white;
  background: red;
  margin-left: 10px !important;
  padding: 4px 5px;
  border-radius: 4px;
  font-weight: bold;
  ${'' /* transform: scale(0); */}
  animation-name: nuevo;
  animation-duration: .3s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  display: none;
  &.shower{
    display: block;
  }

  @keyframes nuevo{
    0%{
      transform: scale(0);
    }
    65%{
      transform: scale(1.1);
    }
    100%{
      transform: scale(1);
    }
  }
`

const DeleteButton = styled.div`
  border-radius: 50%;
  position: absolute;
  align-self: center;
  transition: .15s;
  right: 0;
  display: grid;
  opacity: 0;
`


const DeleteComponent = ({ handleAction, itemId }) => {
  return(
    <DeleteContainer>
      <LoaderDeleteItem id={`loader_${itemId}`}><SimpleLoader loader={2} color="#0198FF" justify="center" /></LoaderDeleteItem>
      <p className="fuente confirmText">¿Estás seguro que deseas eliminar esta cuenta de retiro?</p>
      <DeleteControls>
        {/* <p className="fuente cancel"  onClick={()=>handleAction('unrotate')}>Cancelar</p> */}
        <p className="fuente cancel" data-action="close" onClick={handleAction}>Cancelar</p>
        <p className="fuente delete" data-action="delete" onClick={handleAction}>Eliminar</p>
      </DeleteControls>
    </DeleteContainer>
  )
}

const LoaderDeleteItem = styled.div`
  background: #ffffffe8;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: grid;
  align-items: center;
  justify-items:center;
  display: none;

  &.deleting{
    display: grid;
  }
`

const DeleteControls = styled.div`
  display: grid;
  width: 100%;
  max-width: 200px;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;

  .delete{
    background: red;
    color: white;
    font-weight: bold;
  }

  .cancel{
    color: gray;
  }

  p{
    cursor: pointer;
    border-radius: 3px;
    display: grid;
    align-items: center;
    text-align: center;
    padding: 0 12px;
  }
`


const DeleteContainer = styled.div`
  width: 100%;
  height: calc(100% - 20px);
  padding: 10px 0;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr;
  position: relative;

  p{
    max-width: 70%
    font-size: 13px;
    color: black;
    margin: 0;
    text-align: center;
  }
`



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
  position: relative;
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
    transition: .2s;
    opacity: .9;
    position: relative;
    &:hover{
      opacity: 1;
      ${DeleteButton}{
        right: 10px;
        opacity: 1;
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

    >div{
      display: flex;
    }

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



  ${'' /* &.deleting::after{
    content: '';
    position: absolute;
    z-index: 10;
    background: rgb(255, 255, 255, 0.85);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    backdrop-filter: blur(2px);
    border-radius: 6px;
    opacity: .8;
    transition: .3s;
  } */}
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
  top: -15px;
  width: 100%;
  z-index: 2;
  left: 0;
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

const ContainerLayout = styled.div`
  width: 100%;
  max-width: 400px;
  height: 650px;
  display: grid;
  grid-template-rows: 80px 1fr;
  transform-style: preserve-3d;
`

const Header = styled.div`

  width: 97%;
  height: 100%;
  justify-self: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  position: relative;
  display: grid;
  align-items: center;

  section{
    display: flex;
    align-items: center;
    margin:0 0 0 15px;
  }

  p{
    font-size: 22px;
    color: white;
    font-weight: bold;
  }

  p.appear{
    opacity: 1;
  }

  p.disappear{
    opacity: 0;
  }

  background-image: url(${backImg});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: fixed;
`



const AddressBookCTA = ({ provider_type }) => {

  const actions = useActions()

  const openAddressBook = async() => {
    // const Element = await import('../../../key-actions-documentation')
    // actions.renderModal(Element.default)
    const element = () => <AddressBook provider_type={provider_type}/>
    actions.renderModal(element)
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
