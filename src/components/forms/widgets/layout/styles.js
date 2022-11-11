import styled from 'styled-components'
import { show } from '../../../widgets/animations'
import { device } from 'const/const'

export const Wrapper = styled.div`

  &.scroll{
    overflow-y: scroll;
    overflow-x: hidden;
  }
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
    grid-template-columns: auto minmax(650px, 1fr);
    column-gap: 70px;
    max-width: 1480px;
    justify-self: center;
    padding: 50px 0;
    min-height: calc(100vh - 100px);

    .title{
      color: var(--title1);
      font-size: 30px;
      font-weight: bold;
    }

    @media ${device.mobile} {
      grid-template-columns: 1fr;
    }
  }

  &.titleSection{
    grid-template-rows: auto 1fr;
    row-gap: 20px;

    .kycTitle{
      grid-column: 1/3;
      background:transparent;
    }
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
