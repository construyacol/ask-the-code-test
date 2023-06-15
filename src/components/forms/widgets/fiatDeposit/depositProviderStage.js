import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent, SelectListSkeleton } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { AiFillBank } from "react-icons/ai";
import { isEmpty } from 'lodash'
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
    const [ depositServiceList, setDepositServiceList ] = useState({})
    const [ showPaymentRequest, setShowPaymentRequest ] = useState(false)
  
    const selectProvider = (provider) => {
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
        if(isEmpty(depositAccounts))return;
        let servicesList = {...DEFAULT_SERVICE} 
        for (const depositAccountName in depositAccounts) {
          if(["pse"].includes(depositAccountName) && ["savings"].includes(currentWallet?.type))continue;
          let complementaryModel = DEPOSIT_ACCOUNT_LABELS[depositAccounts[depositAccountName]?.provider_type] || {}
          // if(depositAccounts[depositAccountName]?.currency_type === 'crypto')continue;
          servicesList = {
            ...servicesList,
            [depositAccounts[depositAccountName]?.provider_type]:{
              ...depositAccounts[depositAccountName],
              ...complementaryModel
            }
          }
        } 
        setDepositServiceList(getServiceListOrdered(servicesList))
        if(servicesList?.internal_network) setShowPaymentRequest(true);
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositAccounts])


    return(
      <>
        {
          isEmpty(currentWallet?.dep_prov) ? 
            <P>Creando proveedor de depósito...</P>
          :
          isEmpty(depositServiceList) ?
            <SelectListSkeleton />
          :
          <StageContainer className="_identityComponent">
            {children} 
            {
              showPaymentRequest &&
                <OptionInputContainer>
                  <P className="fuente _pLabel _inputLabelP">Genera un enlace de pago o código QR para recibir pagos instantáneos y grátuitos</P>
                  <SelectListContainer>
                    {
                      Object.keys(depositServiceList).map((key, index) => {
                        const isSelected = [depositServiceList[key]?.value].includes(state[stageData?.key]?.value)
                        if(!depositServiceList[key]?.visible) return null;
                        if(depositServiceList[key]?.provider_type !== 'internal_network') return null;
                        const AuxComponent = depositServiceList[key]?.AuxComponent
                        return <ItemListComponent 
                          key={index} 
                          className={`${depositServiceList[key]?.value}`}
                          itemList={depositServiceList[key]}
                          firstIndex={index === 0}
                          // lastIndex={(Object.keys(depositServiceList)?.length - 1) === index}
                          isSelectedItem={isSelected}
                          isMovilViewport={isMovilViewport}
                          handleAction={selectProvider}
                          AuxComponent={[AuxComponent]}
                        />
                      })
                    }
                  </SelectListContainer>
                </OptionInputContainer>
            }
            <OptionInputContainer>
              <p className="fuente _pLabel _inputLabelP">{stageData?.uiName}</p>
              <SelectListContainer>
                {
                   Object.keys(depositServiceList).map((key, index) => {
                    const isSelected = [depositServiceList[key]?.value].includes(state[stageData?.key]?.value)
                    if(!depositServiceList[key]?.visible) return null;
                    if(depositServiceList[key]?.provider_type === 'internal_network') return null;
                    const AuxComponent = depositServiceList[key]?.AuxComponent

                    return <ItemListComponent 
                      key={index} 
                      className={`${depositServiceList[key]?.value}`}
                      itemList={depositServiceList[key]}
                      firstIndex={index === 0}
                      // lastIndex={(Object.keys(depositServiceList)?.length - 1) === index}
                      isSelectedItem={isSelected}
                      isMovilViewport={isMovilViewport}
                      handleAction={selectProvider}
                      AuxComponent={[AuxComponent]}
                    />
                  })
                }
              </SelectListContainer>
            </OptionInputContainer>
          </StageContainer>
        }
      </>
    )
  }

  export default ProviderComponent

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
    uiName:() => <P>Billetera DCOP <Sub className={"number"}></Sub></P>,
    AuxComponent:TagNewComponent,
    icon:'bsc',
    value:FIAT_DEPOSIT_TYPES?.STAGES?.CRYPTO
  }

  const PSE_ACCOUNT ={ 
    uiName:"PSE",
    AuxComponent:TagNewComponent,
  } 

  const PAYMENT_REQUEST ={ 
    uiName:() => <P>QR de pago</P>,
    icon:'qr',
    AuxComponent:TagNewComponent,
  }

  const DEPOSIT_ACCOUNT_LABELS = {
    pse:PSE_ACCOUNT,
    ethereum_testnet:CRYPTO_ACCOUNT_LABEL,
    ethereum:CRYPTO_ACCOUNT_LABEL,
    bsc:CRYPTO_ACCOUNT_LABEL,
    internal_network:PAYMENT_REQUEST
  }

  const getServiceListOrdered = (serviceList) => {
    const order = ['bank', 'other_bank', 'pse'];
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