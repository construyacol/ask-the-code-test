import React, { Component, Fragment } from "react";
import { InputForm } from "../../../widgets/inputs";
import ItemSelectionContainer from "../../../widgets/items/ItemSelectionContainer";
import { InputButton } from "../../../widgets/buttons/buttons";

class RemittanceAccountFlow extends Component {
  render() {
    const {
      update_control_form,
      handleSubmit,
      actualizarEstado,
      account_name,
      bank_name,
      search,
    } = this.props;

    return (
      <Fragment>
        <div className="step1">
          <form onSubmit={handleSubmit}>
            <InputForm
              type="text"
              label="Elige un nombre para tu cuenta de retiro"
              placeholder="Ej. Cuenta de pagos mensuales"
              name="account_name"
              actualizarEstado={actualizarEstado}
              active={search.length === 1 && account_name}
              value={account_name}
            />
            <ItemSelectionContainer
              type="remittance"
              label="Elige la entidad bancaria que deseas asociar"
              itemSelect={bank_name}
              actualizarEstado={actualizarEstado}
              handleSubmit={handleSubmit}
              update_control_form={update_control_form}
            />
            <InputButton
              label="Continuar"
              type="primary"
              active={search.length === 1 && account_name}
            />
          </form>
        </div>
      </Fragment>
    );
  }
}

export default RemittanceAccountFlow;
