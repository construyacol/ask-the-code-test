import React, { Component } from "react";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";

class ToastContainers extends Component {
  // Ejemplo aplicado con propiedades

  // talkToast = () =>{
  //   toast("¡Copiado Exitosamente!", {
  //     position: toast.POSITION.BOTTOM_LEFT,
  //      pauseOnFocusLoss: false,
  //      draggablePercent: 60,
  //      className: "putito",
  //      bodyClassName: "putitoText",
  //      progressClassName: 'putitoProgress',
  //      toastId:1,
  //      autoClose: 2000
  //   });
  // }

  render() {
    return (
      <div className="toastContainer">
        <ToastContainer />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(ToastContainers);
