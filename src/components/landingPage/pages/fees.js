import React from 'react'

import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import MenuItem from 'react-bootstrap/lib/MenuItem'

import { LinkContainer } from 'react-router-bootstrap'

import PanelLeft from './PanelLeft'
import Faq from '../../Fees'

export default props => {
  return (
    <Grid fluid>
      <Row className="rowFAQ">
        <PanelLeft className='help-menu'>
          <h4>Tarifas de uso</h4>
          <ul>
            <LinkContainer to="/dashboard">
              <MenuItem>
                <i className="fa fa-home fa-fw" />
                <span>Inicio</span>
              </MenuItem>
            </LinkContainer>
            {/* <li role="presentation">
              <a href="#efecty">Efecty</a>
            </li>
            <li role="presentation">
              <a href="#bancolombia">Bancolombia</a>
            </li> */}
          </ul>
        </PanelLeft>
        <Faq />
      </Row>
    </Grid>
  )
}
