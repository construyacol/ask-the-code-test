import React, { Component } from "react";
import InputForm from "../../inputs";

class PhoneView extends Component {
  state = {
    status: "",
  };

  actualizarEstado = (p) => {
    const { payload } = this.props;

    const { value } = p.target;

    if (value.length > 6 && value !== payload) {
      this.setState({
        status: "",
      });
      return this.props.update_state({
        buttonActive: true,
        data: value,
      });
    }

    if (value.length > 6 && value === payload) {
      this.setState({
        status:
          "Tu nuevo número no puede coincidir con el número actual, cambialo.",
      });
    }
    return this.props.update_state({
      buttonActive: false,
      data: value,
    });
  };

  render() {
    const { description, placeholder, code, type, buttonActive } = this.props;

    const { status } = this.state;

    return (
      <InputForm
        type={type}
        label={description}
        placeholder={placeholder}
        name={code}
        actualizarEstado={this.actualizarEstado}
        active={buttonActive}
        status={status}
        // value={name}
      />
    );
  }
}

export default PhoneView;
