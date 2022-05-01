import styled from 'styled-components'
import { show } from '../../../widgets/animations'

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
  backdrop-filter: blur(2px);
  background: linear-gradient(to bottom right, #00000099, #000000f0);
  
  .selectedItemTag__title p{
    text-transform:capitalize;    
  }

  &.infoPanel{
    grid-template-columns: auto 1fr;
  }

  &._show{
    animation-name: ${show};
    animation-duration: 0.5s;
    animation-iteration-count: forwards;
  }

`

// export const MainContainer = styled.div`
//   display: grid;
//   max-width: 500px;
//   width: 100%;
//   justify-self:center;
//   align-self: center;
// `
