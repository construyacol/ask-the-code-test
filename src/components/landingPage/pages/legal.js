import React, { Component } from 'react';
import MenuItem from 'react-bootstrap/lib/MenuItem'
import { Router, Switch, Route } from 'react-router'
import Terms from '../../Legal/Terms'
import Privacy from '../../Legal/Privacy'
import { LinkContainer } from 'react-router-bootstrap'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import PanelLeft from './PanelLeft'
import PanelRight from './PanelRight'

export default class Profile extends Component {


  constructor (props) {
    super (props)
    this.state = {key: props.location.pathname}
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(key, ...args) {
    this.props.history.push(key)
  }

  render() {

    return (
      <Grid fluid>
        <Row className="rowFAQ">
          <PanelLeft className='legal-menu'>
            <h4>LEGAL</h4>
            <ul>
              <LinkContainer to="/">
                <MenuItem>
                  <i className="fa fa-home fa-fw" />
                  <span>Inicio</span>
                </MenuItem>
              </LinkContainer>

              <LinkContainer to="/help/legal/terms" isActive={()=>false}>
                <MenuItem>Términos de Uso</MenuItem>
              </LinkContainer>
              <LinkContainer to="/help/legal/privacy" isActive={()=>false}>
                <MenuItem>Políticas de Privacidad</MenuItem>
              </LinkContainer>
            </ul>
          </PanelLeft>
          <PanelRight>
            <Router history={this.props.history}>
              <Switch>
                <Route path="/help/legal/privacy" component={Privacy} />
                <Route path="*" component={Terms} />
              </Switch>
            </Router>
          </PanelRight>
        </Row>
      </Grid>
    );
  }
}
