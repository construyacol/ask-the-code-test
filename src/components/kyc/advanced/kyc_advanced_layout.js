import React from "react";
import KycDashBoard from "./dashboard/kycDashboardLayout";
import SimpleSlider from "./carousel/carouselLayout";
// import CropImg from "../../widgets/cropimg";
import SimpleLoader from "../../widgets/loaders";
import SuccessComponentScreen from "../../widgets/success_screen/success_screen";
import "../kyc.css";

const KycAdvancedLayout = (props) => {
  const {
    dashboard,
    // fileloader,
    onBoarding,
    continuar,
    topOnBoarding,
    loader,
    step,
    kyc_success,
    finish,
  } = props;

  return (
    <div className="KycAvancedLayout">
      {!kyc_success ? (
        <div
          className={`containerKycAvanced ${
            dashboard && step < 5 ? "desktop" : ""
          }`}
          style={{ top: `${topOnBoarding}vh` }}
        >
          {step < 5 && window.innerWidth > 768 && (
            <div className="KYCAstep KycOnboarding">
              <SimpleSlider onBoarding={onBoarding} continuar={continuar} />
            </div>
          )}

          <div className="KYCAstep KycDashboard">
            <div className="KycprogressBar">
              <div
                className="kycPropgressed"
                style={{
                  width:
                    step === 1
                      ? "0%"
                      : step === 2
                      ? "33%"
                      : step === 3
                      ? "66%"
                      : "100%",
                }}
              ></div>
            </div>
            {loader && (
              <div className="auxDesma">
                <SimpleLoader label="cargando" />
              </div>
            )}

            <div
              className={`KycDashContainer`}
              // className={`KycDashContainer ${fileloader ? "fileloader" : ""}`}
            >
              <KycDashBoard {...props} />
              {/* <div className="ssoa">
                <CropImg {...props} />
              </div> */}
            </div>
          </div>
        </div>
      ) : (
        <SuccessComponentScreen
          {...props}
          confetti={true}
          cta_secondary={false}
          title="!Lo has hecho muy bien!, tus documentos han sido enviados exitosamente y nuestro sistema se encuentra verificándolos."
          classes="long_msg"
          cta_primary_text="Finalizar"
          siguiente={finish}
          user_name={props.user.name}
        />
      )}
    </div>
  );
};

export default KycAdvancedLayout;
