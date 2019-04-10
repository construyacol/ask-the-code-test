import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
// import Button from 'react-bootstrap/lib/Button'
import PricesWidget from '../PricesWidget'
import './style.css'

const PricesModal = props => {
  return (
    <Modal
      bsSize="large"
      show={props.open}
      onHide={props.closeHandler}>
      <Modal.Header closeButton>
        <h3 className="text-center">Coinsenda</h3>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12}>
            <PricesWidget classes="nav for-modal" />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
          <div onClick={props.closeHandler}>
            Cerrar
          </div>
      </Modal.Footer>
    </Modal>
  )
}

export default PricesModal
