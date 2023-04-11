import { PaymentRequestParams } from 'interfaces/paymentRequest';
export class PaymentRequestInstance { 
   constructor(params: PaymentRequestParams) {
     this.recipient = params.recipient;
     this.currency = params.currency;
     this.amount = params.amount;
     this.metaData = params?.metaData ?? {};
     this.expirationTime = params?.expirationTime ?? new Date().toISOString();
   }
 
   readonly recipient: string;
   readonly metaData: object;
   readonly currency: string;
   readonly amount: number | string;
   readonly expirationTime: string;
}
