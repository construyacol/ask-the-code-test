import React from "react";
import KycLayout from "./kycLayout";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../actions";
import { useState } from "react";
import useToastMessage from "../../hooks/useToastMessage";
import withCoinsendaServices from "../withCoinsendaServices";
import BigNumber from "bignumber.js";
// import moment from "moment";
// import "moment/locale/es";
// moment.locale("es");


const Kyc = (props) => {
  const [reset, setReset] = useState();
  const [financial_success, setFinancial_success] = useState();
  const [identity_success, setIdentity_success] = useState(false);
  const [toastMessage] = useToastMessage();
  const [showSuccess, setShowSuccess] = useState(false);

  const validate_personal_kyc = async () => {
    const { form_kyc_basic, user } = props;
    const { data_state } = form_kyc_basic;


    let config = {
      info: {
        name: data_state.name.trim(),
        surname: data_state.surname.trim(),
        birthday: data_state.birthday,
        address: data_state.address.trim(),
        phone: `+${data_state.country_prefix[0].prefix[0]}${data_state.phone}`,
        city: data_state.city.trim(),
        country: data_state.country[0].code && data_state.country[0].code.trim(),
        id_type: data_state.id_type[0].code && data_state.id_type[0].code.trim(),
        id_number: data_state.id_number.trim(),
        nationality: data_state.nationality[0].code && data_state.nationality[0].code.trim(),
      },
      info_type: "personal",
      verification_level: "level_1",
    };
    
    const _timeStamp = new Date(config.info.birthday).getTime()
    config.info.birthday = BigNumber(_timeStamp).div(1000).toString()

    props.action.isAppLoading(true);

    console.log('updateLevelProfile personal ==> ', config)
    debugger
    return

    let res = await props.coinsendaServices.updateLevelProfile(config, user);
    if (!res) {
      await props.action.ReduceStep("kyc_basic", 1);
      props.action.isAppLoading(false);
      toastMessage(
        "No puedes verificarte en este momento, intenta más tarde",
        "error"
      );
      return props.action.ReduceStep("kyc_global_step", 1);
    }
    const { data } = res;
    const { personal } = data;

    let user_update = {
      ...user,
      ...personal,
      levels: {
        ...user.levels,
        personal: "confirmed",
      },
      security_center: {
        ...user.security_center,
        kyc: {
          ...user.security_center.kyc,
          basic: "confirmed",
        },
      },
      country:user.country
    };

    await props.coinsendaServices.updateUser(user_update);

    props.action.IncreaseStep("kyc_global_step");
    props.action.success_sound();
    props.action.isAppLoading(false);
    setShowSuccess(true);
    // setTimeout(()=>{
    // props.action.isAppLoading(false)
    // props.action.ReduceStep('kyc_basic')
    // },1000)
    // }, 3000)
  };

  const validate_identity_kyc = async ({ base64 }) => {
    const { user } = props;
    const { newselfie, newfront, newback } = base64;

    let config = {
      info: {
        selfie: newselfie,
        id_front: newfront,
        id_back: user.id_type === "pasaporte" ? newfront : newback,
      },
      info_type: "identity",
      verification_level: "level_1",
    };
    props.action.isAppLoading(true);
    let res = await props.coinsendaServices.updateLevelProfile(config, user);
    // console.log('||||||||||| VALIDATE_RES', res)
    if (!res) {
      await props.action.ReduceStep("kyc_advanced", 1);
      await setReset(true);
      props.action.isAppLoading(false);
      return toastMessage(
        "No puedes verificarte en este momento, intenta más tarde",
        "error"
      );
    }

    let user_update = {
      ...user,
      levels: {
        ...user.levels,
        identity: "confirmed",
      },
      security_center: {
        ...user.security_center,
        kyc: {
          ...user.security_center.kyc,
          advanced: "confirmed",
        },
      },
    };
    // console.log('||||||||||| VALIDATE_IDENTITY_kyc', user_update)
    await props.coinsendaServices.updateUser(user_update);

    props.action.isAppLoading(false);
    setIdentity_success(true);
    setShowSuccess(true);
    return true;
  };

  const validate_financial_kyc = async (info) => {
    const { user } = props;
    let config = {
      info,
      info_type: "financial",
      verification_level: "level_2",
    };

    let res = await props.coinsendaServices.updateLevelProfile(config, user);
    if (!res) {
      // await props.action.ReduceStep('kyc_basic', 1)
      props.action.isAppLoading(false);
      return toastMessage(
        "No puedes verificarte en este momento, intenta más tarde",
        "error"
      );
    }
    props.action.success_sound();

    setFinancial_success(true);
    let user_update = {
      ...user,
      levels: {
        ...user.levels,
        financial: "confirmed",
      },
      security_center: {
        ...user.security_center,
        kyc: {
          ...user.security_center.kyc,
          financial: "confirmed",
        },
      },
    };
    // console.log('||||||||||| VALIDATE_IDENTITY_kyc', user_update)
    await props.coinsendaServices.updateUser(user_update);
    props.action.isAppLoading(false);
    setShowSuccess(true);
  };

  const siguiente = () => {
    props.action.IncreaseStep("kyc_global_step");
    setShowSuccess(false);
  };

  const exit = () => {
    props.action.toggleModal(false);
    setShowSuccess(false);
  };

  return (
    <KycLayout
      validate_personal_kyc={validate_personal_kyc}
      validate_identity_kyc={validate_identity_kyc}
      validate_financial_kyc={validate_financial_kyc}
      siguiente={siguiente}
      showSuccess={showSuccess}
      exit={exit}
      {...props}
      {...{
        reset,
        financial_success,
        identity_success,
      }}
    />
  );
};

function mapStateToProps(state, props) {
  // console.log('S T A T E -- K Y C --- C O N T A I N E R', state)
  const { user } = state.modelData;
  const { current } = state.form;

  return {
    loader: state.isLoading.loader,
    globalStep: state.form.globalStep,
    user: user,
    form_kyc_basic: state.form.form_kyc_basic,
    current,
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
)(withCoinsendaServices(Kyc));
