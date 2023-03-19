import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { AiFillBank } from "react-icons/ai";
import { isEmpty } from 'lodash'
import withCoinsendaServices from 'components/withCoinsendaServices'
import { serveModelsByCustomProps } from 'selectors'
import { checkIfFiat } from 'core/config/currencies';
import { TagNewComponent } from 'core/components/molecules'
import styled from 'styled-components'
import { P, SPAN } from 'core/components/atoms';
import { FIAT_DEPOSIT_TYPES } from './api'

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
    const [ depositServiceList, setDepositServiceList ] = useState({})
  
    const selectProvider = (provider) => {
      // console.log({[stageData?.key]: provider })
      setState(prevState => ({ ...prevState, [stageData?.key]: provider }))
      setStageStatus('success')
    }

    useEffect(() => {
      if(state[stageData?.key]) selectProvider(state[stageData?.key]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const DEFAULT_SERVICE = {
      other_bank:{
        value:"other_bank",
        icon:"bank",
        uiName:"Otro banco",
        Icon:AiFillBank,
        defaultProv:depositAccounts && depositAccounts[Object.keys(depositAccounts).at(0)],
        visible:true
      }
    }

    
    useEffect(() => {
      (async() => {
        if(isEmpty(depositAccounts) || isEmpty(depositProvidersByName))return;
        let servicesList = {...DEFAULT_SERVICE}
        for (const depositAccountName in depositAccounts) {
          // if(!depositProvidersByName[depositAccountName]) await props.coinsendaServices.createAndInsertDepositProvider(currentWallet, depositAccounts[depositAccountName]?.id)
          let complementaryModel = DEPOSIT_ACCOUNT_LABELS[depositAccounts[depositAccountName]?.provider_type] || {}
          // if(isEmpty(complementaryModel))continue;
          if(depositAccounts[depositAccountName]?.currency_type === 'crypto')continue;
          servicesList = {
            ...servicesList,
            [depositAccounts[depositAccountName]?.provider_type]:{
              ...depositAccounts[depositAccountName],
              ...complementaryModel
            }
          }
        }
        setDepositServiceList(getServiceListOrdered(servicesList))
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositAccounts, depositProvidersByName])

    // console.log('depositServiceList', depositServiceList)
    // console.log('depositAccounts', depositAccounts)
    



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
                  depositServiceList && Object.keys(depositServiceList).map((key, index) => {
                    const isSelected = [depositServiceList[key]?.value].includes(state[stageData?.key]?.value)
                    if(!depositServiceList[key]?.visible) return null;
                    const AuxComponent = depositServiceList[key]?.AuxComponent

                    return <ItemListComponent 
                      key={index} 
                      className={`${depositServiceList[key]?.value}`}
                      itemList={depositServiceList[key]}
                      firstIndex={index === 0}
                      lastIndex={(Object.keys(depositServiceList)?.length - 1) === index}
                      isSelectedItem={isSelected}
                      isMovilViewport={isMovilViewport}
                      handleAction={selectProvider}
                      AuxComponent={[AuxComponent]}
                    />
                  })
                }

                {/* <ItemListComponent 
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
                /> */}
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


  const Sub = styled(SPAN)`
  opacity: .5;
  font-size: 14px;
  font-weight: 200;
`

  const CRYPTO_ACCOUNT_LABEL ={ 
    uiName:() => <P>Billetera DCOP <Sub className={"number"}> (ERC20)</Sub></P>,
    AuxComponent:TagNewComponent,
    icon:'eth',
    value:FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO
  }


  const PSE_ACCOUNT ={ 
    uiName:"PSE",
    AuxComponent:TagNewComponent,
    // icon:'eth'
  }



  const DEPOSIT_ACCOUNT_LABELS = {
    pse:PSE_ACCOUNT,
    // ethereum_testnet:CRYPTO_ACCOUNT_LABEL,
    // ethereum:CRYPTO_ACCOUNT_LABEL,
  }


  const getServiceListOrdered = (serviceList) => {
    const order = ['bank', 'other_bank', 'pse', 'ethereum'];
    let newObjects = {};
    for (const prop of order) {
      if (serviceList.hasOwnProperty(prop)) {
        newObjects[prop] = serviceList[prop];
      }
    }
    newObjects = {
      ...newObjects,
      ...serviceList
    }
    return newObjects
  }