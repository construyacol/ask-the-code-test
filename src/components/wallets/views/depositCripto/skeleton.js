
import { useWalletInfo } from "hooks/useWalletInfo";
import { checkIfFiat } from 'core/config/currencies';
import { SelectListSkeleton } from 'components/forms/widgets/selectListComponent'
import {
    ContAddress,
    DepositForm
  } from './styles'

const SkeletonDepositView = () => {
    const { currentWallet } = useWalletInfo();
    return (
      <>
        {
          !checkIfFiat(currentWallet?.currency) ?
          <>
            <div></div>
            <DepositForm className="skeleton">
              <ContAddress className="contAddress">
                <p id="soloAd2" className="fuente title soloAd2"></p>
                <p className="fuente soloAd"></p>
                <div className="qrContainer">{/* <QrProtector visible/> */}</div>
                <p className="fuente title dirDep"></p>
                <p className="verifyAddress"></p>
              </ContAddress>
            </DepositForm>
          </>
            :
            <SelectListSkeleton/>
        }
      </> 
    );
  };

  export default SkeletonDepositView