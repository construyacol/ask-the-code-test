import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FlowAnimationLayout from "../../widgets/flowAnimationLayout/flowAnimationLayout";
import ViewAmountComponent from "../views/viewAmount";
import WithdrawAccountList from "../../withdrawAccounts/views/withdraw_account_list";
import { SimpleLoader } from "../../widgets/loaders";
import WithdrawAccountForm from "../../withdrawAccounts/new/withdrawAccountForm";
import { ButtonModalBack } from "../../widgets/buttons/buttons";
import FinalTicket from "../../withdrawAccounts/new/views/finalTicket";
import {
  withdrawProvidersByType,
  matchItem,
  number_format,
  debounce,
} from "../../../utils";
import actions from "../../../actions";
import Withdraw2FaModal from "../../widgets/modal/render/withdraw2FAModal";
import withCoinsendaServices from "../../withCoinsendaServices";
import { createSelector } from "reselect";

import "./withdrawFlow.css";
import withKeyActions from "../../withKeyActions";

class WithdrawFlow extends Component {
  // Withdraw FIAT COMPONENT

  state = {
    amount: "",
    withdrawProviders: null,
    need_new_acount: null,
    show_list_accounts: false,
    finish_step: false,
    ticket: null,
    ticket_label_loader: `Creando orden de retiro`,
    color_loader: "blue",
    new_order: null,
    addNotification: false,
    min_amount: 0,
    provider_type: "bank", //Por defecto en el flujo el tipo de retiro es por transferencia bancaria, a futuro habilitaremos cash (efectivo)
    withdraw_account_list_update: [],
    twoFaToken: null,
    // step:1
  };

  componentDidMount() {
    this.props.action.CurrentForm("withdraw");
    this.init_config();
    this.props.history.push(`?form=withdraw_amount`);
  }

  componentWillUnmount() {
    this.props.history.push(window.location.pathname);
  }

  updateTimes = 0;

  componentDidUpdate(prevProps) {
    // inserto las siguientes rutas para poder hacer seguimiento al funnel desde hotjar
    // console.log('|||||||||||||||||||||||||||||||| =======> withdraw flow CONT ==> ', this.props)
    let route;
    if (
      prevProps.step === 1 &&
      this.state.show_list_accounts &&
      this.updateTimes < 1
    ) {
      route = `?form=withdraw_select_account`;
      this.updateTimes++;
      return this.props.history.push(route);
    }

    if (
      prevProps.step === 1 &&
      !this.state.show_list_accounts &&
      this.updateTimes > 0
    ) {
      route = `?form=withdraw_amount`;
      this.updateTimes--;
      this.props.history.push(route);
    }

    if (prevProps.step === this.props.step) {
      return;
    }
    // console.log('NEXT STEP ==>', this.props.step, prevProps.step)

    if (this.props.step >= 2) {
      this.updateTimes--;
      route = `?form=withdraw_order_created`;
    }

    this.props.history.push(route);
    // alert()
  }

  // componentWillReceiveProps({step}){
  //   this.setState({step})
  // }

  init_config = () => {
    const {
      currency_type,
      // country,
      withdrawProviders,
      have_withdraw_accounts,
    } = this.props;

    if (!have_withdraw_accounts) {
      this.setState({ need_new_acount: true });
    }
    let available_providers = [];

    withdrawProviders &&
      withdrawProviders.map((provider) => {
        if (
          provider.currency_type === currency_type &&
          provider.enabled
        ) {
          return available_providers.push(provider);
        }

        return false;
      });

      // console.log('||||||||||||||||||||| available_providers', available_providers)

    if (available_providers.length < 1) {
      return false;
    }

    let withdraw_account_list_update = [];
    // Calculamos los costos de retiro en función al proveedor de retiro y las cuentas de retiro disponibles
    if (
      this.state.provider_type === "bank" &&
      this.props.withdraw_account_list
    ) {
      // 1.mapear las cuentas de retiros
      // 2.matchear la cuenta de retiro contra => available_providers por medio de su provider_type ===
      // 3. Validar si el name withdraw provider es el mismo del name del withdraw account (pertenecen a la misma red de pagos) available_provider.provider.name === withdraw_account.provider_name
      // 3.1 si no pertenece a la misma red bancaria entonces buscar por withdraw_account.city.value en el modelo let plaza_type = available_provider.info_needed.city.plaza_type
      // 4.obteniendo el plaza_type agregar al withdraw_account una propiedad llamada cost = available_provider.provider.cost[plaza_type].fixed
      // con esto ya podemos validar los fondos minimos necesarios para crear la orden de retiro
      withdraw_account_list_update = this.get_cost_struct(available_providers);
    }




    this.setState({ withdraw_account_list_update });


    this.setState({
      withdrawProviders: available_providers,
      min_amount: parseInt(available_providers[0].provider.min_amount),
    });
  };

  get_cost_struct = (available_providers, withdraw_account_list) => {
    let providers_served = withdrawProvidersByType(available_providers || this.props.withdrawProviders);
    // console.log('withdraw_account_list_update', withdraw_account_list_update)
    let update_list = [];
    let w_account_list =  withdraw_account_list || this.props.withdraw_account_list;

    w_account_list && w_account_list.map((withdraw_account) => {
        if (withdraw_account.currency_type === "crypto") {
          return false;
        }
        let plaza_type;
        let provider_type = withdraw_account.provider_type;

        if (providers_served[provider_type]?.provider?.name.includes(withdraw_account.provider_name)) {
          plaza_type = "same_bank";
        }else{
          plaza_type = 'pp'
        }

        let new_withdraw_account = {
          ...withdraw_account,
          cost_struct:providers_served[provider_type].provider.costs[plaza_type],
          cost:(providers_served[provider_type].provider.costs[plaza_type] && providers_served[provider_type].provider.costs[plaza_type].fixed),
        };
        return update_list.push(new_withdraw_account);
      });

    return update_list;
  };

  new_account_and_withdraw = async (new_account) => {
    console.log('=======> new_account', new_account)

    const { withdrawProviders, form_withdraw } = this.props;

    let providers_served = await withdrawProvidersByType(withdrawProviders);

    const { provider_type } = new_account;

    const { amount } = form_withdraw;

    const { min_amount } = this.state;

    let withdraw_account_list = await this.props.coinsendaServices.fetchWithdrawAccounts();

    let withdraw_account_list_update = this.get_cost_struct(null, withdraw_account_list);
    this.setState({ withdraw_account_list_update });
    let new_account_update = await matchItem(withdraw_account_list_update, { primary: new_account.id }, "id");

    console.log('=======> new account_update', new_account_update)

    let min_amount_withdraw = parseFloat(min_amount) + parseFloat(new_account_update[0].cost);

    if (parseFloat(amount) < min_amount_withdraw) {
      setTimeout(async () => {
        this.props.action.addNotification("withdraw_accounts", { account_id: new_account.id }, 1);
        this.props.toastMessage("Nueva cuenta de retiro creada", "success");
        this.props.action.CleanForm("bank");
      }, 500);

      await this.setState({ show_list_accounts: false, need_new_acount: null });
      await this.volver(1);
      await this.props.action.isAppLoading(false);
      return this.props.toastMessage(`Minimo de retiro por esta cuenta es de: $${number_format(min_amount_withdraw)}`, "error");
    }

    await this.setState({ addNotification: true });
    await this.new_withdraw_order({
      withdraw_account: new_account.id,
      withdraw_provider: providers_served[provider_type].id,
    });
  };

  setTowFaToken = async (twoFaToken) => {
    this.setState({ twoFaToken });
    this.props.action.renderModal(null);
    const { state_data, limit, limit_supered } = this.state;
    this.new_withdraw_order(state_data, limit, limit_supered);
  };

  new_withdraw_order = async (state_data, limit, limit_supered) => {
    // validar que el limite maximo es permitido por el provider

    if (
      this.props.user.security_center.authenticator.withdraw &&
      !this.state.twoFaToken
    ) {
      this.setState({ state_data, limit, limit_supered });
      return this.props.action.renderModal(() => (
        <Withdraw2FaModal
          cancelAction={() => this.close2FaModal()}
          isWithdraw2fa
          callback={this.setTowFaToken}
        />
      ));
    }
    this.props.action.isAppLoading(true);

    await this.setState({
      finish_step: limit_supered ? false : true,
      limit_supered_component: limit_supered ? true : false,
      need_new_acount: false,
    });
    this.props.action.FlowAnimationLayoutAction("nextV", "next", "withdraw");
    // await this.props.coinsendaServices.get_withdraws(this.props.account_id);

    const { withdraw_account, withdraw_provider } = state_data;

    const { amount } = this.props.form_withdraw;

    const { account_id } = this.props;

    await this.props.action.UpdateForm("withdraw", {
      withdraw_account: withdraw_account,
      withdraw_provider: withdraw_provider,
    });
    let res = await this.props.coinsendaServices.addWithdrawOrder(
      {
        data: {
          amount,
          account_id: account_id,
          withdraw_provider_id: withdraw_provider,
          withdraw_account_id: withdraw_account,
          country: this.props.user.country,
        },
      },
      this.state.twoFaToken
    );

    if (!res) {
      this.setState({
        finish_step: false,
        limit_supered_component: false,
        need_new_acount: true,
        twoFaToken: null,
      });
      this.props.action.FlowAnimationLayoutAction(
        "backV",
        "back",
        "withdraw",
        1 
      );
      this.props.action.isAppLoading(false);
      return this.handleError("La orden no ha podido ser creada");
    }

    const { data } = res;

    this.setState({
      new_order: data,
    });

    this.props.action.isAppLoading(false);
    return this.create_order(res);
  };

  close2FaModal() {
    if (!this.state.need_new_acount) return;
    this.setState({
      need_new_acount: false,
      show_list_accounts: true,
    });
    this.props.action.isAppLoading(false);
    this.volver(1);
  }

  new_acount = async () => {
    await this.setState({
      need_new_acount: true,
      finish_step: false,
    });
    this.siguiente();
  };

  updateFormDebounced = debounce(this.props.action.UpdateForm, 100);

  updateAmountOnState = (amount) => {
    this.setState(
      {
        amount: amount,
      },
      () => {
        this.updateFormDebounced("withdraw", { amount: amount });
      }
    );
  };

  create_order = async ({ data }) => {

    this.props.action.success_sound();
    await this.props.action.ModalView("modalSuccess");

    this.setState({
      ticket: data,
    });
  };

  confirmar = async () => {
    await this.setState({
      ticket: null,
      color_loader: "white",
      ticket_label_loader: "Confirmando orden de retiro",
    });

    // return console.log('________________________________________CONFIRMAR ORDEN DE RETIRO', this.state)

    let res = await this.props.coinsendaServices.addUpdateWithdraw(
      this.state.new_order.id,
      "confirmed"
    );

    if (!res || res === 465) {
      this.setState({
        finish_step: false,
        limit_supered_component: false,
        need_new_acount: true,
      });
      this.props.action.ModalView('modalView')
      this.props.action.FlowAnimationLayoutAction(
        "backV",
        "back",
        "withdraw",
        1
      );
      this.props.action.isAppLoading(false);
      return this.handleError("La orden no ha podido ser confirmada");
    }

    const { new_order } = this.state;

    await this.props.action.toggleModal();

    this.props.action.CleanForm("deposit");
    this.props.action.CleanForm("withdraw");
    this.props.action.CleanForm("bank");

    if (this.state.addNotification) {
      setTimeout(async () => {
        this.props.action.addNotification(
          "withdraw_accounts",
          { account_id: new_order.withdraw_account_id },
          1
        );
        this.props.toastMessage("Nueva cuenta de retiro creada", "success");
        await this.setState({ addNotification: false });
      }, 2000);
    }
    setTimeout(async () => {
      await this.props.coinsendaServices.manageBalance(
        this.props.account_id,
        "reduce",
        new_order.amount
      );
    }, 1000);
  };

  handleError = (msg) => {
    return this.props.toastMessage(msg, "error");
  };

  siguiente = (event) => {
    const { step } = this.props;

    const { need_new_acount } = this.state;
    if (step === 1 && !need_new_acount) {
      return this.setState({ show_list_accounts: true });
    }
    return this.props.action.FlowAnimationLayoutAction(
      "nextV",
      "next",
      "withdraw"
    );
  };

  volver = (step) => {
    return this.props.action.FlowAnimationLayoutAction(
      "backV",
      "back",
      "withdraw",
      step
    );
  };

  backAmount = () => {
    return this.setState({ show_list_accounts: false, need_new_acount: false });
  };

  cancelWithdrawOrder = async () => {
    await this.props.action.ModalView("modalView");
    this.setState({
      ticket_label_loader: "Cancelando orden",
      ticket: null,
    });

    this.props.action.isAppLoading(true);
    await this.volver(1);
    this.props.action.isAppLoading(false);
    this.setState({
      ticket_label_loader: "Creando orden de retiro",
      show_list_accounts: true,
    });
  };

  render() {
    const { currency, available, step, idAccept, withdraw_order:{withdraw_account} } = this.props;

    // console.log('|||||||||||||| show_list_accounts: ', this.state.show_list_accounts)
    // console.log('|||||||||||||| withdrawProviders: ', this.props.withdrawProviders)


    const {
      amount,
      withdrawProviders,
      need_new_acount,
      show_list_accounts,
      finish_step,
      ticket,
      ticket_label_loader,
      color_loader,
      min_amount,
      withdraw_account_list_update,
    } = this.state;


    return (
      <section className="WFC DepositLayout">
        <FlowAnimationLayout>
          {step === 1 && !show_list_accounts && (
            <ViewAmountComponent
              currency={currency}
              mainCtaId={idAccept}
              amount={amount}
              updateAmountOnState={this.updateAmountOnState}
              operation_type="withdraw"
              available={available}
              handleSubmit={this.siguiente}
              min_amount={min_amount}
              {...this.props}
            />
          )}

          {step === 1 &&
            show_list_accounts &&
            (withdrawProviders ? (
              <div className="WA">
                <ButtonModalBack color="gray" volver={this.backAmount}>
                  {window.innerWidth > 768 && "volver"}
                </ButtonModalBack>

                <div className="DLcontain">
                  <p className="fuente DLtitle2">Elige la cuenta donde recibirás tu retiro</p>
                </div>
                <WithdrawAccountList
                  currency_type="fiat"
                  withdraw_flow={true}
                  new_withdraw_order={this.new_withdraw_order}
                  new_account_method={this.new_acount}
                  back={this.volver}
                  amount={amount}
                  withdrawProviders={withdrawProviders}
                  inherit_account_list={withdraw_account_list_update}
                />
              </div>
            ) : (
              <SimpleLoader label="Cargando" />
            ))}

          {step >= 2 && need_new_acount && !finish_step && (
            <WithdrawAccountForm
              withdraw_flow={true}
              eventName="onkeydown"
              initPrevKeyActions={() => this.keyActions()}
              withdraw_flow_action={this.new_account_and_withdraw}
              toastMessage={this.props.toastMessage}
            />
          )}

          {step >= 2 && !need_new_acount && finish_step && (
            <Fragment>
              {!ticket ? (
                <SimpleLoader
                  label={ticket_label_loader}
                  color={color_loader}
                />
              ) : ( 
                <FinalTicket 
                  finishAction={this.confirmar}
                  wAccount={withdraw_account}
                  order={ticket}
                  title={"Retiro creado exitosamente"}
                  cta_primary_label="Confirmar"
                  cta_secondary={true}
                  cta_secondary_label="Cancelar"
                  cta_secondary_action={this.cancelWithdrawOrder}
                />
              )}
            </Fragment>
          )}
        </FlowAnimationLayout>
      </section>
    );
  }
}

const selectWithdrawProvidersList = createSelector(
  [
    (state) => state.modelData.user.withdrawProviders,
    (state) => state.modelData.withdrawProviders,
  ],
  (_withdrawProviders, withdrawProviders) => {
    return _withdrawProviders
      ? _withdrawProviders.map((id_prov) => {
          return withdrawProviders[id_prov];
        })
      : [];
  }
);

const selectWithdrawAccountList = createSelector(
  [
    (state) => state.modelData.user.withdraw_accounts,
    (state) => state.modelData.withdraw_accounts,
  ],
  (_withdraw_accounts, withdraw_accounts) => {
    const withdraw_account_list = [];
    _withdraw_accounts && _withdraw_accounts.map((account_id) => {
      if (withdraw_accounts[account_id].currency_type !== "fiat" || !withdraw_accounts[account_id].visible || withdraw_accounts[account_id].state === "rejected") {
        // if (withdraw_accounts[account_id].currency_type !== "fiat" || !withdraw_accounts[account_id].visible || withdraw_accounts[account_id].state !== 'complete') {
          return false;
        }
        return withdraw_account_list.push(withdraw_accounts[account_id]);
      });

    return {
      withdraw_account_list: withdraw_account_list.length > 0 && withdraw_account_list,
      have_withdraw_accounts: withdraw_account_list.length > 0,
    };
  }
);



function mapStateToProps(state, props) {
  const { params } = props.match;

  const {
    withdraw_accounts,
    user,
    withdrawProviders,
    wallets,
    withdraws,
    balances,
  } = state.modelData;

  const current_wallet = wallets[params.account_id];

  const { withdraw_provider, withdraw_account } = state.form.form_withdraw;

  return {
    withdraw_order: {
      account_from: wallets[params.account_id],
      withdraw_account: withdraw_account && withdraw_accounts[withdraw_account],
      withdraw_provider:
        withdraw_provider && withdrawProviders[withdraw_provider],
    },
    account_id: params.account_id,
    withdraws,
    currency_type: current_wallet && current_wallet.currency_type,
    user: user,
    country: user.country,
    currency: current_wallet && current_wallet.currency.currency,
    available:
      current_wallet && balances && balances[current_wallet.id].available,
    current: state.form.current,
    step: state.form.form_withdraw.step,
    form_withdraw: state.form.form_withdraw,
    withdrawProviders: selectWithdrawProvidersList(state),
    wallets,
    ...selectWithdrawAccountList(state),
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
)(withCoinsendaServices(withKeyActions(WithdrawFlow)));
