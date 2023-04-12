export interface loggedViewProps {
    currency: string;
}


export interface AmountProps { 
    amount: number | string; 
    uiCurrencyName: string;
 }
 
 export interface UserRecipientProps {
    [id: string]: any;
 }
 
 export type paymentDetailProps = {
    paymentRequest: PaymentRequestParams,
    uiCurrencyName?: string
 }


export interface PaymentRequestParams {
    recipient: string;
    currency: string;
    amount: number | string;
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