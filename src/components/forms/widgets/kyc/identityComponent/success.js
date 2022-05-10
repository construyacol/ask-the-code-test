import React from "react"
import ConfettiComponent from '../../success/confetti'
import { Medal } from '../../success/icons'
import { LayoutContainer, ControlContainer } from '../../success/styles'
import { Button } from '../../biometricKycComponent/styles'
import Layout from '../../layout'

const IdentityKycSuccess = (props) => {
// const PersonalKycSuccess = ({ handleDataForm:{ setDataForm }, handleState:{ state, setState } }) => {
    return(
        <Layout background="white">
            <LayoutContainer className="show fuente">
                <ConfettiComponent/>
                <h1 style={{fontSize:"2em"}} >Identidad creada {props?.state?.name?.toLowerCase()}</h1>
                <Medal size={150} />
                <p className="identitySuccess">El proceso de verificación de identidad puede tardar hasta 72 horas hábiles.</p>
                <ControlContainer onClick={props.closeModal}>
                    <Button data-close_modal>Finalizar</Button>
                </ControlContainer>
            </LayoutContainer>
        </Layout>
    )
}

export default IdentityKycSuccess

