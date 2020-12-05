import React, { Fragment, useEffect } from "react";
import { SimpleLoader } from "../../../widgets/loaders";
import {
  ButtonSuccess,
  ButtonSuccess2,
} from "../../../widgets/buttons/buttons";
import "./flows.css";
import { service_modes, cash_payment } from "../../../api/ui/api.json";
import proof from "../../../../assets/proof.png";
import ModalityView from "../views/modality";
import IconSwitch from "../../../widgets/icons/iconSwitch";
import DetailGenerator from "../../../widgets/modal/render/orderDetail/detailGenerator";



// {/* ---------------------------------------------------------FLUJO TRANSFERENCIA BANCARIA.-------------------------------------------------------------------- */}

export const TransferFlow = (props) => {
  const {
    deposit_way,
    deposit_service,
    step,
    buttonActive,
    update_service_mode,
    service_mode,
    create_deposit_order,
    idForAcceptButtonInDepositView,
  } = props;

  return (
    <section className="DepositLayout">
      {/* {
        (step === 3 && deposit_way === "bankaccount") &&
        <div className="DLstep">
          <div className="DLcontain">
            <p className="fuente DLtitle2" >Procesaré el deposito por medio</p>
            <p className="fuente DLstitle" >de la entidad Bancaria:</p>
          </div>
          {
            !deposit_provider_list ?
            <SimpleLoader label="cargando proveedores"/>
            :
            <ItemSelectionContainer
              items={deposit_provider_list}
              type="banks"
              itemSelect={deposit_service}
              actualizarEstado={actualizarEstado}
              update_control_form={update_control_form}
            />
          }

          <ButtonForms type="primary" active={buttonActive} siguiente={siguiente}>Continuar</ButtonForms>
        </div>
      } */}

      {step === 3 && deposit_way === "bankaccount" && (
        <ModalityView
          title="Haré la transferencia"
          subtitle="Por medio de:"
          items={service_modes}
          update_service_mode={update_service_mode}
          service_mode={service_mode}
          buttonActive={buttonActive}
          deposit_service={deposit_service}
          create_deposit_order={create_deposit_order}
        />
      )}

      {step === 4 && deposit_way === "bankaccount" && (
        <Success
          idForAcceptButtonInDepositView={idForAcceptButtonInDepositView}
          {...props}
        />
      )}
    </section>
  );
};

export const CashFlow = (props) => {
  // console.log('LAAAAAA NUEVA PROPIEDAD DE SERVICIOOOOOOOO------------------', props)

  const {
    deposit_way,
    short_bank_name,
    deposit_service,
    step,
    update_local_state,
    buttonActive,
    create_deposit_order,
    idForAcceptButtonInDepositView,
  } = props;

  return (
    <section className="DepositLayout">
      {step === 3 && deposit_way === "cash" && (
        <ModalityView
          title="Haré el deposito por:"
          items={cash_payment}
          update_service_mode={update_local_state}
          service_mode={short_bank_name}
          buttonActive={buttonActive}
          deposit_service={deposit_service}
          create_deposit_order={create_deposit_order}
        />
      )}

      {step === 4 && deposit_way === "cash" && (
        <Success
          idForAcceptButtonInDepositView={idForAcceptButtonInDepositView}
          {...props}
        />
      )}
    </section>
  );
};

const Success = (props) => {
  const {
    loader,
    deposit_way,
    deposit_service,
    finalizar,
    final,
    finalButton,
    step,
    new_ticket,
    idForAcceptButtonInDepositView,
    deposit_order
  } = props;

  // console.log('|||||||||||||| °°°°° MODALSUCCESS', deposit_order, props)

  return (
    <div
      id="DLstep2"
      className={`DLstep ${
        step === 4 || (step === 4 && deposit_way === "cash") ? "DLstep2" : ""
      }`}
    >
      {
        loader ? (
          <Fragment>
            <div></div>
            <SimpleLoader label={`Creando orden de deposito`} />
          </Fragment>
        ) : (
          // <section className={`stepFinish ${final ? 'cambiarGrid': ''}`}>
          <Fragment>
            {/* <span className="DLsave" onClick={guardarMetodo}>
              <i className="far fa-bookmark tooltip" >
              <span className="tooltiptext tooltiptexts fuente">Guardar Medio de pago</span>
              </i>
            </span> */}

            <div className={`succ nWCabeza ${final ? "desaparece1" : ""}`}>
              <div className="icon icon--order-success svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="72px"
                  height="72px"
                  alt=""
                >
                  <g fill="none" stroke="white" strokeWidth="3">
                    <circle cx="36" cy="36" r="35"></circle>
                    <path
                      className="check"
                      d="M17.417,37.778l9.93,9.909l25.444-25.393"
                    ></path>
                  </g>
                </svg>
              </div>
              <p className="titleWhite fuente"> Operación Exitosa</p>
            </div>

            <div className="asaras">
              <div
                style={{ marginTop: "-20%", zIndex: 999 }}
                className={`${
                  final ? "apareces1" : ""
                } nWbody2 Fbody2 FlowCont fuente DLmessage`}
              >
                <div className="FolowTexts">
                  <p className="fuente Fimportant">¡IMPORTANTE!</p>
                  <p className="Ftexto fuente ">
                    Una vez realizado el deposito bancario debes confirmar la
                    transacción con una fotografía del{" "}
                    <strong> DESPRENDIBLE DE PAGO </strong>y adjuntarlas en la
                    orden de pago
                  </p>
                  <img className="tocatoca" src={proof} alt="" width="34%" />
                </div>
              </div>

              <div
                className={`nWbody2 DLbody2 Fbody2 eya fuente ${
                  final ? "desaparece1" : ""
                }`}
              >
                <div className="nBitemSuccesss">
                  <p className="fuente">Debes depositar por:</p>
                  <div className="fuente">
                    <div className="DLicontainer">
                      {/* <img className="DLimg2" src={require(`../../../widgets/items/assets/${deposit_way === 'cash' ? 'remittance' : 'bank'}/${short_bank_name}.png`)} alt="" width="30"/> */}
                      {deposit_service}
                      <IconSwitch
                        icon={deposit_service.toLowerCase()}
                        size={25}
                      />
                    </div>
                  </div>
                </div>

                {new_ticket && (
                  <DetailGenerator
                    order={deposit_order}
                    theme="darkTheme"
                  />

                )}
              </div>
            </div>

            <div id="nWcta" className="nWcta">
              {finalButton ? (
                <ButtonSuccess2
                  id={idForAcceptButtonInDepositView}
                  toggleModal={finalizar}
                >
                  Finalizar
                </ButtonSuccess2>
              ) : (
                <ButtonSuccess
                  id={idForAcceptButtonInDepositView}
                  toggleModal={finalizar}
                >
                  Finalizar
                </ButtonSuccess>
              )}
            </div>
          </Fragment>
        )
        // </section>
      }
    </div>
  );
};
