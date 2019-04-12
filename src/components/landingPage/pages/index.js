import React, { Fragment, Component } from 'react'
// import Navbar from '../navbar'
import MenuSuperiorContainer from '../../menuSuperior/menuSuperiorContainer'
import { Router, Route, Switch } from 'react-router-dom'
import Help from './help'
import LegalPage from './legal'
import FeePage from './fees'

import './pages.css'



class PagesRouter extends Component {

  componentDidMount(){
  }

  render(){

    return(
      <div className="PagesRouter">
          <MenuSuperiorContainer/>
          <div className="boardHelp">
            <Router history={this.props.history}>
                <Switch>
                    <Route exact path="/help" component={Help} />
                    <Route path="/help/legal" component={LegalPage} />
                    <Route path="/help/fees" component={FeePage} />
                </Switch>
            </Router>
          </div>
      </div>
    )

  }


}


export default PagesRouter
