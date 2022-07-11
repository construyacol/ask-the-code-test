import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ToastContainer as ReactToastContainer } from "react-toastify";
import actions from "../../../actions";
import { ToastContainer } from './styles';

class Toast extends Component {
  render() {
    return (
      <ToastContainer>
        <ReactToastContainer />
      </ToastContainer>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(Toast);
