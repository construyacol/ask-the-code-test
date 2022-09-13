import { useSelector } from "react-redux";
import { selectAllIdentities } from 'selectors'
import { SelectListContainer, ItemListComponent } from 'components/forms/widgets/selectListComponent'
import { useActions } from "hooks/useActions";
import { HR } from 'components/widgets/headerAccount/styles'
import { MetaContainer } from 'components/forms/widgets/sharedStyles'
import useViewport from 'hooks/useWindowSize'
import { getIdentityState } from 'utils'

type handleIdentity = {
    isNewId?:boolean
    currentIdentity?:object,
    identityState?:string
}


const IdentityListComponent = () => {

    const [ userIdentities ] = useSelector((state) => selectAllIdentities(state));
    const actions = useActions()
    const { isMovilViewport } = useViewport();

    const handleIdentity = async(payload:handleIdentity) => {
        if(payload?.identityState && ["accepted"].includes(payload?.identityState))return alert('esta identidad ya fué aceptada');
        const Element = await import(`components/forms/widgets/kyc/identityComponent/init`)
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <Element.default {...payload}/>)
    }

    console.log('userIdentities', userIdentities)

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

                        return <ItemListComponent 
                        key={index} 
                        className={`${isDisabled ? 'disabled' : ''}`}
                        itemList={userIdentities[key]}
                        firstIndex={index === 0}
                        lastIndex={(Object.keys(userIdentities)?.length - 1) === index}
                        // isSelectedItem={isSelected}
                        handleAction={() => handleIdentity({ currentIdentity:userIdentities[key], identityState })}
                        auxUiName={userIdentities[key]?.value}
                        AuxComponent={[
                            isMovilViewport ? () => null :
                            () => <DataState
                            title={identityState}
                            />
                        ]}
                        />
                    })
                }
            </SelectListContainer>
        </>
    )
}



const DataState = ({ title }:any) => {

    return( 
      <MetaContainer className="uniqueRow">
        <HR/>
        <p className="fuente2">{title}</p>
        <p className="fuente2">{title}</p>
      </MetaContainer>
    )
}


export default IdentityListComponent