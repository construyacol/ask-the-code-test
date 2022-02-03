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
import { skeletonStyle } from "./shareStyles";
import { scroller } from "react-scroll";
import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import Environment from '../../environment'
import { useObserver } from "../hooks/useObserver";
import ReferralActivity from './activity'
import { Route } from "react-router-dom";
import useViewport from '../../hooks/useWindowSize'

const {
  BASE_URL
} = Environment


const REFERRAL_LINK = (refCode) => `${BASE_URL}?ref_code=${refCode}`;

const ReferralComponent = (props) => {

  const { isMovilViewport } = useViewport()
  const { user } = props;
  // const [wasReferralCodeCreated, setWasReferralCodeCreated] = useState(false);
  // const [haveReferraLink, setHaveReferralLink] = useState(false);
  const [referralLink, setReferralLink] = useState("");
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

    // The code below is for test purpose on view skeleton UI
    // setTimeout(() => setLoading(false), 3000)
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
        <ContainerProof >
          {!referralLink && !loading ? (
            <CreateCode coinsendaServices={coinsendaServices}/>
          ) : (
            <ReferralGrid id="referralGrid" className={`${isMovilViewport ? 'isMovil' : ''}`}>

              <PanelLeft className={`fuente ${isMovilViewport ? 'isMovil' : ''}`}>
                <FirstText className={`${loading === true ? "skeleton" : ""}`}>
                  <p>Recibe el <strong className="fuente2">0.5% </strong> de todas las operaciones de compra y venta que tus referidos realicen.</p>
                  <RefCode>
                    <p className="ref__code_title">Código de referido:</p>
                    <p className="refCode__p fuente2">{user?.referral?.ref_code}</p>
                  </RefCode>
                </FirstText>


                <ShareContainer>
                  <ShareSection loading={loading} referralLink={referralLink} />
                  <ShowShareSectionSticky ref={setElement} />
                </ShareContainer>
                {
                  isMovilViewport &&
                  <ReferralCounter loading={loading ? loading.toString() : null} referral={user && user.referral} />
                }

                <ReferralActivity
                  coinsendaServices={coinsendaServices}
                />
              </PanelLeft>

              {
                !isMovilViewport &&
                <PanelRight>
                  <PanelSticky>
                      <ShareSectionContainer className={`${show === false ? 'aparecer' : show === true && 'desaparecer'}`}>
                          <ShareSection loading={loading} referralLink={referralLink} />
                      </ShareSectionContainer>
                    <ReferralCounter loading={loading ? loading.toString() : null} referral={user && user.referral} />
                  </PanelSticky>
                </PanelRight>
              }

            </ReferralGrid>
          )}
      </ContainerProof>
    )}
   />
  );
};



const RefCode = styled.div`
  display:grid;
  grid-template-rows:auto auto;
  grid-template-columns:1fr;
  
  .ref__code_title{
    font-size:18px;
    font-weight:bold;
    margin-bottom: 0px;
  }
  
  .refCode__p{
    margin:0;
    font-size:35px;
  }

`

const ShareContainer = styled.div`
  position: relative;
`

const ContainerProof = styled.div`
  width: 100%;
  height: auto;
  min-height: calc(100vh - 14vh);
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
  top: 140px;
  display: grid;
  justify-items:center;
  row-gap:25px;

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
`

const PanelLeft = styled.section`
  height: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  color: gray;
  row-gap: 20px;
  padding: 0 90px;
  width: calc(100% - 180px);

  section section{
    justify-items:center;
  }

  &.isMovil{
    width: 100%;
    padding: 0;
  }
`

const FirstText = styled.div`
  ${'' /* grid-area: top; */}
  font-size: 16px;
  color: #6b6b6b;
  font-weight: 100;

  &.skeleton {
    p {
      ${skeletonStyle}
      width: fit-content;
      height: 18px;
    }
  }

  @media ${device.laptopL} {
    font-size: 17px;
  }
  @media ${device.tabletL} {
    display: none;
  }
`;

const ReferralGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  column-gap: 50px;
  color: ${FONT_COLOR};
  padding: 100px 50px 50px;
  height: calc(100% - 150px);
  width: calc(100% - 100px);


  ${'' /* font-family: 'Raleway', sans-serif; */}
  transition; all 500ms ease;
  @media ${device.laptopL} {
    width: 90%;
    padding: 0 5%;
    ${'' /* padding: 50px 5%; */}
    height: calc(100% - 100px);
    grid-template-columns: 1fr 340px;
    column-gap: 35px;

    ${PanelLeft}{
      width: 100%;
      padding: 50px 0 0;
      row-gap:0;
    }

  }

  &.isMovil{
    grid-template-columns: 1fr;
    padding: 30px 0 0;
    margin: auto;
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
