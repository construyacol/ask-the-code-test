import styled, { keyframes } from 'styled-components'

export const SelectListMain = styled.div`
  width: calc(100% - 20px);
  height: ${props => props.height};
  transition: .3s;
  animation-delay: 1s;
  margin: 20px 10px 10px;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 8px;
    cursor: pointer;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #f5f5f5;
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #e2e2e2;
  }
`

export const ItemListGrid = styled.div`
  display: grid;
  column-gap: 15px;
  grid-template-rows: 1fr;
  grid-template-columns: auto 1fr;
  border: 1px solid #ffffff;
  border-radius: 6px;
  padding: 0 15px;
  cursor: pointer;
  transition: .15s;
  height: 60px;
  .itemList__icon{
    display: flex;
    align-items: center;
  }
  img{
    border-radius:50%;
  }
  p{
    color: #676767;
    display: flex;
    align-items: center;
  }
  &:hover{
    border: 1px solid #f5f5f5;
    background: #f5f5f5;
    p{
      color: #353535;
    }
  }

`

export const backTopSection = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

export const ListContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  row-gap: 7px;
  opacity: 0;
  animation: ${backTopSection};
  animation-duration: .3s;
  animation-delay: .3s;
  animation-fill-mode: forwards;
`
