import styled from 'styled-components'


export const LabelContainer = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
`

export const IconContainer = styled.div`
  width: ${props => props.size ? `${props.size}px` : 'auto'};
  height: ${props => props.size ? `${props.size}px` : 'auto'};
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid gray;
  display: grid !important;
  align-items: center;
  justify-items: center;
  position: relative;
  align-self: flex-start;

  ::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .tooltiptext {
    padding-left: 4px !important;
    padding-right: 4px !important;
    width: auto !important;
    min-width: 60px !important;
  }

  i,
  svg {
    color: gray;
  }

  :hover {
    i,
    svg {
      color: #0c96fa;
    }
  }
`;
