import React, { useState, useEffect } from "react";
// import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import { connect } from "react-redux";
import ShareSection from "./share-section";
// import sleep from "../../utils/sleep";
import styled from "styled-components";
import ReferralCounter from "./referral-counter";
// import BalanceSelect from "./balance-select";
// import WithdrawAd from "./withdraw-ad";
import { device, FONT_COLOR } from "../../const/const";
import CreateCode from "./create-code";
// import { skeletonStyle } from "./shareStyles";
import { scroller } from "react-scroll";
import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import Environment from '../../environment'
import { useObserver } from "hooks/useObserver";
import ReferralActivity from './activity'
import { Route } from "react-router-dom";
import useViewport from '../../hooks/useWindowSize'
// import TitleSection from '../widgets/titleSectionComponent'
// import { ReferralLayout } from '../widgets/layoutStyles'
// import CopyContainer from "../widgets/copy/copyContainer";
import SettingElement from 'components/settings/settingElement'
import { ReferralLayout } from 'components/settings/styles'

const {
  BASE_URL
} = Environment


const REFERRAL_LINK = (refCode) => `${BASE_URL}?ref_code=`;
const customLaptoDeviceWidth = "(max-width:1000px)"
const REFERRAL_DATA = {
  value:"referral",
  uiName:"Referidos",
  uiDescription:"Recibe el 0.5% de todas las operaciones de compra y venta que tus referidos realicen.",
  states:{
      uiEnabled:"Habilitado",
      uiDisabled:"Deshabilitado"
  }
}


const ReferralComponent = (props) => {

  const { isMovilViewport, isTabletOrMovilViewport } = useViewport()
  const { user } = props;
  // const [wasReferralCodeCreated, setWasReferralCodeCreated] = useState(false);
  // const [haveReferraLink, setHaveReferralLink] = useState(false);
  const [referralLink, setReferralLink  ] = useState("");
  const [ loading, setLoading ] = useState(true);
  // const [ loading ] = useState(props.setSkeleton ? true : false);
  // const [loading, setLoading] = useState(true)
  const [ coinsendaServices ] = useCoinsendaServices();
  const [show, setElement] = useObserver();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      scroller.scrollTo("firstInsideContainer", {
        offset: 0,
        duration: 0,
        smooth: true,
        containerId: "containerElement",
      });
    });
  }, []);

  const getRef = async() => {
    await coinsendaServices.getReferralCode()
    setLoading(false)
  }

  useEffect(() => {
    if (user && user.referral && user.referral.ref_code) {
      setReferralLink(REFERRAL_LINK(user.referral.ref_code));
    }
    setLoading(false)
  }, [user]);

  useEffect(()=>{
    if (user && user.referral && !user.referral.referred_by) {
      getRef()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Route path="/:primary_path" render={(routeProps) => (
        <ReferralLayout className="ReferralLayout">

          {/* <TitleSection/> */}

          <SettingElement
              itemElement={REFERRAL_DATA}
              isCompleted={user?.referral?.ref_code}
              isLastElement={true}
          />

          {!referralLink && !loading ? (
            <CreateCode coinsendaServices={coinsendaServices}/>
          ) : (
            <ReferralGrid id="referralGrid">

              <PanelLeft className={`fuente ${isMovilViewport ? 'isMovil' : ''} panelLeft`}>

                <ShareContainer>
                  <ShareSection 
                    loading={loading} 
                    referralLink={referralLink} 
                    referral={user?.referral} 
                  />
                  <ShowShareSectionSticky ref={setElement} />
                </ShareContainer>
                  
                {
                  isTabletOrMovilViewport &&
                  <ReferralCounter 
                    loading={loading ? loading.toString() : null} 
                    referral={user && user.referral} 
                  />
                }

                <ReferralActivity
                  coinsendaServices={coinsendaServices}
                />
              </PanelLeft>
             
                <PanelRight>
                  <PanelSticky>
                      <ShareSectionContainer className={`${show === false ? 'aparecer' : show === true && 'desaparecer'}`}>
                          <ShareSection 
                            panelSticky={true}
                            loading={loading} 
                            referralLink={referralLink} 
                            referral={user?.referral} 
                          />
                      </ShareSectionContainer>
                    <ReferralCounter loading={loading ? loading.toString() : null} referral={user && user.referral} />
                  </PanelSticky>
                </PanelRight>

            </ReferralGrid>
          )}
      </ReferralLayout>
    )}
   />
  );
};



// const RefCodeContainer = styled.div`
//   display:flex;
//   background: #dbdbdb;
//   padding: 7px 25px;
//   align-items: center;
//   border-radius: 4px;
//   width: fit-content;
//   p{
//     margin:0;
//     font-size:25px;
//   }
// `

// const RefCode = styled.div`
//   display:grid;
//   grid-template-rows:auto auto;
//   grid-template-columns:1fr;
//   row-gap:10px;
//   .ref__code_title{
//     font-size:17px;
//     font-weight:600;
//     margin-bottom: 0px;
//   }
// `


const ShareContainer = styled.div`
  position: relative;
  max-width: 800px;
`

const ShareSectionContainer = styled.div`
  width: 100%;
  transition: .3s;
  height: 0;
  opacity: 0;

  &.aparecer{
    height: 125px;
    opacity:1;
  }

  &.unappear{
    p{
      opacity: 0;
    }
  }
`


const ShowShareSectionSticky = styled.div`
  width: 100%;
  height: 3px;
  position: absolute;
  top: 0;
`

const PanelSticky = styled.div`
  position: sticky;
  width: 100%;
  max-height: 350px;
  top: 220px;
  display: grid;
  justify-items:center;
  row-gap:25px;
  transform: translateY(-80px);

  .skeleton{
     opacity: 0;
     p{
       opacity: 0;
     }
  }

`


const PanelRight = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  position: relative;

  .sub-text{
    margin:0;
  }

  @media  ${customLaptoDeviceWidth} {
    display:none;
  }

`

const PanelLeft = styled.section`
  height: auto;
  display: grid;
  grid-template-columns:1fr;
  grid-template-rows:auto 1fr;
  color: gray;
  row-gap: 20px;
  padding: 0;
  width: 100%;

  section section{
    justify-items:center;
  }

  @media ${device.mobile} {
    width: 100%;
    padding: 0;
  }
`

// const FirstText = styled.div`
//   font-size: 16px;
//   color: var(--paragraph_color);
//   font-weight: 100;

//   &.skeleton {
//     p {
//       ${skeletonStyle}
//       width: fit-content;
//       height: 18px;
//     }
//   }

//   @media ${device.laptop} {
//     font-size: 17px;
//   }
// `;

const ReferralGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  column-gap: 20px;
  color: ${FONT_COLOR};
  transition: all 500ms ease;



  @media ${device.laptop} {
    ${'' /* height: calc(100% - 100px); */}
    grid-template-columns: minmax(600px, 1fr) minmax(230px,400px);
    column-gap: 15px;

    ${PanelLeft}{
      row-gap:0;
    }
  }

  @media ${device.mobile} {
    ${PanelLeft}{
      row-gap:10px;
    }
  }

  @media ${customLaptoDeviceWidth} {
    grid-template-columns: 1fr;
  }

`;

function mapStateToProps(state, props) {
  const { user } = state.modelData;
  return {
    user: user,
  };
}

export const ReferralComponentAsSkeleton = () => (
  <ReferralComponent setSkeleton={true} />
);

export default connect(mapStateToProps)(ReferralComponent);
