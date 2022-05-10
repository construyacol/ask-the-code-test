import React, { Component } from "react";
import DropDownLayout from "./ui/dropdownlayout";
import "./inputStyles.css";

class DropDownContainer extends Component {
  state = {
    elements: this.props.elements,
    open: false,
    placeHolder: this.props.placeholder,
  };

  componentDidUpdate(prevProps) {
    if(prevProps?.elements !== this.props?.elements){
      this.setState({elements:this.props.elements})
    }
  }

  componentDidMount() {
    if (this.props.selected && this.props.elements) {
      const indexOfSelectedElement = this.props.elements.findIndex(
        (element) => element.value === this.props.selected
      );

      this.setState({ 
        placeHolder: this.props.elements[indexOfSelectedElement]?.ui_name,
      });
    }

    // window.addEventListener('click', (e => this.eventHandle(e)))




    // return () =>{
    //   window.removeEventListener('click', e => eventHandle(e))
    // }




    // if(document.querySelector(".InputDesplegable")){
    //   let dropDownEl = document.querySelector(".InputDesplegable")
    //   dropDownEl.addEventListener("click", (e) => {
    //     console.log(e.target)
    //     debugger
    //   })
    // }

  }

  // eventHandle = (e) => {
  //   // console.log('eventHandle', e.target.dataset)
  //   // if(!e.target?.dataset?.drop_down){
  //   //   this.setState({
  //   //     open: null
  //   //   });
  //   // }else{
  //   //   this.setState({
  //   //     open: true
  //   //   });
  //   // }
  // }

  abrir = (e) => {
    this.setState({
      open: !this.state.open,
    });
  };



  selectItem = (event) => {
    // console.log('_________________________________________________________selectItem', this.state.elements, event.target.dataset)
    let value
    if(!event.target.dataset.value){  
      if(event.target.dataset.ui_name === "Cuenta corriente") value = "cuenta_corriente";
      if(event.target.dataset.ui_name === "Cuenta de ahorros") value = "cuenta_ahorro";
      if(event.target.dataset.ui_name === "Depósito electrónico") value = "deposito_electronico";
    }

    const estado = {
      target: {
        name: this.props.name,
        value: event.target.dataset.value || value,
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
