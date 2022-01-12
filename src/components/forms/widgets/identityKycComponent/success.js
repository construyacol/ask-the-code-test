import React from "react"
import ConfettiComponent from '../success/confetti'
import { Medal } from '../success/icons'
import { LayoutContainer, ControlContainer } from '../success/styles'
import { Button } from '../biometricKycComponent/styles'
import Layout from '../layout'

const PersonalKycSuccess = (props) => {
// const PersonalKycSuccess = ({ handleDataForm:{ setDataForm }, handleState:{ state, setState } }) => {
    return(
        <Layout background="white">
            <LayoutContainer className="show fuente">
                <ConfettiComponent/>
                <h1 style={{fontSize:"2em"}} >Genial {props?.state?.name?.toLowerCase()}</h1>
                <Medal size={150} />
                <p>Has completado tu verificación avanzada</p>
                <ControlContainer onClick={props.closeModal}>
                    <Button data-close_modal>Finalizar</Button>
                </ControlContainer>
            </LayoutContainer>
        </Layout>
    )
}

export default PersonalKycSuccess

