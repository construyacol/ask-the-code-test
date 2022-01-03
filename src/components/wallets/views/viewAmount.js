import React, { Component, Fragment } from "react";
import { ButtonForms } from "../../widgets/buttons/buttons";
import IconSwitch from "../../widgets/icons/iconSwitch";
import { InputDepositForm } from "../../widgets/inputs";
import {
  handleKeyPress,
  number_format,
  get_ui_name_currency,
} from "../../../utils";
// import BigNumber from "bignumber.js";

import "../deposit/deposit.css";

class ViewAmountComponent extends Component {
  state = {
    statusInput: "",
    ui_currency_name: "",
    minAmount: this.props.min_amount || 20000,
  };

  handleKeyPress = (e) => {
    let message = handleKeyPress(e);
    return this.setState({ statusInput: message });
  };

  componentDidMount() {
    this.init_config();
  }

  componentWillUnmount() {}

  getMinAmount = async() => {
    
    const { withdrawProviders, withdraw_account_list } = this.props

    let wProvider
    let minAmount
    let cost

    if(!withdrawProviders) return this.state.minAmount;

    await withdrawProviders.forEach(_wProvider => {
      if(_wProvider.provider_type === 'bank'){
        wProvider = _wProvider
      }
    });

    minAmount = wProvider?.provider?.min_amount || '50000' 

    // minAmount = new BigNumber(wProvider.provider.min_amount)
    if(!wProvider || !withdraw_account_list) return minAmount;

    await withdraw_account_list.forEach(_wAccount => {
      if(wProvider.name.includes(_wAccount?.bank_name?.value)){
        // wProviderName validar el nombre del withdraw provider y el withdraw account
        cost = wProvider.provider.costs.same_bank.fixed
      }
    });

    if(!cost){
      cost = wProvider.provider.costs.pp.fixed
    }

    const final = parseInt(minAmount) + parseInt(cost)


    // return minAmount.plus(cost).toFormat()
    return final
    // withdrawProviders
    // 
  }

  init_config = async() => {
    const { currency } = this.props;
    let ui_currency_name = get_ui_name_currency(currency);
    const minAmount = await this.getMinAmount()
    this.setState({
      ui_currency_name,
      minAmount
    });
  };

  actualizarAmount = ({ target }) => {
    let amount = target.value.replace(/\D/g, "");
    // if (amount === 0 || amount === "0") return;
    // amount = amount.substring(0, 15);
    console.log('actualizarAmount', amount)
    // target.value = amount;
    this.props.updateAmountOnState(amount);
  };

  load_amount = () => {
    const { operation_type, available } = this.props;

    this.props.updateAmountOnState(
      operation_type === "deposit" ? 20000 : available
    );
  };

  render() {
    const {
      operation_type,
      currency,
      available,
      amount,
      handleSubmit,
    } = this.props;

    const { statusInput, ui_currency_name, minAmount } = this.state;

    // let moneda =


    const atributos = {
      icon: currency,
      size: 80,
      // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
    };


    // operation_type="withdraw"
    const buttonValidation = operation_type === "withdraw" ? this.props?.withdrawProviders?.length : true 

    // console.log('||||||||||| VIEW  AMOUNT  ||||||||||', parseFloat(available) > minAmount, parseFloat(available), minAmount, typeof(parseFloat(available)), typeof(minAmount))
    return (
      <div className="viewAmount DLstep">
        {currency && (
          <Fragment>
            <div className="DLcontain">
              <p className="fuente DLtitle2">
                Quiero {operation_type === "deposit" ? "depositar" : "retirar"}
              </p>
              <p className="fuente DLstitle">La cantidad de</p>
            </div>

            <div className="DLcontain2">
              <IconSwitch {...atributos} />

              <InputDepositForm
                value={amount}
                autoFocus={true}
                actualizar={this.actualizarAmount}
                name="amount"
                handleKeyPress={this.handleKeyPress}
                service={number_format}
              />

              <div className="DLstatus">
                <p
                  id="DLcop2"
                  className="fuente2 DLstitle DLcop DLcop2"
                  onClick={this.load_amount}
                >
                  {operation_type === "deposit" ? `Cantidad minima: $ ${number_format(minAmount)} ${currency.toUpperCase()}`
                    : operation_type === "withdraw" && parseFloat(available) > minAmount ? `Disponible: ~$${number_format(available)} ${currency.toUpperCase()} | Minima: ~$${number_format(minAmount)} ${currency.toUpperCase()}`
                    : `Disponible: ~$${number_format(available)} ${currency.toUpperCase()} | Minima: ~$${number_format(minAmount)} ${currency.toUpperCase()}`}
                </p>
                <p className="textStatus">{statusInput}</p>
                <p className="fuente DLstitle DLcop">{ui_currency_name}</p>
              </div>
            </div>

            <ButtonForms
              _id={this.props.mainCtaId}
              type="primary"
              active={ 
                buttonValidation && (operation_type === "deposit" ? parseFloat(amount) >= parseFloat(minAmount) ? true : false
                  : parseFloat(amount) >= parseFloat(minAmount) && parseFloat(amount) <= parseFloat(available) && parseFloat(amount) > 0
                  ? true
                  : false)
              }
              siguiente={handleSubmit}
            >
              Continuar
            </ButtonForms>
          </Fragment>
        )}
      </div>
    );
  }
}

export default ViewAmountComponent;
