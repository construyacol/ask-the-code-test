import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { AiFillBank } from "react-icons/ai";

const DEFAULT_PROVIDER = {
  value:"bancolombia"
}

export default function DepositProviderComponent({ 
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
    const [ depositProviders ] = useSelector((state) => selectDepositProviders(state));
    // const actions = useActions()

    const selectProvider = (provider) => {
      setState(prevState => ({ ...prevState, [stageData?.key]: provider }))
      setStageStatus('success')
    }

    useEffect(() => {
      if(state[stageData?.key]) selectProvider(state[stageData?.key]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // console.log('DEPOSIT_PROVIDER => ', state)
    const otherBankIsSelected = ["other_bank"].includes(state[stageData?.key]?.value)


    return(
      <StageContainer className="_identityComponent">
        {children} 
        <OptionInputContainer>
          <p className="fuente _pLabel _inputLabelP">{stageData?.uiName}</p>
          <SelectListContainer>
            {
              depositProviders && Object.keys(depositProviders).map((key, index) => {
                const isSelected = [depositProviders[key]?.value].includes(state[stageData?.key]?.value)
                return <ItemListComponent 
                  key={index} 
                  // className={`auxNumber`}
                  itemList={depositProviders[key]}
                  // auxUiName={isSelected && withdrawAccount?.account_number?.value}
                  firstIndex={index === 0}
                  lastIndex={(Object.keys(depositProviders)?.length - 1) === index}
                  isSelectedItem={isSelected}
                  isMovilViewport={isMovilViewport}
                  handleAction={selectProvider}
                />
              })
            }
            <ItemListComponent 
              className="createButton"
              itemList={{
                value:"other_bank",
                icon:"bank",
                uiName:"Otro banco/servicio",
                Icon:AiFillBank,
                defaultProv:depositProviders[DEFAULT_PROVIDER?.value]
              }}
              // AuxComponent={[
              //   () => <BiRightArrowAlt className="_birArrow" size={37} />
              // ]}
              isSelectedItem={otherBankIsSelected}
              lastIndex={true}
              handleAction={selectProvider}
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




  const selectDepositProviders = createSelector(
    (state) => state.modelData.deposit_providers,
    (deposit_providers) => {
      if(!deposit_providers)return ; 
      
      let depositProviders = {}
      Object.keys(deposit_providers).forEach(depProvKey => {
        const depositProvider = deposit_providers[depProvKey];
        if(["fiat"].includes(depositProvider?.currency_type)){
          depositProviders = {
            ...depositProviders,
            [depositProvider?.provider?.name]:{
              ...depositProvider,
              uiName:depositProvider?.provider?.ui_name,
              value:depositProvider?.provider?.name
            }
          }
        }
      })

      return [ depositProviders ];
    }
  );