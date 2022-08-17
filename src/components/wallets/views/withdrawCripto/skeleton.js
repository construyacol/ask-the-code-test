import React from "react";
import InputForm from "../../../widgets/inputs/inputForm";
import { WithdrawForm } from "./";
import ControlButton from "../../../widgets/buttons/controlButton";
import { useWalletInfo } from "../../../../hooks/useWalletInfo";
// import DepositWithdrawFiatSkeleton from '../skeleton/depositWithdrawFiatSkeleton'
import { StageSkeleton } from 'components/forms/widgets/stageManager'


const SkeletonWithdrawView = () => {

  const { currentWallet } = useWalletInfo();

  return (
    <>
    {
      currentWallet.currency_type === 'fiat' ?
      <StageSkeleton/>
      :
      <WithdrawForm>
        <InputForm skeleton />
        <InputForm skeleton />
        <ControlButton formValidate={false} label="Enviar" />
      </WithdrawForm>
    }
    </>
  );
};

export default SkeletonWithdrawView;
