import styled, { css, keyframes } from 'styled-components'
import { device } from 'const/device'

export const skeletonStyles = css`
  width: fit-content;
  color: var(--skeleton_color);
  background-color: var(--skeleton_color);
  border-radius: 4px;
`

export const HowWorks = styled.div`
  display: flex;
  height: 2rem;
  align-items: center;
  column-gap: .6rem;

  .how_works__p{
    color: var(--secondary);
    padding-bottom: 0.1rem;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    transition: .15s;
    &:hover{
      border-bottom: 1px solid var(--secondary);

    }
  }
`

const desappearStoreNameKeyFrames = keyframes`
    0%{
      transform: translateY(0px);
    }
    90%{
      transform: translateY(3px);
      opacity: 0;
    }
    100%{
      transform: translateY(-3px);
      opacity: 0;
    }
`;

const appearStoreNameKeyFrames = keyframes`
    0%{
      transform: translateY(-3px);
      opacity: 0;
    }
    100%{
      transform: translateY(0px);
      opacity: 1;
    }
`;

export const desappearStoreName = css`
  animation-name: ${desappearStoreNameKeyFrames};
  animation-duration: .15s;
  animation-fill-mode: forwards;
`
export const appearStoreName = css`
  animation-name: ${appearStoreNameKeyFrames};
  animation-duration: .15s;
  animation-fill-mode: forwards;
`

const desappearStoreImgKeyFrames = keyframes`
    0%{
      /* transform: scale(1); */
      opacity: 1;
    }
    100%{
      opacity: 0;
      /* transform: scale(1.25); */
    }
`;

const appearStoreImgKeyFrames = keyframes`
    0%{
      transform: scale(.5);
      opacity: 0;
    }
    100%{
      transform: scale(1);
      opacity: 1;
    }
`;

export const disappearStoreImg = css`
  animation-name: ${desappearStoreImgKeyFrames};
  animation-duration: .15s;
  animation-fill-mode: forwards;
`

export const appearStoreImg = css`
  animation-name: ${appearStoreImgKeyFrames};
  animation-duration: .15s;
  animation-fill-mode: forwards;
`

export const inAnimationKeyFrames = keyframes`
    0%{
      transform: translateY(-1rem);
      opacity: 0;
    }
    10%{
      transform: translateY(-1rem);
      opacity: 0;
    }
    100%{
      transform: translateY(0rem);
      opacity: 1;
    }
`;

export const inAnimation = css`
  animation-name: ${inAnimationKeyFrames};
  animation-duration: .15s;
  animation-iteration-count: forwards;
  ${'' /* animation-fill-mode: forwards; */}
`

export const outAnimation = css`
   transition: .15s;
   transform: translateY(1rem);
   opacity: 0;
`

export const Label = styled.label`
  font-family: 'Raleway',sans-serif;
  color: ${props => props.color ? props.color : "var(--placeholder)"};
  font-size: 0.8rem;
  &.skeleton{
    ${skeletonStyles}
  }
`

export const Circle = styled.div`
   position: absolute;
   background-color: var(--secondary);
   width: 30vh;
   height: 60vh;
   border-radius: 50%;
   top: 14rem;
   -webkit-filter: blur(121px);
   filter: blur(121px);
   opacity: .5;
  &.after.top{
    top: calc(100% + -8rem);
    opacity: .1;
  }
  &.right{
    right: 50px;
  }
  &.left{
    left: 20px;
  }
  &.section.bottom{
    width: 50vh;
    right: -120px;
    opacity: .4;
    top: 105rem;
  }

  @media ${device} {
    &.right{
      right: 0;
      transform: translateX(10rem);
    }
  }
`