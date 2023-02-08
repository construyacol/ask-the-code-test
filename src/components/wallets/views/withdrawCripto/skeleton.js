import React from "react";
import InputForm from "../../../widgets/inputs/inputForm";
// import { WithdrawForm } from "./styles";
// import ControlButton from "../../../widgets/buttons/controlButton";
import { useWalletInfo } from "../../../../hooks/useWalletInfo";
// import DepositWithdrawFiatSkeleton from '../skeleton/depositWithdrawFiatSkeleton'
import { SelectListSkeleton } from 'components/forms/widgets/selectListComponent'
import { CriptoWithdrawForm } from 'components/forms/widgets/sharedStyles'


const SkeletonWithdrawView = () => {

  const { currentWallet } = useWalletInfo();

  return (
    <>
      {
        currentWallet.currency_type === 'fiat' ?
        <SelectListSkeleton/>
        :
        <>
          <div/>
          <CriptoWithdrawForm >
            <InputForm skeleton className="withdrawCripto"/>
          </CriptoWithdrawForm>
        </>
      }
    </>
  );
};

export default SkeletonWithdrawView;
