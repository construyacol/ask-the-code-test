import React from "react";
import Col from "react-bootstrap/lib/Col";
import PanelRight from "../landingPage/pages/PanelRight";
// import './style.css'
const Faq = (props) => {
  return (
    <PanelRight className="helps">
      <Col md={12}>
        <h2>Preguntas más frecuentes</h2>
      </Col>
      <Col md={12}>
        <h3>Creación y verificación de la cuenta</h3>
        <hr />
      </Col>
      <Col md={12}>
        <h4>¿Cómo empezar a utilizar Coinsenda?</h4>
        <p>
          Para empezar a utilizar Coinsenda, debes ir a la opción registrarte en
          la página principal, ingresar tu correo electrónico, asignar una
          contraseña y aceptar los términos y condiciones antes de darle clic en
          el botón registrarte.
          <br />
          Luego recibirás un email en el correo electrónico que utilizaste y
          debes dar clic en activar tu cuenta para confirmar la creación de la
          misma.
        </p>
        <hr />

        <h4>No recibí el Email para activar mi cuenta ¿Qué debo hacer?</h4>
        <p>
          Si no recibiste el correo para activar tu cuenta o no te aparece en tu
          bandeja de entrada, debes revisar en correos no deseados o spam, en
          algunas ocasiones se almacenan ahí. Ahora bien, si no lo encuentras en
          ninguna de estas carpetas puede ser también que utilizaste una
          dirección de correo electrónico incorrecta.
          <br />
          Una forma de verificar si ingresaste bien tu correo es intentar crear
          otra cuenta con el mismo correo. En caso de que lo anterior no
          funcione y no puedas ingresar a tu cuenta, envíanos un correo a
          soporte@coinsenda.com y nosotros te ayudaremos a solucionarlo.
        </p>
        <hr />

        <h4>¿Cómo verificar tu cuenta?</h4>
        <p>
          Tu cuenta estará verificada cuando completes el formulario
          correspondiente y envíes la información solicitada, para hacerlo debes
          ingresar a tu usuario e ir a la opción “Mi Cuenta” “Verificación” y
          seguir los pasos allí indicados, además debes llenar también la
          información en la sección “Información Personal” y darle guardar para
          que tu información sea validada, otras forma de hacerlo es si tu
          cuenta no se encuentra verificada, darle clic en la opción “Verificar
          Cuenta” cuando abres por primera vez el dashboard y completar cada uno
          de los campos, el proceso de verificación puede tardar hasta 24 horas
          hábiles en ser aceptado una vez hayas completado todos los pasos,
          aunque normalmente dura mucho menos.
        </p>
        <hr />

        <h4>¿Por qué debo verificar mi cuenta?</h4>
        <p>
          Como empresa legalmente constituida, damos estricto cumplimiento a la
          política de prevención de lavado de activos y financiación del
          terrorismo, exigiendo así a cada uno de nuestros usuarios que deban
          validar su identidad a la hora de realizar cualquier operación, de
          esta manera tenemos conocimiento de cada cliente que visita nuestra
          plataforma, garantizando poder brindarle a cada uno un servicio seguro
          y completo.
        </p>
        <hr />

        <h4>¿Cuánto tiempo tarda que sea verificada mi cuenta?</h4>
        <p>
          Una vez que hayas completado todos los pasos y cargado la información
          correspondiente, el proceso de verificación puede tardar hasta 24
          horas hábiles, sin embargo, en la mayoría de los casos suele tardar
          mucho menos.
        </p>
        <hr />

        <h4>
          ¿Los datos que me piden para verificar mi cuenta son compartidos?
        </h4>
        <p>
          Coinsenda no comparte tus datos con ninguna organización gubernamental
          ni persona ajena a la compañía, por lo cual tus datos siempre estarán
          seguros.
        </p>

        <hr />
      </Col>
      <Col md={12}>
        <h3>Compra y venta</h3>
        <hr />
      </Col>
      <Col md={12}>
        <h4>¿Cómo comprar Bitcoins?</h4>
        <p>
          Para poder comprar Bitcoins debes ir a la opción “Billeteras”, “COP” y
          luego darle clic a la opción “Depositar”.
        </p>
        <p>
          Indicar el monto – Escoger el medio de pago que desees utilizar –
          Validar que has leído los términos y condiciones de la pagina web y
          confirmar el depósito una vez hayas realizado el pago.
        </p>
        <p>
          Luego de ser verificado tu pago, la plataforma habilitara tus tokens
          para que puedas cambiarlos por Bitcoins cuando quieras en la opción
          “Cambiar” (Para conocer más acerca de cómo funcionan los Tokens, leer
          Términos y condiciones de uso de la página web).
        </p>
        <p>
          Luego de cambiar tus Tokens por Bitcoins puedes retirarlos cuando
          quieras a tu dirección de billetera ingresando a la opción de
          “Billeteras” “Bitcoin”, e ingresar el monto y billetera donde quieres
          recibir tu retiro.
        </p>
        <hr />

        <h4>¿Cómo vender tus Bitcoins?</h4>
        <p>
          Para vender tus Bitcoins por pesos colombianos y poder retirarlos en
          los medios de pago habilitados, primero debes ir a la opción
          “Billetera” “Bitcoin” y escoger la opción “Depositar Bitcoins”.
        </p>
        <p>
          Luego de cargarlos en la plataforma y esperar las confirmaciones
          podrás utilizar la opción “Cambiar”, y allí seleccionar el monto el
          cual deseas cambiar por pesos colombianos teniendo en cuenta la
          cotización que se encuentra en la página al momento de realizar la
          operación.
        </p>
        <p>
          Una vez que tengas saldo cargado en pesos colombianos podrás darle
          clic en la opción “Retirar”, seleccionar el medio de pago completando
          los datos y confirmar tu retiro.
        </p>
        <p>
          Debes tener en cuenta que el tiempo para que se vea reflejado tu
          dinero en el medio de pago que escogiste depende de las políticas de
          la entidad que seleccionaste, sin embargo, en la mayoría de los casos
          es bastante rápido, esto principalmente para usuarios que ya han
          realizado retiros anteriormente en la plataforma ya que su número de
          cuenta se encuentra inscrito con anterioridad.
        </p>
        <hr />

        <h4>
          ¿Puedo volver a retirar mis Bitcoins o saldo en Tokens en caso de no
          realizar ningún intercambio?
        </h4>
        <p>
          Sí, puedes depositar un saldo en Bitcoins en la plataforma y retirarlo
          cuando quieras en caso de no haber realizado ninguna operación.
        </p>
        <p>
          También puedes retirar a tu cuenta un saldo en COP que hayas agregado
          con anterioridad en caso de que hayas decidido no realizar ningún
          intercambio.
        </p>
        <hr />
      </Col>
      <Col md={12}>
        <div className="alert">
          <p>
            Si tienes alguna duda o inquietud adicional puedes escribirnos al
            correo soporte@coinsenda.com o hacer uso de nuestros canales
            corporativos.
          </p>
          <p>
            Recuerda que para realizar cualquier operación en la plataforma
            debes tener tu usuario validado previamente cargando tu información
            personal y documentos.
          </p>
          <p>
            Esto se realiza dando cumplimiento a la política de conocimiento de
            clientes y sistema de prevención contra el lavado de activos y
            financiación del terrorismo.
          </p>
        </div>
      </Col>
    </PanelRight>
  );
};

export default Faq;
