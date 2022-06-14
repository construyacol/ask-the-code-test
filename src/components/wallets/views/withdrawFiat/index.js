import { useState, useEffect, useRef } from "react";
// import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";
// import WithdrawViewState from "../../../hooks/withdrawStateHandle";
import ControlButton from "../../../widgets/buttons/controlButton";
import IconSwitch from "../../../widgets/icons/iconSwitch";
import styled from 'styled-components'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { isEmpty } from 'lodash'
// import { MdDoNotDisturbOnTotalSilence } from "react-icons/md";
import NewFiatWithdrawAccountComponent from '../../../forms/widgets/newWithdrawAccount/init'


const selectFiatWithdrawAccounts = createSelector(
  ({ modelData:{ withdraw_accounts } }) => withdraw_accounts,
  (withdraw_accounts) => {
    if(!withdraw_accounts)return;
    let fiatWithdrawAccounts = []
    Object.keys(withdraw_accounts).forEach(wAKey => {
      if(withdraw_accounts[wAKey]?.currency_type.includes("fiat")){
        fiatWithdrawAccounts.push(withdraw_accounts[wAKey])
      }
    });
    return fiatWithdrawAccounts
  }
)

const CreateNewWithdrawAccount = ({ setCreateAccount }) => {

  const titleSectionEl = useRef(document.querySelector('.accountDetailTitle h1'))

  useEffect(() => {
    initConfig()
    return () => unMountAction()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // console.log('titleSectionEl', titleSectionEl?.current)

  const unMountAction = () => {
    titleSectionEl.current.classList.remove("_breadCrumbParent");   
    titleSectionEl.current.onclick = () => null;
  }

  const backToWithdraw = () => {
    titleSectionEl.current.innerHTML = "Retirar";
    document.querySelector("._breadCrumbChild")?.remove()
    setCreateAccount(false)
    unMountAction()
  }

  const initConfig = () => {
    titleSectionEl.current.innerHTML = "Retirar   /      ";
    titleSectionEl.current.classList.add("_breadCrumbParent");   
    titleSectionEl.current.onclick = backToWithdraw
    const newSpan = document.createElement("span");
    newSpan.classList.add("_breadCrumbChild");   
    const newContent = document.createTextNode("Creando cuenta de retiro");
    newSpan.appendChild(newContent);
    titleSectionEl.current.append(newSpan)
  }
  
  return(
    <NewFiatWithdrawAccountComponent/>
  )

}
 

const FiatView = (props) => {
  
  const fiatWithdrawAccounts = useSelector((state) => selectFiatWithdrawAccounts(state));
  const [ createAccount, setCreateAccount ] = useState(false)
  // console.log('|||||||||||||||||||||  fiatWithdrawAccounts  ====> ', fiatWithdrawAccounts)
  
  if(createAccount){
    return(
      <CreateNewWithdrawAccount
            setCreateAccount={setCreateAccount}
      />
    )
  }

  return(
    <>
      {
        !fiatWithdrawAccounts ?
          <p>Cargando</p>
        : 
        isEmpty(fiatWithdrawAccounts) ?
          <EmptyStateWithdrawAccount
            setCreateAccount={setCreateAccount}
          />
        :
          <p className="fuente">Lista de cuentas de retiro</p>
      }
    </>
  )

};

export default FiatView;


export const EmptyStateWithdrawAccount = ({ setCreateAccount }) => {
 
  const atributos = {
    icon: "emptyState",
    size: 100,
    color: "var(--paragraph_color)",
    opacity:0.7
  }; 

  return(
    <EmptyStateContainer>
      <IconSwitch {...atributos} />
      <p className="fuente _emptyCopy">
        Para realizar retiros debes tener por lo menos una cuenta de retiro agregada 
      </p>
      <ControlButton
        // loader={loader}
        // id={idForMainButton}
        formValidate
        label="Agregar cuenta de retiro"
        handleAction={() => setCreateAccount(true)}
      />
    </EmptyStateContainer>
  )
}  

const EmptyStateContainer = styled.div`
  display:grid;
  justify-items: center;
  row-gap: 25px;

  #controlsContainer{
    transform: scale(.95);
  }

  ._emptyCopy{
    max-width:440px;
    text-align: center;
    line-height: 25px;
    color:var(--paragraph_color);
    margin:0 0 30px;
  }

`