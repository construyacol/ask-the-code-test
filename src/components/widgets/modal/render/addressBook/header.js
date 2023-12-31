import React from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import styled from "styled-components";
// import backImg from "../../../../../assets/map.webp";
import useKeyActionAsClick from "../../../../../hooks/useKeyActionAsClick";
import { IconBackContainer } from "../../../shared-styles";
import { getCdnPath } from '../../../../../environment'

const HeaderComponent = ({ uiName, view, switchView }) => {
  const idForBack = useKeyActionAsClick(
    true,
    "back-step-ca",
    8,
    true,
    "onkeyup",
    true
  );

  const getTittle = (view) => {
    switch (view) {
      case "newAccount":
        return `Creando nueva cuenta`;
      default:
        return `Agenda ${uiName}`;
    }
  };

  const goBack = () => {
    return switchView("addressList");
  };

  return (
    <Header backgroundImage={`${getCdnPath('assets')}map.webp`}>
      <section>
        <WindowControl
          id={idForBack}
          state={`${view === "addressList" ? "close" : "open"}`}
          onClick={goBack}
        >
          <IconBackContainer>
            <MdKeyboardArrowLeft size={27} color="white" />
          </IconBackContainer>
        </WindowControl>
        <p className="fuente titleHead">{getTittle(view)}</p>
      </section>
    </Header>
  );
};

export default HeaderComponent;

export const WindowControl = styled.div`
  overflow: hidden;
  width: 0;
  transition: 0.2s;
  width: ${(props) => (props.state === "open" ? "45px" : "0px")};
  opacity: ${(props) => (props.state === "open" ? "1" : "0")};
  cursor: pointer;
`;

export const Header = styled.div`
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

  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
`;
