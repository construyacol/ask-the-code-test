import React from "react";
import useKeyActionAsClick from "../../../hooks/useKeyActionAsClick";
import "./modal.css";
import { IconClose } from "../shared-styles";
import styled from 'styled-components'
import { device } from 'const/const'

const OtherModalLayoutPairs = (props) => {
  const { children, title, close_modal, classes } = props;

  const idForCloseModal = useKeyActionAsClick(true, "close-modal-button-orders", 27, true, "onkeyup", true);

  const closeModal = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      close_modal && close_modal();
    }
  };

  return (
    <section className={`Modal aparecer`}>
      <div id={idForCloseModal} className={`modalCont2 ConfirmationModal`} data-close_modal={true} onClick={closeModal ? closeModal : null}>
        <PairList className={`_pairList ${classes === "2auth" ? "auth" : classes}`}>
          <IconClose theme="dark" size={20} />
          <PairListtitle>
            <h1 className="fuente">{title}</h1>
          </PairListtitle>
          {children}
        </PairList>
      </div>
    </section>
  );
};

export default OtherModalLayoutPairs;

const PairListtitle = styled.div`
  background: #0080d7;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(to bottom right, #0175c3, #039aff);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  img {
    margin-right: 10px;
  }

  i {
    position: absolute;
    right: 30px;
    font-size: 25px;
    cursor: pointer;
  }

  h1,
  i {
    color: white;
  }


`

const PairList = styled.div`
  border-radius: 7px;
  width: 90%;
  max-width: 700px;
  max-height: 700px;
  height: 100vh;
  background: white;
  z-index: 99;
  display: grid;
  grid-template-rows: 65px 60px 1fr;
  position: relative;

  &.auth{
    max-width: 500px;
    max-height: 550px;
  }

  .PairListFind{
    background: #f3f3f3;
  }

  .PairListItems{
    position: relative;
    display: grid;
    padding: 25px 25px;
    grid-template-columns: repeat(auto-fill, minmax(160px, 200px));
    grid-template-rows: repeat(auto-fill, 220px);
    justify-items: center;
    grid-row-gap: 12px;
    grid-column-gap: 15px;
  }

  @media ${device.mobile} {
    position: absolute;
    width: 100vw;
    max-height: initial;
    bottom: 0px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .PairListItems {
      width: calc(100vw - 30px);
      padding: 20px 15px;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(auto-fill, minmax(150px, 1fr));
    }
  }

`
