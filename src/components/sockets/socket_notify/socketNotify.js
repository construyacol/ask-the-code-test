import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import OtherModalLayout from "../../widgets/modal/otherModalLayout";
import IconSwitch from "../../widgets/icons/iconSwitch";
import { ButtonNofity } from "../../widgets/buttons/buttons";
import { formatToCurrency } from "../../../utils/convert_currency";
import { IconClose } from "../../widgets/shared-styles";
import "./socketNotify.css";
import { createSelector } from "reselect";

const SocketNotify = (props) => {
  const [formatCurrency, setFormatCurrency] = useState(null);
  const { item_type, title } = props.socket_notify;
  let txType = `${item_type === "deposits" ? "deposito" : "retiro"}`;
  let fallBackTitle = `${
    item_type === "deposits"
      ? "Nuevo deposito aprobado"
      : item_type === "withdraws"
      ? "Nuevo retiro enviado"
      : ""
  }`;

  useEffect(() => {
    if (props.socket_notify && props.socket_notify.amount) {
      const { amount, currency } = props.socket_notify;
      formatToCurrencies(amount, currency);
    }
  }, [props.socket_notify]);

  const formatToCurrencies = async (amount, currency) => {
    let resul = await formatToCurrency(amount, currency);
    setFormatCurrency(resul.toFormat());
  };

  const closeModal = (e) => {
    const { target } = e;
    if (target && target.dataset.close_modal) {
      props.action.socket_notify(null);
      props.action.toggleOtherModal();
    }
  };

  return (
    <OtherModalLayout on_click={closeModal}>
      {/* {
        item_type === 'deposits' ?
          <OrderNotifyView
            title={`${title ? title : `Nuevo ${ui_text} aprobado.`}`}
            button_tittle={`Ver ${ui_text}`}
            item_type={item_type}
            formatCurrency={formatCurrency}
            {...props} />

          :

          item_type === 'withdraws' &&
          <OrderNotifyView
            title={`${title ? title : `Nuevo ${ui_text} enviado`}`}
            button_tittle={`Ver ${ui_text}.`}
            item_type={item_type}
            formatCurrency={formatCurrency}
            {...props} />

      } */}

      {["deposits", "withdraws"].includes(item_type) && (
        <OrderNotifyView
          title={title || fallBackTitle}
          button_tittle={`Ver ${txType}.`}
          item_type={item_type}
          formatCurrency={formatCurrency}
          {...props}
        />
      )}
    </OtherModalLayout>
  );
};

const OrderNotifyView = (props) => {
  const {
    socket_notify,
    formatCurrency,
    currencies,
    title,
    button_tittle,
  } = props;

  const {
    item_type,
    currency,
    // state
  } = props.socket_notify;

  // console.log('||||||||||||||_____________________________________________socket_notify', props)
  const buttonAction = async (wallet_id) => {
    // console.log('||||||||||||||_____________________________________________buttonAction', wallet_id)
    props.action.socket_notify(null);
    await props.action.toggleOtherModal();
    // await props.action.current_section_params({currentFilter:item_type})
    props.history.push(`/wallets/activity/${wallet_id}/${item_type}`);
  };

  // console.log('item_type', item_type)

  return (
    <LayoutSocketNotify>
      <IconClose theme="dark" size={20} />
      <div className="topSection">
        <div className="contBackTopSection">
          <div className="backTopSection animate" />
        </div>
        <div className="socketIconContainer in">
          <div className="wavExpansive in"></div>
          <IconSwitch icon={item_type} size={45} color="#11998e" />
        </div>
      </div>

      <div className="bottomSection">
        <h3 className="fuente">{title}</h3>
        <div className="depositAmount">
          <IconSwitch icon={currency.currency} size={35} />
          <p id="order_amount" className="fuente2">
            {formatCurrency}{" "}
            <span>{currencies[socket_notify.currency.currency].symbol}</span>
          </p>
        </div>
        <ButtonNofity
          buttonAction={buttonAction}
          item_id={socket_notify.account_id}
        >
          <p id="ButtonNofityText" className="fuente">
            {button_tittle}
          </p>
        </ButtonNofity>
      </div>
    </LayoutSocketNotify>
  );
};

const LayoutSocketNotify = (props) => {
  return (
    <div className="LayoutSocketNotify swing-in-bottom-bck">
      <div className="socketContent">{props.children}</div>
    </div>
  );
};

const selectCurrencies = createSelector(
  (state) => state.modelData.currencies,
  (currencies) => {
    let currency_list;
    if (currencies) {
      currencies.map((currency) => {
        return (currency_list = {
          ...currency_list,
          [currency.currency]: {
            ...currency,
          },
        });
      });
    }
    return currency_list;
  }
);

const mapStateToProps = (state) => {
  const { socket_notify } = state.ui.notifications;

  return {
    socket_notify: socket_notify && socket_notify[0],
    currencies: selectCurrencies(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    action: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SocketNotify);
