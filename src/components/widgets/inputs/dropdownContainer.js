import React, { Component } from "react";
import DropDownLayout from "./ui/dropdownlayout";
import "./inputStyles.css";

class DropDownContainer extends Component {
  state = {
    elements: this.props.elements,
    open: false,
    placeHolder: this.props.placeholder,
  };

  componentDidMount() {
    if (this.props.selected && this.props.elements) {
      const indexOfSelectedElement = this.props.elements.findIndex(
        (element) => element.value === this.props.selected
      );

      this.setState({
        placeHolder: this.props.elements[indexOfSelectedElement].ui_name,
      });
    }
  }

  abrir = (e) => {
    this.setState({
      open: !this.state.open,
    });
  };

  selectItem = (event) => {
    const estado = {
      target: {
        name: this.props.name,
        value: event.target.dataset.value,
      },
    };

    this.setState({
      placeHolder: event.target.dataset.ui_name,
    });

    this.props.actualizarEstado(estado);
  };

  render() {
    const { label, active } = this.props;
    // console.log('DESDE EL CONTENEDOR DEL DROPDOWN::::', this.props)
    return (
      <DropDownLayout
        elements={this.state.elements}
        open={this.state.open}
        abrir={this.abrir}
        placeholder={this.state.placeHolder}
        selectItem={this.selectItem}
        label={label}
        active={active}
      />
    );
  }
}

export default DropDownContainer;
