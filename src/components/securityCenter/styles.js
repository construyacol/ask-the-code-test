import styled from "styled-components";

export const ItemSecurity = styled.div`
  height: 150px;
  display: grid;
  margin: 15px 0;
  position: relative;

  &.loader{
    animation-name: orderLoader;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    opacity: .5;
  }

  @keyframes orderLoader{
    0%{
      opacity: .5;
    }
    70%{
      opacity: 1;
    }
    100%{
      opacity: .5;
    }
  }

  p, div{
    margin: 0 !important;
  }

  .SCimgItem{
    display: grid;
    align-items: center;
    justify-items: center;
    position: relative;
  }

  .SCimgItemCont{
    display: grid;
    align-items: center;
    justify-items: center;
    background: var(--skeleton_color);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    z-index: 1;
  }
  .contentSubItem{
    display: grid;
    grid-template-columns: 1fr 250px;
    border: 1px solid transparent;
  }

  .contentSubText{
    color: var(--skeleton_color);
    display: grid;
    align-items: center;
    padding-left: 20px;
    grid-template-rows: 60px 20px 1fr;
    opacity: 1;
  }

  .contentSubText p{
    background: var(--skeleton_color);
    border-radius: 4px;
  }

  .contentSubText p:nth-child(1){
    width: 40%
    height: 22px;
  }

  .contentSubText p:nth-child(2){
    width: 25%
    height: 18px;
  }

  .contentSubText p:nth-child(3){
    width: 60%
    height: 16px;
  }



  .SCcta{
    display: grid;
    align-self: center;
    width: 100px;
    height: 35px;
    background: var(--skeleton_color);
    border-radius: 4px;
    justify-self: center;
  }

  .contentSubItem.last {
    border-bottom-color: transparent;
  }
`;

export const SecurityLayoutLoader = styled.section`
  width: 100%;
  height: auto;
  border: 1px solid transparent;
  border-top-color: #d5d5d6;
  border-bottom-color: #d5d5d6;
  padding: 20px 0px;
`;
