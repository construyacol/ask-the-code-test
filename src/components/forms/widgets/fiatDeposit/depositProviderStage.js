import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { AiFillBank } from "react-icons/ai";
import { isEmpty } from 'lodash'
import { P } from 'core/components/atoms';
import withCoinsendaServices from 'components/withCoinsendaServices'
import { serveModelsByCustomProps } from 'selectors'
import styled from 'styled-components'
import { checkIfFiat } from 'core/config/currencies';

const TagCont = styled.div`
  padding: 5px 10px;
  background-color: red;
  width: fit-content;
  height: fit-content;
  border-radius: 3px;
  align-self: center;
  justify-self: end;
  p{
    margin: 0;
    color: white !important;
  }
`

const TagNewComponent = () => {
  return(
    <TagCont>
      <P className="bold" color="white" size={12}>Nuevo</P>
    </TagCont>
  )
}

function ProviderComponent({ 
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
    const [ depositAccounts ] = useSelector((state) => selectDepositAccounts(state));
    const depositProvidersByName = useSelector(({ modelData:{ deposit_providers } }) => serveModelsByCustomProps(deposit_providers, 'provider.name'));
    // const actions = useActions() 

    const selectProvider = (provider) => {
      console.log({[stageData?.key]: provider })
      setState(prevState => ({ ...prevState, [stageData?.key]: provider }))
      setStageStatus('success')
    }

    useEffect(() => {
      if(state[stageData?.key]) selectProvider(state[stageData?.key]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    

    useEffect(() => {
      (async() => {
        if(isEmpty(depositAccounts) || isEmpty(depositProvidersByName))return;
        for (const depositAccountName in depositAccounts) {
          if(!depositProvidersByName[depositAccountName]){
            await props.coinsendaServices.createAndInsertDepositProvider(currentWallet, depositAccounts[depositAccountName]?.id)
          }
        }
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositAccounts, depositProvidersByName])

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
                    if(!depositAccounts[key]?.visible) return null;
                    return <ItemListComponent 
                      key={index} 
                      className={`${depositAccounts[key]?.value}`}
                      itemList={depositAccounts[key]}
                      firstIndex={index === 0}
                      lastIndex={(Object.keys(depositAccounts)?.length - 1) === index}
                      isSelectedItem={isSelected}
                      isMovilViewport={isMovilViewport}
                      handleAction={selectProvider}
                      AuxComponent={[ depositAccounts[key]?.provider_type === 'pse' ? () => <TagNewComponent/> : () => null]}
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

  export default withCoinsendaServices(ProviderComponent)

  const selectDepositAccounts = createSelector(
    (state) => state.modelData.depositAccounts,
    (depositAccounts) => {
      if(!depositAccounts)return [undefined]; 
      let _depositAccounts = {}
      Object.keys(depositAccounts).forEach(depAccountKey => {

        const depositAccount = depositAccounts[depAccountKey];

          if(checkIfFiat(depositAccount?.currency)){
            let keyProp = depositAccount?.name?.replace(" ", "_")?.toLowerCase()
          _depositAccounts = {
            ..._depositAccounts,
            [keyProp]:{
              ...depositAccount,
              uiName:depositAccount?.ui_name,
              value:keyProp
            }
          }
        }
      })
      return [ _depositAccounts ];
    }
  );