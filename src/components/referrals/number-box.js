import React from "react";
import styled, { css } from "styled-components";
import {
  ReferralBox,
  Divider,
  Number,
  skeletonStyle,
  RibbonContainer,
  Ribbon,
  Icon
} from "./shareStyles";
import { device, MAIN_COLOR } from "../../const/const";

const NumberBox = (props) => {
  return (
    <StyledShareSection {...props} radius="10px" height="125px">
      <Icon>
        <props.Icon color={MAIN_COLOR} />
      </Icon>
      <Divider height="55px" margin="15px" />
      <Counter loading={props.loading}>
        <Number className="numberC">{props.quantity || "-----------"}</Number>
        <p
          className="sub-text"
          dangerouslySetInnerHTML={{ __html: props.definition }}
        />
      </Counter>

      {props.highlight && (
        <RibbonContainer className="RibbonContainer">
          <Ribbon />
        </RibbonContainer>
      )}
      {props.bottomText && (
        <BottomText dangerouslySetInnerHTML={{ __html: props.bottomText }} />
      )}
    </StyledShareSection>
  );
};

const BottomText = styled.div`
  width: 100%;
  height: 30px;
  text: white;
  background: #c9c9c9;
  position: absolute;
  bottom: 0;
  border-radius: 0 0 5px 5px;
  color: white;
  p {
    margin: 12px;
    font-size: 12px;
    font-weight: 600;
  }
  @media ${device.tabletL} {
    background: ${MAIN_COLOR};
    p {
      font-size: 14px;
    }
  }
`;


const Counter = styled.div`
  flex-direction: column;
  width: 80%;
  align-items: start !important;

  ${(props) =>
    props.loading &&
    css`
      .numberC {
        font-size: 20px !important;
      }
      p {
        ${skeletonStyle}
        width: fit-content;
      }
    `}
  .sub-text {
    font-size: 14px;
    margin-bottom: 0;
    margin-top: 8px;
  }
`;



const StyledShareSection = styled(ReferralBox)`
  max-width: 400px;
  width: calc(100% - 40px);
  transform: scale(.96);
  align-self: flex-start;
  color: #919191;
  display: flex;
  ${(props) =>
    props.withRibbon
      ? css`
          border: 2px solid ${MAIN_COLOR};
        `
      : ""}
  height: ${(props) => (props.height ? props.height : "75%")};
  padding: 0 20px;
  ${(props) =>
    props.withPadding
      ? css`
          padding-bottom: 30px;
        `
      : ""}
  ${(props) =>
    props.height
      ? css`
          max-height: ${props.height};
        `
      : ""}
    justify-content: space-around;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  @media ${device.laptopL} {
    ${(props) =>
      props.height
        ? css`
            max-height: 114px;
          `
        : ""}
  }
  @media ${device.tabletL} {
    margin-top: 1.8em;
    margin-bottom: 0;
    width: calc(100% - 40px);
    height: 160px;
    ${Icon} {
      min-width: 76px;
      width: 76px;
      height: 76px;
      font-size: 34px;
      margin: 8px;
      margin-top: 0;
    }
    ${Number} {
      font-size: 40px;
      opacity: 1;
    }
  }
  ${(props) =>
    props.responsive &&
    css`
        @media ${device.tabletL} {
            border: unset;
            background-color: #f8fcfe;
            height: 9vh;
            margin-top: 10px;
            ${Divider} {
                display: none;
            }
            ${Counter} {
                flex-direction: row-reverse;
                justify-content: space-between;
                width; 90%;
            }
            ${Counter} .sub-text {
                font-size: 17px;
                margin: auto 0;
            }
            ${Number} {
               font-size: 22px;
            }
            ${Icon} {
                min-width: 42px;
                width: 42px;
                height: 42px;
                font-size: 20px;
                margin: 0;
            }
        }
    `}
`;

export default NumberBox;
