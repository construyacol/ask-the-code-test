import styled from 'styled-components'
import { rotate90HorizontalBck, rotate0HorizontalBck } from './animations'


export const Face = styled.div`
  display: block;
  position: absolute;
  width: 358px;
  height: 80px;
`

export const Front = styled(Face)`
`
export const Top = styled(Face)`
  background: #fbfbfb;
  transform: rotateX(90deg) translateZ(40px);
  opacity: 0;
`

export const CubeObject = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  &.rotate{
    animation: ${rotate90HorizontalBck} .3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    ${Top}{
      transition: .3s;
      opacity: 1;
    }
    ${Front}{
      transform: rotateY(0deg) translateZ(40px);
    }
  }
  &.unrotate{
    animation: ${rotate0HorizontalBck} .3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    ${Top}{
      transition: .3s;
      opacity: 0;
    }
    ${Front}{
      transform: rotateY(0deg) translateZ(40px);
    }
  }
`



export const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
  height: 35px;
  background: white;
  border-radius: 50%;
  z-index: 2;
  display: grid;
  align-items: center;
  justify-items: center;
  cursor: pointer;
  transition: .3s;

  :hover{
    transform: scale(1.1);
  }

  ::after{
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
  }

  i{
    color: gray;
  }
`

export const Icon = styled.i`

  font-weight: 400;
  position: relative;
  color: black;
  font-size: 16px;

  &:hover{
    color: black;
  }

  span{
    visibility: hidden;
    width: 60px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    font-size: 13px !important;
    position: absolute;
    z-index: 1;
    top: 130%;
    left: 50%;
    margin-left: -30px;
  }

`
