import styled from 'styled-components'

export const Wrapper = styled.div`
  grid-template-columns: 1fr;
  display: grid;
  height: auto;
  min-height: 100vh;
  width:100vw;
  position:absolute;
  top:0;
  left:0;
  z-index:99;
  &.infoPanel{
    grid-template-columns: auto 1fr;
  }
`

// export const MainContainer = styled.div`
//   display: grid;
//   max-width: 500px;
//   width: 100%;
//   justify-self:center;
//   align-self: center;
// `
