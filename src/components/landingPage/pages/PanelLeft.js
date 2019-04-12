import React from 'react'
import Col from 'react-bootstrap/lib/Col'

export default props => {
  const classes = props.className
    ? props.className + ' panel-left'
    : 'panel-left'
  return (
    <Col {...props} sm={3} md={3} lg={2} className={classes}>
      {props.children}
    </Col>
  )
}
