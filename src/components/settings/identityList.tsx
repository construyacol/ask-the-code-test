import { useSelector } from "react-redux";
import { selectAllIdentities } from 'selectors'
import { SelectListContainer, ItemListComponent } from 'components/forms/widgets/selectListComponent'
import { useActions } from "hooks/useActions";
// import { HR } from 'components/widgets/headerAccount/styles'
// import { MetaContainer } from 'components/forms/widgets/sharedStyles'
import useViewport from 'hooks/useWindowSize'
import { getIdentityState } from 'utils'
import { StateInfo, IdentityInfo, DetailItem } from './styles'
import { BiRightArrowAlt, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { UI_STATE_ACTION, UI_STATE_DESCRIPTION, UI_DETAIL_NAME } from 'const/uiNames'
import { identityInfo } from 'components/forms/widgets/kyc/identityComponent/identityUtils'
import useToastMessage from 'hooks/useToastMessage'
import { useCallback, useState } from 'react' 
import { merge } from 'lodash'
import { handleIdentity, stateInterface } from 'interfaces/settings/kyc'


const IdentityListComponent = () => {

    const [ userIdentities ] = useSelector((state) => selectAllIdentities(state));
    const { isMovilViewport } = useViewport();
    const { confirmedIdentity, pendingOrRejectedIdentity, pendingIdentity } = identityInfo()
    const [ toastMessage ] = useToastMessage()
    const [ showInfoIdentity, setShowInfoIdentity ] = useState<stateInterface>({ id:false})
    
    const actions = useActions()
    const identityInProgress = pendingOrRejectedIdentity || confirmedIdentity

    

    const handleIdentity = useCallback(async(payload:handleIdentity) => {

        const { isNewId, identityState, currentIdentity } = payload
        if(isNewId && (confirmedIdentity || pendingIdentity))return toastMessage("no se puede agregar una nueva identidad porque ya tiene una identidad en progreso");
        if(identityState && ["accepted", "confirmed"].includes(identityState))return setShowInfoIdentity(prevState => { return { [currentIdentity?.id]:!prevState[currentIdentity?.id] }});

        const Element = await import(`components/forms/widgets/kyc/identityComponent/init`)
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <Element.default {...payload}/>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


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
                        const ArrowIcon = showInfoIdentity[key] ? BiChevronUp : BiChevronDown;

                        return (
                        <div key={index} style={{
                            height: "max-content",
                            display: "grid"
                        }}>
                            <ItemListComponent 
                                
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
                                    :
                                    ["confirmed", "accepted"].includes(identityState) ?
                                        () => <ArrowIcon
                                            size={30}
                                            color="var(--paragraph_color)"
                                            className="arrowControl"
                                        />
                                        : null
                                    ]}
                            />
                            {
                                ["confirmed", "accepted"].includes(identityState) &&
                                  <DetailInfoIdentity 
                                    showInfoIdentity={showInfoIdentity[key]}
                                    identity={userIdentities[key as keyof typeof userIdentities]}
                                  />
                            }

                        </div>
                        )
                    })
                }
            </SelectListContainer>
            {
                (identityInProgress && getIdentityState(identityInProgress) && UI_STATE_DESCRIPTION[getIdentityState(identityInProgress)]) &&
                <StateInfo className={getIdentityState(identityInProgress)}>
                    <p className="fuente">{UI_STATE_DESCRIPTION[getIdentityState(identityInProgress)]}</p>
                </StateInfo>
            }
        </>
    )
}

type detailProps = {
    showInfoIdentity:boolean,
    identity:any
}

const DetailInfoIdentity = ({ showInfoIdentity, identity }:detailProps) => {

    let iterableData = merge(identity?.document_info, { nationality:identity.nationality })

    return(
        <IdentityInfo className={`${showInfoIdentity ? 'open' : ''}`} >
            {
                Object.keys(iterableData).map((infoKey, index) => {

                    if(["birthday", "id_number"].includes(infoKey))return null;

                    return(
                        <DetailItem key={index}>
                            <p className="fuente itemKey">{UI_DETAIL_NAME[infoKey as keyof typeof UI_DETAIL_NAME] || infoKey}</p>
                            <p className="fuente2 itemData">{identity?.document_info[infoKey]}</p>
                        </DetailItem>
                    )
                })
            }
        </IdentityInfo>
    )

}



export default IdentityListComponent