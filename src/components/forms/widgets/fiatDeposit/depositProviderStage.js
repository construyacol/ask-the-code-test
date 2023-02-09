import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { AiFillBank } from "react-icons/ai";
import { isEmpty } from 'lodash'
import { P } from 'components/widgets/typography';
import withCoinsendaServices from 'components/withCoinsendaServices'



function DepositProviderComponent({ 
    stageManager:{ 
      stageData,
      setStageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children,
    currentWallet,
    ...props
  }){  

    const { isMovilViewport } = useViewport();
    const [ depositAccounts ] = useSelector((state) => selectDepositProviders(state));
    // const actions = useActions()

    const selectProvider = (provider) => {
      setState(prevState => ({ ...prevState, [stageData?.key]: provider }))
      setStageStatus('success')
    }

    const createDepositProvider = async(wallet) => {
      await props.coinsendaServices.createAndInsertDepositProvider(wallet)
    }

    useEffect(() => {
      if(state[stageData?.key]) selectProvider(state[stageData?.key]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if(currentWallet && isEmpty(currentWallet?.dep_prov)){
        createDepositProvider(currentWallet)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWallet])

    console.log('DEPOSIT_PROVIDER => ', depositAccounts)


    return(
      <>
        {
          isEmpty(currentWallet?.dep_prov) ? 
            <P>Creando proveedor de depósito...</P>
          :
          <StageContainer className="_identityComponent">
            {children} 
            <OptionInputContainer>
              <p className="fuente _pLabel _inputLabelP">{stageData?.uiName}</p>
              <SelectListContainer>
                {
                  depositAccounts && Object.keys(depositAccounts).map((key, index) => {
                    const isSelected = [depositAccounts[key]?.value].includes(state[stageData?.key]?.value)
                    return <ItemListComponent 
                      key={index} 
                      // className={`auxNumber`}
                      itemList={depositAccounts[key]}
                      // auxUiName={isSelected && withdrawAccount?.account_number?.value}
                      firstIndex={index === 0}
                      lastIndex={(Object.keys(depositAccounts)?.length - 1) === index}
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
                    defaultProv:depositAccounts && depositAccounts[Object.keys(depositAccounts).at(0)]
                  }}
                  isSelectedItem={["other_bank"].includes(state[stageData?.key]?.value)}
                  lastIndex
                  handleAction={selectProvider}
                />
              </SelectListContainer>
            </OptionInputContainer>
          </StageContainer>
        }
      </>
    )
  }

  export default withCoinsendaServices(DepositProviderComponent)


  const selectDepositProviders = createSelector(
    (state) => state.modelData.depositAccounts,
    (depositAccounts) => {
      if(!depositAccounts)return [undefined]; 
      let _depositAccounts = {}
      Object.keys(depositAccounts).forEach(depAccountKey => {
        const depositAccount = depositAccounts[depAccountKey];
        if(["fiat"].includes(depositAccount?.currency_type)){
          _depositAccounts = {
            ..._depositAccounts,
            [depositAccount?.name]:{
              ...depositAccount,
              uiName:depositAccount?.ui_name,
              value:depositAccount?.name
            }
          }
        }
      })

      return [ _depositAccounts ];
    }
  );