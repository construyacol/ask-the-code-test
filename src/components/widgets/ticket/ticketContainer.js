import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import TicketDetail from './ticketDetail'
import TicketPaymentProof from './ticketPaymentProof'
import ErrorView from '../errorView'
import SimpleLoader from '../loaders'
import { number_format } from '../../../services'

import './ticket.css'

class TicketContainer extends Component {

  state = {
    current_ticket:null,
    handleError:false,
    confirmations:0,
    total_confirmations:this.props.currencies[this.props.ticket.currency.currency].confirmations,
    current_ticket_state:this.props.ticket && this.props.ticket.state,
    type_order:this.props.ticket && this.props.ticket.type_order,
    currency_type:this.props.ticket && this.props.ticket.currency_type
  }

  componentDidMount(){

    const {
      ticket,
      currencies
    } = this.props

    this.ticket_serve(ticket)

    // console.log('||||||||| - - CURRENCIES', currencies[ticket.currency.currency].confirmations )

    if(ticket && ticket.state !== 'confirmed' || ticket.currency_type !== 'crypto'){return false}

    let confirm = setInterval(async()=>{

      const {
        confirmations
      } = this.state


        await this.setState({
          confirmations:confirmations >= currencies[ticket.currency.currency].confirmations ? confirmations : confirmations + 1,
          total_confirmations:currencies[ticket.currency.currency].confirmations
        });

        if(confirmations === currencies[ticket.currency.currency].confirmations){
          this.setState({current_ticket_state:'accepted'})
          this.props.action.ModalView("modalSuccess")
          this.props.action.success_sound()
          clearInterval(confirm)
        }

    }, 3000)

  }



  ticket_serve = async ticket => {


      const{
        amount,
        amount_neto,
        type_order
      } = ticket

      const{
        current_wallet
      } = this.props

      // console.log('||||||||||||||| - - - - TICKET', ticket)

      switch (type_order) {
        case 'withdraw':
            if(current_wallet.currency_type === 'fiat'){
                let {
                  wallets,
                  withdraw_accounts,
                  withdraw_providers
                } = this.props


                let account_from = wallets[ticket.account_id]
                let withdraw_account = withdraw_accounts[ticket.withdraw_account]
                let withdraw_provider = withdraw_providers[ticket.withdraw_provider]

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
                  value:withdraw_account.bank_name.ui_name,
                  id:2,
                  icon:withdraw_account.bank_name.value
                },
                {
                  ui_name:`${withdraw_account.account_number.ui_name}:`,
                  value:withdraw_account.account_number.value,
                  id:3
                },
                {
                  ui_name:`Ciudad:`,
                  value:withdraw_account.city.ui_name,
                  id:4
                },
                {
                  ui_name:"Propietario de la cuenta:",
                  value:`${withdraw_account.name} ${withdraw_account.surname}`,
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
                  value:account_from.currency_type === 'fiat' ? `$ ${number_format(amount)}` : amount,
                  id:7
                },
                {
                  ui_name:"Total:",
                  value:account_from.currency_type === 'fiat' ? `$ ${number_format(amount_neto)}` : amount_neto,
                  icon:account_from.currency.currency,
                  id:8
                }
              ]
            })
          }else{

            let {
              withdraw_accounts,
              withdraw_providers,
              currencies
            } = this.props

           // console.log('||||||||| - - CURRENCIES', currencies[ticket.currency.currency], )


            return this.setState({
              current_ticket:[
                {
                  ui_name:"Id orden:",
                  value:ticket.id,
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
                  value:this.props.withdraw_accounts[ticket.withdraw_account].account_name.value,
                  icon:ticket.currency.currency,
                  id:3
                },
                {
                  ui_name:`Dirección de billetera:`,
                  value:this.props.withdraw_accounts[ticket.withdraw_account].account_address.value,
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
                  value:ticket.amount,
                  icon:ticket.currency.currency,
                  id:6
                },
                {
                  ui_name:"Costo:",
                  value:ticket.cost,
                  icon:ticket.currency.currency,
                  id:8
                },
                {
                  ui_name:"Cantidad total recibida:",
                  value:ticket.amount_neto,
                  icon:ticket.currency.currency,
                  id:9
                },
                {
                  ui_name:"Tx Id:",
                  value:ticket.state === 'pending' ? 'En proceso' : ticket.proof_of_payment.proof,
                  type:ticket.state !== 'pending' && "tx",
                  copy:ticket.state !== 'pending' && true,
                  url_explorer:ticket.state !== 'pending' && (currencies[ticket.currency.currency].node_url),
                  id:4
                },
              ]
            })
          }

          case 'deposit':


              let {
                id,
                currency,
                info,
                cost_struct,
                cost,
                amount,
                amount_neto,
                deposit_provider_id,
                currency_type,
                proof_of_payment,
                state
              } = ticket

              let {
                deposit_providers,
                currencies
              } = this.props

            if(currency_type == 'crypto'){
              return this.setState({
                current_ticket:[
                  {
                    ui_name:"Id Orden:",
                    copy:true,
                    value:id,
                    id:1
                  },
                  {
                    ui_name:"Moneda(Divisa):",
                    value:currency.currency,
                    icon:currency.currency,
                    id:2
                  },
                  {
                    ui_name:"Estado:",
                    value:state,
                    id:3
                  },
                  {
                    ui_name:"Cantidad:",
                    icon:currency.currency,
                    value:amount,
                    id:4
                  },
                  {
                    ui_name:"Costo:",
                    icon:currency.currency,
                    value:cost,
                    id:5
                  },
                  {
                    ui_name:"Cantidad total recibida:",
                    icon:currency.currency,
                    value:amount_neto,
                    id:6
                  },
                  {
                    ui_name:"Tx Id:",
                    value:proof_of_payment.proof,
                    type:"tx",
                    copy:true,
                    url_explorer:currencies[ticket.currency.currency] && currencies[ticket.currency.currency].node_url,
                    id:7
                  }
                ]
              })
            }

            if(currency_type === 'fiat'){
            return this.setState({
              current_ticket:[
                {
                  ui_name:"Debes depositar a:",
                  value:deposit_providers[deposit_provider_id].provider.ui_name,
                  icon:deposit_providers[deposit_provider_id].provider.name,
                  id:5
                },
                {
                  ui_name:deposit_providers[deposit_provider_id].provider.account.account_id.ui_name,
                  value:deposit_providers[deposit_provider_id].provider.account.account_id.account_id,
                  id:6
                },
                {
                  ui_name:deposit_providers[deposit_provider_id].provider.account.type.ui_name,
                  value:deposit_providers[deposit_provider_id].provider.account.type.type,
                  id:7
                },
                {
                  ui_name:deposit_providers[deposit_provider_id].provider.account.bussines_name.ui_name,
                  value:deposit_providers[deposit_provider_id].provider.account.bussines_name.bussines_name,
                  id:8
                },
                {
                  ui_name:"Id deposito:",
                  value:id,
                  id:1
                },
                {
                  ui_name:"Cantidad deposito:",
                  value:`$ ${number_format(amount)} ${currency.currency}`,
                  icon:currency.currency,
                  id:2
                },
                {
                  ui_name:"Costo deposito:",
                  value:`$ ${number_format(cost)} ${currency.currency}`,
                  id:3
                },
                {
                  ui_name:"Total deposito:",
                  value:`$ ${number_format(amount_neto)} ${currency.currency}`,
                  id:4
                }
              ]
            })
            }
        default:
          return this.setState({current_ticket:ticket})
      }

  }




  paymentProof = () =>{

    const {
      current_form
    } = this.props

    this.props.action.IncreaseStep(current_form)

  }


  update_ticket = async ticket => {

    const {
      current_form
    } = this.props

    const {
      current_ticket
    } = this.state


    await this.setState({
      // current_ticket:this.ticket_serve(ticket),
      current_ticket_state:ticket && ticket.deposit_info.state
    })

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
      state,
      step
    } = this.props.ticket

    const{
      current_ticket,
      handleError,
      confirmations,
      current_ticket_state,
      type_order,
      currency_type,
      total_confirmations
    } = this.state


    if(handleError){
      return (<ErrorView
              msg="Al parecer tu token ha caducado"
             />)
    }


    return(
      <section className="TicketContainer" >
        <section className={`smartContainer ${step != 1 ? 'ticketStep2Border' : '' }`}>
          <div className={`ticketSlide`} style={{transform:step === 1 ? 'translateX(0%)' : 'translateX(-50%)' }}>

          {
            current_ticket ?
            <TicketDetail
              clases={`${step != 1 ? 'desaparecer' : '' }`}
              ticket={current_ticket}
              type_order={type_order}
              state={current_ticket_state}
              confirmations={confirmations}
              total_confirmations={total_confirmations}
              paymentProof={this.paymentProof}
              currency_type={currency_type}
            />
            :
            <div className="loaderTicketCont">
              <SimpleLoader label="Cargando ticket" color="white"/>
            </div>
          }

            <TicketPaymentProof
              clases={`${step != 1 ? 'aparecer' : '' }`}
              ticket={this.props.ticket}
              update_ticket={this.update_ticket}
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

  const{
    withdraw_providers,
    withdraw_accounts,
    wallets,
    deposit_providers,
    currencies
  } = state.model_data

  const{
    current_wallet
  } = state.ui.current_section.params

  let currency_list

  if(currencies && current_wallet.currency_type === 'crypto'){
    currencies.map(currency=>{
      currency_list = {
        ...currency_list,
        [currency.currency]:{
          ...currency
        }
      }
    })
  }

  return{
    ticket:state.form.form_ticket,
    current_form:state.form.current,
    withdraw_providers,
    withdraw_accounts,
    wallets,
    deposit_providers,
    current_wallet,
    currencies:currency_list
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (TicketContainer)
