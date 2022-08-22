import { useEffect, useCallback } from 'react'
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
import { useCoinsendaServices } from "services/useCoinsendaServices";
import useToastMessage from "hooks/useToastMessage";

import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineDelete } from 'react-icons/ai';
import { FcCancel } from 'react-icons/fc';
import styled from 'styled-components';
import { WiStars } from 'react-icons/wi';



export default function WithdrawAccountsComponent({ 
    stageManager:{ 
      stageData,
      setStageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children,
    withdrawProviders,
    ...props
}){
  
    const actions = useActions()
    const { isMovilViewport } = useViewport();
    const [ withdrawAccounts ] = useSelector((state) => selectWithdrawAccounts(state));
    const [coinsendaServices] = useCoinsendaServices();
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

    // console.log('WITHDRAW_ACCOUNT => ', state)

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
                const isAvalaibleSameProvider = withdrawProviders[withdrawAccount?.bank_name?.value]

                return <ItemListComponent 
                  key={index} 
                  className={`auxNumber __withdrawAccount ${withdrawAccount?.state} account_${withdrawAccount?.id}`}
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
                      />,
                      isAvalaibleSameProvider ? () => <IconStarContainerComponent/> : () => null
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

      </StageContainer>
    )
}

// AiFillStar
const IconStarContainerComponent = props => {
  return (
    <IconStarContainer>
        <TooltipContainer>
          <WiStars size={25} color="#ffc107" /> 
          <span className="tooltiptext fuente">Tárifa y velocidad preferencial</span>
        </TooltipContainer>
    </IconStarContainer>
  )
}

const IconStarContainer = styled.div`
  position:absolute;
  margin: auto;
  top: 11px;
  right: 12px;

  position: absolute;
  margin: auto;
  top: 8px;
    right: 10px;
`

const getIcon = state => {
  const size = 20
  return (
    ["pending", "in_progress"].includes(state) ? <AiOutlineClockCircle size={size} color="orange"/> :
    ["complete"].includes(state) ? <AiOutlineCheckCircle size={size} color="green"/> : <FcCancel size={size}></FcCancel>
  )
}


const StateComponent = ({ withdrawAccount, handleAction, isMovilViewport }) => {

  const uiLabel = ["pending", "in_progress"].includes(withdrawAccount?.state) ? "Inscribiendo..." : ["rejected"].includes(withdrawAccount?.state) ? "Cuenta Inhabilitada" : "Inscrita"

  return(
      <MetaContainer className={`uniqueRow __withdrawAccount`} >
        <HR height={30} />
        
        { getIcon(withdrawAccount?.state) }
        <p className={`fuente2 metaText ${withdrawAccount?.state}`}><span>{!isMovilViewport && uiLabel}</span></p>
        
        {/* <TooltipContainer>
          { getIcon(withdrawAccount?.state) }
          <span className="tooltiptext fuente">{uiLabel}</span>
        </TooltipContainer> */}

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