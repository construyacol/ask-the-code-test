import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { BiRightArrowAlt } from 'react-icons/bi';


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

    const { isMovilViewport } = useViewport();
    const [ withdrawAccounts ] = useSelector((state) => selectWithdrawAccounts(state));
    // const actions = useActions()

    const selectWithdrawAccount = (withdrawAccount) => {
      setState(prevState => {
        return { ...prevState, [stageData?.key]: withdrawAccount }
      })
      setStageStatus('success')
    }

    useEffect(() => {
      if(state[stageData?.key]){
        selectWithdrawAccount(state[stageData?.key])
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // console.log('WITHDRAW ACCOUNT => ', state.withdrawAccount)


    return(
      <StageContainer className="_identityComponent">
        {children} 
        <OptionInputContainer>
          <p className="fuente _pLabel _inputLabelP">¿En que cuenta quieres recibir tu dinero?  </p>
          <SelectListContainer>
            {
              withdrawAccounts && Object.keys(withdrawAccounts).map((key, index) => {

                const withdrawAccount = withdrawAccounts[key]
                const isSameAccountNumber = [withdrawAccount?.account_number?.value].includes(state[stageData?.key]?.account_number?.value)
                const isSameBankName = [withdrawAccount?.bank_name?.value].includes(state[stageData?.key]?.bank_name?.value)
                const isSelected = isSameBankName && isSameAccountNumber;

                return <ItemListComponent 
                  key={index} 
                  className={`auxNumber`}
                  itemList={withdrawAccount}
                  auxUiName={isSelected && withdrawAccount?.account_number?.value}
                  firstIndex={index === 0}
                  lastIndex={(Object.keys(withdrawAccounts)?.length - 1) === index}
                  isSelectedItem={isSelected}
                  isMovilViewport={isMovilViewport}
                  handleAction={selectWithdrawAccount}
                />
              })
            }
            <ItemListComponent 
                  className="createButton"
                  itemList={{
                    value:"createId",
                    icon:"add",
                    uiName:isMovilViewport ? "Crear cuenta" : "Agregar nueva cuenta de retiro"
                  }}
                  AuxComponent={[
                    () => <BiRightArrowAlt className="_birArrow" size={37} />
                  ]}
                  firstIndex={true}
                  handleAction={() => props.setCreateAccount(true)}
                />
          </SelectListContainer>
        </OptionInputContainer>
      </StageContainer>
    )
  }


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