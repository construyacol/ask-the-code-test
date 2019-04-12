import React from 'react'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import './style.css'

export default props => {
  return (
    <Grid fluid>
      <Row>
        <Col lg={10} lgOffset={1} className="legals">
          <h2 className="text-center">Políticas de Privacidad</h2>
          <p className="text-right">
            <span className='date hidden-xs'>Última actualización Mayo 2018</span>
          </p>
          <p>
            El equipo de trabajo de INDOPHI agradece la confianza depositada
            en nuestra compañía, como la mejor alternativa para realizar
            operaciones con Bitcoin.
          </p>
          <p>
            Un aviso de privacidad es una comunicación expedida por una
            persona o empresa, en donde le informa a sus grupos de interés,
            como clientes, trabajadores y proveedores, que existe una Política
            de Tratamiento de Datos Personales que establece los derechos,
            obligaciones y procedimientos para proteger sus datos personales.
          </p>
          <p>
            La información comercial y financiera que hemos recibido de
            nuestros grupos de interés, y en general cualquier información,
            será manejada bajo las más estrictas condiciones de
            confidencialidad y seguridad, para evitar su pérdida, fuga o
            uso no autorizado por parte de terceros, dando cumplimiento a
            las normas legales sobre protección de datos personales.
          </p>
          <p>
            El responsable del tratamiento de los datos personales de nuestros
            grupos de interés, recibidos a través del sitio web
            www.coinsenda.com, será la sociedad comercial colombiana
            denominada PHI COLOMBIA S.A.S., identificada con el número
            de identificación tributaria 901.130.547-2, que establece
            como canal de comunicación para atender asuntos relacionados
            con el tratamiento de datos personales el correo electrónico
            info@indophi.com.
          </p>
          <p>
            El tratamiento de datos personales comprende su recolección,
            almacenamiento, uso, transmisión y supresión, respetando las
            normas legales vigentes, así como los compromisos comerciales
            y contractuales acordados con cada usuario o cliente.
          </p>
          <p>
            La finalidad del tratamiento de datos personales, según la clase
            de base de datos gestionada y administrada por INDOPHI, tiene un
            fin legítimo y se detalla a continuación:
          </p>

          <h3>Bases de datos de clientes. Finalidad:</h3>
          <ul>
            <li>
              Mantener un relacionamiento con los clientes del sitio web
              destinado para la compra, venta e intercambio de bienes virtuales.
            </li>
            <li>
              Verificar el cumplimiento de los compromisos adquiridos por los
              clientes y con los clientes.
            </li>
            <li>
              Realizar encuestas de satisfacción con los clientes.
            </li>
            <li>
              Promocionar otros bienes y servicios de la compañía.
            </li>
            <li>
              Actualizar los datos de los clientes.
            </li>
            <li>
              Mantener una relación comercial estable y duradera con los
              clientes.
            </li>
          </ul>
          <h3>Bases de datos de proveedores. Finalidad:</h3>
          <ul>
            <li>
              Solicitar el abastecimiento de bienes y servicios necesarios
              para el desarrollo del objeto social.
            </li>
            <li>
              Realizar los pagos por la venta de bienes o la prestación
              de servicios.
            </li>
            <li>
              Gestionar los certificados tributarios por las retenciones
              tributarias.
            </li>
            <li>
              Actualizar los datos de los proveedores.
            </li>
            <li>
              Mantener una relación comercial estable y duradera con
              los proveedores.
            </li>
          </ul>
          <p>
            La vigencia de las bases de datos será indefinida y permanecerá
            así por el tiempo que razonablemente sea necesaria para realizar
            el tratamiento de datos personales.
          </p>
          <p>
            Son derechos de los titulares de los datos personales sobre los
            cuales INDOPHI realice tratamiento los siguientes:
          </p>
          <ul>
            <li>
              Dirigirse a INDOPHI, a través de los canales establecidos
              por ésta, los cuales se indican en el aviso de privacidad,
              con el fin de conocer, actualizar y rectificar sus datos
              personales. Este derecho se podrá ejercer, entre otros frente
              a datos parciales, inexactos, incompletos, fraccionados,
              que induzcan a error, o aquellos cuyo tratamiento esté
              expresamente prohibido o no haya sido autorizado.
            </li>
            <li>
              Solicitar prueba de la autorización otorgada a INDOPHI salvo
              cuando, de acuerdo con la Ley, el Tratamiento que se está
              realizando no lo requiera.
            </li>
            <li>
              Ser informado por INDOPHI, previa solicitud efectuada a
              través de los canales dispuestos por INDOPHI, respecto del
              uso que ésta le ha dado a sus datos personales.
            </li>
            <li>
              Presentar ante la Superintendencia de Industria y Comercio
              quejas por infracciones a la Ley General y sus decretos
              reglamentarios.
            </li>
            <li>
              Acceder en forma gratuita, a través de los canales dispuestos
              por INDOPHI, a sus datos personales que hayan sido objeto
              de tratamiento.
            </li>
          </ul>
          <p>
            Para conocer la Política de Tratamiento de Datos Personales
            de INDOPHI por favor dirija su solicitud a info@indophi.com,
            así como para realizar cualquier solicitud, queja, reclamo o
            felicitación, por el manejo de sus datos personales.
          </p>
          <br />
          <p className="text-left">
            Atentamente,<br />
            Equipo de trabajo<br />
            INDOPHI
          </p>
        </Col>
      </Row>
    </Grid>
  )
}
