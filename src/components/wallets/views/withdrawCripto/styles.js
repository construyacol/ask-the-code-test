import styled from 'styled-components'
import { MAIN_COLOR } from "const/const";
import { OperationForm } from '../../styles'

export const IconsContainer = styled.div`
display: flex;
> div:first-child {
  margin: 0 12px;
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
  padding:0;
  
  @media (max-width: 768px) {
    height: calc(100% - 40px);
    width: 100%;
    padding: 20px 0;
    row-gap: 20px;
    grid-template-rows: 140px auto auto;
  }
`;