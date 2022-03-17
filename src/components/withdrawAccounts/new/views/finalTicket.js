import React from "react";
import loadable from "@loadable/component";
import { ButtonSuccess } from "../../../widgets/buttons/buttons";
import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";
import { 
  BankData,
  TitleContainer,
  CorpAccountContainer,
  IconContainer,
  DetailAccountProv
} from '../../../forms/widgets/fiatDeposit/success'
import DetailGenerator from "../../../widgets/modal/render/orderDetail/detailGenerator";
import { useSelector } from "react-redux";


import "./finalTicket.css";

const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));
const EfectyDisclaimer = loadable(() => import("../../../widgets/efectyDisclaimer"));





function FinalTicket(props) {
  // const [current_ticket, setCurrentTicket] = useState(null);
  const idCancelButton = useKeyActionAsClick(true, "cancel-button-ticket", 8, false, "onkeyup", true);
  const idFinalizarButton = useKeyActionAsClick(true, "finalizar-button-ticket", 13,false, "onkeyup", true);
  const { osDevice } = useSelector((state) => state.ui);

  const {
    finishAction,
    cta_primary_label,
    cta_secondary,
    cta_secondary_label,
    cta_secondary_action,
    wAccount,
    order,
    title
  } = props;

  const atributos = {
    icon: "success",
    size: 75,
    color: "white",
  };

  
  const parseUiName = (text) => {
    if(typeof text !== 'string') return text;
    const finalText = text?.split("_")?.join(" ")
    const capitalizeText = finalText?.replace(text?.charAt(0), text?.charAt(0)?.toUpperCase())
    return capitalizeText
  }

  console.log('||||||||||||||||||||||||||||||_____________________________wAccount', wAccount)
  const isEFecty = wAccount?.provider_type === 'efecty_network'
  return (
    <div id="_wAccount" className="finalTicket TicketDetail _wAccountSuccess">
      <>
        <div className="finalTicket ticketHeader wAccountSuccess">
          <IconSwitch {...atributos} />
          <h1 className="fuente finalTicket TicketTitle">{`${title || "Cuenta de retiro creada exitosamente"}`}</h1>
        </div>

        <div className="finalTicket contenidoTicket wAccountSuccess">

        <BankData>

          <TitleContainer className="__titleCont">
           <p className="fuente">{'Datos de tu cuenta de retiro'}</p>
           <div className="__line__"/>
          </TitleContainer>

          <CorpAccountContainer className="corpAccountContainer">
                <IconContainer className="_corpAccIcon">
                    <IconSwitch size={45} icon={wAccount?.info?.bank_name || wAccount?.info?.label} />
                </IconContainer>
                <DetailAccountProv> 
                    <h3 className="fuente">{parseUiName(wAccount?.info?.bank_name || wAccount?.info?.label)}</h3>
                    <p className="fuente">{parseUiName(isEFecty ? wAccount?.info?.id_type : wAccount?.info?.account_type)}</p>
                    { !isEFecty &&  <p className="fuente"> Número de cuenta:</p>}
                    <p className="fuente2">{wAccount?.info?.account_number || wAccount?.info?.id_number}</p>
                </DetailAccountProv>
            </CorpAccountContainer>

            {(isEFecty && !order) && <EfectyDisclaimer/>}

            {
              order &&
              <>
              <DetailGenerator
                title="Detalle del retiro"
                order={order}
                theme="darkTheme"
              />
              </>
            }

        </BankData>
       
        </div>

        <div
          className={`nWcta2 ${osDevice}`}
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
