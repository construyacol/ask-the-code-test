import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { AiFillBank } from "react-icons/ai";


export default function DepositProviderComponent({ 
    stageManager:{ 
      stageData,
      setStageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children,
    // ...props
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
                defaultProv:depositProviders[Object.keys(depositProviders).at(0)]
              }}
              isSelectedItem={["other_bank"].includes(state[stageData?.key]?.value)}
              lastIndex
              handleAction={selectProvider}
            />
          </SelectListContainer>
        </OptionInputContainer>
      </StageContainer>
    )
  }


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