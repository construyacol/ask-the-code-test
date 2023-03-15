import { useCallback } from 'react'
import { SelectListContainer, ItemListComponent } from '../../selectListComponent'
import { MetaContainer, TooltipContainer } from '../../sharedStyles'
import { BiRightArrowAlt } from 'react-icons/bi';
import { HR } from 'components/widgets/headerAccount/styles'
import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineDelete } from 'react-icons/ai';
import { FcCancel } from 'react-icons/fc';
import styled from 'styled-components';
import { WiStars } from 'react-icons/wi';
import { WithdrawServiceList, 
  // INTERNAL_NETWORK, 
  WITHDRAW_ACCOUNT_LIST
} from './emptyStateAccountList'



const WithdtrawAccountList = ({
    withdrawAccounts,
    withdrawProviders,
    isMobile,
    actions,
    toastMessage,
    coinsendaServices,
    selectWithdrawAccount,
    ...props
  }) => {

    const { stageManager:{ setStageStatus, stageData }, handleState:{ state } } = props 
    const deleteAccount = useCallback(async(wAccountId) => {
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
  
      return(
        <> 
          <WithdrawServiceList
            withdrawServiceList={WITHDRAW_ACCOUNT_LIST}
            handleAction={selectWithdrawAccount}
            // uiName="Envía de forma instantanea y gratuita"
            {...props}
          />
          <p className="fuente _pLabel _inputLabelP">Envía DCOP a una cuenta bancaria personal</p>
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
                  isMovilViewport={isMobile}
                  handleAction={selectWithdrawAccount}
                  AuxComponent={[
                    () => 
                      <StateComponent 
                        withdrawAccount={withdrawAccount}
                        isMobile={isMobile}
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
              handleAction={() => props.setView("newBankAccount")}
              itemList={{
                value:"createId",
                icon:"add",
                uiName:"Otra cuenta bancaria"
              }}
              AuxComponent={[
                () => <BiRightArrowAlt className="_birArrow" size={37} />
              ]}
            />
          </SelectListContainer>
        </>
      )
  }
  

  export default WithdtrawAccountList



  const StateComponent = ({ withdrawAccount, handleAction, isMobile }) => {

    const uiLabel = ["pending", "in_progress"].includes(withdrawAccount?.state) ? "Inscribiendo..." : ["rejected"].includes(withdrawAccount?.state) ? "Cuenta Inhabilitada" : "Inscrita"
  
    return(
        <MetaContainer className={`uniqueRow __withdrawAccount`} >
          <HR height={30} />
          
          { getIcon(withdrawAccount?.state) }
          <p className={`fuente2 metaText ${withdrawAccount?.state}`}><span>{!isMobile && uiLabel}</span></p>
  
          <TooltipContainer className="deleteButton__" onClick={() => handleAction(withdrawAccount?.id)}>
            <AiOutlineDelete className="_deleteAccount" color="var(--title2)" size={20}/>
            <span className="tooltiptext fuente">Eliminar</span>
          </TooltipContainer>
        </MetaContainer>
    )
  }



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
  