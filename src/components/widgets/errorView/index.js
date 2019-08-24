import React, { Component } from 'react'
import error_travolta from '../../../assets/error.gif'
import errorIcon from '../../../assets/erroricon.png'
// import * as Sentry from '@sentry/browser';
import './handleError.css'

// Sentry.init({dsn: "https://5cae2e853bb1487cbd40c223556d3760@sentry.io/1478048"});

class HandleError extends Component  {

   state = {
     handleError:false,
     error:""
   }

   componentDidCatch(error, info){
     // Sentry.captureException(error);
     this.setState({handleError:true, error})
   }

   render(){
     if(this.state.handleError){
       return(
         <div className="HandleError">
           <img src={errorIcon} alt="" width="70"/>
           <h1 className="fuente">ERROR</h1>
           <p className="fuente">Ha ocurrido un error, intentalo mas tarde...</p>
           <div className="contImgError">
             <img src={error_travolta} alt="" width="100%"/>
           </div>
         </div>
       );
     }
     return this.props.children
   }

}

export default HandleError
