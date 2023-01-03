import styled from 'styled-components'
import { MAIN_COLOR } from "const/const";
import { OperationForm } from '../../styles'

export const HandlePriorityCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const IconsContainer = styled.div`
  display: flex;
  min-width: 25px;
  width:auto;
  position: relative;
  align-items:center;
  column-gap: 5px;

  > div{
    position:relative;
  }
  > div:last-child {
    cursor: pointer;
    transition: all 300ms ease;
    &:hover {
      > svg {
        fill: ${MAIN_COLOR} !important;
      }
    }
  }
`;

export const WithdrawForm = styled(OperationForm)`
  grid-template-rows: 180px 180px auto;
  background: transparent;
  padding: 70px 0 0;

  
  @media (max-width: 768px) {
    height: calc(100% - 40px);
    width: 100%;
    padding: 20px 0;
    row-gap: 20px;
    grid-template-rows: 140px 170px auto;
  }
`;