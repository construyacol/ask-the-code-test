import styled from "styled-components";


export const Button = styled.button`
      min-height: 60px;
      cursor:pointer;
      width: auto;
      min-width:230px;
      padding: 15px 20px;
      background:#0198ff;
      border-style: none;
      border-radius:4px;
      color:white;
      font-size: 1rem;
      font-weight: 600;
      &.disabled{
        background: gainsboro;
      }
      &.secondary{
        background: none;
        color: #0198ff;
        &.disabled{
            color:gainsboro;
        }
      }

      &.center-end{
        justify-self: center;
        align-self: flex-end;
      }
    
` 