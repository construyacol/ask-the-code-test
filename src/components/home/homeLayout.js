// import React from "react";
import styled from "styled-components";
import "./home.css";
import { device } from '../../const/const'

// const HomeLayout = (props) => {

//   return (
//     <div className={`HomeLayout`}>
//       {props.children}
//     </div>
//   );
// };

export const HomeLayout = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto 1fr;
  height: 100vh;
  background: rgb(249, 249, 251);

  @media ${device.mobile} {
    grid-template-columns: 1fr;
  }
  
`

export default HomeLayout;
