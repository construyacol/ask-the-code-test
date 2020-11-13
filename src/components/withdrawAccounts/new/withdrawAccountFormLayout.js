import React, { Fragment } from "react";
import loadable from "@loadable/component";
import SimpleLoader from "../../widgets/loaders";
import { payment_method } from "../../api/ui/api.json";
import BankAccountFlow from "./flows/bankAccountFlow";
import "./newAccount.css";
import "../../wallets/newWallet/newWallet.css";

const MethodView = loadable(() => import("./views/1method"));
const FinalTicket = loadable(() => import("./views/finalTicket"));
const RemittanceAccountFlow = loadable(() =>
  import("./flows/remittanceAccountFlow")
);

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
