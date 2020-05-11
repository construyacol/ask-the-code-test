import styled, { keyframes } from 'styled-components'



export const skeleton = keyframes`
    0%{
      opacity: .5;
    }
    70%{
      opacity: 1;
    }
    100%{
      opacity: .5;
    }
`;

const SkeletonAnimation = styled.div`
  &.skeleton{
    animation-name: ${skeleton};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    opacity: .5;
  }
`
export default SkeletonAnimation
