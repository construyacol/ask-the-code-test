import React from 'react'

import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import MenuItem from 'react-bootstrap/lib/MenuItem'

import { LinkContainer } from 'react-router-bootstrap'

import PanelLeft from './PanelLeft'
import Faq from '../../FAQ'

export default props => {
  return (
    <Grid fluid>
      <Row className="rowFAQ">
        <PanelLeft className='help-menu'>
          <h4>AYUDA</h4>
          <ul>
            <LinkContainer to="/dashboard">
              <MenuItem>
                <i className="fa fa-home fa-fw" />
                <span>Inicio</span>
              </MenuItem>
            </LinkContainer>
          </ul>
        </PanelLeft>
        <Faq />
      </Row>
    </Grid>
  )
}
