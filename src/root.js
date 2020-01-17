import React from 'react'
import { Router, Route } from 'react-router-dom'
import createBrowserHistory from "history/createBrowserHistory"



const history = createBrowserHistory();


const RootContainer = (props) => {

  return(
    <Router
      history={history}
      >
          <Route path="/" render={() => (<div><h1 style={{color:"white"}}>ROOT CONTAINER</h1></div>)} />

    </Router>
  )

}


export default RootContainer
