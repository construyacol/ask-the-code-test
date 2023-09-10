import { ProcessItem, IconContainer, IsCompletedIcontainer } from './styles'
import { P, SPAN } from 'core/components/atoms'
import { GiCheckMark } from 'react-icons/gi';
import payment_detected from 'assets/tempIcons/payment_detected.gif'
import detecting_payment from 'assets/tempIcons/detecting_payment.gif'
import transferring_funds from 'assets/tempIcons/transferring_funds.gif'

const IMAGES = {
    payment_detected,
    detecting_payment,
    transferring_funds
}

export default function BitrefillPaymentProcessItem({itemPayment, className, isCompleted, index, paymentProcessState }){
    return (
        <ProcessItem key={itemPayment} className={`${className}`}>
            <IconContainer className={`${className}`}>
                {
                    isCompleted ? 
                        <IsCompletedIcontainer>
                            <GiCheckMark size={13} color="white"/>
                        </IsCompletedIcontainer>
                    : 
                        <img height="80%" src={IMAGES[itemPayment]} alt=""></img>
                }
            </IconContainer>
            <P className={`titleProcess ${className}`}>
                <SPAN className={"number"}>
                    {`${index+1}.  `} 
                </SPAN> 
                {isCompleted ? paymentProcessState[itemPayment].successTitle : paymentProcessState[itemPayment].title}
            </P>
        </ProcessItem>
    )
}

