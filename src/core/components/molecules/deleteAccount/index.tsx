import { P } from 'core/components/atoms'
// import { SUPPORT_EMAIL } from 'const/const'
// import { useSelector } from "react-redux";
import { ButtonContainer } from './styles'
import { useActions } from 'hooks/useActions'
  
function DeleteAccount(){

    const actions = useActions()
    const sendEmail = async() => {
        const ModalDisclaimer = await import('./modalDisclaimer')
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <ModalDisclaimer.default/>); 
        // const subject = `Eliminar cuenta de usuario de ${user?.name ? user?.name : ''}: ${user?.email}`;
        // const receiver = SUPPORT_EMAIL 
        // const body = `Nombre: ${user?.name}\nCorreo: ${user?.name}`;
        // window.location.href = `mailto:${receiver}?subject=${subject}&body=${body}`;
    }

    return(
        <ButtonContainer onClick={sendEmail}>
            <P className="deleteAccount__p--paragraph">
                Eliminar cuenta
            </P>
        </ButtonContainer>
    )
}

export default DeleteAccount


