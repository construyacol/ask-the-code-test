import React, { Component } from "react";
import WithdrawAccountFormLayout from "./withdrawAccountFormLayout";
import { connect } from "react-redux";
// import { updateFormControl, FormWallet } from '../../../actions'
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import { withRouter } from "react-router";
import withCoinsendaServices from "../../withCoinsendaServices";
import { createSelector } from "reselect";
import { UI_NAMES } from '../../../const/uiNames'
import { getIdentityState } from './../../../utils'

class WithdrawAccountForm extends Component {

  state = {
    name: this.props.user.name,
    surname: this.props.user.surname,
    bank_name: this.props.form_bank.bank_name,
    account_type: this.props.form_bank.account_type,
    account_number: this.props.form_bank.account_number,
    short_name: this.props.form_bank.short_name,
    id_type: null,
    statusInput: "",
    withdraw_way: "bankaccount",
    provider_type: "", 
    id_number: "",
    city: "medellin",
    // email: this.props.user.email, 
    currency: null,
    ticket: null,
    idTypes:null
  };

  update_control_form = (searchMatch) => {
    //esta función valida si tenemos un nombre item escrito y si tenemos un item coin/bank seleccionado, si cumple con esto, nos habilita el call to action para seguir hacia la proxima acción
    // console.log('update_control_form SE ESTA ACTUALIZANDO: ', searchMatch)

    if (!searchMatch || this.props.search.length > 1) {
      this.props.action.UpdateFormControl("bank", false);
    }

    switch (this.props.step) {
      case 3:
        if (this.props.search.length === 1) {
          this.props.action.UpdateFormControl("bank", true);
        }
        break;

      case 5:
        if (
          this.state.account_type !== "" &&
          this.state.account_number !== ""
        ) {
          this.props.action.UpdateFormControl("bank", true);
        }
        break;
      default:
        console.log("");
    }
  };

  // this.props.action.UpdateForm('deposit', this.state)

  select_withdraw_way = async (payload, withdraw_way) => {
    await this.setState({
      withdraw_way: withdraw_way,
      provider_type: withdraw_way === "bankaccount" ? "bank" : "",
    });

    // this.props.action.UpdateFormControl('deposit', true)
    this.update_form();
  };

  handleKeyPress = (e) => {
    var keynum = window.event ? window.event.keyCode : e.which;
    // if ((keynum == 8) || (keynum == 46) || (keynum == 45) || (keynum == 44) ){
    if (keynum < 48 || keynum > 57) {
      this.setState({ statusInput: "Solo se aceptan números en este campo" });
      return true;
    }

    this.setState({ statusInput: "" });
    return /\d/.test(String.fromCharCode(keynum));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.actualizarEstado(event);

    await this.siguiente();
    // if(this.props.step === 7){
    //   this.crearCuenta()
    // }
  };

  final_step_create_account = async (event) => {
    await this.handleSubmit(event);
    // if(this.props.withdraw_flow){
    //   return this.props.withdraw_flow_action()
    // }
    this.crearCuenta();
  };

  crearCuenta = async () => {
    // simulación Endpoint Crear wallet
    const { withdraw_accounts } = this.props
    this.props.action.isAppLoading(true);
    let res
    let payload = this.state

    if(withdraw_accounts){
      // validate if withdraw account already exist 
      const result = Object.values(withdraw_accounts).filter(WAccount => WAccount.info.bank_name === this.state.bank_name && WAccount.info.account_number === this.state.account_number)
      if(result.length){
        this.props.action.ReduceStep(this.props.current, 2);
        this.props.toastMessage("La cuenta de retiro ya existe", "error")
        return this.props.action.isAppLoading(false)
      }
    }

    if(this.state.bank_name === 'efecty'){
      const { user } = this.props
      payload = {
        ...payload,
        info_needed:{
          id_number:user?.id_number,
          id_type:user?.id_type,
          name:user?.name,
          surname:user?.surname,
          phone:user?.phone,
          label:"Efecty"
        },
        provider_type:"efecty_network"
      }
    }

    res = await this.props.coinsendaServices.addNewWithdrawAccount(payload);

    if (!res) {
      this.props.action.ReduceStep(this.props.current, 2);
      this.props.toastMessage("No es posible crear la cuenta ahora.", "error");
      this.props.action.isAppLoading(false);
      this.cleanSearch()
      return 
    }

    await this.props.coinsendaServices.fetchWithdrawAccounts();

    if (this.props.withdraw_flow) {
      return this.props.withdraw_flow_action(res);
    }

    await this.setState({
      ticket: res,
    });

    // setTimeout(()=>{
    this.props.action.success_sound();
    this.update_form();
    this.props.action.isAppLoading(false);
    this.props.action.ModalView("modalSuccess");
    // }, 1500)
  };

  actualizarEstado = async (event) => {
    event.persist && event.persist();
    
    if(event?.target?.name === 'id_type'){
      let idType = event?.target?.value
      let identity = idType && this.state?.idTypes[idType]
      if(identity && (identity?.value !== 'newIdentity' && getIdentityState(identity) !== 'accepted')){
        return alert('La identidad seleccionada está en proceso de verificación, este proceso puede tardar hasta 72 horas hábiles.')
      }
    }

    if (event.target && event.target.short_name) {
      this.setState({ short_name: event.target.short_name });
    }

    const name = event.target.name;
    let value = event.target.value;
    

    window.requestAnimationFrame(() => {
      let truncateString = false;
      let maxLength = 50;
      if (name && name === "id_number") {
        truncateString = true;
        if (this.state.id_type === "pasaporte") {
          if (value && !/^[a-zA-Z0-9]{1,20}$/g.test(value)) return;
        } else if (this.state.id_type === "nit") {
          maxLength = 11;
          value = value.replace(/(\d{9})(\d{1})/, "$1-$2");
        } else {
          if (value && !/^[0-9]{1,12}$/g.test(value)) return;
        }
      }

      if (name && name === "account_number") {
        value = value.replace(/[^0-9]/g, "");
        truncateString = true;
        maxLength = 20;
      }

      if (this.state.short_name === 'nequi') {
        maxLength = 10
      }

      if(this.state.bank_name === 'bancolombia'){
        maxLength = 11
      }

      if (truncateString && value.length > maxLength) {
        value = value.slice(0, maxLength);
      }

      if (name) {
        this.setState({ [name]: value });
      }

      // optimize, the actions below make app slow
      this.update_control_form(value);
      this.update_form();
    });
    
    
  };

  update_form = () => {
    // Acualizamos el estado del formulario en redux
    this.props.action.UpdateForm("bank", this.state);
  };

  siguiente = async () => { 
    // this.props.action.UpdateFormControl('bank',false)
    // this.update_form(this.state)
    if(this.state.bank_name === 'efecty'){
      // this.props.action.IncreaseStep(this.props.current);
      // this.props.action.IncreaseStep(this.props.current);
      // this.props.action.IncreaseStep(this.props.current);
      // return this.crearCuenta();
    }
    if (this.props.step === 1) {
      await this.cleanSearch();
    }
    return this.props.action.IncreaseStep(this.props.current);
  };

  finalizar = (event) => {
    this.props.action.CleanForm("bank");
    this.props.action.CleanForm("withdraw");
    // this.props.action.toggleModal()
  };

  cleanSearch = () => {
    this.setState({ 
      bank_name: "",
    });
    this.props.action.UpdateFormControl("bank", false);
    this.props.action.cleanSearch("bank");
  };

  // clearState = (e) => {
  //   if(e?.target?.id === 'modal-backstep-button' && this.state.bank_name === 'efecty'){
  //     alert()
  //     // this.setState({bank_name:""})
  //     // this.update_form()
  //     this.props.action.CleanForm("bank");
  //     this.props.action.CleanForm("withdraw");
  // }
  // }

  // componentWillUnmount() {
  //   document.removeEventListener("click", this.clearState);
  // }

  async getIdTypeList() {

    const { user:{ identities } } = this.props

    if(!identities?.length)return ; 

    let userIdentities = {}

    identities.forEach(userIdentity => {
      userIdentities = {
        ...userIdentities,
        [userIdentity?.document_info?.id_number]:{
          ...userIdentity,
            ui_name:`${UI_NAMES?.documents[userIdentity?.id_type]} - ${userIdentity?.document_info?.id_number}`,
            enabled:true,
            value:userIdentity?.document_info?.id_number,
        }
      }
    })

    userIdentities = {
      ...userIdentities,
      newIdentity:{
        ui_name:"Otro documento",
        enabled:false,
        value:"newIdentity"
      }
    }

   return this.setState({ idTypes:userIdentities });
    
  }

  componentDidMount() {
    this.getIdTypeList()
    // document.addEventListener('click', this.clearState)

    setTimeout(() => {
      this.props.history.push(`?form=wa_terms`);
    }, 100);

    const { withdraw_flow } = this.props;

    if (withdraw_flow) {
      return this.props.action.CurrentForm("withdraw");
    }

    this.props.action.CurrentForm("bank");
  }

  componentDidUpdate(prevProps) {

    // inserto las siguientes rutas para poder hacer seguimiento al funnel desde hotjar
    
    if(prevProps?.user?.identities !== this.props?.user?.identities){
      this.getIdTypeList()
    }

    if (prevProps.step === this.props.step) {
      return;
    }
    // console.log('||||||||||||||||||| STEP WITHDRAW ACCOUNT FORM ==> ', prevProps.step, this.props.step, this.props)

    let route;

    if (this.props.step === 2) {
      route = `?form=wa_terms`;
    }

    if (this.props.step === 3) {
      route = `?form=wa_choose_bank`;
    }

    if (this.props.step === 4) {
      route = `?form=wa_enter_bank_details`;
    }

    if (this.props.step === 5) {
      route = `?form=wa_id_type`;
    }

    if (this.props.step === 6) {
      route = `?form=wa_opening_city`;
    }

    if (this.props.step === 7) {
      route = `?form=wa_success`;
    }
    // console.log('||||||||||||||||||||||||||||||| componentDidUpdate =?=> ')
    setTimeout(() => {
      this.props.history.push(route);
    }, 100);
    // alert()
  }

  render() {

    const {
      step,
      search,
      withdraw_flow,
      withdraw_flow_action,
      eventName = "onkeyup",
    } = this.props;

    // console.log('--- idTypes ==> ', this.state.idTypes)

    return (
      <WithdrawAccountFormLayout
        withdraw_flow={withdraw_flow}
        withdraw_flow_action={withdraw_flow_action}
        statusInput={this.state.statusInput}
        handleKeyPress={this.handleKeyPress}
        crearCuenta={this.crearCuenta}
        siguiente={this.siguiente}
        actualizarEstado={this.actualizarEstado}
        handleSubmit={this.handleSubmit}
        update_control_form={this.update_control_form}
        buttonActive={this.props.buttonActive}
        loader={this.props.loader}
        finalizar={this.finalizar}
        step={step}
        select_withdraw_way={this.select_withdraw_way}
        cleanSearch={this.cleanSearch}
        initPrevKeyActions={this.props.initPrevKeyActions}
        search={search}
        final_step_create_account={this.final_step_create_account}
        eventName={eventName}
        {...this.state}
        {...this.props}
      />
    );
  }
}

const selectWithdrawProviders = createSelector(
  [
    (state) => state.modelData.user.withdrawProviders,
    (state) => state.modelData.withdrawProviders,
  ],
  (_withdrawProviders, withdrawProviders) => {
    return (
      _withdrawProviders &&
      _withdrawProviders.map((w_id) => {
        return withdrawProviders[w_id];
      })
    );
  }
);

function mapStateToProps(state, props) {
  // console.log('R E N D E R I Z A N D O ssssssss', props)
  const { withdraw_flow } = props;
  const { user, withdraw_accounts } = state.modelData;

  return {
    search: state.form.search_bank,
    withdrawProviders: selectWithdrawProviders(state),
    form_bank: state.form.form_bank,
    buttonActive: state.form.form_control_bank,
    loader: state.isLoading.loader,
    current: state.form.current,
    step: withdraw_flow
      ? state.form.form_withdraw.step
      : state.form.form_bank.step,
    user: user,
    withdraw_accounts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withCoinsendaServices(WithdrawAccountForm))
);
