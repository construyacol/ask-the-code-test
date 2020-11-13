import React, { useEffect } from "react";
import useNavigationKeyActions from "../../../../hooks/useNavigationKeyActions";
import { ButtonForms } from "../../../widgets/buttons/buttons";
import NewItemsLayout from "../../../widgets/items/new-items-layout";

const ModalityView = (props) => {
  const {
    items,
    update_service_mode,
    service_mode,
    buttonActive,
    deposit_service,
    create_deposit_order,
    title,
    subtitle,
  } = props;
  let movil_viewport = window.innerWidth < 768;

  const [setCurrentSelection] = useNavigationKeyActions({
    items,
    loader: false,
    uniqueIdForElement: "modality-item-",
    modalRestriction: false,
  });

  useEffect(() => {
    update_service_mode("Sucursal virtual", "app");
  }, []);

  return (
    <div className="DLstep modality">
      <div className="DLcontain">
        <p className="fuente DLtitle2">
          {title} {deposit_service ? deposit_service : ""}
        </p>
        <p className="fuente DLstitle">{subtitle}</p>
      </div>

      <div
        className={`${
          window.innerWidth > 768
            ? "DLItemSelectionContainer"
            : "ItemSelectionContainerMovil"
        }`}
      >
        <div
          className={`${
            window.innerWidth > 768 ? "DLcontainerItems" : "containerItems"
          } chooseMethod`}
        >
          {items.map((item, index) => {
            return (
              <NewItemsLayout
                setCurrentSelection={setCurrentSelection}
                focusedId={`modality-item-${index}`}
                number={index}
                handleClick={create_deposit_order}
                primarySelect={movil_viewport}
                actualizarEstado={update_service_mode}
                actives={service_mode === item.code && true}
                {...item}
                key={item.id}
              />
            );
          })}
        </div>
      </div>
      <ButtonForms
        type="primary"
        active={buttonActive}
        siguiente={create_deposit_order}
      >
        CREAR ORDEN
      </ButtonForms>
    </div>
  );
};

export default ModalityView;
