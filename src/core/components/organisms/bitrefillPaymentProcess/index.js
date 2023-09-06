import { useState } from 'react'
import { PaymentProcessContainer } from './styles'
import styled from 'styled-components'
import { P, SPAN } from 'core/components/atoms'
import { 
    BITREFILL_STATE,
    TRANSFERRING_FUNDS,
    DETECTING_PAYMENT,
    PAYMENT_DETECTED 
} from 'const/bitrefill'

import { GiCheckMark } from 'react-icons/gi';
import payment_detected from 'assets/tempIcons/payment_detected.gif'
import detecting_payment from 'assets/tempIcons/detecting_payment.gif'
import transferring_funds from 'assets/tempIcons/transferring_funds.gif'

const IMAGES = {
    payment_detected,
    detecting_payment,
    transferring_funds
}

export default function BitrefillPaymentProcess({ visible, paymentState }){

    const [ paymentProcessState ] = useState({
        [TRANSFERRING_FUNDS]:BITREFILL_STATE[TRANSFERRING_FUNDS],
        [DETECTING_PAYMENT]:BITREFILL_STATE[DETECTING_PAYMENT],
        [PAYMENT_DETECTED]:BITREFILL_STATE[PAYMENT_DETECTED]
    })
    console.log('paymentProcessState', paymentState.status, IMAGES)
    const paymentProcessList = Object.keys(paymentProcessState)
    return(
       <PaymentProcessContainer className={`${visible ? 'visible' : 'hidden'}`}>
            <ProcessItemsContainer>
                {
                    paymentProcessList.map((itemPayment, index) => {

                        const isCompleted = paymentProcessList.indexOf(paymentState.status) > index
                        const inProgress = paymentProcessList.indexOf(paymentState.status) === index
                        const className = isCompleted ? 'isCompleted' : inProgress ? 'inProgress' : ''

                        return (
                            <ProcessItem className={`${className}`}>
                                <IconContainer className={`${className}`}>
                                    {
                                        isCompleted ? 
                                            <IsCompletedIcontainer>
                                                <GiCheckMark size={13} color="var(--green_color)"/>
                                            </IsCompletedIcontainer>
                                        : 
                                            <img height="80%" src={IMAGES[itemPayment]} alt=""></img>
                                    }
                                </IconContainer>
                                <P className="titleProcess">
                                    <SPAN className={"number"}>
                                        {`${index+1}.  `} 
                                    </SPAN>
                                    {paymentProcessState[itemPayment].title}
                                </P>
                            </ProcessItem>
                        )
                    })
                }
            </ProcessItemsContainer>
            {
                paymentState?.message && <P className={"no-margin message"} >{paymentState?.message}</P>
            }
            

       </PaymentProcessContainer>
    )
}

const IsCompletedIcontainer = styled.div`
    width: 60%;
    height: 60%;
    border-radius: 50%;
    display: flex;
    place-content: center;
    place-items: center;
    border: 1px solid var(--green_color);
`

const IconContainer = styled.div`
    height: 3rem;
    width: 3rem;
    aspect-ratio: 1; 
    background-color: white;
    border: 1px solid #E9E9E9;
    border-radius: 50%;
    display: flex;
    place-content: center;
    place-items: center;
    transition:.3s;
    img{
        transition: .3s;
        opacity: .01;
    }
    &.inProgress{
        border-color: var(--primary);
        img{
            opacity: 1;
        }
    }
    &.isCompleted{
        /* border-color: var(--green_color); */
    }
`

const ProcessItem = styled.div`
    height: 4rem;
    width: 100%;
    background-color: #43576814;
    border: 1px solid #E9E9E9;
    background-color: #43576808;
    backdrop-filter: blur(10px);
    border-radius: 9px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    padding: 0 0.7rem;
    width: calc(100% - 1.4rem);
    column-gap: 1rem;
    opacity: .3;
    transition: .3s;

    &.isCompleted{
        opacity: 1;

    }
    &.inProgress{
        opacity: 1;
        .titleProcess{
            font-weight: 600;
        }

    }
    .titleProcess{
        font-size: .9rem;
    }
`

const ProcessItemsContainer = styled.div`
    width: calc(100% - 2rem);
    height: calc(100% - 2rem);
    padding: 1rem;
    border-radius: 6px;
    display: grid;
    row-gap: 1.2rem;
`

