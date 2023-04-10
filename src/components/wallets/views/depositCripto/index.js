
import loadable from "@loadable/component";
import SkeletonDepositView from './skeleton'
import { useWalletInfo } from 'hooks/useWalletInfo'

const AddDepositProviderCripto = loadable(() => import("./addDepositProviderCripto"));
const CriptoView = loadable(() => import("./main"));
 
const CriptoSupervisor = (props) => {
  const { currentWallet, modelData: { deposit_providers } } = useWalletInfo();
  return (
    <>
      {!deposit_providers || Object.keys(deposit_providers).length === 0 ? (
        <SkeletonDepositView/>
      ) : currentWallet.dep_prov.length < 1 ? (
        <AddDepositProviderCripto />
      ) : (
        <CriptoView {...props}/>
      )}
    </>
  );
};

export default CriptoSupervisor;
