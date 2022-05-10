import React, { Component } from "react";
// import error_travolta from "../../../assets/error.png";
// import errorIcon from "../../../assets/erroricon.png";
// import IconSwitch from '../icons/iconSwitch'
// import * as Sentry from '@sentry/browser';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import "./handleError.css";
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
 
  componentDidMount(){
    if(process.env.NODE_ENV !== 'development'){
      Sentry.init({
        dsn: "https://bb17fc53b9d74ba1a3e514982bbbb28b@o269316.ingest.sentry.io/6258790",
        integrations: [new BrowserTracing()],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        // tracesSampleRate: 1.0,
      }); 
    }
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de repuesto
      return (
        <div className="HandleError">
          <h1 className="fuente">ERROR</h1>
          <p className="fuente">Ha ocurrido un error, intentalo más tarde...</p>
          <div className="contImgError">
            {/* <IconSwitch
              icon="errorState"
              width="100%"
            /> */}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default HandleError;
