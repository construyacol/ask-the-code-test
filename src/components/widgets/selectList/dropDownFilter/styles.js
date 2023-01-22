import styled from 'styled-components'
import { device } from 'const/const'



export const Container = styled.div`
  width: 100vw;
  max-width: 200px;

  @media ${device.mobile} {
    width: 100%;
    max-width: inherit;
  }

`

export const DropDownList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  width: 100%;
  height: auto;
  top: 38px;
  background: white;
  border-bottom-left-radius: 4px; 
  border-bottom-right-radius: 4px;
  background: #ececec;
  z-index: 5;
  transition:.3s;

  .itemFilter{
    margin: 20px 15px;
    font-size: 14px;
    color: var(--paragraph_color);
    cursor: pointer;
    display: flex;
    column-gap: 8px;
    position: relative;
    
    &::after{
      content:"";
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
  .itemFilter:hover{
    color: #1ea4ff;
    p,
    span{
      color: #1ea4ff;
    }
  }
`

export const DropDown = styled.div`
  width: ${props => props.width ? props.width : "140px"};
  height: ${props => props.height ? props.height : "auto"};
  display: grid;
  align-items: center;
  position: relative;
  background: #e6e6e6;
  transition:.3s;
  border-radius:3px;

  .currentFilter{
    display: grid;
    grid-template-columns: 1fr 25px;
    align-items: flex-end;
    grid-column-gap: 10px;
    cursor: pointer;
    height: 100%;
    align-items: center;
    position:relative;
    margin-left: 15px;

    &::after{
      content:"";
      width: 100%;
      height: 100%;
      position: absolute;
    }
    
    &.withIcon{
      margin-left: 0;
      grid-template-columns:25px 1fr 25px;
    }
    p{
      margin: 0;
    }
    
  }

  &:hover{
    background:#dcdcdc;
    ${DropDownList}{
      background:#dcdcdc;
    }
  }

  .currentFilter:hover{
    p{
    color: #1ea4ff;
    }
    color: #1ea4ff;
  }

  .currentFilter p{
    font-size: 14px;
    font-weight: bold;
  }
  
`
