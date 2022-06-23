import styled from 'styled-components'
import { device } from "../../../../const/const"



export const BackButtom = styled.button`
    cursor: pointer;
    height: 33px;
    display: flex;
    width: auto;
    width:33px;
    place-items: center;
    border-style: none;
    place-content: center;
`
  
export const StageIndicator = styled.div`
    display: grid;
    grid-template-columns: 30px auto;
    column-gap: 15px;
    align-items: center;
    height:auto;
    height:33px;
    p{
      font-size: 14px;
      color: #979797;
      margin: 0;
    }
    ._stageManagerTitle{
      display:none;
    }
    @media${device.mobile}{
      position: sticky;
      top: 118px;
      background: #f9f9fb;
      padding: 10px 0;
      z-index: 1;
      grid-template-columns: 30px auto 1fr;

      ._stageManagerTitle{
        margin:0;
        color:var(--paragraph_color);
        display:initial;
        font-size: 21px;
      }
    }
`
