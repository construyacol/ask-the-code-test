import React, { Fragment } from "react";
import { ButtonForms } from "../../../widgets/buttons/buttons";
import Marco from "../../../widgets/marco";
import { ACCEPT_FILE_TYPE_ADVANCE_KYC } from "../../../../const/const";
import useKeyActionAsClick from "../../../../hooks/useKeyActionAsClick";

const KycDashBoard = (props) => {
  const {
    step,
    front,
    back,
    selfie,
    goFileLoader,
    prevState,
    animation,
    action,
    animation2,
    id_type,
    base64,
    fileloader,
  } = props;

  const { newfront, newselfie, newback } = base64;
  const idUploadPic = useKeyActionAsClick(
    !fileloader,
    "upload-pic-button",
    13,
    true,
    "onkeyup",
    true
  );

  return (
    <div className="KycDashBoard">
      <div className="imgDashContainer">
        <p className={`fuente ${step > 3 ? "topThree" : ""}`}>
          {step === 1
            ? "1. Frente del documento"
            : step === 2
            ? "2. Revés del documento"
            : step === 3 || step === 4
            ? "3. Selfie con documento y texto"
            : "¡Lo hiciste muy Bien!"}
        </p>
        {/* pasaporte */}

        <Marco type="green">
          <div className={`imgDashContainerD ${animation ? "imgDCAnim" : ""}`}>
            <div className={`imgDashSon`}>
              <img
                className={`imgDashItem ${id_type} ${
                  animation2 ? "frontImg" : ""
                }`}
                src={require(`${front}`)}
                style={{ opacity: prevState === 1 ? "1" : "0", zIndex: 2 }}
                alt=""
                width="100%"
              />
              <img
                className={`imgDashItem ${animation2 ? "backImg" : "backInit"}`}
                src={require(`${back}`)}
                style={{
                  opacity: prevState > 2 || id_type === "pasaporte" ? "0" : "1",
                  zIndex: 1,
                }}
                alt=""
                width="100%"
              />
              <img
                className="imgDashItem"
                src={require(`${selfie}`)}
                style={{ opacity: prevState > 2 ? "1" : "0" }}
                alt=""
                width="100%"
              />
            </div>
          </div>
        </Marco>

        <div
          className="imgDashCarousel"
          style={{
            gridTemplateColumns:
              id_type === "pasaporte" ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            maxWidth: id_type === "pasaporte" ? "260px" : "400px",
          }}
        >
          <div
            className={`imgDashStep ${step === 1 ? "active" : ""}`}
            title="1"
          >
            {!newfront ? (
              <img
                className={`imgDashItem ${id_type}`}
                src={require(`${front}`)}
                alt=""
                width="80"
                title="1"
              />
            ) : (
              <Fragment>
                <img
                  className="imgDashItem"
                  src={newfront}
                  alt=""
                  width="80"
                  title="1"
                />
                <i className="fas fa-check-circle"></i>
              </Fragment>
            )}
          </div>

          {id_type !== "pasaporte" && (
            <div
              className={`imgDashStep ${step === 2 ? "active" : ""}`}
              title="2"
            >
              {!newback ? (
                <img
                  className="imgDashItem"
                  src={require(`${back}`)}
                  alt=""
                  width="80"
                  title="2"
                />
              ) : (
                <Fragment>
                  <i className="fas fa-check-circle"></i>
                  <img
                    className="imgDashItem"
                    src={newback}
                    alt=""
                    width="80"
                    title="2"
                  />
                </Fragment>
              )}
            </div>
          )}

          <div
            className={`imgDashStep ${
              step === 3 || step === 4 ? "active" : ""
            }`}
            title="3"
          >
            {!newselfie ? (
              <img
                className="imgDashItem"
                src={require(`${selfie}`)}
                alt=""
                width="80"
                title="3"
              />
            ) : (
              <Fragment>
                <i className="fas fa-check-circle"></i>
                <img
                  className="imgDashItem"
                  src={newselfie}
                  alt=""
                  width="80"
                  title="3"
                />
              </Fragment>
            )}
          </div>
        </div>

        <div className="controlContainers">
          {step < 4 ? (
            <div className="contButtonUpload">
              <input
                id={!fileloader ? idUploadPic : ""}
                type="file"
                accept={ACCEPT_FILE_TYPE_ADVANCE_KYC.join()}
                onChange={goFileLoader}
              />
              <ButtonForms active={true} type="primary">
                {" "}
                Subir Foto
              </ButtonForms>
            </div>
          ) : (
            <ButtonForms
              active={true}
              type="primary"
              siguiente={action.toggleModal}
            >
              {" "}
              Finalizar
            </ButtonForms>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycDashBoard;