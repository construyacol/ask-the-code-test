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
  grid-template-rows: 40% 1fr 1fr;
  @media (max-width: 768px) {
    height: calc(100% - 40px);
    width: 100%;
    padding: 20px 0;
    background: transparent;
    grid-template-rows: 1fr 1fr 1fr;
  }
`;