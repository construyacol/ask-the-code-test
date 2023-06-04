import { useEffect, useState, useRef } from 'react'
import validations from '../validations'
import { StageContainer } from '../../sharedStyles'
import InputComponent from '../../kyc/InputComponent'
import SelectListComponent from '../../selectListComponent'
import { AuxContainer } from './styles' 
// import useViewport from 'hooks/useWindowSize'
import { FIAT_WITHDRAW_TYPES, DEFAULT_IDENTIFIER_TYPE } from '../api'
import { ItemListComponent, SelectListContainer } from 'components/forms/widgets/selectListComponent'
import Buttom from 'components/widgets/buttons/button'
import { IoPersonAddOutline } from 'react-icons/io5';
import useViewport from 'hooks/useViewport'
import { QrReader } from 'core/components/molecules'

// import { useLocation } from 'react-router-dom';

const TargetPersonStage = ({ 
    stageManager, 
    children,
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    coinsendaServices,
    withdrawAccounts,
    providerType,
    withdrawProvider,
    currentWallet,
    ...props
  }) => {
    
    const { isMobile } = useViewport();
    const [ selectList, setSelectList ] = useState({})
    const [ idType ] = useState(DEFAULT_IDENTIFIER_TYPE)
    const [ newAccount, setNewAccount ] = useState(false)
    const inputEl = useRef()
    // let location = useLocation();

    const {
      stageData,
      setStageStatus,
      stageStatus,
      // setStageData
    } = stageManager
  
    const onChange = (e) => { 
      e?.target?.preventDefault && e?.target?.preventDefault();
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

    const createWithdrawAccountMock = () => ({
      icon:idType,
      id_type:idType,
      identifier:state[stageData?.key],
      uiName:state[stageData?.key],
      auxUiName:state[stageData?.key],
    })

    
    // verify if user is registered on withdraw accounts
    useEffect(() => {
      (async() => {
        if(stageStatus === "success"){
          let wAccountId = await Object.keys(selectList).find(wAccountId => selectList[wAccountId]?.info?.identifier === state[stageData?.key])
          let withdrawAccount = {}
          const prevStageKey = FIAT_WITHDRAW_TYPES?.STAGES?.WITHDRAW_ACCOUNT
          setNewAccount(false)
          if(!selectList[wAccountId]){
            setNewAccount(true)
            withdrawAccount = createWithdrawAccountMock()
          }else{
            withdrawAccount = selectList[wAccountId]
          }
          setState(prevState => {
            return { 
              ...prevState, 
              [prevStageKey]:{
                ...withdrawAccount,
                value:prevState[prevStageKey]?.value
              } 
            }
          })
        }else{
          setNewAccount(false)
        }
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectList, stageStatus, inputEl?.current?.value])
 

    // se crea la lista de cuentas internas guardadas por el usuario (contiene custom label)
    useEffect(() => {
      let _selectList = {}
      for (const keyId in withdrawAccounts) {
        if(withdrawAccounts[keyId]?.provider_type === providerType && withdrawAccounts[keyId]?.info?.type === idType && (withdrawAccounts[keyId]?.info?.label !== withdrawAccounts[keyId]?.info?.identifier)){
          _selectList = {
            ..._selectList,
            [withdrawAccounts[keyId]?.info?.identifier?.toLowerCase()]:{
              ...withdrawAccounts[keyId],
              value:withdrawAccounts[keyId]?.info?.identifier,
              // icon:idType,
              icon:"person",
              uiName:withdrawAccounts[keyId]?.info?.label,
              auxUiName:withdrawAccounts[keyId]?.info?.identifier
            }
          }
        }
      }
      setSelectList(_selectList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawAccounts])

    const qrResponse = (data) => {
      onChange({target:{value:data?.recipient || data}});
      setState(prevState => {
        return { ...prevState, [FIAT_WITHDRAW_TYPES?.STAGES?.AMOUNT]: data?.amount }
      })
    } 

    return(
      <StageContainer className="_bankNameList">
        {children}
        <InputComponent 
          refEl={inputEl}
          className="_stickyPosition"
          onChange={onChange} 
          inputStatus={stageStatus}
          name={stageData?.key} 
          label={stageData?.uiName}
          placeholder={stageData?.settings?.placeholder}
          type={stageData?.uiType}
          AuxComponent={() => 
            <AuxContainer>
              <QrReader callback={qrResponse}/>
            </AuxContainer>}
        />
        {
          newAccount ?
          <NewAccountComponent
            itemList={state?.withdrawAccount}
            actions={props?.actions}
            stageManager={stageManager}
            withdrawProvider={withdrawProvider}
            currentWallet={currentWallet}
            withdrawAccount={state?.withdrawAccount}
            isMobile={isMobile}
          />
          :
          <SelectListComponent
            stageData={stageData}
            state={state}
            selectList={selectList}
            isMovilViewport={isMobile}
            onChange={onChange}
          /> 
        }
      </StageContainer>
    )
  } 

export default TargetPersonStage

// Buttom
const NewAccountComponent = (props) => {

    const { itemList, actions, isMobile } = props

    const showModalToCreateWAccount = async() => {
      const element = await import(`./newInternalAccount`)
      const CreateInternalAccount = element.default
      actions.renderModal(() => <CreateInternalAccount item={itemList} {...props}/>);
    }

    return(
      <SelectListContainer>
        <ItemListComponent 
          itemList={itemList}
          lastIndex
          isSelectedItem
          AuxComponent={[
            () => <Buttom
              size='medium'
              variant='outlined'
              className="hoverFilled fit align-center justify-end"
              color={"primary"}
              onClick={showModalToCreateWAccount}
            >
              {!isMobile && 'Guardar'}
              <IoPersonAddOutline size={18} color="primary" />
            </Buttom>
          ]}
        />
      </SelectListContainer>
    )
}