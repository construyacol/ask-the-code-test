import React, { Component, Fragment } from 'react'
import IconSwitch from '../../../widgets/icons/iconSwitch'
import { ButtonSuccess } from '../../../widgets/buttons/buttons'

import '../../../widgets/ticket/ticket.css'
import './finalTicket.css'

class FinalTicket extends Component {

  // ticket  //Objetito con los parametros a mostrar en el componente
  // finishAction,  //Metodo que se asignara al call to action primario
  // cta_primary_label  //Texto del cta primary
  // cta_secondary,  // boolean para definir si el ticket tiene call to action secundario
  // cta_secondary_label  // Texto del cta secondary
  // cta_secondary_action: //Metodo asignado para el cta secondary  ej:cancelar - volver etc...

  state = {
    current_ticket: null
  }

  componentDidMount() {
    this.composeMethod()
    this.keyActions()
  }

  keyActions() {
    document.onkeydown = false
    window.onkeydown = (event) => {
      if (event.keyCode === 8 || event.keyCode === 46) {
        document.getElementById('cancel') && document.getElementById('cancel').click()
      }
      if (event.keyCode === 13) {
        document.getElementById('accept') && document.getElementById('accept').click()
      }
    }
  }

  componentWillUnmount() {
    window.onkeydown = () => null
  }

  composeMethod = async () => {
    const {
      ticket,
      ticket_type
    } = this.props

    let new_ticket = []


    switch (ticket_type) {
      case "withdraw_form":
        new_ticket = [
          {
            ui_name: "Propietario:",
            value: ticket.info.name,
            id: 6
          },
          {
            ui_name: "No. id propietario:",
            value: ticket.info.id_number,
            id: 7
          },
          {
            ui_name: "Estado:",
            value: ticket.inscribed ? 'Inscrita' : 'Inscripción pendiente',
            id: 1
          },
          {
            ui_name: "No. de cuenta:",
            value: ticket.info.account_number,
            id: 2
          },
          {
            ui_name: "Tipo de cuenta:",
            value: ticket.info.account_type,
            id: 3
          },
          {
            ui_name: "Entidad bancaria:",
            value: ticket.info.bank_name,
            id: 4,
            icon: ticket.info.bank_name
          },
          {
            ui_name: "Ciudad:",
            value: ticket.info.city,
            id: 5
          }
        ]
        return this.setState({ current_ticket: new_ticket })
      default:
        return this.setState({ current_ticket: ticket })
    }
  }

  render() {
    const {
      finishAction,
      cta_primary_label,
      cta_secondary,
      cta_secondary_label,
      cta_secondary_action
    } = this.props

    // const {
    //   state
    // } = ticket

    const atributos = {
      icon: "success",
      size: 75,
      color: "white"
    }

    const {
      current_ticket
    } = this.state

    return (
      <div className="finalTicket TicketDetail">
        {
          current_ticket &&
          <Fragment>

            <div className="finalTicket ticketHeader">
              <IconSwitch
                {...atributos}
              />
              <h1 className="fuente finalTicket TicketTitle">Operación exitosa</h1>
            </div>

            <div className="finalTicket contenidoTicket">
              {
                current_ticket.map(ticket => {
                  return (<ItemTicket key={ticket.id} {...ticket} />)
                })
              }
            </div>

            {/* cta_primary_label */}
            {/* cta_secondary */}
            {/* cta_secondary_label */}
            {/* cta_secondary_action */}
            <div className="nWcta2" style={{ gridTemplateColumns: cta_secondary ? 'repeat(2, 1fr)' : '1fr', width: cta_secondary ? '400px' : 'auto' }}>
              {
                cta_secondary &&
                <ButtonSuccess id='cancel' cta_secondary={true} toggleModal={cta_secondary_action}>{cta_secondary_label ? cta_secondary_label : 'Cancelar'}</ButtonSuccess>
              }
              <ButtonSuccess id='accept' toggleModal={finishAction}>{cta_primary_label ? cta_primary_label : 'Finalizar'}</ButtonSuccess>
            </div>

          </Fragment>
        }
      </div>
    )
  }
}

export default FinalTicket

const ItemTicket = payload => {

  const {
    ui_name,
    value,
    icon
  } = payload

  return (
    <div className="TicketDetailItem" >
      <p className="fuente TicketItemTitle" >{ui_name}</p>
      <span className="fuentePrin fuenteTicket" >
        {value}
        {icon &&
          <IconSwitch
            icon={icon}
            size={20}
            color="white"
          />}
      </span>
    </div>
  )

}
