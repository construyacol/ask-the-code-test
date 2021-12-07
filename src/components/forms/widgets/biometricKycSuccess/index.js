import React from "react"
import ConfettiComponent from '../success/confetti'
import { Medal } from '../success/icons'
import { LayoutContainer, ControlContainer } from '../success/styles'
import { Button } from '../biometricKycComponent/styles'

const PersonalKycSuccess = ({ handleDataForm:{ setDataForm }, handleState:{ state, setState } }) => {

    return(
        <LayoutContainer>
            <ConfettiComponent/>
            <h1 style={{fontSize:"2em"}} >Genial {state?.name?.toLowerCase()}</h1>
            <Medal size={150} />
            <p>Has completado tu verificación biométrica</p>
            <ControlContainer>
                <Button data-close_modal>Finalizar</Button>
            </ControlContainer>
        </LayoutContainer>
    )
}

export default PersonalKycSuccess

