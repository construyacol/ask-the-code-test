import React from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import styled from "styled-components";
import backImg from "../../../../../assets/map.webp";

const HeaderComponent = ({ provider_type, view, switchView }) => {
  const getTittle = (view) => {
    switch (view) {
      case "newAccount":
        return `Creando nueva cuenta`;
      default:
        return `Agenda ${provider_type}`;
    }
  };

  const goBack = () => {
    return switchView("addressList");
  };

  return (
    <Header>
      <section>
        <WindowControl
          state={`${view === "addressList" ? "close" : "open"}`}
          onClick={goBack}
        >
          <div>
            <MdKeyboardArrowLeft size={27} color="white" />
          </div>
        </WindowControl>
        <p className="fuente titleHead">{getTittle(view)}</p>
      </section>
    </Header>
  );
};

export default HeaderComponent;

const WindowControl = styled.div`
  div {
    width: 35px;
    height: 35px;
    background: rgb(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }
  overflow: hidden;
  width: 0;
  transition: 0.2s;
  width: ${(props) => (props.state === "open" ? "45px" : "0px")};
  opacity: ${(props) => (props.state === "open" ? "1" : "0")};
  cursor: pointer;
`;

const Header = styled.div`
  width: 97%;
  height: 100%;
  justify-self: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  position: relative;
  display: grid;
  align-items: center;

  section {
    display: flex;
    align-items: center;
    margin: 0 0 0 15px;
  }

  p {
    font-size: 22px;
    color: white;
    font-weight: bold;
  }

  p.appear {
    opacity: 1;
  }

  p.disappear {
    opacity: 0;
  }

  background-image: url(${backImg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
`;
