import React, { Component } from "react";
import Marco from "../../../widgets/marco";
import { ButtonForms } from "../../../widgets/buttons/buttons";
import Slider from "../../../widgets/slider";
import { getCdnPath } from '../../../../environment'
import "./carousel.css";

export default class SimpleSlider extends Component {
  render() {
    const { onBoarding, continuar } = this.props;

    const config = {
      // pauseOnFocus
      autoSwap: true,
      swapInterval: 7000,
      controls: {
        size: "50px",
      },
    };

    return (
      <div className="SimpleSlider">
        <h1 className="TitleSlider fuente">La foto DEBE ser:</h1>

        <Slider config={config}>
          <div className="SimpleSliderItem">
            <h1 className="fuente">Plana</h1>
            <Marco>
              <img src={`${getCdnPath('assets')}kyc_identity/examples/perspective.png`} alt="" width="80%" />
            </Marco>
            <p className="fuente">
              La fotografía del documento debe ser recta, no puede tener
              perspectiva
            </p>
          </div>

          <div className="SimpleSliderItem">
            <h1 className="fuente">Legible</h1>
            <Marco>
              <img src={`${getCdnPath('assets')}kyc_identity/examples/borroso.png`} alt="" width="80%" />
            </Marco>
            <p className="fuente">
              Asegúrese, que la identificación este totalmente visible y
              enfocada, incluidos su nombre completo, fecha de nacimiento y
              número de identificación.
            </p>
          </div>

          <div className="SimpleSliderItem">
            <h1 className="fuente">Iluminada</h1>
            <Marco>
              <img src={`${getCdnPath('assets')}kyc_identity/examples/oscuro.png`} alt="" width="80%" />
            </Marco>
            <p className="fuente">
              La imagen no debe estar oscura, procure tomarla con iluminación
              natural
            </p>
          </div>

          <div className="SimpleSliderItem">
            <h1 className="fuente">A color</h1>
            <Marco>
              <img src={`${getCdnPath('assets')}kyc_identity/examples/gris.png`} alt="" width="80%" />
            </Marco>
            <p className="fuente">La imagen no debe estar a blanco y negro</p>
          </div>

          <div className="SimpleSliderItem">
            <h1 className="fuente">Entera</h1>
            <Marco>
              <img src={`${getCdnPath('assets')}kyc_identity/examples/sinmarc.png`} alt="" width="100%" />
            </Marco>
            <p className="fuente">
              Asegúrese, que las 4 esquinas del documento se vean completamente
              en el marco de la foto
            </p>
          </div>
        </Slider>

        {onBoarding && (
          <div className="holi">
            <ButtonForms active={true} type="primary" siguiente={continuar}>
              Continuar
            </ButtonForms>
          </div>
        )}
      </div>
    );
  }
}
