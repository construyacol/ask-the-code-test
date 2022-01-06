import styled from "styled-components";

export const Layout = styled.div`
    display: grid;
    width: 100vw;
    height: 100vh;
    background: #fffffffa;
    position: absolute;
    justify-items: center;
    top: 0;
    left: 0;
`

export const ContentContainer = styled.div`
  position:relative;
  width:100vw;
  height:auto;
  max-width:800px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto auto auto;
  height: calc(100vh - 80px);
  padding: 40px 0;
`

export const Content = styled.section`
  width:100vw;
  height:100vh;
  display:grid;
  position:relative;
  align-items:center;
  justify-items:center;
  
  [alt="isoType"]{
    position: absolute;
    margin: auto;
    top: 30px;
    left: 40px;
  }
`