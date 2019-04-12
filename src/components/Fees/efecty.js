import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Table from 'react-bootstrap/lib/Table'

export default props => {
  return (
    <React.Fragment>
      <Col md={12}>
        <h3>Efecty</h3>
      </Col>
      <Col md={12}>
        <hr />
      </Col>
      <Col md={12}>
        <h4>
            Para depositar y recibir, ¿Cuánto es lo mínimo y máximo que puedo realizar por Efecty en una operación?
        </h4>
        <Table responsive bordered striped>
          <tbody>
            <tr>
              <td>Valor Mínimo</td>
              <td>${Number(20000).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Valor Máximo</td>
              <td>${Number(3000000).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={12}>
        <h4>
          Tabla de costos
        </h4>
        <Table responsive bordered striped>
          <thead>
            <tr>
              <th className="text-center">Rango</th>
              <th className="text-center">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">${Number(20000).toLocaleString()} a ${Number(50000).toLocaleString()}</td>
              <td className="text-center">{Number(3.16).toLocaleString()}%</td>
            </tr>
            <tr>
              <td className="text-center">${Number(50001).toLocaleString()} a ${Number(100000).toLocaleString()}</td>
              <td className="text-center">{Number(2.38).toLocaleString()}%</td>
            </tr>
            <tr>
              <td className="text-center">${Number(100001).toLocaleString()} a ${Number(200000).toLocaleString()}</td>
              <td className="text-center">{Number(1.78).toLocaleString()}%</td>
            </tr>
            <tr>
              <td className="text-center">${Number(200001).toLocaleString()} a ${Number(500000).toLocaleString()}</td>
              <td className="text-center">{Number(1.54).toLocaleString()}%</td>
            </tr>
            <tr>
              <td className="text-center">${Number(500001).toLocaleString()} a ${Number(1000000).toLocaleString()}</td>
              <td className="text-center">{Number(1.3).toLocaleString()}%</td>
            </tr>
            <tr>
              <td className="text-center">${Number(1000001).toLocaleString()} a ${Number(3000000).toLocaleString()}</td>
              <td className="text-center">{Number(1.19).toLocaleString()}%</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </React.Fragment>
  )
}
