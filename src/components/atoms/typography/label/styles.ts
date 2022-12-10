import styled from 'styled-components';
import { device } from 'const/const'

type textStyleProps = {
  color?: string
}

export const LabelStyle = styled.label<textStyleProps>`
  display: flex;
  display: grid;
  cursor:pointer;
  grid-template-columns: auto 1fr;
  column-gap: 12px;
  font-family: "Raleway", sans-serif;
  color: ${props =>
    props.color && props.theme.palette[props.color]
      ? props.theme.palette[props.color]
      : props.color
      ? props.color
      : props.theme.mode.contrastText};
  @media ${device.desktop} {
    font-size: 1.125rem;
  }
  @media ${device.laptop} {
    font-size: 1rem;
  }
  @media ${device.mobile} {
    font-size: 0.875rem;
  }
  &.large {
    font-size: 1.125rem;
  }
  &.medium {
    font-size: 1rem;
  }
  &.small {
    font-size: 0.875rem;
  }
`;