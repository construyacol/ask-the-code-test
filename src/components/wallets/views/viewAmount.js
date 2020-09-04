import React, { Component, Fragment } from 'react'
import { ButtonForms } from '../../widgets/buttons/buttons'
import IconSwitch from '../../widgets/icons/iconSwitch'
import { InputDepositForm } from '../../widgets/inputs'
import { handleKeyPress, number_format, get_ui_name_currency } from '../../../utils'


import '../deposit/deposit.css'

class ViewAmountComponent extends Component {


  state = {
    statusInput:"",
    ui_currency_name:"",
    minAmount:this.props.min_amount || 20000
  }

  handleKeyPress = (e) => {
    let message = handleKeyPress(e)
    return this.setState({statusInput:message})
  }

  componentDidMount(){
    this.init_config()
  }

  componentWillUnmount() {

  }

  init_config = () => {
    const {
      currency
    } = this.props

    let ui_currency_name = get_ui_name_currency(currency)

    this.setState({
      ui_currency_name
    })
  }

  actualizarAmount = ({target}) =>{
    const amount = target.value.replace(/\D/g,'')
    if(amount === 0 || amount === '0') return
    // target.value = amount;
    this.props.updateAmountOnState(amount)
  }

  load_amount = () => {

    const {
      operation_type,
      available
    } = this.props


    this.props.updateAmountOnState(operation_type === 'deposit' ? 20000 : available)

  }


  render(){

    const{
      operation_type,
      currency,
      available,
      amount,
      handleSubmit
    } = this.props

    const {
      statusInput,
      ui_currency_name,
      minAmount
    } = this.state

    // let moneda =

// console.log('|||||||||Currency y short', currency)

    const atributos ={
      icon:currency,
      size:80,
      // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
    }

    // operation_type="withdraw"

    // console.log('|||||||||||||||| VIEW AMOUNT =======> ', currency)

    // console.log('||||||||||| VIEW  AMOUNT  ||||||||||', parseFloat(available) > minAmount, parseFloat(available), minAmount, typeof(parseFloat(available)), typeof(minAmount))
    return(
      <div className="viewAmount DLstep">
        {
          currency &&
          <Fragment>

          <div className="DLcontain">
            <p className="fuente DLtitle2" >Quiero {operation_type === 'deposit' ? 'depositar' : 'retirar' }</p>
            <p className="fuente DLstitle" >La cantidad de</p>
          </div>

          <div className="DLcontain2">

              <IconSwitch {...atributos}/>

              <InputDepositForm
                value={amount}
                autoFocus={true}
                actualizar={this.actualizarAmount}
                name="amount"
                handleKeyPress={this.handleKeyPress}
                service={number_format}
              />

              <div className="DLstatus">
                <p id="DLcop2" className="fuente2 DLstitle DLcop DLcop2" onClick={this.load_amount} >
                  {
                    operation_type === 'deposit' ?
                    `Cantidad minima: $ ${number_format(minAmount)} ${currency.toUpperCase()}`
                    : (operation_type === 'withdraw' && parseFloat(available) > minAmount) ?
                    `Disponible: ~$${number_format(available)} ${currency.toUpperCase()}`
                    : `Disponible: ~$${number_format(available)} ${currency.toUpperCase()} | Minima: ~$${number_format(minAmount)} ${currency.toUpperCase()}`
                  }
                </p>
                <p className="fuente DLstitle DLcop" >{ui_currency_name}</p>
                <p className="textStatus">{statusInput}</p>
              </div>
          </div>

          <ButtonForms
            type="primary"
            active={
              operation_type === 'deposit' ?
                  parseFloat(amount)>=parseFloat(minAmount) ? true : false
                  :
                  (parseFloat(amount)>=parseFloat(minAmount) && parseFloat(amount) <= parseFloat(available) && parseFloat(amount) > 0) ? true : false
            }
            siguiente={handleSubmit}>
            Continuar
          </ButtonForms>
        </Fragment>
        }


      </div>
    )
  }


}

export default ViewAmountComponent
