
import { device } from 'const/const'
import styled from 'styled-components'

export const ALFilterSect = styled.section`
  display: flex;

  &.withOutBackground{
    .ALfiltros{
      background: transparent;
    }
  }

  &.titleOverPos{
    transform: translateY(-46px);
    ~ div #withdrawForm{
      padding-top: 0;
    }
  }

  &.titleUnderPos{
    transform: translateY(25px);
  }

  &.justify-start{
    justify-self: start;
  }

  &.justify-end{
    justify-self: end;
  }

  &.relativePos{
    position: relative;
    z-index: 1; 
  }
  &.stickyPos{
    position: sticky;
    z-index: 3;
  }

  &.withIconDisable{
    .currentFilter{
      grid-template-columns: 1fr 25px;
      margin-left: 15px;
    }
  }



  @media ${device.mobile} {
    width: 100%;
    .ALfiltros{
      padding: 0 0 0 15px;
      display: grid;
      grid-template-columns: 1fr minmax(150px, 250px);
    }
  }
`

export const ALfiltros = styled.div`
  width: calc(100%);
  column-gap: 15px;
  height: 45px;
  transition: 0.3s;
  border-radius: 6px;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #e7e7e7b0, #f1f1f1b0, white);
  justify-content: flex-start;
  backdrop-filter: blur(7px);
  p{
    color: ${props => props.theme.palette.text_color};
  }
  @media ${device.mobile} {
    justify-content: space-between;
  }
`

export const ALif2Item = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  color: ${props => props.theme.palette.text_color};
  path{
    stroke: ${props => props.theme.palette.text_color};
  }
  column-gap: 5px;
  font-size: 14px;
  margin: 0;
  p{
    margin: 0;
  }
`

