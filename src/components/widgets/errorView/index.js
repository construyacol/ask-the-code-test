import React, { Component } from 'react'
import error_travolta from '../../../assets/error.png'
import errorIcon from '../../../assets/erroricon.png'
// import * as Sentry from '@sentry/browser';
import './handleError.css'

// Sentry.init({dsn: "https://5cae2e853bb1487cbd40c223556d3760@sentry.io/1478048"});

class HandleError extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Sentry.captureException(error);
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de repuesto
      return (
        <div className="HandleError">
          <img src={errorIcon} alt="" width="70" />
          <h1 className="fuente">ERROR</h1>
          <p className="fuente">Ha ocurrido un error, intentalo más tarde...</p>
          <div className="contImgError">
            <img src={error_travolta} alt="" width="100%" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default HandleError
