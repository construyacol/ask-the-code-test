import React, { useState, useEffect } from "react";
import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import { connect } from "react-redux";
import ShareSection from "./share-section";
import sleep from "../../utils/sleep";
import styled from "styled-components";
import ReferralCounter from "./referral-counter";
import BalanceSelect from "./balance-select";
import WithdrawAd from "./withdraw-ad";
import { device } from "../../const/const";
import CreateCode from "./create-code";
import { FONT_COLOR, skeletonStyle } from "./shareStyles";
import { scroller } from "react-scroll";
import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import Environment from '../../environment'
import { useObserver } from "../hooks/useObserver";
import ReferralActivity from './activity'
import { Route } from "react-router-dom";


const {
  BASE_URL
} = Environment


const REFERRAL_LINK = (refCode) => `${BASE_URL}?ref_code=${refCode}`;

const ReferralComponent = (props) => {

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

  useEffect(() => {
    if (user && user.referral && user.referral.ref_code) {
      setReferralLink(REFERRAL_LINK(user.referral.ref_code));
    }
  }, [user]);

  useEffect(()=>{
    const getRef = async() => {
      await coinsendaServices.getReferralCode()
      setLoading(false)
    }
    getRef()
  }, [])



  return (
    <Route path="/:primary_path" render={(routeProps) => (
        <ContainerProof>
          {!referralLink && !loading ? (
            <CreateCode coinsendaServices={coinsendaServices}/>
          ) : (
            <ReferralGrid id="referralGrid">

              <PanelLeft className="fuente">
                <FirstText className={`${loading === true ? "skeleton" : ""}`}>
                  <p>
                    Invita amigos con tu link de referido y gana el{" "}
                    <strong className="fuente2">0.5%</strong> de comisión sobre todas sus operaciones.
                  </p>
                </FirstText>
                <ShareContainer>
                  <ShareSection loading={loading} referralLink={referralLink} />
                  <ShowShareSectionSticky ref={setElement} />
                </ShareContainer>
                <ReferralActivity coinsendaServices={coinsendaServices}/>
              </PanelLeft>

              <PanelRight>
                <PanelSticky>
                    <ShareSectionContainer className={`${show === false ? 'aparecer' : show === true && 'desaparecer'}`}>
                      <ShareSection loading={loading} referralLink={referralLink} />
                    </ShareSectionContainer>

                  <ReferralCounter loading={loading ? loading.toString() : null} referral={user && user.referral} />
                </PanelSticky>
              </PanelRight>

            </ReferralGrid>
          )}
      </ContainerProof>
    )}
   />
  );
};


{/* <ShareSectionContainer/> */}
{/* <BalanceSelect loading={loading ? loading.toString() : null} /> */}
{/* <WithdrawAd loading={loading ? loading.toString() : null} /> */}


const ShareContainer = styled.div`
  position: relative;
`

const ContainerProof = styled.div`
  width: 100%;
  height: auto;
  min-height: calc(100vh - 14vh)
`

const ShareSectionContainer = styled.div`
  width: 100%;
  transition: .3s;
  height: 0;

  &.aparecer{
    height: 125px;
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
  row-gap: 40px;
  padding: 0 90px;
  width: calc(100% - 180px);

  section section{
    justify-items:center;
  }
`

const FirstText = styled.div`
  ${'' /* grid-area: top; */}
  font-size: 16px;
  color: black;
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


  ${'' /* transform: scale(.96);
  padding: 0 10%;
  padding-top: 100px;
  width: 80%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 0.5fr 1.5fr;
  grid-template-rows: 0.35fr 0.5fr 1.5fr;
  gap: 0px 8%;
  grid-template-areas: "top top top top" "mid-left mid-left mid-left mid-right" "bottom-left bottom-left bottom-left bottom-right";
  color: ${FONT_COLOR};
  font-family: 'Raleway', sans-serif; */}
  transition; all 500ms ease;
  @media ${device.laptopL} {
    width: 90%;
    padding: 0 5%;
  }
  @media ${device.tabletL} {
    ${'' /* height: calc(100vh - 100px);
    min-height: 700px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 90vw;
    padding: 0 0vw; */}
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
