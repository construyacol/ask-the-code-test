import { useSelector } from "react-redux";
import { selectAllIdentities } from 'selectors'
import { SelectListContainer, ItemListComponent } from 'components/forms/widgets/selectListComponent'
import { useActions } from "hooks/useActions";
// import { HR } from 'components/widgets/headerAccount/styles'
// import { MetaContainer } from 'components/forms/widgets/sharedStyles'
import useViewport from 'hooks/useWindowSize'
import { getIdentityState } from 'utils'
// import { UiStateCont } from './styles'
import { BiRightArrowAlt } from 'react-icons/bi';
import { UI_STATE_ACTION } from 'const/uiNames'
import { identityInfo } from 'components/forms/widgets/kyc/identityComponent/identityUtils'
import useToastMessage from 'hooks/useToastMessage'

type handleIdentity = {
    isNewId?:boolean
    currentIdentity?:object,
    identityState?:string
}


const IdentityListComponent = () => {

    const [ userIdentities ] = useSelector((state) => selectAllIdentities(state));
    const actions = useActions()
    const { isMovilViewport } = useViewport();
  const { confirmedIdentity } = identityInfo()
  const [ toastMessage ] = useToastMessage()


    const handleIdentity = async(payload:handleIdentity) => {
        const { isNewId, identityState } = payload
        if(isNewId && confirmedIdentity)return toastMessage("no se puede agregar una nueva identidad porque ya tiene una identidad en progreso");
        if(identityState && ["accepted", "confirmed"].includes(identityState))return;
        const Element = await import(`components/forms/widgets/kyc/identityComponent/init`)
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <Element.default {...payload}/>)
    }

    // console.log('userIdentities', userIdentities)

    return(
        <>
            <h3 className="fuente">
                Documentos de identidad
            </h3>
            
            <SelectListContainer>
                <ItemListComponent 
                  className="createButton"
                  itemList={{
                    value:"createId",
                    icon:"add",
                    uiName:"Agregar nueva identidad"
                  }} 
                  firstIndex={true}
                  handleAction={() => handleIdentity({isNewId:true})}
                />
                {
                    userIdentities && Object.keys(userIdentities).map((key, index) => {
                        // const isSelected = [userIdentities[key]?.value].includes(state?.identity?.value)
                        const isDisabled = !userIdentities[key]?.enabled
                        const identityState = getIdentityState(userIdentities[key])
                        const uiStateAction = (UI_STATE_ACTION[identityState] && isMovilViewport) ? `- ${UI_STATE_ACTION[identityState]}` : ''

                        return <ItemListComponent 
                        key={index} 
                        className={`${isDisabled ? 'disabled' : ''} withControls`}
                        itemList={userIdentities[key]}
                        firstIndex={index === 0}
                        lastIndex={(Object.keys(userIdentities)?.length - 1) === index}
                        // isSelectedItem={isSelected}
                        handleAction={() => handleIdentity({ currentIdentity:userIdentities[key], identityState })}
                        auxUiName={`${userIdentities[key]?.value} ${uiStateAction}`}
                        auxUiState={identityState}
                        AuxComponent={[
                            ["pending", "rejected"].includes(identityState) ?
                                () => <BiRightArrowAlt
                                    size={30}
                                    color="var(--paragraph_color)"
                                    className="arrowControl"
                                />
                            :   null
                        ]}
                        />
                    })
                }
            </SelectListContainer>
        </>
    )
}



export default IdentityListComponent