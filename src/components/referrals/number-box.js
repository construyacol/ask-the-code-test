import React from "react";
import styled, { css } from "styled-components";
import {
  ReferralBox,
  Divider,
  Number,
  MAIN_COLOR,
  skeletonStyle,
} from "./shareStyles";
import { device } from "../../const/const";

const NumberBox = (props) => {
  return (
    <StyledShareSection {...props} radius="10px">
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
        <RibbonContainer>
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
  heigh: 30px;
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

const Icon = styled.div`
  min-width: 70px;
  width: 70px;
  height: 70px;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  img,
  svg {
    width: 55%;
    height: 55%;
  }
  img {
    box-shadow: 3px 4px 10px -5px rgba(0, 0, 0, 0.54);
    border-radius: 50%;
  }
  font-size: 30px;
  border: 1.5px solid ${MAIN_COLOR};
  border-radius: 50%;
  background-color: #ebf7fe;
  color: ${MAIN_COLOR};
  @media ${device.laptopL} {
    min-width: 60px;
    width: 60px;
    height: 60px;
    font-size: 26px;
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

const RibbonContainer = styled.div`
  height: 100%;
  display: block !important;
`;
const Ribbon = styled.div`
  width: 24px;
  height: 20px;
  background: ${MAIN_COLOR};
  position: relative;
  border-radius: 4px 4px 0 0;
  top: -1px;
  &:after {
    content: "";
    position: absolute;
    height: 0;
    width: 0;
    border-left: 12px solid ${MAIN_COLOR};
    border-right: 12px solid ${MAIN_COLOR};
    border-bottom: 10px solid transparent;
    bottom: -9px;
  }
  @media ${device.tabletL} {
    display: none;
  }
`;

const StyledShareSection = styled(ReferralBox)`
  ${(props) => props.css && css(props.css)}
  color: #919191;
  width: unset;
  align-self: ${(props) => (props.center ? "center" : "end")};
  display: flex;
  position: relative;
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
