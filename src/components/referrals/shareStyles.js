import styled, { css } from "styled-components";
import { device, MAIN_COLOR } from "../../const/const";
import { OnlySkeletonAnimation } from "../widgets/loaders/skeleton";


export const Data = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
      column-gap: 10px;
    align-items: center;
`

export const IconContainer = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    height: 100%;

    &.internal{
      display: flex;
      column-gap: 10px;
    }
`

export const Icon = styled.div`
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

export const RibbonContainer = styled.div`
  height: 100%;
  display: block !important;
`;

export const RibbonContDeposit = styled(RibbonContainer)`
  height: 100%;
  display: block !important;
  position: absolute;
  right: 7px;
  transform: scale(.8);
  top: -2px;
  p{
    margin:0px;
    color:gray;
  }
  &.tooltip{
    position:absolute;
  }
  &.tooltip .tooltiptext{
    top:30%;
  }
}
`
export const Ribbon = styled.div`
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


export const ReferralBox = styled.div`
  width: 100%;
  border-radius: ${(props) => (props.radius ? props.radius : "5px")};
  ${(props) =>
    props.highlight
      ? css`
          border: 2px solid ${MAIN_COLOR};
        `
      : css`
          border: 1px solid lightgrey;
        `}
`;
export const Title = styled.p`
  color: var(--paragraph_color);

  ${(props) =>
    props.loading &&
    css`
      ${skeletonStyle}
      width: fit-content;
      height: 16px;
    `}

  @media ${device.tabletL} {
    font-weight: 600;
    margin-bottom: 1.8em;
  }

  @media ${device.mobile} {
    font-size:17px;
  }
`

;

export const Divider = styled.div`
  border: 1px solid lightgrey;
  width: -1px;
  height: ${(props) => (props.height ? props.height : "75%")};
  min-height: 20px;
  margin: 0 ${(props) => (props.margin ? props.margin : "20px")};
  opacity: 0.8;
`;

export const Number = styled.p`
  font-family: "Tomorrow", sans-serif;
  font-weight: 600;
  margin: 0;
  color:var(--paragraph_color);
  font-size: ${(props) => (props.fontSize ? props.fontSize : "36px")};
  @media ${device.laptopL} {
    font-size: ${(props) =>
      props.fontSize ? `calc(${props.fontSize} - 6px)` : "32px"};
  }
`;

export const skeletonStyle = css`
  background: #c9c9c9;
  border-radius: 3px;
  color: #c9c9c9;
  pointer-events: none;
  ${OnlySkeletonAnimation}
`;
