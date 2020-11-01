import React, { Component } from 'react'
import pending from '../../../assets/ticket/pending.png'
import rejected from '../../../assets/ticket/warning.png'
import canceled from '../../../assets/ticket/canceled.png'
import confirmed from '../../../assets/ticket/confirmed.png'
import { PaymentConfirButton, ButtonSuccess } from '../buttons/buttons'
import { matchItem } from '../../../utils'
import ConfirmationCounter from './confirmationCounter'
import ItemTicket from './itemTicket'
// import { ButtonSuccess, ButtonSuccess2 } from '../../../widgets/buttons/buttons'

import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'

import './ticket.css'
import { createSelector } from 'reselect'

class TicketDetail extends Component {



  salirTicket = () => {

    const {
      current_form
    } = this.props

    this.props.action.ModalView('modalView')
    this.props.action.CleanForm(current_form)

    return this.props.action.toggleModal()
  }



  render() {

    const {
      ticket,
      clases,
      paymentProof,
      confirmations,
      state,
      only_detail,
      currency_type,
      type_order,
      total_confirmations
    } = this.props

    const {
      comment
    } = ticket

    // console.log('|||||||||||||| - - -  PROPIEDADES', this.props)

    return (
      <div className={`TicketDetail ${clases}`}>

        {
          !only_detail &&
          <div className="ticketHeader">
            {
              (state === 'confirmed' && currency_type === 'crypto' && type_order === "deposits") ?
                <ConfirmationCounter
                  confirmations={confirmations}
                  total_confirmations={total_confirmations}
                />
                :
                state === 'pending' ? <TicketPending /> :
                  state === 'accepted' ? <TicketSuccess /> :
                    state === 'canceled' ? <TicketCanceled /> :
                      state === 'rejected' ? <TicketRejected /> :
                        state === 'confirmed' && <TicketConfirmed />
            }

            {
              (state === 'confirmed' && currency_type === 'crypto' && type_order === "deposits") ?
                <h1 className="fuente confirm TicketTitle">Confirmaciones</h1>
                :
                <h1 className="fuente TicketTitle">Transacción {
                  state === 'pending' ? 'Pendiente' :
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
            <p className="TicketmsgPayment TicketConfirm fuente">Genial, ahora solo queda tener algo de paciencia, esta ordén esta siendo confirmada, alcanzando {total_confirmations} confirmaciones en la blockchain pasará a "Aceptada" y podrás hacer uso de tu saldo.</p>
          }

          {
            (state === 'rejected' && currency_type === 'fiat') &&
            <p className="TicketmsgPayment TicketConfirm fuente">{comment}</p>
          }
          {
            ticket.map(ticket => {
              return (<ItemTicket key={ticket.id} {...ticket} />)
            })
          }
        </div>


        {
          ((state === 'pending') && !only_detail && currency_type === 'fiat' && type_order !== 'swaps') ?
            <PaymentConfirButton
              id={this.props.id}
              clases="laReputas ALconfirmButton"
              active={true}
              type="primary"
              siguiente={paymentProof}
              label="Confirmar"
            />
            :
            (state) &&
            <div id="nWcta" className="nWcta" >
              <ButtonSuccess id={this.props.id} cta_secondary toggleModal={this.salirTicket}>Cerrar</ButtonSuccess>
            </div>

        }

      </div>
    )
  }
}




export const TicketPending = () => {
  return (
    <img src={pending} alt="" width="73" />
  )
}


export const TicketRejected = () => {
  return (
    <section className="rejectedCont">
      <img id="rejectedOne" src={rejected} alt="" width="73" />
      {/* <img src={rejected} alt="" width="73"/> */}
    </section>
  )
}


export const TicketCanceled = () => {
  return (
    <img src={canceled} alt="" width="73" />
  )
}


export const TicketConfirmed = () => {
  return (
    <img src={confirmed} alt="" width="73" />
  )
}

export const TicketSuccess = () => {
  return (
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

const selectWithMathItems = createSelector(
  state => state.modelData.currencies,
  (_, props) => props.ticket,
  (currencies, ticket) => {
    let currency_type_bought

    if (ticket.type_order === 'swaps') {
      currency_type_bought = matchItem(currencies, { primary: ticket.currency_bought }, 'name')
    }
    return currency_type_bought && currency_type_bought[0].currency_type
  }
)

function mapStateToProps(state, props) {

  return {
    currency_type_bought: selectWithMathItems(state, props)
  }
}

export default connect(mapStateToProps)(TicketDetail)
