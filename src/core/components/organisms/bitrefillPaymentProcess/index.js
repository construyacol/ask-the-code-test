import { useState } from 'react'
import { PaymentProcessContainer, ProcessItemsContainer } from './styles'
import { P } from 'core/components/atoms'
import { BitrefillPaymentProcessItem } from 'core/components/molecules'
import { 
    BITREFILL_STATE,
    TRANSFERRING_FUNDS,
    DETECTING_PAYMENT,
    PAYMENT_DETECTED 
} from 'const/bitrefill'


export default function BitrefillPaymentProcess({ visible, paymentState }){

    const [ paymentProcessState ] = useState({
        [TRANSFERRING_FUNDS]:BITREFILL_STATE[TRANSFERRING_FUNDS],
        [DETECTING_PAYMENT]:BITREFILL_STATE[DETECTING_PAYMENT],
        [PAYMENT_DETECTED]:BITREFILL_STATE[PAYMENT_DETECTED]
    })
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
                            <BitrefillPaymentProcessItem
                                key={itemPayment}
                                itemPayment={itemPayment}
                                className={className}
                                isCompleted={isCompleted}
                                index={index}
                                paymentProcessState={paymentProcessState}
                            />
                        )
                    })
                }
            </ProcessItemsContainer>
            {
                paymentState?.message && <P className={"no-margin message"} >{paymentState?.message}</P>
            }
            {/* <P className={"no-margin message"}>En caso de que tengas inconvenientes con tu compra, comunícate con soporte y comparte el id de esta factura</P> */}
       </PaymentProcessContainer>
    )
}
