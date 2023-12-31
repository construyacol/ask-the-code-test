import React, { useEffect } from "react";
// import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../actions";
// import SimpleLoader from "../widgets/loaders";
import ItemSettingsInit from "../widgets/itemSettings/";
import { scroller } from "react-scroll";
import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import { useActions } from "../../hooks/useActions";
import { updateLocalForagePersistState } from 'hooks/sessionRestore'
import { SecurityCenterLayout } from '../widgets/layoutStyles'
import TitleSection from '../widgets/titleSectionComponent'
import { SecurityCenterSkeletonLoader } from 'components/widgets/skeletons'
import settings from "api/ui/settings";


const SecurityCenter = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [_, globalState] = useCoinsendaServices();
  const actions = useActions();
  const { security_center } = settings 

  const validate_state = () => {
    if (props.verification_state !== "accepted") {
      scroller.scrollTo("firstInsideContainer", {
        offset: -50,
        duration: 1,
        smooth: true,
        containerId: "containerElement",
      });
      // coinsendaServices.freshChatShowTags(["verify"], "article");
    }
  };

  useEffect(() => {
    validate_state();
    return () => {
      actions.default_video_state();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{
    actions.isAppLoading(true);
    setTimeout(()=>{
      actions.isAppLoading(false);
    }, 100)
    updateLocalForagePersistState(globalState.modelData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState?.modelData?.user?.security_center])


 
  return (
    <>
      <SecurityCenterLayout customClass="securityCenterDetail_" title="Centro de seguridad" {...props}>
        <TitleSection titleKey="security" />
        {props.loader ? (
          <SecurityCenterSkeletonLoader tittleOff />
        ) : (
          security_center && <ItemSettingsInit user={props.user} data={security_center} />
        )}

      </SecurityCenterLayout>
    </>
  );
};

function mapStateToProps(state, props) {
  const { user } = state.modelData;
  const { verification_state } = state.ui;

  return {
    user: user,
    loader: state.isLoading.loader,
    verification_state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityCenter);
