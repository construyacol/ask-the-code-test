import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { UI_NAMES } from '../../../../const/uiNames'
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { HR } from '../../../widgets/headerAccount/styles'
import { useActions } from '../../../../hooks/useActions'
import { getIdentityState } from '../../../../utils'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { MetaContainer } from '../sharedStyles'

export default function IdentityComponent({ 
    stageManager:{ 
      stageData,
      setStageData,
      setStageStatus,
      stageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children 
  }){  

    const { isMovilViewport } = useViewport();
    const [ userIdentities, createNewId ] = useSelector((state) => selectAvailableIdentities(state));
    const actions = useActions()
  
    const createNewIdAction = async() => {
      if(!createNewId)return alert('No puedes crear una nueva identidad si tienes identidades en proceso de verificación.');
      const Element = await import(`../kyc/identityComponent/init`)
      if(!Element) return;
      const BiometricKyc = Element.default
      actions.renderModal(() => <BiometricKyc/>);
    }
    
    const selectIdentity = (identity) => {
      if(!identity?.enabled)return alert("La identidad seleccionada está en proceso de verificación, este proceso puede tardar hasta 72 horas hábiles.");
      setState(prevState => {
        return { ...prevState, [stageData?.key]: identity }
      })
      setStageStatus('success')
    }
  
    useEffect(() => {
      if(state?.identity){
        selectIdentity(state?.identity)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    return(
      <StageContainer className="_identityComponent">
        {children}
        <OptionInputContainer>
          <p className="fuente _pLabel _inputLabelP">Elige el documento de identidad vinculado a tu cuenta de retiro</p>
          <SelectListContainer>
            {
              userIdentities && Object.keys(userIdentities).map((key, index) => {
                const isSelected = [userIdentities[key]?.value].includes(state?.identity?.value)
                const isDisabled = !userIdentities[key]?.enabled
                return <ItemListComponent 
                  key={index} 
                  className={`${isDisabled ? 'disabled' : ''}`}
                  itemList={userIdentities[key]}
                  firstIndex={index === 0 && !createNewId}
                  lastIndex={(Object.keys(userIdentities)?.length - 1) === index}
                  isSelectedItem={isSelected}
                  isMovilViewport={isMovilViewport}
                  handleAction={selectIdentity}
                  auxUiName={userIdentities[key]?.nationality}
                  AuxComponent={[
                    isMovilViewport ? () => null :
                    () => <IdNumberPanel
                      item={userIdentities[key]}
                    />
                  ]}
                />
              })
            }
            <ItemListComponent 
                  className="createButton"
                  itemList={{
                    value:"createId",
                    icon:"add",
                    uiName:isMovilViewport ? "Otro documento" : "Otro documento"
                  }}
                  firstIndex={true}
                  handleAction={createNewIdAction}
                />
          </SelectListContainer>
        </OptionInputContainer>
      </StageContainer>
    )
  }




const IdNumberPanel = ({ item }) => {
    return( 
      <MetaContainer>
        <HR/>
        <p className="fuente2">{item?.document_info?.id_number}</p>
        <p className="fuente2">{item?.enabled ? 'Número' : 'Verificando...'}</p>
      </MetaContainer>
    )
}


 
  const selectAvailableIdentities = createSelector(
    (state) => state.modelData.user.identities,
    (identities) => {
      if(!identities?.length)return ; 
      let createNewId = true
      let userIdentities = {}
      identities.forEach(userIdentity => { 
        const identityState = getIdentityState(userIdentity)
        if(["pending", "confirmed"].includes(identityState))createNewId = false;
        if(["accepted", "confirmed"].includes(identityState)){
          userIdentities = { 
            ...userIdentities,
            [userIdentity?.document_info?.id_number]:{
              ...userIdentity,
              uiName:`${UI_NAMES?.documents[userIdentity?.id_type]}`,
              icon:"identity",
              enabled:["accepted"].includes(identityState),
              value:userIdentity?.document_info?.id_number,
            }
          }
        }
      })
      return [ userIdentities, createNewId ];
    }
  );