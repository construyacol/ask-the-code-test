import { useState, useEffect, useRef } from "react";
// import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";
import ControlButton from "../../../widgets/buttons/controlButton";
import IconSwitch from "../../../widgets/icons/iconSwitch";
import styled from 'styled-components'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { isEmpty } from 'lodash'
// import { MdDoNotDisturbOnTotalSilence } from "react-icons/md";
import NewFiatWithdrawAccountComponent from '../../../forms/widgets/newWithdrawAccount/init'
import FiatWithdraw from '../../../forms/widgets/fiatWithdraw/init'
import { history } from '../../../../const/const'
import useViewport from '../../../../hooks/useWindowSize'
// import { StageOptionSkeleton } from '../../../forms/widgets/stageManager'
import { SelectListSkeleton } from '../../../forms/widgets/selectListComponent'


 
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
    titleSectionEl.current.innerHTML = "Retirar";
    setCreateAccount(false)
    unMountAction() 
  }

  const initConfig = () => {
    if(isMovilViewport)return;
    titleSectionEl.current.classList.add("_breadCrumbParent");   
    titleSectionEl.current.innerHTML = "Retirar   >      ";
    titleSectionEl.current.onclick = backToWithdraw
    const newSpan = document.createElement("span");
    newSpan.classList.add("_breadCrumbChild");   
    const newContent = document.createTextNode(uiName);
    newSpan.appendChild(newContent);
    let targetEl = ".accountDetailTitle h1"
    document.querySelector(targetEl).append(newSpan)
  }

  // useEffect(() => {
  //   console.log('mobileTitleRef', mobileTitleRef.current)
  //   if(mobileTitleRef?.current && isMovilViewport){
  //     mobileTitleRef.current.innerHTML = uiName;
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mobileTitleRef?.current])

  return(
    <NewFiatWithdrawAccountComponent
      mainTitle="Creando cuenta de retiro"
      backToWithdraw={backToWithdraw}
    />
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

  // return <SelectListSkeleton/>
   

  return(
    <>
      {
        !fiatWithdrawAccounts ?
          <SelectListSkeleton/>
        : 
        isEmpty(fiatWithdrawAccounts) ?
          <EmptyStateWithdrawAccount
            setCreateAccount={setCreateAccount}
          />
        :
        <FiatWithdraw
          setCreateAccount={setCreateAccount}
        />
      }
    </>
  )

};

export default FiatView;


// <p className="fuente">Lista de cuentas de retiro</p>
// <ControlButton
//   // loader={loader}
//   // id={idForMainButton}
//   formValidate
//   label="Agregar cuenta de retiro"
//   handleAction={() => setCreateAccount(true)}
// />

// const EmptyStateSkeleton = props => {
//   return(
//     <EmptyStateContainer className="skeleton">
//       <div className="_iconSkeleton"></div>
//       <p className="fuente _emptyCopy"><span>Para realizar retiros debes tener por</span> <br/> <span>lo menos una cuenta de retiro agregada</span> </p>
//       <ControlButton/>
//     </EmptyStateContainer>
//   )
// }



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
      if(withdraw_accounts[wAKey]?.currency_type.includes("fiat")){
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