import { SPAN, H3, P } from 'core/components/atoms'
import { loggedViewProps } from 'interfaces/paymentRequest';
import { useSelector } from "react-redux";
import { modelDataProps } from 'interfaces/state'
import { serveModelsByCustomProps } from 'selectors'
// currency

const IsLoggedView = ({ currency }:loggedViewProps) => {
    //@ts-ignore
    const walletsByCurrencies = useSelector(({ modelData:{ wallets }}:modelDataProps) => serveModelsByCustomProps(wallets, 'currency'));
    console.log('walletsByCurrencies', currency, walletsByCurrencies)
    return(
       <P className={'no-margin'}>IsLoggedView</P>
    )
 }

 export default IsLoggedView