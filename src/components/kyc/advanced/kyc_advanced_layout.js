import React, { useEffect } from "react";
import KycDashBoard from "./dashboard/kycDashboardLayout";
import SimpleSlider from "./carousel/carouselLayout";
// import CropImg from "../../widgets/cropimg";
import SimpleLoader from "../../widgets/loaders";
// import SuccessComponentScreen from "../../widgets/success_screen/success_screen";
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

  const callKycSuccess = async() => {
    await finish()
    const Element = await import("../../forms/widgets/identityKycComponent/success");
    const IdentityKycComponent = Element.default
    return props.action.renderModal(() => <IdentityKycComponent  closeModal={() => props.action.renderModal(null)} />); 
  }

  useEffect(() => {
    if(kyc_success) callKycSuccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kyc_success])


  return (
    <div className="KycAvancedLayout">
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
            </div>
          </div>
        </div>
    </div>
  );
};

export default KycAdvancedLayout;
