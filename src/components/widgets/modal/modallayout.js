import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { ButtonModalClose, ButtonModalBack } from "../buttons/buttons";
import { useActions } from "../../../hooks/useActions";

import "./modal.css";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import { CAPACITOR_PLATFORM } from "components/utils";

const ModalLayout = (props) => {
  const { modalView, loader, step, children, current, isAppLoaded } = props;
  const actions = useActions();
  const isModalRenderShowing = useSelector((state) => state.ui.modal.render);
  const [activeKeyEvent, setActiveKeyEvent] = useState(false);

  useEffect(() => {
    setActiveKeyEvent(isModalRenderShowing ? true : false);
  }, [isModalRenderShowing]);

  const idForCloseButton = useKeyActionAsClick(
    activeKeyEvent,
    "modal-close-button",
    27,
    false,
    "onkeyup",
    true
  );
  const idForBackstepButton = useKeyActionAsClick(
    activeKeyEvent,
    "modal-backstep-button",
    8,
    true,
    "onkeyup",
    true
  );

  const volver = () => {
    if (step === 1) return;
    const { uiAnimation } = props;
    if (uiAnimation) {
      return actions.FlowAnimationLayoutAction("backV", "back", props.current);
    }
    actions.ReduceStep(props.current);
  };

  const salir = async (callback) => {
    const { current } = props;
    actions.CleanForm("deposit");
    actions.CleanForm("withdraw");
    actions.CleanForm("bank");
    actions.CleanForm(current);
  };

  const salirTicket = async () => {
    const { current } = props;
    actions.ModalView("modalView");
    actions.CleanForm(current);

    return actions.toggleModal();
  };

  const conditionForCloseButton =
    !activeKeyEvent &&
    !loader &&
    isAppLoaded &&
    (modalView === "modalView" ||
      (current === "withdraw" && modalView === "modalSuccess"));

  const buttonCloseProps =
    current === "ticket"
      ? {
          color: "white",
          toggleModal: salirTicket,
        }
      : {
          toggleModal: salir,
        };

  const conditionForBackButton =
    (current === "bank" && step > 2 && !loader && modalView === "modalView") ||
    (current !== "bank" && step > 1 && !loader && modalView === "modalView") ||
    (step > 1 && current === "ticket");

  return (
    <section
      className={`Modal ${isAppLoaded ? "aparecer" : "show_loader_app"} ${CAPACITOR_PLATFORM === 'ios' && 'ios-notch-fix'}`}
    >
      <div className={`modalCont ${modalView}`}>
        {children}

        {conditionForCloseButton && (
          <ButtonModalClose id={idForCloseButton} {...buttonCloseProps}>
            {window.innerWidth > 768 && "Salir"}
          </ButtonModalClose>
        )}

        {conditionForBackButton && (
          <ButtonModalBack
            id={idForBackstepButton}
            color={step > 1 && current === "ticket" && "white"}
            volver={volver}
          >
            {window.innerWidth > 768 && "volver"}
          </ButtonModalBack>
        )}
      </div>
    </section>
  );
};

function mapStateToProps(state) {
  const { current } = state.form;
  const steped =
    current === "wallets"
      ? `form_wallet`
      : current === "kyc_advanced"
      ? "form_kyc_basic"
      : `form_${current}`;

  const { isAppLoaded } = state.isLoading;

  return {
    step: state.form[steped] && state.form[steped].step,
    current: state.form.current,
    redux_route: state.ui.menu_item_active,
    sub_section: state.ui.current_section.params.current_sub_section,
    deposit_direct_access:
      state.ui.current_section.params.deposit_direct_access,
    uiAnimation: state.ui.flowAnimationActive,
    isAppLoaded,
  };
}

export default connect(mapStateToProps)(ModalLayout);
