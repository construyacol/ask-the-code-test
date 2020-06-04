import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import TicketDetail from './ticketDetail'
import TicketPaymentProof from './ticketPaymentProof'
import ErrorView from '../errorView'
import SimpleLoader from '../loaders'
import { formatToCurrency } from '../../../utils/convert_currency'
import { ticketModalView } from '../../../utils'
import { withRouter } from "react-router";

import './ticket.css'

class TicketContainer extends Component {

  state = {
    current_ticket:null,
    handleError:false,
    // confirmations:this.props.ticket.confirmations,
    // total_confirmations:this.props.current_wallet.currency_type === 'crypto' && this.props.currencies[this.props.ticket.currency.currency] && this.props.currencies[this.props.ticket.currency.currency].confirmations,
    // current_ticket_state:this.props.ticket && this.props.ticket.state,
    type_order:this.props.type_order,
    currency_type:this.props.ticket && this.props.ticket.currency_type
  }

  async componentDidMount(){

    const {
      ticket
    } = this.props


    this.props.action.CurrentForm('ticket')
    let view = await ticketModalView(ticket.state)
    await this.props.action.ModalView(view)

    this.ticket_serve(ticket)
    // return console.log('||||||||||||||||||| ======> FROM TICKET CONTAINER ==> ', ticket)

    this.get_deposit_payment_proof()


  }

  get_deposit_payment_proof = async() =>{

    const {
      ticket
    } = this.props

    if(ticket.type_order !== 'deposit' || ticket.currency_type === 'fiat'){return false}
    if(ticket.paymentProof){return false}
    let deposit = await this.props.action.get_one_deposit(ticket.id)
    this.ticket_serve({...ticket, ...deposit})

    let update_ticket = {
      [ticket.id]:{...ticket, ...deposit}
    }
    console.log('||||||||||||||||||| ======> FROM TICKET CONTAINER ==> ', update_ticket)

    await this.props.action.update_item_state(update_ticket, 'deposits')
    this.props.action.update_activity_state(ticket.account_id, 'deposits')
  }



    async componentDidUpdate(prevProps){
      // console.log('||||||||||||   componentDidUpdate ==> ', prevProps.current_ticket_state, this.props.current_ticket_state)
      if(prevProps.current_ticket_state === this.props.current_ticket_state){return false}
      let view = await ticketModalView(this.props.ticket.state)
      await this.props.action.ModalView(view)
    }



  ticket_serve = async ticket => {


      const{
        type_order
      } = this.props

      const{
        current_wallet
      } = this.props


      // ticket.amount
      // ticket.cost
      // ticket.amount_neto
      // ticket.currency
      // console.log('||||||||||||||| - - - - TICKET BEFORE', ticket)

      let amount
      let cost
      let amount_neto
      let bought
      let spent

      if(type_order !== 'swaps'){
         amount = await formatToCurrency(ticket.amount, ticket.currency, true)
         cost = await formatToCurrency(ticket.cost, ticket.currency, true)
         amount_neto = await formatToCurrency(ticket.amount_neto, ticket.currency, true)
      }else{
        // console.log('||||||||||||||| - - - - TICKET swap', spent, bought)
        spent = await formatToCurrency(ticket.spent, ticket.currency, true)
        bought = await formatToCurrency(ticket.bought, ticket.currency_bought, true)
      }


      // console.log('||||||||||||||| - - - - TICKET BOUGHT', bought, bought === 'NaN', ticket.bought)


      // formatToCurrency

      switch (type_order) {
        case 'withdraws':
            if(!current_wallet || current_wallet.currency_type === 'fiat'){
                let {
                  wallets,
                  withdraw_accounts,
                  withdrawProviders
                } = this.props


                let account_from = wallets[ticket.account_id]
                let withdraw_account = withdraw_accounts[ticket.withdraw_account]
                let withdraw_provider = withdrawProviders[ticket.withdraw_provider]
                // console.log('withdraw_accounts', withdraw_accounts, withdraw_account)

            return this.setState({
              current_ticket:[
                {
                  ui_name:"El Retiro proviene desde:",
                  value:`${account_from.name} - ${account_from.currency.currency}`,
                  id:1,
                  icon:account_from.currency.currency
                },
                {
                  ui_name:"Los fondos se recibirán en:",
                  value:withdraw_account ? withdraw_account.bank_name.ui_name : 'Cuenta eliminada',
                  id:2,
                  icon:withdraw_account && withdraw_account.bank_name.value
                },
                {
                  ui_name:`${withdraw_account ? withdraw_account.account_number.ui_name : 'Cuenta eliminada'}:`,
                  value:withdraw_account && withdraw_account.account_number.value,
                  id:3
                },
                {
                  ui_name:`Ciudad:`,
                  value:withdraw_account && withdraw_account.city.ui_name,
                  id:4
                },
                {
                  ui_name:"Propietario de la cuenta:",
                  value:`${withdraw_account ? withdraw_account.name : 'Anonimo'} ${withdraw_account ? withdraw_account.surname : ''}`,
                  id:5
                },
                {
                  ui_name:"Retiro realizado a travez de:",
                  value:withdraw_provider.info_needed.bank_name[withdraw_provider.provider.name].ui_name,
                  id:6,
                  icon:withdraw_provider.provider.name
                },
                {
                  ui_name:"Cantidad a retirar:",
                  value:account_from.currency_type === 'fiat' ? `$ ${amount}` : amount,
                  icon:account_from.currency.currency,
                  id:7
                },
                {
                  ui_name:"Costo del retiro:",
                  value:`$ ${cost}`,
                  icon:account_from.currency.currency,
                  id:9
                },
                {
                  ui_name:"Total:",
                  value:account_from.currency_type === 'fiat' ? `$ ${amount_neto}` : amount_neto,
                  icon:account_from.currency.currency,
                  id:8
                }
              ]
            })
          }else{

            let {
              currencies
            } = this.props

            // console.log('||||||||| - - INFO PRINCIPAL', this.props.withdraw_accounts[ticket.withdraw_account], ticket)
            // console.log('||||||||| - - WITHDRAW ACCOUNTS', this.props.withdraw_accounts)


            return this.setState({
              current_ticket:[
                {
                  ui_name:"Id orden:",
                  value:ticket.unique_id || ticket.id,
                  id:1,
                },
                {
                  ui_name:"Moneda(Divisa):",
                  value:ticket.currency.currency,
                  icon:ticket.currency.currency,
                  id:2,
                },
                {
                  ui_name:`Enviado a:`,
                  value:this.props.withdraw_accounts[ticket.withdraw_account_id].account_name.value,
                  icon:ticket.currency.currency,
                  id:3
                },
                {
                  ui_name:`Dirección de billetera:`,
                  value:this.props.withdraw_accounts[ticket.withdraw_account_id].account_address.value,
                  copy:true,
                  id:7
                },
                {
                  ui_name:"Prioridad:",
                  value:ticket.cost_struct.description,
                  id:5
                },
                {
                  ui_name:"Cantidad:",
                  value:amount,
                  icon:ticket.currency.currency,
                  id:6
                },
                {
                  ui_name:"Costo:",
                  value:cost,
                  icon:ticket.currency.currency,
                  id:8
                },
                {
                  ui_name:"Cantidad total recibida:",
                  value:amount_neto,
                  icon:ticket.currency.currency,
                  id:9
                },
                {
                  ui_name:"Tx Id:",
                  value:ticket.state === 'confirmed' ? 'En proceso' : ticket.proof,
                  type:ticket.state !== 'confirmed' && "tx",
                  copy:ticket.state !== 'confirmed' && true,
                  url_explorer:ticket.state !== 'confirmed' && (currencies[ticket.currency.currency].node_url),
                  id:4
                },
              ]
            })
          }

          case 'deposits':

              let {
                deposit_providers,
                currencies
              } = this.props

            if(ticket.currency_type === 'crypto'){
              return this.setState({
                current_ticket:[
                  {
                    ui_name:"Id Orden:",
                    copy:true,
                    value:ticket.unique_id || ticket.id,
                    id:1
                  },
                  {
                    ui_name:"Moneda(Divisa):",
                    value:ticket.currency.currency,
                    icon:ticket.currency.currency,
                    id:2
                  },
                  {
                    ui_name:"Estado:",
                    value:ticket.state,
                    id:3
                  },
                  {
                    ui_name:"Cantidad:",
                    icon:ticket.currency.currency,
                    value:amount,
                    id:4
                  },
                  {
                    ui_name:"Costo:",
                    icon:ticket.currency.currency,
                    value:cost,
                    id:5
                  },
                  {
                    ui_name:"Cantidad total recibida:",
                    icon:ticket.currency.currency,
                    value:amount_neto,
                    id:6
                  },
                  {
                    ui_name:"Tx Id:",
                    value:ticket.paymentProof ? ticket.paymentProof.proof_of_payment.proof : 'Sin Registro',
                    copy:ticket.paymentProof && true,
                    url_explorer:(ticket.paymentProof && currencies[ticket.currency.currency]) && currencies[ticket.currency.currency].node_url,
                    id:7
                  }
                ]
              })
            }

            if(ticket.currency_type === 'fiat'){
            return this.setState({
              current_ticket:[
                {
                  ui_name:"Debes depositar a:",
                  // value:'kkk',
                  value:deposit_providers[ticket.deposit_provider_id].provider.ui_name,
                  // icon:'kkk',
                  icon:deposit_providers[ticket.deposit_provider_id].provider.name,
                  id:5
                },
                {
                  // ui_name:'dsdsd',
                  ui_name:deposit_providers[ticket.deposit_provider_id].provider.account.account_id.ui_name,
                  // value:'dsdsd',
                  value:deposit_providers[ticket.deposit_provider_id].provider.account.account_id.account_id,
                  id:6
                },
                {
                  // ui_name:'222',
                  ui_name:deposit_providers[ticket.deposit_provider_id].provider.account.type.ui_name,
                  // value:'222',
                  value:deposit_providers[ticket.deposit_provider_id].provider.account.type.type,
                  id:7
                },
                {
                  // ui_name:'22222',
                  ui_name:deposit_providers[ticket.deposit_provider_id].provider.account.bussines_name.ui_name,
                  // value:'22222',
                  value:deposit_providers[ticket.deposit_provider_id].provider.account.bussines_name.bussines_name,
                  id:8
                },
                {
                  ui_name:"Id deposito:",
                  value:ticket.unique_id || ticket.id,
                  id:1
                },
                {
                  ui_name:"Cantidad de deposito:",
                  value:`$ ${amount} ${ticket.currency.currency}`,
                  icon:ticket.currency.currency,
                  id:2
                },
                {
                  ui_name:"Costo deposito:",
                  value:`$ ${cost} ${ticket.currency.currency}`,
                  id:3
                },
                {
                  ui_name:"Total deposito:",
                  value:`$ ${amount_neto} ${ticket.currency.currency}`,
                  id:4
                }
              ]
            })
            }
          break;
          case 'swaps':
          return this.setState({current_ticket:[
            {
              ui_name:"id intercambio:",
              value:ticket.unique_id || ticket.id,
              id:1
            },
            // {
            //   ui_name:"fecha de creación:",
            //   value:ticket.expiration_date,
            //   id:2
            // },
            {
              ui_name:"divisa gastada:",
              value:ticket.currency.currency,
              icon:ticket.currency.currency,
              id:3
            },
            {
              ui_name:"cantidad gastada:",
              value:spent,
              icon:ticket.currency.currency,
              id:4
            },
            {
              ui_name:"divisa adquirida:",
              value:ticket.currency_bought.currency,
              icon:ticket.currency_bought.currency,
              id:5
            },
            {
              ui_name:"cantidad adquirida:",
              icon:ticket.currency_bought.currency,
              value:bought === 'NaN' ? ticket.bought : bought ,
              id:6
            },
            {
              ui_name:"Estado:",
              value:ticket.state,
              id:7
            }
          ]})
        default:
          return this.setState({current_ticket:ticket})
      }

  }




  paymentProof = () =>{

    const {
      current_form
    } = this.props

    this.props.action.IncreaseStep(current_form)
    this.props.history.push('?form=upload_deposit_payment_proof')
  }


  update_ticket = async ticket => {
    const {
      current_form
    } = this.props

    // await this.setState({
    //   // current_ticket:this.ticket_serve(ticket),
    //   current_ticket_state:ticket && ticket.state
    // })

    this.props.action.ModalView("confirmedView")
    this.props.action.ReduceStep(current_form)
  }


  componentDidCatch(error, info){
    this.setState({
      handleError:true,
    })
  }


  render(){

    const {
      step,
      confirmations,
      current_wallet,
      current_ticket_state,
      total_confirmations
    } = this.props

    const{
      current_ticket,
      handleError,
      type_order,
      currency_type,
    } = this.state


    if(handleError){
      return (<ErrorView
              msg="Al parecer tu token ha caducado"
             />)
    }


    return(
      <section className="TicketContainer" >
        <section className={`smartContainer ${step !== 1 ? 'ticketStep2Border' : '' }`}>
          <div className={`ticketSlide`} style={{transform:step === 1 ? 'translateX(0%)' : 'translateX(-50%)' }}>

          {
            current_ticket ?
            <TicketDetail
              clases={`${step !== 1 ? 'desaparecer' : '' }`}
              ticket={current_ticket}
              type_order={type_order}
              state={current_ticket_state}
              confirmations={confirmations}
              total_confirmations={total_confirmations}
              paymentProof={this.paymentProof}
              currency_type={currency_type}
              current_form={this.props.current_form}
              action={this.props.action}
            />
            :
            <div className="loaderTicketCont">
              <SimpleLoader label="Cargando ticket" color="white"/>
            </div>
          }

            <TicketPaymentProof
              clases={`${step !== 1 ? 'aparecer' : '' }`}
              ticket={this.props.ticket}
              update_ticket={this.update_ticket}
              current_wallet={current_wallet}
            />

          </div>

        </section>
      </section>
    )
  }
}


function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){

  const { account_id, tx_path, order_id, primary_path } = props.match.params

  // console.log('||||||||||||||||||| ======> Ticket CONTAINER ==> ',  props)

  let current_wallet = state.modelData.wallets[account_id]

  const{
    withdrawProviders,
    withdraw_accounts,
    wallets,
    deposit_providers,
    currencies
  } = state.modelData


  let currency_list
  
  if(current_wallet && currencies && current_wallet.currency_type === 'crypto'){
    currencies.map(currency=>{
      return currency_list = {
        ...currency_list,
        [currency.currency]:{
          ...currency
        }
      }
    })
  }

  let ticket = state.modelData[tx_path][order_id]

  const total_confirmations = current_wallet && (current_wallet.currency_type === 'crypto' && currency_list[ticket.currency.currency] && currency_list[ticket.currency.currency].confirmations)

  return{
    step:state.form.form_ticket.step,
    type_order:tx_path,
    ticket,
    current_form:state.form.current,
    withdrawProviders,
    withdraw_accounts,
    wallets,
    deposit_providers,
    current_wallet,
    currencies:currency_list,
    confirmations:ticket.confirmations,
    total_confirmations,
    current_ticket_state:ticket.state
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (TicketContainer))
