import styled from "styled-components"
import ControlButton, { SecondaryButton } from '../widgets/buttons/controlButton'
import { useActions } from '../../hooks/useActions'

export default function DialogWAccount(props) {
    
    const actions = useActions()

    const closeDialog = () => {
        let idTypeDialog = document.querySelector("#idTypeDialog")
        idTypeDialog.close()
    }

    const openCreateId = async() => {
        const Element = await import(`../forms/widgets/kyc/identityComponent/init`)
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <Element.default {...props} />)
        return closeDialog()
    }    

    return(
      <Dialog id="idTypeDialog">
        <Container>
            <h2 className="fuente">¡ATENCIÓN!</h2>
            <p className="fuente">Para crear cuentas de retiro vinculadas con otro documento de identidad, debes agregar este documento a tus identidades.</p>
            <ButtonContainer>
                <SecondaryButton
                    label={`Lo haré después`}
                    handleAction={closeDialog}
                />
                <ControlButton 
                    formValidate
                    label={`Agregar documento`}
                    handleAction={openCreateId}
                />
            </ButtonContainer>
        </Container>
      </Dialog>      
    )
}

const Container = styled.div`
    display:grid;
    grid-template-rows:auto 1fr auto;
    row-gap:60px;
    max-width: 440px;
    padding: 10px;
`

const ButtonContainer = styled.div`
    display:flex;
    column-gap: 15px;
    place-items: center;
    justify-self: center;

    .botonForm{
       width: auto !important;
    }
`
 
const Dialog = styled.dialog`
    border: 1px solid gray;
    border-radius: 6px;
    text-align: center;
    &::backdrop {
        backdrop-filter: blur(2px);
        background: linear-gradient(to bottom right, #00000099, #000000f0);
    }
`