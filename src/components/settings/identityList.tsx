import { useSelector } from "react-redux";
import { selectAvailableIdentities } from 'selectors'
import { SelectListContainer, ItemListComponent } from 'components/forms/widgets/selectListComponent'
import { useActions } from "hooks/useActions";
    

const IdentityListComponent = () => {

    const [ userIdentities, createNewId ] = useSelector((state) => selectAvailableIdentities(state));
    const actions = useActions()

    const handleIdentity = async() => {
        const Element = await import(`components/forms/widgets/kyc/identityComponent/init`)
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <Element.default/>)
    }

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
                  handleAction={handleIdentity}
                />
                {
                    userIdentities && Object.keys(userIdentities).map((key, index) => {
                        // const isSelected = [userIdentities[key]?.value].includes(state?.identity?.value)
                        const isDisabled = !userIdentities[key]?.enabled
                        return <ItemListComponent 
                        key={index} 
                        className={`${isDisabled ? 'disabled' : ''}`}
                        itemList={userIdentities[key]}
                        firstIndex={index === 0 && !createNewId}
                        lastIndex={(Object.keys(userIdentities)?.length - 1) === index}
                        // isSelectedItem={isSelected}
                        // isMovilViewport={isMovilViewport}
                        handleAction={() => null}
                        auxUiName={userIdentities[key]?.nationality}
                        // AuxComponent={[
                        //     isMovilViewport ? () => null :
                        //     () => <IdNumberPanel
                        //     item={userIdentities[key]}
                        //     />
                        // ]}
                        />
                    })
                }
            </SelectListContainer>
        </>
    )
}


export default IdentityListComponent