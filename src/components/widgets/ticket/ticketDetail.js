import React, { Fragment, Component } from 'react'
import pending from '../../../assets/ticket/pending.png'
import rejected from '../../../assets/ticket/warning.png'
import rejected2 from '../../../assets/ticket/warning2.png'
import canceled from '../../../assets/ticket/canceled.png'
import confirmed from '../../../assets/ticket/confirmed.png'
import { PaymentConfirButton } from '../buttons/buttons'
import CopyContainer from '../copy/copyContainer'
import { number_format, matchItem } from '../../../services'
import ConfirmationCounter from './confirmationCounter'
import IconSwitch from '../icons/iconSwitch'
import ItemTicket from './itemTicket'

import actions from '../../../actions'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'

import './ticket.css'

class TicketDetail extends Component{


  render(){

  const {
    ticket,
    clases,
    paymentProof,
    confirmations,
    state,
    only_detail,
    currency_type_bought,
    currency_type,
    type_order,
    total_confirmations
  } = this.props

  const {
    step,
    currency,
    deposit_cost,
    expiration_date,
    id,
    amount,
    amount_neto,
    proof_of_payment,
    comment,
    spent,
    bought,
    currency_bought,
    action_price
  } = ticket

  // console.log('|||||||||||||| - - -  ticket', ticket)
  // console.log('|||||||||||||| - - -  PROPIEDADES', this.props)


  let fiatSimbol2 = currency_type_bought === 'fiat' ? '$' : ''
  let fiatSimbol = currency_type === 'fiat' ? '$' : ''

  let expiration = new Date(expiration_date)
  let options = { year: 'numeric', month: 'long', day: 'numeric' };

// console.log('|||||||||||||| DETALLE TICKET - - - - ', currency_type_bought)

const atributos ={
  icon:currency_bought,
  size:18,
  color:'#1babec'
  // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`
}

const atributos2 ={
  icon:currency && currency.currency,
  size:20,
  color:'#1babec'
}

  // console.log('|||||||||||||  detalle tickete', state)

  return(
        <div className={`TicketDetail ${clases}`}>

          {
            !only_detail &&
              <div className="ticketHeader">
                {
                  (state === 'confirmed' && currency_type === 'crypto' && type_order === "deposit") ?
                    <ConfirmationCounter
                      confirmations={confirmations}
                      total_confirmations={total_confirmations}
                    />
                  :
                  state === 'pending' ? <TicketPending/>:
                  state === 'accepted' ? <TicketSuccess/>:
                  state === 'canceled' ? <TicketCanceled/>:
                  state === 'rejected' ? <TicketRejected/>:
                  state === 'confirmed' && <TicketConfirmed/>
                }

                {
                  (state === 'confirmed' && currency_type === 'crypto' && type_order === "deposit") ?
                    <h1 className="fuente confirm TicketTitle">Confirmaciones</h1>
                  :
                  <h1 className="fuente TicketTitle">Transacción {
                    state === 'pending' ? 'Pendiente':
                    state === 'accepted' ? 'Aceptada' :
                    state === 'canceled' ? 'Cancelada' :
                    state === 'rejected' ? 'Rechazada' :
                    state === 'confirmed' && currency_type === 'crypto' ? 'en proceso' : 'en Revisión'
                  }</h1>
                }
              </div>
          }




            <div className="contenidoTicket">
              {
                (state === 'confirmed' && currency_type === 'fiat') &&
                // <p className="TicketmsgPayment TicketConfirm fuente">Esta transacción esta siendo revisada por Doomy(Nombre personaje de coinsenda(lo venderemos como  una inteligencia artificial), el es el que estará siempre en contacto con el usuario final, el que representará comercialmente la voz y la personalidad de marca de coinsenda)</p>
                <p className="TicketmsgPayment TicketConfirm fuente">Estamos a un paso de concretar tu retiro, muy pronto podrás disponer de tus fondos...</p>
              }

              {
                (state === 'confirmed' && currency_type === 'crypto') &&
                <p className="TicketmsgPayment TicketConfirm fuente">Genial, ahora solo queda tener algo de paciencia, esta ordén esta siendo confirmada, alcanzando 6 confirmaciones en la blockchain pasará a "Aceptada" y podrás hacer uso de tu saldo.</p>
              }

              {
                (state === 'rejected' && currency_type === 'fiat') &&
                <p className="TicketmsgPayment TicketConfirm fuente">{comment}</p>
              }
              {
                ticket.map(ticket => {
                  return (<ItemTicket key={ticket.id} {...ticket}/>)
                })
              }
            </div>


            {
              ((state === 'pending' || state === 'rejected')&& !only_detail && currency_type === 'fiat') &&
              <PaymentConfirButton
                id="ALconfirmButton"
                clases="laReputas"
                active={true}
                type="primary"
                siguiente={paymentProof}
                label="Confirmar"
              />
            }

        </div>
  )
  }
}




export const TicketPending = () => {
  return(
    <img src={pending} alt="" width="73"/>
  )
}


export const TicketRejected = () => {
  return(
    <section className="rejectedCont">
      <img id="rejectedOne" src={rejected} alt="" width="73"/>
      {/* <img src={rejected} alt="" width="73"/> */}
    </section>
  )
}


export const TicketCanceled = () => {
  return(
    <img src={canceled} alt="" width="73"/>
  )
}


export const TicketConfirmed = () => {
  return(
    <img src={confirmed} alt="" width="73"/>
  )
}

export const TicketSuccess = () =>{
  return(
    <div className="icon icon--order-success svg">
      <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px" alt="">
        <g fill="none" stroke="white" strokeWidth="3">
          <circle cx="36" cy="36" r="35"></circle>
          <path className="check" d="M17.417,37.778l9.93,9.909l25.444-25.393"></path>
         </g>
      </svg>
    </div>
  )
}



function mapStateToProps(state, props){

  const { ticket } = props
  const { model_data } = state

  let currency_type_bought

  if(ticket.type_order === 'swap'){
    currency_type_bought = matchItem(model_data.currencies, {primary:ticket.currency_bought}, 'name')
  }

  return{
    currency_type_bought:currency_type_bought && currency_type_bought[0].currency_type
  }
}

export default connect(mapStateToProps) (TicketDetail)
