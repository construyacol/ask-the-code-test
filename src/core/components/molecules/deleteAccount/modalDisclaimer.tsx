import { ModalLayout } from 'core/components/layout'
import styled from 'styled-components'
import { CrudContainer } from '../modalCrud/styles'
import { getCdnPath } from 'environment'
import { P, H3, Button } from 'core/components/atoms'
import { InputComponent } from 'core/components/molecules'
import { useSelector } from "react-redux";
import { useState, ChangeEvent } from 'react'
import withCoinsendaServices from 'components/withCoinsendaServices'
import { device } from 'const/const';


interface modelDataProp {
    [id: string]: any;
}

type modelDataProps = {
    modelData: modelDataProp;
}

const TYPE_REQUEST_DEFAULT = 'delete'
const ERROR_MESSAGE_MATCH = "duplicate key error"
const ERROR_DUPLICATE_REQUEST = "Ya hay una solicitud en proceso"
const SUCCESS_MESSAGE = "Tu solicitud se creó con exito"

const ModalDisclaimer = (props:any) => {

    const user = useSelector(({ modelData:{ user } }:modelDataProps) => user);
    const [ passPhrase ] = useState(user?.email)
    const [ availableAction, setAvailableAction ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { target:{ value } } = event
      if(value?.trim() === passPhrase){
         setAvailableAction(true)
      }else{
         setAvailableAction(false)
      }
    }

    const DeleteAccount = async() => {
      setLoading(true)
      const { data, error } = await props?.coinsendaServices?.addNewDeleteRequet(TYPE_REQUEST_DEFAULT)
      setLoading(false)
      if(error) return props?.toastMessage(error?.message?.includes(ERROR_MESSAGE_MATCH) ? ERROR_DUPLICATE_REQUEST : error?.message, 'error')
      props?.toastMessage(SUCCESS_MESSAGE)
      console.log('DeleteAccount ', data)
    }

    return(
      <ModalLayout loading={loading}>
         <CrudContainer rowGap="10px" className={`medium flex`}>
            <HeaderContainer>
                  <img src={`${getCdnPath('assets')}error_animation.gif`}  alt="" width={75} height={75} />
                  <H3 color='red_color'>Eliminación de cuenta</H3>
            </HeaderContainer>
            <ContentContainer>
               <P>Antes de eliminar tu cuenta, es importante que sepas que estás a punto de perder acceso a los siguientes beneficios:</P>
               <ul>
                  <li>Historial de transacciones</li>
                  <li>Verificación KYC existente</li>
                  <li>Potencial de crecimiento de tus inversiones</li>
                  <li>Incentivos y comisiones de tus referidos</li>
               </ul>
               <P variant="bold">Para confirmar escribe el siguiente texto:</P>
               <ConfirmationWord>
                  <P>{passPhrase}</P>
               </ConfirmationWord>
               <InputComponent  
                  className="input__fit"
                  onChange={onChange} 
                  inputStatus={availableAction ? 'success' : ''}
                  disabled={loading} 
                  // label="Asígnale un nombre"
                  placeholder="Escribe aquí"
               />
            </ContentContainer>
            <ControlContainer>
               <Button 
                  size="small"
                  data-close_modal
                  disabled={loading}
               >
                  Deseo mantener mi cuenta
               </Button>
               <Button 
                  size="small" 
                  variant="contained" 
                  color={"red_color"} 
                  disabled={!availableAction} 
                  onClick={!loading ? DeleteAccount : () => null}
                  loading={loading}
               >  Eliminar cuenta
               </Button>
            </ControlContainer>
         </CrudContainer>
      </ModalLayout>
    )
 } 

 export default withCoinsendaServices(ModalDisclaimer)

 const ControlContainer = styled.div`
    display: flex;
    column-gap: 25px;
    justify-content: center;
    @media ${device.mobile} {
       flex-direction: column;
    }
 `

 const ConfirmationWord = styled.div`
    display: flex;
    column-gap:7px;
    padding-left: 12px;
    border-left: 2px solid  ${props => props.theme.palette.red_color};
    background-color: ${props => props.theme.palette.red_background};
`
 
 const ContentContainer = styled.div`
    ul
    li{
        color: ${props => props.theme.palette.text_color};
        font-family: "Raleway",sans-serif;
        padding-bottom: 15px;
        font-size:14px;
    }
    p, input{
        font-size:15px;
        color: ${props => props.theme.palette.text_color};
    }
    display: flex;
    flex-direction: column;
 `
 
 const HeaderContainer = styled.div`
    display: flex;
    place-content: center;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.palette.skeleton_color};
 `
 
 