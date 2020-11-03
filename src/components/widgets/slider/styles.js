import styled from "styled-components";

export const SliderContainer = styled.section`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
`;

export const SliderC = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 1fr;
  transition: 0.3s;
  transform: ${(props) =>
    props.position === 1
      ? `translateX(0px)`
      : `translateX(-${props.position}px)`};
  width: ${(props) => props.width && `${props.width}00%`};
  grid-template-columns: ${(props) =>
    props.width ? `repeat(${props.width}, 1fr)` : `repeat(1, 1fr)`};
`;

export const Control = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  position: relative;
`;

export const HandleControl = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
`;

export const ControlContainer = styled.div`
  overflow: hidden;
  position: absolute;
  align-self: center;
  cursor: pointer;
  transition: 0.3s;
  background: white;
  border-radius: 50%;
  color: black;
  opacity: 0.15;

  &:hover {
    opacity: 1;
  }

  &.left {
    left: 15px;
    transform: rotate(-90deg);
    &:hover {
      transform: rotate(-90deg) scale(1.3) !important;
    }
    &:active {
      transition: 0.1s;
      transform: rotate(-90deg) scale(1) !important;
    }
  }

  &.right {
    right: 15px;
    transform: rotate(90deg);
    &:hover {
      transform: rotate(90deg) scale(1.3) !important;
    }
    &:active {
      transition: 0.1s;
      transform: rotate(90deg) scale(1) !important;
    }
  }
`;
