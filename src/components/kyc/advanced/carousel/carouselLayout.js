import React, { Component } from "react";
import "./carousel.css";
import Marco from "../../../widgets/marco";
import { ButtonForms } from "../../../widgets/buttons/buttons";
import perspective from "../../../../assets/docs/perspective.png";
import borroso from "../../../../assets/docs/borroso.png";
import oscuro from "../../../../assets/docs/oscuro.png";
import gris from "../../../../assets/docs/gris.png";
import sinmarc from "../../../../assets/docs/sinmarc.png";
import Slider from "../../../widgets/slider";

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
              <img src={perspective} alt="" width="80%" />
            </Marco>
            <p className="fuente">
              La fotografía del documento debe ser recta, no puede tener
              perspectiva
            </p>
          </div>

          <div className="SimpleSliderItem">
            <h1 className="fuente">Legible</h1>
            <Marco>
              <img src={borroso} alt="" width="80%" />
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
              <img src={oscuro} alt="" width="80%" />
            </Marco>
            <p className="fuente">
              La imagen no debe estar oscura, procure tomarla con iluminación
              natural
            </p>
          </div>

          <div className="SimpleSliderItem">
            <h1 className="fuente">A color</h1>
            <Marco>
              <img src={gris} alt="" width="80%" />
            </Marco>
            <p className="fuente">La imagen no debe estar a blanco y negro</p>
          </div>

          <div className="SimpleSliderItem">
            <h1 className="fuente">Entera</h1>
            <Marco>
              <img src={sinmarc} alt="" width="100%" />
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
