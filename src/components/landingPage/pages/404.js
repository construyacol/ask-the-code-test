import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import PanelLeft from '../components/PanelLeft'
import PanelRight from '../components/PanelRight'

export default props => {
  return (
    <Grid fluid>
      <Row>
        <PanelLeft />
        <PanelRight>Not Found</PanelRight>
      </Row>
    </Grid>
  )
}
