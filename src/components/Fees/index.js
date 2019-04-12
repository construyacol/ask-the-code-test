import React from 'react'
// import Col from 'react-bootstrap/lib/Col'
import PanelRight from '../landingPage/pages/PanelRight'
// import Efecty from './efecty'
import Bancolombia from './bancolombia'
import './style.css'

const Fees = props => {
  return (
    <PanelRight className="fees">
      {/* <Efecty /> */}
      <Bancolombia />
    </PanelRight>
  )
}

export default Fees
