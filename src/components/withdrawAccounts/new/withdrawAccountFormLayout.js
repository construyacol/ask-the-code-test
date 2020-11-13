import React, { Fragment } from "react";
import "./newAccount.css";
// import bank from '../../../assets/bank.png'
import SimpleLoader from "../../widgets/loaders";
import MethodView from "./views/1method";
import { payment_method } from "../../api/ui/api.json";
import BankAccountFlow from "./flows/bankAccountFlow";
import RemittanceAccountFlow from "./flows/remittanceAccountFlow";
import FinalTicket from "./views/finalTicket";

const WithdrawAccountFormLayout = (props) => {
  const {
    siguiente,
    step,
    select_withdraw_way,
    withdraw_way,
    ticket,
    finalizar,
    eventName,
  } = props;

  // console.log

  return (
    <div className="containerFormWallet">
      {step === 1 && (
        <Fragment>
          <MethodView
            title="En esta cuenta deseas"
            subtitle="efectuar los retiros por:"
            items={payment_method}
            select_method={select_withdraw_way}
            item_active={withdraw_way}
            siguiente={siguiente}
            withdraw={true}
          />
        </Fragment>
      )}

      {step >= 2 && withdraw_way === "bankaccount" && (
        <BankAccountFlow eventName={eventName} {...props} />
      )}

      {step >= 2 && withdraw_way === "cash" && (
        <RemittanceAccountFlow {...props} />
      )}

      {step === 7 && (
        <Fragment>
          {!ticket ? (
            <SimpleLoader label={`Creando Cuenta de retiro`} />
          ) : (
            <FinalTicket
              finishAction={finalizar}
              ticket={ticket}
              ticket_type="withdraw_form"
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default WithdrawAccountFormLayout;
