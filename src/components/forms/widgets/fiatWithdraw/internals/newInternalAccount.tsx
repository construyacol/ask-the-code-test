import { useState } from 'react'
import IconSwitch from "components/widgets/icons/iconSwitch";
import InputComponent from 'components/forms/widgets/kyc/InputComponent'
import Buttom from 'components/widgets/buttons/button'
import { useActions } from "hooks/useActions";
import { ModalCrud } from 'core/components/molecules'
import { createWithdrawAccount } from '../api'
import {
    P,
    H2
} from 'core/components/atoms'
import { IconClose } from "components/widgets/shared-styles";
import {
    Content,
    IdentifierCont,
    ButtonCont
} from './styles'


function CreateInternalAccount(props:any){

    const [ inputStatus, setInputStatus ] = useState('')
    const [ labelAccount, setLabelAccount ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const { item } = props
    const actions = useActions()

    const onChange = ({target}:any) => {
        setLabelAccount(target?.value)
        if(target?.value?.length >= 1) setInputStatus('success'); else setInputStatus('');
    }
    
    const createAccount = async() => {
        setLoading(true)
        await createWithdrawAccount({ ...props, labelAccount })
        setLoading(false)
        actions.renderModal(null)
    }

    return(
        <ModalCrud loading={loading}>
            <IconClose theme="dark" size={20} />
            <H2 className="no-margin">Guarda este contacto</H2>
            <Content>
                <IdentifierCont>
                    <IconSwitch
                        icon="person"
                        size={20}
                        color="var(--primary)"
                    />
                    <P className="no-margin" color="primary">{item?.identifier}</P>
                </IdentifierCont>
                <InputComponent  
                    className="input__fit"
                    onChange={onChange} 
                    inputStatus={inputStatus === 'success' ? inputStatus : null}
                    label="Asígnale un nombre"
                    placeholder="Ej: Juan Camelo"
                />
            </Content>
            <ButtonCont>
                <Buttom
                    size='medium'
                    variant='contained'
                    color={"primary"}
                    disabled={(inputStatus !== 'success' || loading) ? true : false}
                    onClick={createAccount}
                >
                    {loading ? 'Guardando' : ' Guardar '} 
                </Buttom>
                <Buttom
                    size='medium'
                    color={"primary"}
                    onClick={() => actions.renderModal(null)}
                >
                    Cancelar
                </Buttom>
            </ButtonCont>
        </ModalCrud>
    )
}

export default CreateInternalAccount