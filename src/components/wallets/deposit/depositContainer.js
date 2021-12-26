import React, { Component } from "react";
import DepositLayout from "./depositLayout";
import { connect } from "react-redux";
// import { banks, coins } from '../../api/ui/api.json'
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import { toast } from "react-toastify";
import * as globalServices from "../../../utils";
import "./deposit.css";
import { SavePayment } from "../../widgets/toast/messages";
import { withRouter } from "react-router";
import BigNumber from "bignumber.js";
import withCoinsendaServices from "../../withCoinsendaServices";

class DepositContainer extends Component {
  state = {
    type_currency: this.props.type_currency,
    // currency:this.props.currency,
    currency:
      this.props.current_wallet && this.props.current_wallet.currency.currency,
    short_currency_name: this.props.short_currency_name,
    short_bank_name: this.props.short_bank_name,
    amount: 0,
    minAmount: null,
    deposit_way: this.props.deposit_way,
    deposit_service: this.props.deposit_service,
    service_mode: this.props.service_mode,
    itemActive: "",
    statusInput: "",
    final: false,
    finalButton: false,
    msgLoader: "",
    wallets_list: [],
    cost_id: this.props.cost_id,
    account_id: this.props.match.params && this.props.match.params.account_id,
    new_ticket: null,
    deposit_provider_list: null,
    currentDepositProvider: null,
    deposit_order: null,
  };

  componentDidMount() {
    this.props.action.CurrentForm("deposit");
    // this.serve_deposit_provider_views()
    this.props.history.push(`?form=deposit_amount`);

    // Aqui se selecciona el deposit provider actual
    const { deposit_providers } = this.props;
    // let deposit_provider = await deposit_providers.find(dep_prov => {
    //   return dep_prov.provider.name === short_bank_name || (cost_id === "en_efectivo" &&  dep_prov.provider_type === 'bank')
    // })
    const currentDepositProvider =
      deposit_providers &&
      deposit_providers[this.props.current_wallet.dep_prov[0]];
    this.setState({ currentDepositProvider });
  }

  componentWillUnmount() {
    this.props.history.push(window.location.pathname);
  }

  componentDidUpdate(prevProps) {
    // inserto las siguientes rutas para poder hacer seguimiento al funnel desde hotjar
    if (prevProps.step === this.props.step) {
      return;
    }

    let route;

    if (this.props.step === 1) {
      route = `?form=deposit_amount`;
    }

    if (this.props.step === 2) {
      route = `?form=deposit_way_to_pay`;
    }

    if (this.props.step === 3) {
      route = `?form=deposit_payment_method`;
    }

    if (this.props.step === 4) {
      route = `?form=deposit_finish`;
    }
    // console.log('||||||||||||||||||||||||||||||| componentDidUpdate =?=> ')
    this.props.history.push(route);
  }

  update_control_form = (searchMatch) => {
    //esta función valida si tenemos un nombre item escrito y si tenemos un item coin/bank seleccionado, si cumple con esto, nos habilita el call to action para seguir hacia la proxima acción
    // console.log('update_control_form SE ESTA ACTUALIZANDO: ', searchMatch)

    if (this.props.search.length > 1) {
      return this.props.action.UpdateFormControl("deposit", false);
    }

    if (this.props.search.length === 1) {
      // Valido si hay una coincidencia en la busqueda y un nombre para el item que se esta creando, doy luz verde para continuar hacia el siguiente paso del formulario
      // console.log('esto es lo que pasa puto', this.props.search)
      return this.props.action.UpdateFormControl("deposit", true);
    }

    if (this.props.step === 3) {
      if (this.state.deposit_service !== "") {
        return this.props.action.UpdateFormControl("deposit", true);
      }
    }

    if (this.props.step === 4) {
      if (this.state.service_mode !== "") {
        return this.props.action.UpdateFormControl("deposit", true);
      }
    }
  };

  update_form = () => {
    this.props.action.UpdateForm("deposit", this.state);
  };

  // PASO1, SI ES EL PRIMER DEPOSITO SELECCIONAMOS EL TIPO DE MONEDA LA CUAL DESEAMOS DEPOSITAR
  select_currency = (itemName, short_name, currency_type) => {
    this.setState({
      itemActive: itemName,
      currency: itemName,
      short_currency_name: short_name,
      type_currency: currency_type,
    });
    this.props.action.UpdateFormControl("deposit", true);
  };

  // SI SE SELECIONA CRYPTO, Y NO HAY WALLET DE ESA CUENTA, SE CREA UNA NUEVA, SINO LISTAMOS LAS WALLETS Y LA QUE ELIJA, LO ENVIAREMOS A DEPOSIT DE ESA WALLET SINO SE CONTINÚA CON EL FLUJO DEPOSITO DE FIAT, Y  SE PREESTABLECE LA CANTIDAD MINIMA DE DEPOSITO QUE SON 20.MIL COP
  primerDeposito = async () => {
    let amountw = 20000;

    // limitar cantidad de deposito limite por proveedor
    if (true) {
      console.log(this.state, this.props);
    }

    await this.setState({
      amount: amountw,
    });

    const { type_currency } = this.state;

    this.update_form(this.state);
    // this.props.history.push("/wallets/deposit/5c04f873eb9c94511fd2edfa")
    // this.props.action.toggleModal()
    // console.log('|||||||||||| PRIMER DEPOSITO', this.state.type_currency)

    let wallets = this.props.wallets;

    // 1.Consultamos si hay wallets en el estado
    if (!wallets) {
      this.setState({
        msgLoader: "Obteniendo tus billeteras",
      });

      this.props.action.isAppLoading(true);
      let res = await this.props.coinsendaServices.getWalletsByUser();
      this.props.action.isAppLoading(false);
      if (!res) {
        return this.handleError("No se han podido consultar tus Billeteras");
      }
      wallets = !res.entities.wallets ? [] : res.entities.wallets;
    }

    // 2. hay wallets disponibles sobre la moneda solicitada?
    let current_wallets = await this.props.services.matchNormalizeWallet(
      wallets,
      this.state.currency
    );
    // 2.1 Si NO EXISTEN WALLETS en esta moneda, CREAMOS la wallet y entramos a this.wallet/deposit por medio de la ruta
    if (!current_wallets || current_wallets.length < 1) {
      await this.crearWallet();

      return this.props.action.CurrentForm("deposit");
      // return alert('PERRO, no tenemos wallets todavía, ya mismo creamos una..')
    }
    // 2.2, si existe solamente una wallet entonces ingrese automaticamente al deposito de esta wallet
    if (
      current_wallets.length === 1 ||
      (current_wallets.length >= 1 && type_currency === "fiat")
    ) {
      let unica_wallet = current_wallets.pop();
      // return console.log(unica_wallet.id)
      if (this.state.type_currency !== "fiat") {
        this.props.action.toggleModal();
      }
      // this.props.action.toggleModal()
      await this.to_deposit_wallet(unica_wallet.id);
      return this.props.action.CurrentForm("deposit");
    }

    // 3 Entonces muestre las wallets, para elegir en cual hacer el deposito...

    this.setState({
      wallets_list: current_wallets,
    });
    return console.log("Eureka");
  };

  handleError = (msg) => {
    this.props.toastMessage()(msg, "error");
    this.props.action.toggleModal();
    this.props.action.CleanForm("deposit");
  };

  crearWallet = async () => {
    this.props.action.isAppLoading(true);
    this.setState({
      msgLoader: `Creando billetera ${this.state.currency}`,
    });

    const body = {
      data: {
        userId: this.props.user.id,
        name: `Mi nueva wallet ${this.state.currency}`,
        description: "description",
        country: this.props.user.settings.current_country,
        currency: {
          currency: this.state.currency,
          is_token: false,
        },
      },
    };

    const new_wallet = await this.props.coinsendaServices.createWallet(body);

    // setTimeout(()=>{
    await this.props.coinsendaServices.getWalletsByUser();

    this.props.action.isAppLoading(false);
    this.to_deposit_wallet(new_wallet.account.id);
    if (this.state.type_currency !== "fiat") {
      this.props.action.CleanForm("deposit");
    }
    let message = `¡Estas dentro de la nueva wallet ${this.state.currency}!`;
    this.props.toastMessage()(message, "success");

    // }, 1500)
  };

  to_deposit_wallet = (id_wallet) => {
    return this.props.history.push(`/wallets/deposit/${id_wallet}`);
  };

  // PASO 1, DIGITAMOS EL MONTO DE FIAT QUE DESEAMOS COMPRAR
  updateAmountOnState = async (amount) => {
    // let amountw = await this.props.services.number_format(amount)
    // verificamos que no supere el monto maximo permitido por el preveedor
    const maxDepositAmount = this.state.currentDepositProvider && this.state.currentDepositProvider.provider.max_amount;
    const decimalAmount = new BigNumber(amount);
    if (!amount || decimalAmount.isLessThan(maxDepositAmount || '1000000000')) {
      await this.setState({amount});
    }
    // this.props.action.UpdateFormControl('deposit', (!amount) ? false : (amount<20000) ? false : true)
  };

  // PASO 2, SELECCIONAMOS EL METODO DE PAGO....
  select_deposit_way = async (payload, deposit_way) => {
    await this.setState({
      cost_id: deposit_way === "cash" ? "en_efectivo" : "otros_medios",
      deposit_way: deposit_way,
    });

    this.props.action.UpdateFormControl("deposit", true);
    this.update_form();
    // await this.serve_deposit_provider_views(deposit_way === 'cash' ? 'en_efectivo' : 'otros_medios')
  };

  update_service_mode = async (value, short) => {
    await this.setState({
      service_mode: short,
    });
    await this.update_form();
    this.props.action.UpdateFormControl("deposit", true);
  };

  // PASO 3, SELECCIONAMOS LA ENTIDAD BANCARIA POR LA CUAL PROCESAREMOS EL DEPOSITO....
  actualizarEstado = async (event, ppp) => {
    const { short_name, value } = event.target;
    this.update_local_state(value, short_name);
  };

  update_local_state = async (value, short_name) => {
    // console.log('Entidad bancaria',value, short_name)
    await this.setState({
      deposit_service: value,
      short_bank_name: short_name,
    });

    this.update_form();
    this.update_control_form();
  };

  siguiente = (event) => {
    this.props.action.UpdateFormControl("deposit", false);
    this.update_form();
    this.props.action.IncreaseStep(this.props.current);
    // if(this.state.deposit_way === 'cash'){
    //     return this.props.action.IncreaseStep(this.props.current)
    // }

    if (!this.state.deposit_provider_list) {
      // return this.serve_deposit_provider_views()
    }
  };

  componentWillReceiveProps(props) {
    const { match } = props;

    this.setState({
      account_id: match.params && match.params.account_id,
    });
  }

  finalizar = async () => {
    if (this.state.final) {
      this.props.action.CurrentForm("wallets");
      // programamos la animación del nuevo deposito creado
      this.props.action.add_new_transaction_animation();
      this.props.action.CleanForm("deposit");
      // console.log('||||||||||||||||||| FINISH HIM', this.state)
      return this.props.history.push(
        `/wallets/activity/${this.state.account_id}/deposits`
      );
    }

    this.props.history.push(`?form=deposit_close`);

    this.setState({
      final: true,
      finalButton: true,
    });

    setTimeout(() => {
      this.setState({
        finalButton: false,
      });
    }, 7000);
  };

  create_deposit_order = async () => {
    const { current_wallet, user, deposit_providers } = this.props;

    const { amount, cost_id, deposit_service, service_mode } = this.state;

    const deposit_provider =
      deposit_providers && deposit_providers[current_wallet.dep_prov[0]];

    this.siguiente();
    this.props.action.isAppLoading(true);

    if (!this.props.deposits) {
      await this.props.coinsendaServices.get_deposits(
        this.props.current_wallet.id
      );
    }

    let response = await this.props.coinsendaServices.createDeposit(
      current_wallet && current_wallet.currency,
      amount,
      current_wallet.id,
      cost_id,
      deposit_service,
      user,
      service_mode,
      deposit_provider.id
    );

    if (!response) {
      this.props.action.isAppLoading(false);
      this.props.action.ReduceStep(this.props.current);
      return this.props.toastMessage()(
        "No se ha podido crear la orden de depósito",
        "error"
      );
    }

    let new_deposit_model = {
      id: response.id,
      unique_id: response.id,
      type_order: "deposit",
      ...response,
    };

    if (!current_wallet.count) {
      await this.props.action.update_item_state(
        { [current_wallet.id]: { ...current_wallet, count: 99 } },
        "wallets"
      );
    }

    // await this.props.action.get_deposit_list(user)
    // await this.props.action.normalize_new_item(user, deposits, new_deposit_model, 'deposits')
    // await this.props.action.update_activity_account(this.props.current_wallet.id, 'deposits')

    // await this.props.action.update_pending_activity()
    // console.log('=> deposits UPDATE', this.props.deposits)
    // setTimeout(async()=>{
    //   await this.props.services.serve_activity_list(action.get_deposit_list, user, current_wallet, 'deposits')
    //   await this.props.action.update_activity_account(this.props.current_wallet.id, 'deposits')
    //   await this.props.action.update_pending_activity()
    // }, 5000)

    // return console.log('DEPOSIT INFO RESPONSE', response, new_deposit_model)
    let new_deposit = [
      {
        ui_name: "Id depósito:",
        value: new_deposit_model.id,
        id: 1,
      },
      {
        ui_name: "Cantidad depósito:",
        value: `$ ${this.props.services.number_format(
          new_deposit_model.amount
        )} ${new_deposit_model.currency.currency}`,
        icon: new_deposit_model.currency.currency,
        id: 2,
      },
      {
        ui_name: "Costo depósito:",
        value: `$ ${this.props.services.number_format(
          new_deposit_model.cost
        )} ${new_deposit_model.currency.currency}`,
        id: 3,
      },
      {
        ui_name: "Total depósito:",
        value: `$ ${this.props.services.number_format(
          new_deposit_model.amount_neto
        )} ${new_deposit_model.currency.currency}`,
        id: 4,
      },
      {
        ui_name: "Debes depositar a:",
        value: deposit_provider.provider.ui_name,
        icon: deposit_provider.provider.name,
        id: 5,
      },
      {
        ui_name: deposit_provider.provider.account.account_id.ui_name,
        value: deposit_provider.provider.account.account_id.account_id,
        id: 6,
      },
      {
        ui_name: deposit_provider.provider.account.type.ui_name,
        value: deposit_provider.provider.account.type.type,
        id: 7,
      },
      {
        ui_name: deposit_provider.provider.account.bussines_name.ui_name,
        value: deposit_provider.provider.account.bussines_name.bussines_name,
        id: 8,
      },
    ];

    // setTimeout(()=>{
    this.props.action.isAppLoading(false);
    // si la acción se lleva satisfactoriamente actualizamos el fondo del modal a un color verde
    this.props.action.ModalView("modalSuccess");
    this.props.action.success_sound();

    this.setState({
      new_ticket: new_deposit,
      deposit_order: response,
    });
    return this.props.action.current_section_params({
      currentFilter: "deposits",
    });
    // }, 1500)
  };

  to_deposit_crypto = (wallet, history) => {
    this.props.action.toggleModal();
    return history.push(`wallets/deposit/${wallet.id}`);
  };

  // handleKeyPress = async(e) => {
  //   let message = await this.props.services.handleKeyPress(e, this.props.current)
  //   return this.setState({statusInput:message})
  // }

  guardarMetodo = () => {
    toast("", {
      position: toast.POSITION.BOTTOM_RIGHT,
      pauseOnFocusLoss: false,
      draggablePercent: 60,
      className: "putito",
      bodyClassName: "putitoText",
      progressClassName: "putitoProgress",
      toastId: 2,
      autoClose: false,
    });

    toast.update(2, {
      render: <SavePayment loader={true} label="Guardando Medio de pago" />,
      autoClose: false,
    });

    setTimeout(() => {
      toast.update(2, {
        render: <SavePayment loader={false} label="Medio de pago Guardado" />,
        autoClose: 1500,
      });
    }, 3000);
  };

  // serve_deposit_provider_views = async dep_provs =>{
  //   // @param dep_prov
  //   // otros_medios
  //   // en_efectivo
  //   const{
  //     deposit_providers
  //   } = this.props
  //   // console.log('||||===> deposit_providers', deposit_providers)
  //   let deposit_provider_list = []
  //
  //   await deposit_providers.map(async dep_prov => {
  //     if(dep_prov.currency_type !== 'fiat'){return false}
  //     // console.log('serve_deposit_provider_views', dep_prov)
  //     let new_item = {
  //           code:dep_prov.provider.name,
  //           id:dep_prov.id,
  //           type:'bank',
  //           name:dep_prov.provider.ui_name,
  //           selection:false,
  //           min_amount:dep_prov.provider.min_amount
  //         }
  //       // console.log('dep_prov', dep_prov)
  //       await this.setState({minAmount:dep_prov.provider.min_amount})
  //       deposit_provider_list.push(new_item)
  //   })
  //
  //   // console.log('===============> deposit_provider_list', deposit_provider_list)
  //
  //   return this.setState({deposit_provider_list:deposit_provider_list.length<1 ? null : deposit_provider_list})
  //
  // }

  render() {
    // console.log('::: __PROPIEDADES_DEPOSITO__ ::', this.props.user)
    // console.log('::: __ESTADO_DEPOSITO__ ::', this.state)

    const { buttonActive, coins } = this.props;

    console.log("::: Deposit Container ::", this.props);

    return (
      <DepositLayout
        buttonActive={buttonActive}
        select_currency={this.select_currency}
        siguiente={this.siguiente}
        primerDeposito={this.primerDeposito}
        updateAmountOnState={this.updateAmountOnState}
        select_deposit_way={this.select_deposit_way}
        actualizarEstado={this.actualizarEstado}
        update_control_form={this.update_control_form}
        update_service_mode={this.update_service_mode}
        create_deposit_order={this.create_deposit_order}
        finalizar={this.finalizar}
        update_local_state={this.update_local_state}
        // handleKeyPress={this.handleKeyPress}
        guardarMetodo={this.guardarMetodo}
        deposit={this.to_deposit_crypto}
        coins={coins}
        {...this.state}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state, props) {
  // console.log('::: __ESTADO_DEPOSITO__ ::', state)
  // const { firstDeposit } = props

  const {
    short_bank_name,
    service_mode,
    deposit_way,
    step,
    short_currency_name,
    type_currency,
    deposit_service,
    cost_id,
  } = state.form.form_deposit;

  // const {
  //   short_name
  // } = state.ui.current_section.params

  const { localCurrency, currency } = state.modelData.pairs;
  // console.log('::: __ESTADO_DEPOSITO__ ::', state.ui.current_section.params.current_wallet)

  const {
    user,
    deposit_providers,
    wallets,
    pairs,
    // deposits,
    currencies,
  } = state.modelData;

  // let deposit_providers_list = []
  // user.deposit_providers.map(provider_id => {
  //   if (deposit_providers[provider_id].currency_type !== 'fiat') { return false }
  //   return deposit_providers_list.push(deposit_providers[provider_id])
  // })

  const { account_id } = props.match.params;

  let current_wallet = wallets[account_id];
  // console.log('_____________________DEPOSIT PROVIDER ITEM ITERATOR', props, deposit_providers_list)
  // console.log('_____________________DEPOSIT PROVIDER ITEM ITERATOR', props)

  return {
    buttonActive: state.form.form_control_deposit,
    step: step,
    current: state.form.current,
    short_currency_name: short_currency_name
      ? short_currency_name
      : localCurrency,
    short_bank_name: short_bank_name,
    currency,
    deposit_service: deposit_service,
    type_currency: type_currency,
    cost_id: cost_id,
    loader: state.isLoading.loader,
    search: state.form.search_deposit,
    deposit_way: deposit_way,
    service_mode: service_mode,
    services: globalServices,
    redux_route: state.ui.menu_item_active,
    wallets: wallets,
    user: user,
    localCurrency: pairs.localCurrency,
    current_wallet,
    deposits:
      state.storage.activity_for_account[account_id] &&
      state.storage.activity_for_account[account_id].deposits,
    coins: currencies,
    // deposit_providers: deposit_providers_list
    deposit_providers,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCoinsendaServices(withRouter(DepositContainer)));
