import React, { useEffect, useState } from "react";
import NewWalletLayout from "./newWalletLayout";
import { connect } from "react-redux";
// import { updateFormControl, FormWallet } from '../../../actions'
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import { matchItem } from "../../../utils";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import useToastMessage from "../../../hooks/useToastMessage";

const NewWallet = (props) => { 
  const [name, setName] = useState();
  const [currency, setCurrency] = useState(
    props.search.length && props.search[0].currency
  );
  const [address] = useState();
  const [short_currency_name, setShortCurrencyName] = useState();
  const [coinsendaServices] = useCoinsendaServices();
  const [toastMessage] = useToastMessage();

  const update_control_form = (searchMatch) => {
    // if (!searchMatch || props.search.length > 1) {
    //   props.action.UpdateFormControl('wallet', false)
    // }
    // if (name !== "" && props.search.length === 1) {
    //   props.action.UpdateFormControl('wallet', true)
    // }
  };

  const clearCurrency = () => {
    setCurrency(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.action.isAppLoading(true);
    siguiente();
    actualizarEstado(event);
    crearWallet();
  };

  const crearWallet = async () => {
    // simulación Endpoint Crear wallet
    const { user, currencies } = props;

    let get_currency = await matchItem(
      currencies,
      { primary: currency },
      "currency"
    );

    const body = {
      data: {
        name: name,
        description: "description",
        country: user && user.country,
        enabled: true,
        currency: {
          currency: get_currency[0].currency,
          is_token: get_currency[0].is_token,
        },
      },
    };

    const wallets = await coinsendaServices.createWallet(body);

    if (!wallets) {
      return errorHandle("Error al crear la billetera...");
    }
    await coinsendaServices.getWalletsByUser();
    const { account } = wallets;

    const dep_prov = await coinsendaServices.createAndInsertDepositProvider(
      account
    );

    if (!dep_prov) {
      return errorHandle(
        "Error al crear el proveedor de deposito de la billetera..."
      );
    }

    // si la acción se lleva satisfactoriamente actualizamos el fondo del modal a un color verde
    let msg = `Nueva wallet ${account.currency.currency} creada!`;
    toastMessage(msg, "success");

    // await props.action.add_item_state('wallets', { ...account, visible: true })
    // await props.action.get_account_balances(props.user)
    // return console.log('=================> CREATE WALLET CURRENCIE=>', wallets)

    props.action.isAppLoading(false);
    props.action.success_sound();
    await props.action.toggleModal();
    await props.action.CleanForm("wallet");

    return props.history.push(`/wallets/deposit/${account.id}`);
  };

  const errorHandle = (msg) => {
    props.action.ReduceStep("wallets");
    props.action.isAppLoading(false);
    return toastMessage(
      msg ? msg : "Ups, al parecer esto no podrá ser...",
      "error"
    );
  };

  const actualizarEstado = async (event) => {
    if (event.target.short_name) {
      await setShortCurrencyName(event.target.short_name);
    }
    const names = event.target.name;
    const value = event.target.value;
    // update_control_form(value)
    // update_form()
    switch (names) {
      case "name":
        return setName(value);
      case "currency":
        return setCurrency(value);
      default:
    }
  };

  const siguiente = () => {
    return props.action.IncreaseStep(props.current);
  };

  const finalizar = (event) => {
    // reiniciamos el estado del formulario(./reducers/form)
    props.action.toggleModal();
    props.action.CleanForm("wallet");
  };

  useEffect(() => {
    return () => props.action.CurrentForm("wallets");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let states = {
    name,
    currency,
    address,
    short_currency_name,
  };

  return (
    <NewWalletLayout
      clearCurrency={clearCurrency}
      actualizarEstado={actualizarEstado}
      handleSubmit={handleSubmit}
      update_control_form={update_control_form}
      buttonActive={props.buttonActive}
      loader={props.loader}
      finalizar={finalizar}
      step={props.step}
      {...states}
      {...props}
    />
  );
};

function mapStateToProps(state, props) {
  const user = state.modelData.user;

  return {
    search: state.form.search_coin,
    form_wallet: state.form.form_wallet,
    buttonActive: state.form.form_control_wallet,
    loader: state.isLoading.loader,
    step: state.form.form_wallet.step,
    current: state.form.current,
    user,
    state: state.modelData,
    currencies: state.modelData.currencies,
    wallets: state.modelData.wallets,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWallet);
