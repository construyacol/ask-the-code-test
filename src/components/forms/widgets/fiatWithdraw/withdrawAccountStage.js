import { useEffect, useState, useCallback } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { BiRightArrowAlt } from 'react-icons/bi';
// import styled from 'styled-components'
import { MetaContainer, TooltipContainer } from '../sharedStyles'
import { HR } from '../../../widgets/headerAccount/styles'
// import { MetaDataContainer } from '../sharedStyles'
import { useActions } from 'hooks/useActions'
import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineDelete } from 'react-icons/ai';
import { useCoinsendaServices } from "services/useCoinsendaServices";
import useToastMessage from "hooks/useToastMessage";



export default function WithdrawAccountsComponent({ 
    stageManager:{ 
      stageData,
      setStageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children,
    ...props
}){  

    const actions = useActions()
    const { isMovilViewport } = useViewport();
    const [ withdrawAccounts ] = useSelector((state) => selectWithdrawAccounts(state));
    const [coinsendaServices] = useCoinsendaServices();
    // const [ accountState, setAccountState ] = useState()
    const [toastMessage] = useToastMessage();

    const selectWithdrawAccount = (withdrawAccount) => {
      setState(prevState => { return { ...prevState, [stageData?.key]: withdrawAccount } })
      setStageStatus('success')
    }
 
    const deleteAccount = useCallback((wAccountId) => {
      const el = document.querySelector(`.account_${wAccountId}`)
      actions.confirmationModalToggle();
      actions.confirmationModalPayload({
        title: "Esto es importante, vas a...",
        description: "Eliminar esta cuenta de retiro...",
        txtPrimary: "Continuar",
        txtSecondary: "Cancelar",
        payload: "id",
        action: (async() => { 
          el?.classList?.add("deleting")
          setStageStatus(null)
          const { error } = await coinsendaServices.deleteAccount(wAccountId);
          if(error){
            el?.classList?.remove("deleting")
            return toastMessage(error?.message, "error");
          }
          el?.classList?.add("deleted")
          await coinsendaServices.fetchWithdrawAccounts();
        }),
        img: "deleteticket",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if(state[stageData?.key]){
        selectWithdrawAccount(state[stageData?.key])
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log('WITHDRAW_ACCOUNT => ', state)

    return(
      <StageContainer className="_identityComponent">
        {children} 
        <OptionInputContainer>
          <p className="fuente _pLabel _inputLabelP">¿En que cuenta quieres recibir tu dinero?</p>
          <SelectListContainer>
            {
              withdrawAccounts && Object.keys(withdrawAccounts).map((key, index) => {

                const withdrawAccount = withdrawAccounts[key]
                const isSameAccountNumber = [withdrawAccount?.account_number?.value].includes(state[stageData?.key]?.account_number?.value)
                const isSameBankName = [withdrawAccount?.bank_name?.value].includes(state[stageData?.key]?.bank_name?.value)
                const isSelected = isSameBankName && isSameAccountNumber;

                return <ItemListComponent 
                  key={index} 
                  className={`auxNumber account_${withdrawAccount?.id}`}
                  itemList={withdrawAccount}
                  auxUiName={isSelected && withdrawAccount?.account_number?.value}
                  firstIndex={index === 0}
                  lastIndex={(Object.keys(withdrawAccounts)?.length - 1) === index}
                  isSelectedItem={isSelected}
                  isMovilViewport={isMovilViewport}
                  handleAction={selectWithdrawAccount}
                  AuxComponent={[
                    () => 
                      <StateComponent 
                        withdrawAccount={withdrawAccount}
                        isMovilViewport={isMovilViewport}
                        handleAction={deleteAccount}                        
                      /> 
                  ]}
                />
              })
            }
            <ItemListComponent 
                  className="createButton"
                  lastIndex
                  handleAction={() => props.setCreateAccount(true)}
                  itemList={{
                    value:"createId",
                    icon:"add",
                    uiName:isMovilViewport ? "Otra cuenta de retiro" : "Otra cuenta de retiro"
                  }}
                  AuxComponent={[
                    () => <BiRightArrowAlt className="_birArrow" size={37} />
                  ]}
                />
          </SelectListContainer>
        </OptionInputContainer>

        {/* {
          ["pending", "in_progress"].includes(state?.withdrawAccount?.state) &&
          <MetaDataContainer>
            {isMovilViewport && <p className="fuente">Inscribiendo cuenta...</p>}
            <p className="fuente">Recuerda que los retiros a cuentas de retiro en proceso de inscripción pueden tardar de 1 a 72 horas hábiles en ser procesados.</p>
          </MetaDataContainer>
        } */}

      </StageContainer>
    )
}


const getIcon = state => {
  return (
    ["pending", "in_progress"].includes(state) ? <AiOutlineClockCircle color="orange"/> :
    ["complete"].includes(state) ? <AiOutlineCheckCircle color="green"/> : <></>
  )
}


const StateComponent = ({ withdrawAccount, handleAction, isMovilViewport }) => {

  const uiLabel = ["pending", "in_progress"].includes(withdrawAccount?.state) ? "Inscribiendo..." : ["rejected"].includes(withdrawAccount?.state) ? "Cuenta eliminada" : "Inscrita"
  return(
      <MetaContainer className={`uniqueRow __withdrawAccount`} >
        <HR height={30} />
        { getIcon(withdrawAccount?.state) }
        <p className={`fuente2 metaText ${withdrawAccount?.state}`}><span>{!isMovilViewport && uiLabel}</span></p>
        <TooltipContainer className="deleteButton__" onClick={() => handleAction(withdrawAccount?.id)}>
          <AiOutlineDelete className="_deleteAccount" color="var(--title2)" size={20}/>
          <span className="tooltiptext fuente">Eliminar</span>
        </TooltipContainer>
      </MetaContainer>
  )
}


// <i
//           style={{ color: color }}
//           className="copy far fa-clone tooltip"
//           data-copy={valor}
//           id={valor}
//         > 
//           <span className="tooltiptext fuente">Copiar</span>
//         </i>



// auxUiName

// const IdNumberPanel = ({ item }) => {
//     return( 
//       <PanelContainer>
//         <HR/>
//         <p className="fuente2">{item?.document_info?.id_number}</p>
//         <p className="fuente2">{item?.enabled ? 'Número' : 'Verificando...'}</p>
//       </PanelContainer>
//     )
// }




// const PanelContainer = styled.div`
//   width:auto;
//   display: grid;
//   align-items: center;
//   grid-template-columns: auto 1fr;
//   column-gap: 15px;
//   grid-template-rows: auto auto;
//   align-self: center;
//   row-gap: 3px;

//   ${HR}{
//     grid-column-start: 1;
//     grid-row-start: 1;
//     grid-row-end: 3;
//   }

//   p{
//     margin:0;
//     color:var(--paragraph_color);
//     font-size:18px;
//   }

//   p:nth-child(3) {
//     font-size:13px;
//     font-family: "Raleway",sans-serif;
//     color: var(--placeholder);
//   }
// `




  const selectWithdrawAccounts = createSelector(
    (state) => state.modelData.withdraw_accounts,
    (withdraw_accounts) => {
      if(!withdraw_accounts)return ; 
      let fiatWithdrawAccounts = {}
      Object.keys(withdraw_accounts).forEach(wAccountKey => {
        const withdrawAccount = withdraw_accounts[wAccountKey];
        if(["fiat"].includes(withdrawAccount?.currency_type)){
          fiatWithdrawAccounts = {
            ...fiatWithdrawAccounts,
            [wAccountKey]:{
              ...withdrawAccount,
              uiName:withdrawAccount?.bank_name?.ui_name,
              value:withdrawAccount?.bank_name?.value
            }
          }
        }
      })
      return [ fiatWithdrawAccounts ];
    }
  );