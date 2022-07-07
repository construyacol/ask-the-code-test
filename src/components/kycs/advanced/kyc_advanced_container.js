import React, { Component } from "react";
import KycAdvancedLayout from "./kyc_advanced_layout";
import { readFile, img_compressor, includesAnyImageMime } from "../../../utils";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import withCoinsendaServices from "../../withCoinsendaServices";
import { getCdnPath } from '../../../environment'
import { history } from '../../../const/const'

class KycAdvancedContainer extends Component {

  state = {
    kyc_success: false,
    front:
      this.props.user.id_type === "pasaporte"
        ? `${getCdnPath('assets')}kyc_identity/front_passport.png`
        : `${getCdnPath('assets')}kyc_identity/front.png`,
    back: `${getCdnPath('assets')}kyc_identity/back.png`,
    selfie:
      this.props.user.id_type === "pasaporte"
        ? `${getCdnPath('assets')}kyc_identity/selfie_passport.png`
        : `${getCdnPath('assets')}kyc_identity/selfie.png`,
    newfront:
      this.props.user.id_type === "pasaporte"
        ? `${getCdnPath('assets')}kyc_identity/front_passport.png`
        : `${getCdnPath('assets')}kyc_identity/front.png`,
    newback: `${getCdnPath('assets')}kyc_identity/back.png`,
    newselfie:
      this.props.user.id_type === "pasaporte"
        ? `${getCdnPath('assets')}kyc_identity/selfie_passport.png`
        : `${getCdnPath('assets')}kyc_identity/selfie.png`,
    id_type: this.props.user.id_type,
    dashboard: window.innerWidth > 768 ? true : false,
    fileloader: false,
    prevState: this.props.step,
    animation: false,
    animation2: false,
    onBoarding: window.innerWidth > 768 ? false : true,
    topOnBoarding: 0,
    imageSrc: null,
    base64: { ...this.props.base64 },
  };



  async componentDidMount() {
    await this.props.action.CurrentForm("kyc_advanced");
    if (this.props.current === "kyc_advanced") {
      this.props.action.isAppLoading(false);
      history.push(`?form=identity_front_upload`);
    }
  }

  componentWillUnmount() {
    document.onkeydown = false;
  }

  componentDidUpdate(prevProps, state) {
    // inserto las siguientes rutas para poder hacer seguimiento al funnel desde hotjar
    if (
      prevProps.step === this.props.step &&
      this.props.current === "kyc_advanced"
    ) {
      return;
    }
    // console.log('||||||||||||||||||||||||||||||| componentDidUpdate KYC ADVANCE ===> ', prevProps.step, this.props.step, this.props)

    const { reset, step } = this.props;
    if (reset) {
      this.setState({
        animation: false,
        animation2: false,
        prevState: 1,
      });
    }
    if (step === 2) {
      setTimeout(() => {
        this.setState({ animation: true });
      }, 1);
      setTimeout(() => {
        this.setState({ animation2: true });
      }, 300);
    }
    if (this.props.user !== prevProps.user) {
      this.setState({
        front:
          this.props.user.id_type === "pasaporte"
            ? "./docs/front_passport.png"
            : "./docs/front.png",
        selfie:
          this.props.user.id_type === "pasaporte"
            ? "./docs/selfie_passport.png"
            : "./docs/selfie.png",
        newfront:
          this.props.user.id_type === "pasaporte"
            ? "./docs/front_passport.png"
            : "./docs/front.png",
        newselfie:
          this.props.user.id_type === "pasaporte"
            ? "./docs/selfie_passport.png"
            : "./docs/selfie.png",
        id_type: this.props.user.id_type,
      });
    }

    //
    let route;
    //

    if (this.props.step === 2) {
      route = `?form=identity_back_upload`;
    }

    if (this.props.step === 3) {
      route = `?form=identity_selfie_upload`;
    }

    if (this.props.step === 4) {
      route = `?form=identity_files_uploaded_success`;
    }
    history.push(route);
  }

  goFileLoader = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      this.props.action.isAppLoading(true);
      const file = await img_compressor(e.target.files[0]);
      const imageDataUrl = await readFile(file);
      const isAnImage = includesAnyImageMime(imageDataUrl.split(",")[1])
      if(!isAnImage){
        this.props.action.isAppLoading(false);
        return alert('Solo se aceptan imagenes')
      }
      this.props.action.isAppLoading(false);

      await this.subirImg({
        urlImg:imageDataUrl,
        base64:imageDataUrl,
      })

      this.setState({
        imageSrc: imageDataUrl,
        fileloader: !this.state.fileloader,
      });
    }
  };


  subirImg = (img) => {
    this.props.action.isAppLoading(true);
    const { urlImg, base64 } = img;
    // simulamos llamado del endpoint para guardar imagen
    // setTimeout(() => {
      this.props.action.isAppLoading(false);
      this.setState({
        fileloader: !this.state.fileloader,
      });

      this.updateLocalImg(urlImg, base64);
      this.props.toastMessage("¡Imagen cargada con éxito!", "success");
    // }, 2000);
  };

  updateLocalImg = async (img, base64) => {
    const name =
      this.props.step === 1
        ? "newfront"
        : this.props.step === 2
        ? "newback"
        : "newselfie";
    // this.props.action.UpdatePicKyc({[name]:img})
    await this.setState({
      [name]: base64,
      base64: {
        ...this.state.base64,
        [name]: base64,
      },
      imageSrc: null,
    });

    await this.props.action.UpdateForm("kyc_advanced", this.state);

    if (this.props.step <= 3) {
      return setTimeout(() => {
        this.stepChange();
      }, 700);
    }
  };

  cancelarSubidaImg = () => {
    this.setState({
      fileloader: false,
    });
  };

  continuar = () => {
    this.setState({
      topOnBoarding: -100,
    });
  };

  stepChange = async () => {
    // manejo esta estructura ya que el estep tambien se podrá alterar al dar click en los elementos ./kycDashboardLayout.js=>.imgDashStep
    // const currentStep = step.target.title
    if (this.props.user.id_type === "pasaporte" && this.props.step === 1) {
      this.setState({ prevState: 3 });
      return this.props.action.IncreaseStep("kyc_advanced", 3);
    }

    const prevStep = this.props.step;
    await this.props.action.IncreaseStep("kyc_advanced");
    const currentStep = this.props.step;

    // console.log(`DEBUGEANDO ANDO::::::-----____----- CURRENT: ${currentStep} -- PREVSTEP: ${prevStep}`)

    if (currentStep === prevStep) {
      return false;
    }
    await this.setState({
      animation: false,
    });

    // console.log(`|||||| KYC CONTAINER Steps current ${currentStep} , prev ${prevStep}`, this.props)
    // if(currentStep != 3 && prevStep != 3){

    // Ejecutamos este if para aplicar la animacion de la cedula
    if (currentStep < 3) {
      setTimeout(() => {
        this.setState({ animation: true });
      }, 1);
      setTimeout(() => {
        this.setState({ animation2: true });
      }, 300);
      return setTimeout(() => {
        this.setState({
          prevState: currentStep,
        });
      }, 500);
    }

    this.setState({
      prevState: currentStep,
    });

    // Si todo sale bien, Finalizamos y enviamos la información para validar en el back
    // console.log('||||||||| currentStep', currentStep)
    const { base64 } = this.state;
    const { newfront, newback, newselfie } = base64;

    if (
      (newfront && newback && newselfie) ||
      (newfront && newselfie && this.props.user.id_type === "pasaporte")
    ) {
      let finish_kyc_advanced = await this.props.validate_identity_kyc(this.state);
      if (finish_kyc_advanced) {
        return this.setState({ kyc_success: true });
      }else{
        await this.setState({
          base64: {
            newfront:null,
            newback:null,
            newselfie:null
          },
        })
        this.props.action.UpdateForm("kyc_advanced", this.state);
      }
    }
  };
  
  finish = () => {
    if(this.props.isModalVisible){
      this.props.action.toggleModal();
    }
  };

  render() {
    console.log('||||||||||||||||||| KYC ADVANCED ==> getCdnPath ==> ', `${getCdnPath('assets')}kyc_identity/back.png`)
 

    return (
      <KycAdvancedLayout
        stepChange={this.stepChange}
        goFileLoader={this.goFileLoader}
        continuar={this.continuar}
        subirImg={this.subirImg}
        cancelarSubidaImg={this.cancelarSubidaImg}
        finish={this.finish}
        {...this.state}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state, props) {
  const { user } = state.modelData;
  const { current, isModalVisible } = state.form;
  return {
    loader: state.isLoading.loader,
    step: state.form.form_kyc_advanced.step,
    base64: state.form.form_kyc_advanced.base64,
    user: user,
    current,
    isModalVisible
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCoinsendaServices(KycAdvancedContainer));
