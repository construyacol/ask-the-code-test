import { AmountProps } from 'interfaces/paymentRequest';
import { SPAN } from 'core/components/atoms'


 const AmountUiView = ({amount, uiCurrencyName}:AmountProps) => {
    if(!amount)return null;
    return(
       <SPAN>
          &nbsp;por la cantidad de  
          <SPAN className="number">
             &nbsp;{amount}&nbsp;
          </SPAN>
          <strong>{uiCurrencyName}</strong>
       </SPAN>
    )
 }

 export default AmountUiView