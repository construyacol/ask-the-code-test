import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import ActiveItem from "../items/active_item";
import LimitTermometer from "../limitTermometer/limitTermometer";
import { number_format, mensaje } from "../../../utils";
import { InputKeyActionHandler } from "../accountList/styles";
import { useItemsInteractions } from "../../../hooks/useNavigationKeyActions";

import "./account_item.css";

const IconSwitch = loadable(() => import("../icons/iconSwitch"));

function AccountItemList(props) {

  const [amountCharge] = useState(0);
  const [preferencialAcc, setPreferencialAcc] = useState(null);

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const init = () => {
    const { preferential_accounts, account } = props;

    if (!preferential_accounts) {
      return false;
    }

    let matches = preferential_accounts.find((pa) => {
      return pa === account.id;
    });
    setPreferencialAcc(matches);
  };

  const createOrder = () => {
    const { account, amount } = props;

    const { provider_max_amount } = account;

    let limit = (amount * 100) / provider_max_amount;
    let limit_supered = (amount * 100) / provider_max_amount > 100;
    let state_data = {
      withdraw_provider: account.withdraw_provider,
      withdraw_account: account.id,
      orders:account?.orders
    };

    props.new_withdraw_order(state_data, limit, limit_supered);
  };

  const showRequireActionMessage = (amountValidation) => {
    return mensaje(`${amountValidation === 'amount_exceeds_limits' ? 'Límite de retiro superado' : 'Fondos insuficientes'}`, "error");
  };

  const { account, addElement, action, amount } = props;

  const handleClick = action ? action : createOrder;

  // console.log('|||||||||||||||| AccountItemList ==> ', props, props.account)
  // debugger

  const [isSelected] = useItemsInteractions(
    {...props, uniqid: props.account && props.account.id},
    { suprKeyAction: () => false, enterKeyAction: handleClick },
    false
  );

  let currency_type = props.account && props.account.currency_type;

  const atributos = {
    icon: addElement ? "add_account" : account && account.bank_name.value,
    size: 50,
    color: "gray",
    // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
    // viewBox:{`${viewBox ? viewBox : '0 0 512 512' }`},
    // clases:"marginLef"
  };

  let preferential_account = !addElement
    ? preferencialAcc === account.id
      ? "preferential"
      : false
    : false;

  let withdraw_amount = parseFloat(amount);
  let withdraw_min_amount;
  let withdraw_max_amount = parseFloat(account?.provider_max_amount);


  if (account && account.cost && account.provider_min_amount) {
    withdraw_min_amount = parseFloat(account.cost) + parseFloat(account.provider_min_amount);
  }

  let need_more_amount = withdraw_amount < withdraw_min_amount ? "need_more" : 
                         withdraw_amount > withdraw_max_amount ? "amount_exceeds_limits" : "satisfy";

  let classNameStyle = ["need_more", "amount_exceeds_limits"].includes(need_more_amount) ? 'need_more' : need_more_amount

  return (
    <div
      onClick={
        ["need_more", "amount_exceeds_limits"].includes(need_more_amount)
          ? () => showRequireActionMessage(need_more_amount)
          : handleClick
      }
      className={`AccountItemList ${
        isSelected && "item-selected"
      } ${preferential_account} ${
        addElement ? "addElement" : "noAddElement"
      } ${classNameStyle}`}
    >
      <div className={`backgroundAccount ${classNameStyle}`}>
        <InputKeyActionHandler
          aria-label="itemFromList"
          name="itemFromList"
          autoComplete="off"
          id={props.focusedId}
        />
      </div>

      <div
        className={`limitComp ${classNameStyle}`}
        style={{ display: addElement ? "none" : "block" }}
      >
        <LimitTermometer
          amount={amountCharge}
          max_amount={7}
          limit={addElement ? null : account.percent}
          orders={addElement ? null : account.orders}
        />
      </div>

      <div className="contLogoAIL">
        <div
          className={`logoAIL ${
            addElement ? "addElement" : "noAddElement"
          } ${classNameStyle}`}
        >
          <div
            className={`backLogoAil ${currency_type} ${classNameStyle}`}
          ></div>
          <IconSwitch {...atributos} />
        </div>
      </div>

      {!addElement ? (
        <>
          <div className="infoAIL">
            <div
              className={`infoAILItem ${preferential_account} ${classNameStyle}`}
            >
              {preferential_account && (
                <IconSwitch
                  icon={preferential_account && preferential_account}
                  size={18}
                  // color="#38ef7d"
                />
              )}
              <p
                className={`infoAILItem name ${preferential_account} ${classNameStyle}`}
              >
                {account.bank_name.ui_name}
                {account.cost ? (
                  <span className={`costStyle fuente2  ${classNameStyle}`}>
                    | ${number_format(account.cost)}
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>

            <p className={`infoAILItem account_type ${classNameStyle}`}>
              {
                need_more_amount === "need_more"
                ? "Fondos insuficientes" : 
                need_more_amount === 'amount_exceeds_limits' 
                ? "Los fondos exceden el límite de retiro"
                : account.account_type.ui_name
                }
            </p>

            <div className="AILAnumber">
              <IconSwitch icon="root" size={16} color="#5999f1" />
              <span
                className={`infoAILItem account_number fuente2 ${classNameStyle}`}
              >
                {
                  need_more_amount === "need_more"
                  ? `Cantidad minima de retiro: $${number_format(withdraw_min_amount)}` :
                  need_more_amount === "amount_exceeds_limits"
                  ? `Cantidad máxima de retiro: $${number_format(withdraw_max_amount)}`
                  : `No.: ${account.account_number.value}`}
              </span>
            </div>
          </div>

          <div className={`optionsALI ${preferencialAcc} ${classNameStyle}`}>
            {/* <p style={{color:account.inscribed ? 'green' : 'red'}}>{account.inscribed ? 'Inscrita' : 'NoInscrita'}</p> */}
            {/* <p style={{color:account.visible ? 'green' : 'red'}}>{account.visible ? 'Visible' : 'InVisible'}</p> */}
            {/* <p>{account.limit ? 'Limite Alcanzado' : 'soportado'} {account.provider_max_amount}</p> */}

            <div className="controlDespegable">
              <div className={`forroDesp ${classNameStyle}`}>
                <div className="contDesp">
                  <IconSwitch
                    icon="arrow_right"
                    size={25}
                    color={`${
                      need_more_amount === "need_more" ? "#d42215" : "#38ef7d"
                    }`}
                  />
                </div>
              </div>
              <div className="contActiveItem">
                <ActiveItem
                  Anim2={true}
                  color={`${
                    classNameStyle === "need_more" ? "red" : "green"
                  }`}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="AILadd fuente">Añade una nueva cuenta de retiro</p>
          <div className="poisonEve">
            <IconSwitch icon="withdraw2" size={60} color="gray" />
          </div>
        </>
      )}
    </div>
  );
}

export default AccountItemList;
