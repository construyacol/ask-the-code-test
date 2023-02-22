import { useState, useEffect, useRef } from "react";
// import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";
import ControlButton from "../../../widgets/buttons/controlButton";
import IconSwitch from "../../../widgets/icons/iconSwitch";
import styled from 'styled-components'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
// import { isEmpty } from 'lodash'
// import { MdDoNotDisturbOnTotalSilence } from "react-icons/md";
import NewFiatWithdrawAccountComponent from '../../../forms/widgets/newWithdrawAccount/init'
import FiatWithdraw from '../../../forms/widgets/fiatWithdraw/init'
import { history } from '../../../../const/const'
import useViewport from '../../../../hooks/useWindowSize'
// import { StageOptionSkeleton } from '../../../forms/widgets/stageManager'
import { SelectListSkeleton } from 'components/forms/widgets/selectListComponent'
import { checkIfFiat } from 'core/config/currencies';
import { MENU_LABELS } from 'api/ui/menuItems' 

 
const CreateNewWithdrawAccount = ({ setCreateAccount }) => {

  const { isMovilViewport } = useViewport();
  // let targetEl = isMovilViewport ? "._stageIndicator" : ".accountDetailTitle h1>span"
  const titleSectionEl = useRef(document.querySelector(`.accountDetailTitle h1>span`))
  const withdrawButton = useRef(document.querySelector('#withdraw-menu-button'))
  // const mobileTitleRef = useRef()
  const uiName = "Creando cuenta de retiro"

  useEffect(() => {
    initConfig()
    withdrawButton?.current?.addEventListener("click", backToWithdraw);
    return () => unMountAction()
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []) 
 
  const unMountAction = () => {
    titleSectionEl.current.classList.remove("_breadCrumbParent");   
    document.querySelector("._breadCrumbChild")?.remove()
    titleSectionEl.current.onclick = () => null;
    withdrawButton?.current?.removeEventListener("click", backToWithdraw);
    history.push(`${history.location.pathname}`)
  } 

  const backToWithdraw = () => {
    titleSectionEl.current.innerHTML = MENU_LABELS?.withdraw;
    setCreateAccount(false)
    unMountAction() 
  }

  const initConfig = () => {
    if(isMovilViewport)return;
    titleSectionEl.current.classList.add("_breadCrumbParent");   
    titleSectionEl.current.innerHTML = `${MENU_LABELS?.withdraw}   >      `;
    titleSectionEl.current.onclick = backToWithdraw
    const newSpan = document.createElement("span");
    newSpan.classList.add("_breadCrumbChild");   
    const newContent = document.createTextNode(uiName);
    newSpan.appendChild(newContent);
    let targetEl = ".accountDetailTitle h1"
    document.querySelector(targetEl).append(newSpan)
  }

  return(
    <NewFiatWithdrawAccountComponent
      mainTitle="Creando cuenta de retiro"
      backToWithdraw={backToWithdraw}
    />
  )
}
 

 
const FiatView = () => {

  const fiatWithdrawAccounts = useSelector((state) => selectFiatWithdrawAccounts(state));
  const [ createAccount, setCreateAccount ] = useState(false)
  
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
          <SelectListSkeleton/>
        : 
        <FiatWithdraw
          setCreateAccount={setCreateAccount}
        />
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


const selectFiatWithdrawAccounts = createSelector(
  ({ modelData:{ withdraw_accounts } }) => withdraw_accounts,
  (withdraw_accounts) => {
    if(!withdraw_accounts)return;
    let fiatWithdrawAccounts = []
    Object.keys(withdraw_accounts).forEach(wAKey => {
      if(checkIfFiat(withdraw_accounts[wAKey]?.currency)){
        fiatWithdrawAccounts.push(withdraw_accounts[wAKey])
      }
    });
    return fiatWithdrawAccounts
  }
)




const EmptyStateContainer = styled.div`
  display:grid;
  justify-items: center;
  row-gap: 25px;

  ._iconSkeleton{
    height:55px;
    width:55px;
    background:var(--skeleton_color);
    border-radius:4px;
  }

  &.skeleton span{
    background:var(--skeleton_color);
    border-radius:4px;
    color:transparent;
  }



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