import BigNumber from 'bignumber.js';
import { ChildrenReactNode } from '../utils'

export interface doPaymentProps {
    twoFaToken?: string;
}

interface AmountState {
    amount?: BigNumber
    setAmount: React.Dispatch<React.SetStateAction<BigNumber>>;
}
export type paymentAmount = {
    amount: number | string;
}

export interface loggedViewProps extends ChildrenReactNode, AmountState {
    currency: string;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    paymentRequest: PaymentRequestParams;
    actions?:any;
    isLogged: boolean;
    rejectRequest: () => void;
    user: UserRecipientProps;
    isLoading: boolean;
}

export interface AmountProps { 
    amount: number | string; 
    uiCurrencyName: string;
 }
 
 export interface UserRecipientProps {
    [id: string]: any;
 }
 
 export type paymentDetailProps = {
    paymentRequest?: PaymentRequestParams,
    uiCurrencyName?: string,
    amount?: BigNumber
 }


export interface PaymentRequestParams {
    recipient: string;
    currency: string;
    amount: paymentAmount["amount"];
    expirationTime?: string;
    metaData?: {
        [key: string]: any;
    };
 }

//  remitter
// export type errProps = {
//     error?:string;
//     message?:any;
// }