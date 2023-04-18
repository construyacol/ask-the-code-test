
import loadable from "@loadable/component";
import SkeletonDepositView from './skeleton'
import { isEmpty } from "lodash";
import { useWalletInfo } from 'hooks/useWalletInfo'

const AddDepositProviderCripto = loadable(() => import("./addDepositProviderCripto"));
const CriptoView = loadable(() => import("./main"));
 
const CriptoSupervisor = (props) => {
  const { currentWallet, modelData: { deposit_providers } } = useWalletInfo();
  return (
    <>
      {!deposit_providers || Object.keys(deposit_providers).length === 0 ? (
        <SkeletonDepositView/>
      ) : isEmpty(currentWallet.dep_prov) ? (
        <AddDepositProviderCripto />
      ) : (
        <CriptoView {...props}/>
      )}
    </>
  );
};

export default CriptoSupervisor;
