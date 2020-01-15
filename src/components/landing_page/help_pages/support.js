import React from 'react'
import IconSwitch from '../../widgets/icons/iconSwitch'


export default props => {


  return (
    <section className="HeaderLanding support">

      <div id="Headers">
        <span className="header_first"></span>
        <span className="header_second"></span>
        <span className="header_third"></span>
        <span className="header_four"></span>
        <span className="header_five"></span>
      </div>

      <div className="supportSections">

        <h1 className="fuente">Lineas de soporte</h1>

        <a href="https://wa.me/573117656310" target="_blank" rel="noopener noreferrer">
          <div className="supportOption">
            <div className="supportImg">
              <IconSwitch icon="whatsapp" size={50} />
            </div>
            <h2 className="supportText fuente">WhatsApp</h2>
            <p className="supportText fuente">Hablemos por Whatsapp</p>
          </div>
        </a>

        <a href="https://t.me/Coinsendaoficial" target="_blank" rel="noopener noreferrer">
        <div className="supportOption">
          <div className="supportImg">
            <IconSwitch icon="telegram" size={50} />
          </div>
          <h2 className="supportText fuente">Telegram</h2>
          <p className="supportText fuente">Hablemos por Telegram</p>
        </div>
      </a>

      <div onClick={props.action.other_modal_toggle}>
        <div className="supportOption">
          <div className="supportImg">
            <IconSwitch icon="zammad" size={50} />
          </div>
          <h2 className="supportText fuente">Zammad</h2>
          <p className="supportText fuente">Abre un ticket de soporte</p>
        </div>
      </div>

      {/* <a href="https://soporte.coinsenda.com/" target="_blank" rel="noopener noreferrer">
        <div className="supportOption">
          <div className="supportImg">
            <IconSwitch icon="zammad" size={50} />
          </div>
          <h2 className="supportText fuente">Zammad</h2>
          <p className="supportText fuente">Abre un ticket de soporte</p>
        </div>
      </a> */}

      </div>



    </section>
  )
}
