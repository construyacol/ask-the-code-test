import React, { useEffect } from "react"
import ConfettiComponent from '../success/confetti'
import { Medal } from '../success/icons'
import { LayoutContainer, ControlContainer } from '../success/styles'
import { Button } from './styles'
import Layout from '../layout'
// import { useActions } from '../../../../hooks/useActions'

const PersonalKycSuccess = ({ handleState:{ state }, ...props }) => {
    
    // const actions = useActions();

    const tryConfirmDeposit = () => {
        if(!props.orderData) return;
        const { orderData:{ order, paymentProof } , coinsendaServices } = props
        coinsendaServices.confirmDepositOrder(order.id, paymentProof);
    }

    useEffect(() => {
      tryConfirmDeposit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return(
        <Layout background="white">
            <LayoutContainer className="show fuente">
                <ConfettiComponent/>
                <h1 style={{fontSize:"2em"}} >Genial {state?.name?.toLowerCase()}</h1>
                <Medal size={150} />
                <p>Has completado tu verificación biométrica</p>
                <ControlContainer>
                    <Button data-close_modal>Finalizar</Button>
                </ControlContainer>
            </LayoutContainer>
        </Layout>
    )
}

export default PersonalKycSuccess

