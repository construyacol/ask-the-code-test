import { useEffect, useState } from 'react'
import validations from '../validations'
import { StageContainer } from '../../sharedStyles'
import InputComponent from '../../kyc/InputComponent'
import SelectListComponent from '../../selectListComponent'
import useViewport from 'hooks/useWindowSize'
import withCoinsendaServices from 'components/withCoinsendaServices'
import { FIAT_WITHDRAW_TYPES } from '../api'


const TargetPersonStage = ({ 
    stageManager, 
    children,
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    coinsendaServices,
    withdrawAccounts,
    ...props
  }) => {
    
    const { isMovilViewport } = useViewport();
    const [ selectList, 
      // setSelectList 
    ] = useState({})
    const providerType = state[FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT]?.value
    const {
      stageData,
      setStageStatus,
      stageStatus,
      // setStageData
    } = stageManager
  
    const onChange = (e) => { 
      e.target.preventDefault && e.target.preventDefault();
      if(!validations[stageData.key]) return; 
      const [ _value, _status ] = validations[stageData.key](e?.target?.value, {
        ...stageData, 
        state, 
        dataForm, 
        // selectList
      });
      e.target.value = _value
      setState(prevState => {
        return { ...prevState, [stageData?.key]: _value }
      })
      setStageStatus(_status)
    }
    
    // load state  by default
    useEffect(() => {
      let inputElement = document.querySelector(`[name="${stageData?.key}"]`)
      if(inputElement && state[stageData.key]){
        onChange({target:{value:state[stageData.key]}});
        inputElement.value = state[stageData.key]
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state[stageData?.key]])
    
    // verify if user is registered on coinsenda
    useEffect(() => {
      if(stageStatus === "success")(async () => {
        // coinsendaServices.resolveIdentifier(state[stageData?.key])
        // let wAccountId = await Object.keys(withdrawAccounts).find(wAccountId => withdrawAccounts[wAccountId]?.provider_type === providerType)
        // if(!wAccountId) return;
        // const { data, error } = await createWithdrawAccount()
        // if(error)return alert('la cuenta de retiro no pudo ser creada')
        // let wAccountId = data
        // console.log('wAccountId', wAccountId)
        // const withdrawAccount = withdrawAccounts[wAccountId]
        // const stageKey = FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT
        // setState(prevState => {
        //   return { ...prevState, [stageKey]: {
        //       ...withdrawAccount,
        //       ...prevState[stageKey],
        //     } 
        //   }
        // })
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stageStatus])

    useEffect(() => {
      (async() => {
        if(stageStatus === "success"){
          let wAccountId = await Object.keys(withdrawAccounts).find(wAccountId => withdrawAccounts[wAccountId]?.provider_type === providerType)
          console.log('wAccountId', wAccountId)
          if(!wAccountId) return await createWithdrawAccount();
          const withdrawAccount = withdrawAccounts[wAccountId]
          const stageKey = FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT
          setState(prevState => {
            return { ...prevState, [stageKey]: {
                ...withdrawAccount,
                ...prevState[stageKey],
              } 
            }
          })
        }
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawAccounts, stageStatus])

    // construyacol+currency_type@gmail.com
    // console.log('withdrawAccountsState', state)


    // // create select list withdraw accounts
    // useEffect(() => {
    //   let _selectList = {}
    //   for (const keyId in withdrawAccounts) {
    //     if(withdrawAccounts[keyId]?.provider_type === providerType){
    //       _selectList = {
    //         ..._selectList,
    //         [keyId]:withdrawAccounts[keyId]
    //       }
    //     }
    //   }
    //   // setSelectList(_selectList)
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [withdrawAccounts])

    const createWithdrawAccount = async() => {
      const provider = props?.fiatWithdrawProviders[providerType]
        const body = {
          data:{
            country:props?.currentWallet?.country,
            currency: props?.currentWallet?.currency,
            provider_type: providerType,
            internal:provider?.internal,
            info_needed:{
              identifier:state[stageData?.key],
              type:"email",
            }
          }
        }
        let res = await coinsendaServices.createWithdrawAccount(body);
        await coinsendaServices.fetchWithdrawAccounts();
        return res
    }

    return(
      <StageContainer className="_bankNameList">
        {children}
        <InputComponent 
          className="_stickyPosition"
          onChange={onChange} 
          inputStatus={stageStatus}
          name={stageData?.key} 
          label={stageData?.uiName}
          placeholder={stageData?.settings?.placeholder}
          type={stageData?.uiType}
        />
        {/* {
          stageStatus === "success" &&
          <p onClick={createWithdrawAccount}>Guardar</p>
        } */}
        <SelectListComponent
          stageData={stageData}
          state={state}
          selectList={selectList}
          isMovilViewport={isMovilViewport}
          onChange={onChange}
        /> 
        {/* {
          state[stageData?.key] &&
            <Disclaimer className="fullDisclaimer pending warning">
              <h3 className='fuente'>¡Atención!</h3>
              <p className='fuente disclaimer--message_p disclaimer__open'>La cuenta de retiro debe estar vinculada a tu identidad, los retiros procesados hacia cuentas de terceros no podrán ser acréditados a la cuenta de destino.</p>
            </Disclaimer>
        } */}
      </StageContainer>
    )
  } 

export default withCoinsendaServices(TargetPersonStage)