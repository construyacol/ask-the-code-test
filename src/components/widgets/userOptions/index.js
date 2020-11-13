import React, { useState, useEffect } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

import styled from "styled-components";

let profilePic = "https://i.ibb.co/ncF7TsR/image.png";

export default (props) => {
  const [switchState, setSwitchState] = useState(false);
  const { logOut } = props;

  const handleAction = () => {
    setSwitchState(!switchState);
    console.log("switchState", switchState);
  };

  useEffect(() => {
    window.addEventListener("click", (e) => eventHandle(e));
    return () => {
      window.removeEventListener("click", (e) => eventHandle(e));
    };
  }, []);

  const eventHandle = (e) => {
    // console.log('eventHandle', e.target.dataset)
    if (!e.target.dataset.area) {
      // console.log(filterSwitch)
      setSwitchState(false);
    }
  };

  return (
    <UserOptionContainer>
      <HandleAction onClick={handleAction} data-area />

      <UserOptionPic data-area>
        <img data-area src={profilePic} width="100%" height="100%" alt="" />
      </UserOptionPic>

      <IconContainer orientation={switchState}>
        <MdKeyboardArrowUp size="20px" color="white" />
      </IconContainer>

      <PanelOption orientation={switchState} data-area>
        <UserReference>
          <HandleAction data-area />
          <UserOptionPic size="60px">
            <img src={profilePic} width="100%" height="100%" alt="" />
          </UserOptionPic>
          <p>Administrador</p>
        </UserReference>

        <Option onClick={logOut} data-area>
          Cerrar Sesion
        </Option>
      </PanelOption>
    </UserOptionContainer>
  );
};

const Option = styled.p`
  color: white;
  cursor: pointer;
  width: 100%;
  height: 100%;
  height: 50px;
  display: grid;
  align-items: center;
  justify-items: center;
  font-size: 15px;
  transition: 0.2s;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  &:hover {
    background: #101418;
  }

  &:active {
    transition: 0.1s;
    transform: scale(0.9);
  }
`;

const UserReference = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, auto);
  align-items: center;
  justify-items: center;
  color: white;
  grid-row-gap: 15px;
  position: relative;
`;

const PanelOption = styled.section`
  opacity: 0;
  border-radius: 6px;
  width: 200px;
  height: 200px;
  background: linear-gradient(to right, #2b3742, #101418);
  position: absolute;
  right: 0;
  transition: 0.25s;
  animation: ${(props) =>
    props.orientation ? `show .3s linear forwards` : `none`};
  bottom: 100px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 50px;
  align-items: center;
  justify-items: center;

  @keyframes show {
    0% {
      opacity: 0;
      bottom: 100px;
    }
    10% {
      opacity: 0;
      bottom: -200px;
    }
    100% {
      opacity: 1;
      bottom: -205px;
    }
  }
`;

const UserOptionContainer = styled.section`
  width: 70px;
  height: 45px;
  position: relative;
  justify-selft: center;
  align-self: center;
  align-items: center;
  justify-items: center;
  display: grid;
  grid-template-columns: 40px 20px;
`;

const IconContainer = styled.div`
  transform: ${(props) =>
    props.orientation ? "rotate(0deg)" : "rotate(180deg)"};
  transition: 0.2s;
`;

const UserOptionPic = styled.div`
  height: ${(props) => (props.size ? `${props.size}` : `25px`)};
  width: ${(props) => (props.size ? `${props.size}` : `25px`)};
  background: white;
  border-radius: 50%;
  overflow: hidden;
`;

const HandleAction = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  cursor: pointer;
`;
