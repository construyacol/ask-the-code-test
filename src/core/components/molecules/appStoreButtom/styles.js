import { device } from 'const/device';
import styled, { css } from 'styled-components';
import { desappearStoreName, appearStoreName, disappearStoreImg, appearStoreImg } from 'core/shared/styles'

const LargeStyles = css`
`;

const MediumStyles = css`
`;



// const borderStyle = css`
//   border: 1px solid red;
// `;

export const AppStoreDataContainer = styled.div`
  display: grid;
  padding: 7px 0 5px 0;
  grid-template-rows: auto 1fr;
  align-items: center;
  &.no-title{
    grid-template-rows: 1fr;
  }
`

export const StoreNameContainer = styled.div`
  p{
    font-size: 1.15rem;
  }
  &.disappearStoreName{
    p{
      ${desappearStoreName}
    }
  }
  &.appearStoreName{
    p{
      ${appearStoreName}
    }
  }
`

export const AvailableIn = styled.div`
  
  p{
    font-size: 10px;
  }
`

export const LogoContainer = styled.div`
  min-width: 45px;
  display: grid;
  place-items: center;

  &.disappearStoreImg{
    img{
      ${disappearStoreImg}
    }
  }
  &.appearStoreImg{
    img{
      ${appearStoreImg}
    }
  }
` 

export const ButtonLayout = styled.div`
  width: ${props => props.width ? `${props.width}px` : '175px'} ;
  height: 50px;
  background: black;
  border: 1px solid gray;
  border-radius: 7px;
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-template-rows: 1fr;
  column-gap: .3rem;
  cursor: pointer;
`

const SmallStyles = css`
  .appstoreButtom__buttonLayout{
    grid-template-columns: 35px 1fr;
    width: 140px;
    height: 45px;
    column-gap: 0.45rem;
    img{
      width: 60%;
    }
    .appstoreButtom__availableIn{
      p{
        font-size: 9px;
      }
    }
    .appstoreButtom__storeNameContainer{
      p{
        font-size: .9rem;
      }
    }
  }
`;

export const ButtonsContainer = styled.div`
  &.withFrame{
    position: relative;
    &::after{
      content: "";
      position: absolute;
      width: calc(100% + 10px);
      height: calc(100% + 10px);
      background-color: #ffffff54;
      left: -5px;
      z-index: -1;
      top: -6px;
      border-radius: 4px;
      backdrop-filter: blur(5px);
    }
  }

  &::before{
    content:"";
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  @media ${device.desktop} {
    ${LargeStyles}
  }

  @media ${device.laptop} {
    ${MediumStyles}
  }

  &.large {
    ${LargeStyles}
  }

  &.medium {
    ${MediumStyles}
  }
  &.small {
    ${SmallStyles}
  }
`;
