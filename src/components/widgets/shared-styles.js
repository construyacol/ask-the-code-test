import styled from 'styled-components'


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

  i{
    color: gray;
  }
`
