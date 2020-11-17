import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import { ButtonSuccess } from "../../../widgets/buttons/buttons";
import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";
import "../../../widgets/ticket/ticket.css";
import DetailGenerator from "../../../widgets/modal/render/orderDetail/detailGenerator";
import "./finalTicket.css";

const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

function FinalTicket(props) {
  // const [current_ticket, setCurrentTicket] = useState(null);
  const idCancelButton = useKeyActionAsClick(
    true,
    "cancel-button-ticket",
    8,
    false,
    "onkeyup",
    true
  );
  const idFinalizarButton = useKeyActionAsClick(
    true,
    "finalizar-button-ticket",
    13,
    false,
    "onkeyup",
    true
  );

  // const composeMethod = async () => {
  //   const { ticket, ticket_type } = props;
  //
  //   let new_ticket = [];
  //
  //   switch (ticket_type) {
  //     case "withdraw_form":
  //       new_ticket = [
  //         {
  //           ui_name: "Propietario:",
  //           value: ticket.info.name,
  //           id: 6,
  //         },
  //         {
  //           ui_name: "No. id propietario:",
  //           value: ticket.info.id_number,
  //           id: 7,
  //         },
  //         {
  //           ui_name: "Estado:",
  //           value: ticket.inscribed ? "Inscrita" : "Inscripción pendiente",
  //           id: 1,
  //         },
  //         {
  //           ui_name: "No. de cuenta:",
  //           value: ticket.info.account_number,
  //           id: 2,
  //         },
  //         {
  //           ui_name: "Tipo de cuenta:",
  //           value: ticket.info.account_type,
  //           id: 3,
  //         },
  //         {
  //           ui_name: "Entidad bancaria:",
  //           value: ticket.info.bank_name,
  //           id: 4,
  //           icon: ticket.info.bank_name,
  //         },
  //         {
  //           ui_name: "Ciudad:",
  //           value: ticket.info.city,
  //           id: 5,
  //         },
  //       ];
  //       return setCurrentTicket(new_ticket);
  //     default:
  //       return setCurrentTicket(ticket);
  //   }
  // };

  // useEffect(() => {
  //   composeMethod();
  // }, []);

  const {
    finishAction,
    cta_primary_label,
    cta_secondary,
    cta_secondary_label,
    cta_secondary_action,
    ticket,
  } = props;

  const atributos = {
    icon: "success",
    size: 75,
    color: "white",
  };

  return (
    <div className="finalTicket TicketDetail">
      <>
        <div className="finalTicket ticketHeader">
          <IconSwitch {...atributos} />
          <h1 className="fuente finalTicket TicketTitle">Operación exitosa</h1>
        </div>

        <div className="finalTicket contenidoTicket">
          <DetailGenerator
            title="Detalle del retiro"
            order={ticket}
            theme="darkTheme"
          />
        </div>

        <div
          className="nWcta2"
          style={{
            gridTemplateColumns: cta_secondary ? "repeat(2, 1fr)" : "1fr",
            width: cta_secondary ? "400px" : "auto",
          }}
        >
          {cta_secondary && (
            <ButtonSuccess
              id={idCancelButton}
              cta_secondary={true}
              toggleModal={cta_secondary_action}
            >
              {cta_secondary_label ? cta_secondary_label : "Cancelar"}
            </ButtonSuccess>
          )}
          <ButtonSuccess id={idFinalizarButton} toggleModal={finishAction}>
            {cta_primary_label ? cta_primary_label : "Finalizar"}
          </ButtonSuccess>
        </div>
      </>
    </div>
  );
}

export default FinalTicket;

const ItemTicket = (payload) => {
  const { ui_name, value, icon } = payload;

  return (
    <div className="TicketDetailItem">
      <p className="fuente TicketItemTitle">{ui_name}</p>
      <span className="fuentePrin fuenteTicket">
        {value}
        {icon && <IconSwitch icon={icon} size={20} color="white" />}
      </span>
    </div>
  );
};
