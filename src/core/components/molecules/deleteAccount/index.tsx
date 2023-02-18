import { P } from 'core/components/atoms'
import { SUPPORT_EMAIL } from 'const/const'
import { useSelector } from "react-redux";
import { ButtonContainer } from './styles'

export interface modelDataProp {
    [id: string]: any;
}
export type modelDataProps = {
    modelData: modelDataProp;
};

function DeleteAccount(){
    const user = useSelector(({ modelData:{ user } }:modelDataProps) => user);
    function sendEmail() {
        const subject = `Eliminar cuenta de usuario de ${user?.name}: ${user?.email}`;
        const receiver = SUPPORT_EMAIL
        const body = `Nombre: ${user?.name}\nCorreo: ${user?.name}`;
        window.location.href = `mailto:${receiver}?subject=${subject}&body=${body}`;
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

