import { useState } from "react";
import NewFiatWithdrawAccountComponent from '../../../forms/widgets/newWithdrawAccount/init'
import FiatWithdraw from '../../../forms/widgets/fiatWithdraw/init'


const FiatView = () => {
  const [ view, setView ] = useState('defaultWithdraw')
  const STAGE_COMPONENTS = {
    defaultWithdraw:FiatWithdraw,
    newBankAccount:NewFiatWithdrawAccountComponent,
    // withdrawCrypto:NewFiatWithdrawAccountComponent
  }
  const RenderView = STAGE_COMPONENTS[view] || <p>No hay vista para renderizar</p>
  return(<RenderView setView={setView}/>)
};

export default FiatView;