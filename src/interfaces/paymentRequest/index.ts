import BigNumber from 'bignumber.js';
import { ChildrenReactNode } from '../utils'


interface AmountState {
    amount?: BigNumber
    setAmount: React.Dispatch<React.SetStateAction<BigNumber>>;
}

export interface unLoggedViewProps extends ChildrenReactNode, AmountState {
    currency: string;
}

export type paymentAmount = {
    amount: number | string;
}
 
export interface loggedViewProps extends ChildrenReactNode, AmountState {
    currency: string;
    paymentRequest?: PaymentRequestParams;
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
        [key: string]: string;
    };
 }

//  remitter

export type errProps = {
    error?:string;
    message?:any;
}