interface PaymentRequestParams {
   recipient: string;
   currency: string;
   amount: number | string;
   expirationTime?: string;
}
 
export class PaymentRequestInstance {
   constructor(params: PaymentRequestParams) {
     this.recipient = params.recipient;
     this.currency = params.currency;
     this.amount = params.amount;
     this.expirationTime = params?.expirationTime ?? new Date().toISOString();
   }
 
   readonly recipient: string;
   readonly currency: string;
   readonly amount: number | string;
   readonly expirationTime: string;
}
