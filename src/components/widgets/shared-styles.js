import React from "react";
import styled, { css } from "styled-components";
import { rotate90HorizontalBck, rotate0HorizontalBck } from "./animations";
import { AiOutlineClose } from "react-icons/ai";
import {CAPACITOR_PLATFORM} from "const/const";


export const DisclaimerContainer = styled.div`
   padding: 15px 20px;
   border-radius: 5px;
   border-left: 2px solid var(--primary);
   border-top-left-radius: 1px;
   border-bottom-left-radius: 1px;
`

export const AlertDisclaimer = styled(DisclaimerContainer)`
  background-color: #ff8c0024;
  border-left: 2px solid var(--orange_color);
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 100% ;
  padding: 10px 20px;
`

export const TotalAmount = styled.div`
  width: auto;
  height: 70px; 
  justify-self: end;
  align-self: end;

  &.rejected,
  &.canceled {
    .amount {
      text-decoration: line-through;
    }
  }

  p {
    color: ${(props) => props.color ? props.color : 'var(--paragraph_color)'};
    margin: 0;
    text-align: right;
  }
  & > p {
    margin-bottom: 10px;
  }
  .amount {
    font-size: 30px;
    span {
      font-size: 18px;
    }
  }
  .saldo {
    font-size: 16px;
  }
`;

export const inputDropStyle = css`
  input[type="file"],
  input[type="button"]{
    position: absolute;
    z-index: 4;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`

export const DropZoneContainer = styled.section`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  z-index: 3;
  display: grid;
  align-items: center;
  justify-items: center;

  ${inputDropStyle}

  &.dottedBorder{
    border: 3px dotted var(--primary);
    border-radius: 10px;
    background: rgba(255, 255, 255, 1);
    width: calc(100% - 6px);
    height: calc(100% - 6px);
  }

  svg {
    fill: #0198ff;
  }
  p {
    color: #0198ff;
  }
`;


export const UploadContainer = styled.section`
  display: grid;
  justify-items: center;
  row-gap: 12px;
  width: 100%;
  min-height: 170px;
  height: auto;
  &.unButton{
    min-height: 100px;
  }

  &.loaded { 
    grid-template-rows: auto 1fr;
  }
  &.unload {
    grid-template-columns: 1fr;
    max-width: 400px;
    grid-template-rows: repeat(4, auto);
  }
`;

export const UploadText = styled.p`
  margin:0;
  font-size: 16px;
  color: var(--paragraph_color);
`;

export const UploadTextMiddle = styled.p`
  margin:0;
  z-index: 2;
  font-size: 12px;
  width: 150px;
  background: ${props => props.background ? props.background : '#eeeeee' };
  text-align: center;
  color: var(--paragraph_color);

  &.titleSection {
    font-size: 15px;
    width: auto;
    padding: 0 20px;
    align-self: center;
    justify-self: baseline;
  }

  &.consolidatedStyle{
    background:white;
    margin-left:20px;
  }
`;



export const Buttom = styled.div`
  width: 320px;
  height: 45px;
  border-radius: 6px;
  border: 2px solid #0198ff;
  background: #0198ff;
  display: grid;
  align-items: center;
  justify-items: center;
  cursor: pointer;
  position: relative;

  ${inputDropStyle}

  &.loader{
    ::after{
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: #ffffffcf;
      top: 0;
    }
  }

`;

export const UploadMiddle = styled.div`
  font-size: 14px;
  position: relative;
  display: grid;
  width: 100%;
  justify-items: center;
  max-width: 320px;
  hr{
    position: absolute;
    width: 100%;
    align-self: center;
  }

  &.titleSection{
    max-width: inherit;
    position: absolute;
    align-self: start;
    hr{
      border-top: 1px solid;
      color: #d4d4d4;
      position: absolute;
      width: 80%;
      right: 0;
    }
  }
  &.payment{
    p{
      padding-left: 0 !important;
    }
    position: relative !important;
  }

  &.swaps{
    hr{
      width: 98%;
    }
  }
}
`;



export const IconClose = (props) => {
  const { theme, opacity, size, id } = props
  // @params
  // theme => dark/ligth

  return (
    <IconCloseModal
      id={id || "IconCloseModal"}
      color={`${theme === "dark" && "dark"}`}
      opacity={opacity}
      data-close_modal
      {...props}
      size={size + 10}
    >
      <AiOutlineClose
        color={`${theme === "dark" ? "white" : "gray"}`}
        size={size}
      />
    </IconCloseModal>
  );
};

export const IconBackContainer = styled.div`
  width: ${(props) => (props.size && `${props.size}px`) || "35px"};
  height: ${(props) => (props.size && `${props.size}px`) || "35px"};
  background: ${(props) =>
    props.color === "dark"
      ? `rgb(0, 0, 0, ${props.opacity || ".4"})`
      : `rgb(255, 255, 255, ${props.opacity || ".3"})`};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
`;
export const IconCloseModal = styled(IconBackContainer)`
  z-index: 9999;
  right: ${props => props.right ? `${props.right}px` : '5px'};
  top: ${props => props.top ? `${props.top}px` : '-38px'};
  position: absolute;
  cursor: pointer;
  transition: 0.2s;

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
  }
  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 15px;
  }
`;

export const ControlButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  display: grid;
  bottom: ${(props) => `${props.bottom}px`};
  #controlsContainer {
    transform: scale(0.95);
    ${CAPACITOR_PLATFORM === "ios" && "z-index: 2;"}
  }
`;

export const Face = styled.div`
  display: block;
  position: absolute;
  ${"" /* width: 358px; */}
  width: 100%;
  height: 80px;
`;

export const Front = styled(Face)``;

export const Top = styled(Face)`
  background: #fbfbfb;
  transform: rotateX(90deg) translateZ(40px);
  opacity: 0;
  left: 0;
`;

export const CubeObject = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;

  &.rotate {
    animation: ${rotate90HorizontalBck} 0.3s
      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    ${Top} {
      transition: 0.3s;
      opacity: 1;
    }
    ${Front} {
      transform: rotateY(0deg) translateZ(40px);
    }
  }
  &.unrotate {
    animation: ${rotate0HorizontalBck} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
      both;
    ${Top} {
      transition: 0.3s;
      opacity: 0;
    }
    ${Front} {
      transform: rotateY(0deg) translateZ(40px);
    }
  }
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
  height: 35px;
  background: white;
  border-radius: 50%;
  z-index: 2;
  display: grid;
  align-items: center;
  justify-items: center;
  cursor: pointer;
  transition: 0.3s;

  :hover {
    transform: scale(1.1);
  }

  ::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
  }

  i {
    color: gray;
  }
`;

export const Icon = styled.i`
  font-weight: 400;
  position: relative;
  color: black;
  font-size: 16px;

  &:hover {
    color: black;
  }

  span {
    visibility: hidden;
    width: 60px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    font-size: 13px !important;
    position: absolute;
    z-index: 1;
    top: 130%;
    left: 50%;
    margin-left: -30px;
  }
`;
