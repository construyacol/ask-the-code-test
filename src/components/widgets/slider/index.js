import React, { useEffect, useState, Fragment } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import {
  SliderContainer,
  SliderC,
  Control,
  HandleControl,
  ControlContainer,
} from "./styles";

const Slider = (props) => {
  // const tag = document.getElementsByTagName("div")

  const { config } = props;

  const [slider, setSlider] = useState();
  const [currentPosition, setcurrentPosition] = useState(1);

  useEffect(() => {
    setSlider(document.getElementById("Rj45#_SendaSlider"));
  }, [!slider]);

  useEffect(() => {
    if (slider && slider.childNodes) {
      let i = 1;
      for (let child of slider.childNodes) {
        child.classList.add(`sendaSlider`, `slider_${i}`);
        i++;
      }
    }
  }, [slider]);

  // console.log('|||||||||||||||| Slider ==> ', slider)

  const onOver = () => {
    console.log("|||||||||||||||| Over ==>");
  };

  return (
    <SliderContainer onMouseOver={onOver}>
      <SliderC
        id="Rj45#_SendaSlider"
        position={currentPosition}
        width={slider && slider.childNodes.length}
      >
        {props.children}
      </SliderC>

      {slider && config && config.controls && (
        <Controls
          slider={slider}
          setcurrentPosition={setcurrentPosition}
          {...props}
        />
      )}
    </SliderContainer>
  );
};

export default Slider;

const Controls = ({
  config: { controls, autoSwap, swapInterval },
  slider,
  setcurrentPosition,
}) => {
  let totalSlides = slider.childNodes && slider.childNodes.length;
  let size = (controls && controls.size) || "35px";
  let Icon = MdKeyboardArrowUp;
  let slideWidth;
  let autoSwapInterval;

  const [position, setPosition] = useState(0);
  // let position = 0

  const next = async (interval) => {
    if (!interval) {
      clearInterval(autoSwapInterval);
    }
    slideWidth = slider.clientWidth / slider.childNodes.length;
    if (position < totalSlides - 1) {
      setcurrentPosition(slideWidth * (position + 1));
      // position++
      setPosition(position + 1);
    } else {
      // if(interval){
      // position = (-1)
      setPosition(-1);
      // }
    }
  };

  const prev = async () => {
    clearInterval(autoSwapInterval);
    slideWidth = slider.clientWidth / slider.childNodes.length;
    if (position > 0) {
      setcurrentPosition(slideWidth * (position - 1));
      // position--
      setPosition(position - 1);
    } else {
      setPosition(slider.childNodes.length);
    }
  };

  const methods = {
    next,
    prev,
  };

  useEffect(() => {
    if (autoSwap) {
      autoSwapInterval = setInterval(() => {
        clearInterval(autoSwapInterval);
        next(true);
      }, swapInterval || 1500);
    }
    return () => clearInterval(autoSwapInterval);
  }, [position]);

  const actionHandle = (e) => {
    if (!slider.childNodes || !slider.childNodes.length) {
      return false;
    }
    const { action } = e.target.dataset;
    methods[action]();
  };

  return (
    <Fragment>
      <ControlContainer className="right">
        <Control>
          <HandleControl data-action="next" onClick={actionHandle} />
          <Icon size={size} />
        </Control>
      </ControlContainer>

      <ControlContainer className="left">
        <Control>
          <HandleControl data-action="prev" onClick={actionHandle} />
          <Icon size={size} />
        </Control>
      </ControlContainer>
    </Fragment>
  );
};
