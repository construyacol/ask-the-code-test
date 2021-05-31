import React from "react";
import loadable from "@loadable/component";
import { ButtonSuccess } from "../../../widgets/buttons/buttons";
import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";
import DetailGenerator from "../../../widgets/modal/render/orderDetail/detailGenerator";
import "./finalTicket.css";

const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

function FinalTicket(props) {
  // const [current_ticket, setCurrentTicket] = useState(null);
  const idCancelButton = useKeyActionAsClick(true, "cancel-button-ticket", 8, false, "onkeyup", true);
  const idFinalizarButton = useKeyActionAsClick(true, "finalizar-button-ticket", 13,false, "onkeyup", true);

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

// const ItemTicket = (payload) => {
//   const { ui_name, value, icon } = payload;
//
//   return (
//     <div className="TicketDetailItem">
//       <p className="fuente TicketItemTitle">{ui_name}</p>
//       <span className="fuentePrin fuenteTicket">
//         {value}
//         {icon && <IconSwitch icon={icon} size={20} color="white" />}
//       </span>
//     </div>
//   );
// };
