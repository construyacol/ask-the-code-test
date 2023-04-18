
import { useCoinsendaServices } from "services/useCoinsendaServices";
import loadable from "@loadable/component";
import SkeletonDepositView from './skeleton'

const AddDepositProviderCripto = loadable(() => import("./addDepositProviderCripto"));
const CriptoView = loadable(() => import("./main"));
 
const CriptoSupervisor = (props) => {
  const [ , { current_wallet, modelData: { deposit_providers } } ] = useCoinsendaServices();
  return (
    <>
      {!deposit_providers || Object.keys(deposit_providers).length === 0 ? (
        <SkeletonDepositView/>
      ) : current_wallet.dep_prov.length < 1 ? (
        <AddDepositProviderCripto />
      ) : (
        <CriptoView {...props}/>
      )}
    </>
  );
};



export default CriptoSupervisor;
