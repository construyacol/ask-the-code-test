import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Table from 'react-bootstrap/lib/Table'

export default props => {
  return (
    <React.Fragment>
      <a name="bancolombia"> &nbsp; </a>
      <Col md={12}>
        <h3>Tarifas de uso / Límites de depósitos y retiros</h3>
      </Col>
      <Col md={12}>
        <hr />
      </Col>
      <Col md={12}>
        <h4>
          Para depositar y retirar, ¿Cuál es el mínimo y máximo por cuenta bancaria en una operación?
        </h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td>Valor mínimo</td>
              <td>$ 20.000</td>
            </tr>
            <tr>
              <td>Valor máximo</td>
              <td>No hay valores máximos</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h3>Costo de retiro</h3>
      </Col>
      <Col md={12}>
        <h4>Retiro a Bancolombia</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">$3.570</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h4>Retiros a Otros Bancos (ACH)</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">$ 6.664</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h3>Costos de depósito</h3>
      </Col>
      <Col md={12}>
        <h4>Sucursal física o Corresponsal bancario</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">Incluye todos los depósitos en efectivo</td>
              <td className="text-center">$13.000 </td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h4>Otros medios</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">Sucursal Virtual o APP</td>
              <td className="text-center">Sin costo</td>
            </tr>
            <tr>
              <td className="text-center">PAC Bancario</td>
              <td className="text-center">Sin costo</td>
            </tr>
            <tr>
              <td className="text-center">Cajero (Traslados)</td>
              <td className="text-center">Sin costo</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h4>Inscripción Cuentas Bancarias</h4>
        <p>
          La inscripción de las cuentas, por políticas directas del banco, deben realizarse en el horario de lunes a viernes de 6:00 AM a 8:00 PM y sábados de 6:00 AM a 2:00 PM (Días hábiles).
        </p>
        <p>
          Las inscripciones que se hagan en este rango son aprobadas en dos horas. Si se hace fuera de ese horario quedan para el día hábil siguiente.
        </p>
      </Col>

      <Col md={12}>
        <h3>Bitcoin</h3>
      </Col>
      <Col md={12}>
        <h4>Fee de la red Bitcoin</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">0.0005 BTC</td>
            </tr>
          </tbody>
        </Table>
      </Col>

    </React.Fragment>
  )
}
