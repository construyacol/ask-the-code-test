import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Table from 'react-bootstrap/lib/Table'

export default props => {
  return (
    <React.Fragment>
      <a name="bancolombia"> &nbsp; </a>
      <Col md={12}>
        <h3>Bancolombia</h3>
      </Col>
      <Col md={12}>
        <hr />
      </Col>
      <Col md={12}>
        <h4>
          Para depositar y recibir, ¿Cuánto es lo mínimo y máximo que puedo realizar por Bancolombia en una operación?
        </h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td>Valor Mínimo</td>
              <td>No hay valores mínimos</td>
            </tr>
            <tr>
              <td>Valor Máximo</td>
              <td>No hay valores máximos</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h3>Costos cuando recibo</h3>
      </Col>
      <Col md={12}>
        <h4>Transferencia de Bancolombia a Bancolombia</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">${Number(3570).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h4>Transferencia a Otros Bancos (ACH)</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">Plaza 1 (Principales) Plaza 2 (Intermedias)</td>
              <td className="text-center">${Number(6664).toLocaleString()} Pesos</td>
            </tr>
            <tr>
              <td className="text-center">Plazas 3</td>
              <td className="text-center">${Number(22491).toLocaleString()} Pesos</td>
            </tr>
            <tr>
              <td className="text-center">Plazas 4</td>
              <td className="text-center">{Number(1.9).toLocaleString()}% del pago</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h3>Costos cuando envío</h3>
      </Col>
      <Col md={12}>
        <h4>Sucursal física</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">Incluye todas las consignaciones en efectivo</td>
              <td className="text-center">${Number(12138).toLocaleString()} Pesos</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h4>Otros medios</h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td className="text-center">Corresponsal Bancario a cuenta empresarial</td>
              <td className="text-center">Mismos costos que sucursal física</td>
            </tr>
            <tr>
              <td className="text-center">PAC Bancario</td>
              <td className="text-center">Tarifas bancarias externas</td>
            </tr>
            <tr>
              <td className="text-center">Cajero</td>
              <td className="text-center">Tarifas bancarias externas</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h4>Inscripción Cuentas Bancarias</h4>
        <p>
          Para recibir en tu cuenta bancaria, o transferir a la cuenta bancaria de la empresa. La inscripción de las cuentas por políticas directas del banco deben realizarse en el horario de lunes a viernes de 6:00 AM a 8:00 PM y sábados de 6:00 AM a 2:00 PM (Días hábiles).
        </p>
        <p>
          Las que se hagan en este rango son aprobadas en dos horas, si se hace fuera de horario quedan para el día hábil siguiente.
        </p>
        <p>
          Recuerda que si tu cuenta ya fue inscrita por la empresa con anterioridad no tendrá que hacerse de nuevo, o si tienes la cuenta de la empresa ya inscrita también podrás transferir cuando quieras sin ningún problema.
        </p>
      </Col>
    </React.Fragment>
  )
}
