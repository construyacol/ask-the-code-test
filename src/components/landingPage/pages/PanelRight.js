import React from 'react'
import Col from 'react-bootstrap/lib/Col'

export default props => {
  const classes = props.className
    ? props.className + ' panel-right'
    : 'panel-right'
  return (
    <div id="containerElement" className="contHelpPage">

    <Col {...props} smOffset={3} sm={9} mdOffset={3} md={9} lgOffset={2} lg={10} className={classes}>
      {props.children}
    </Col>

    </div>
  )
}
