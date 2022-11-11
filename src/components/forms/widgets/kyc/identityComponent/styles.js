import styled from 'styled-components'
import { device } from 'const/const'


export const StageList = styled.div`
  display:grid;
  grid-template-columns:1fr;
  grid-template-rows: repeat(auto-fill, 70px);
  row-gap:8px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background: #475a681f;
  }
`



export const ControlContainer = styled.div`
  grid-row: 1 / 3;
  grid-column: 3 / 4;
`

export const StageListItemContainer = styled.div`

  display:grid;
  grid-template-columns: minmax(35px, auto) 1fr 15px;
  grid-template-rows: repeat(2, 1fr);
  column-gap:10px;
  align-items:center;
  padding:0 15px;
  cursor:pointer;
  border-radius: 6px;
  transition:.2s;
  opacity:.2;
  max-width: 300px;
  
  &.current{
    background:#f1f1f1;
    opacity:1;
  }

  &.complete,
  &.available{
    opacity:1;
    pointer-events: all;
    p{
      color:var(--primary);
    }
  }

  &.incomplete{
    pointer-events: none;
    &.current{
      pointer-events: all;
    }
  }

  &.available{
    pointer-events: all;
  }

  &.loading{
    pointer-events: none;
  }

  &.current{
    ._title{
      font-weight:bold;
      color:var(--primary);
    }
  }


  ._title{
    font-size:1rem;  
    color:var(--paragraph_color);
    padding-top:15px;

    &.incomplete{
      grid-row: 1 /3;
      padding-top: 0;
    }

  }

  ._size{
    font-size:11px;
    color:gray;
    align-self: flex-start;
    padding-top: 2px;
  }

  ._title,
  ._size{
    padding-left:12px;
  }

  p{
    margin:0;
    display: flex;
    align-items: center;
  }

  .item__{
    ${'' /* border:1px solid green; */}
  }

  @media ${device.mobile}{
    max-width: none;
  }
`



export const CurrentStageIndicator = styled.div`
  width:12px;
  height:12px;
  background:var(--primary);
  border-radius:50%;
  justify-self: center;
`

export const IconContainer = styled.div`
  width:45px;
  height:45px;
  grid-row: 1 / 3;
  border-radius:50%;
  background: #f7f7f7;
  border: 2px solid #e9e9e9;

  &.complete{
    background: #0198ff14;
    border: 1px solid var(--primary);
  }

  display: flex;
  place-content: center;
  place-items: center;

  span{

  }
`




export const MobileControlContainer = styled.div`
display: flex;
width: 100%;
height: 80px;
align-items: center;
place-content: center;
@media ${device.mobile}{
  position:sticky;
  bottom: 15px;
}
`

export const Main = styled.div`
background: #F9F9F9;
border-radius: 5px;
place-content:center;
position:relative;
grid-template-rows: auto auto;
row-gap: 15%;
padding:40px;
max-height: ${props => props.maxHeight ? `${props.maxHeight}px` : 'none'};
overflow:hidden;

&.onManager{
  grid-template-rows: 1fr;
  place-content: initial;
}

@media ${device.mobile}{
  grid-template-rows: 1fr;
  height: 220px;
  align-items: center;
  padding:10px;
}
`

