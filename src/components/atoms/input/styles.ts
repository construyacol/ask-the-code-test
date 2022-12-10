import { device } from 'const/const';
import styled, { css } from 'styled-components';

type inputStyleProps = {
  color?: string;
};

const LargeStyles = css`
  padding: 0.75rem;
  font-size: 1.125rem;
`;

const MediumStyles = css`
  padding: 0.625rem;
  font-size: 1rem;
`;

const SmallStyles = css`
  padding: 0.5rem;
  font-size: 0.875rem;
`;

export const sharedInputStyles = css<inputStyleProps>`
  margin:0;
  width: 100%;
  font-family: 'Roboto', sans-serif;
  position: relative;
  z-index: 1;
  background-color: transparent;
  /* cursor: pointer; */
 
  &.standard {
    border: none;
    color: ${props => props.color && props.theme.palette[props.color]
      ? props.theme.palette[props.color]
      : props.color ? props.color : props.theme.mode.contrastText};
    border-bottom: 1px solid
      ${props => props.color && props.theme.palette[props.color]
      ? props.theme.palette[props.color]
      : props.color ? props.color : props.theme.mode.contrastText};
    &:hover{
      border-bottom: 2px solid
        ${props => props.color && props.theme.palette[props.color]
        ? props.theme.palette[props.color]
        : props.color ? props.color : props.theme.mode.contrastText};
    }
    &.disabled {
      color: ${props => props.theme.palette.gray};
      border-bottom: 1px solid ${props => props.theme.palette.gray};
      cursor: no-drop;
    }
  }
  &.filled {
    border: none;
    border-radius: 5px 5px 0 0;
    position: relative;
    border-bottom: 1px solid
      ${props => props.color && props.theme.palette[props.color]
      ? props.theme.palette[props.color]
      : props.color ? props.color : props.theme.mode.contrastText};
    color: ${props => props.theme.palette.white}; 
    &:hover{
      border-bottom: 2px solid 
      ${props => props.color && props.theme.palette[props.color]
      ? props.theme.palette[props.color]
      : props.color ? props.color : props.theme.mode.contrastText};
    }
    &.disabled {
      color: ${props => props.theme.palette.white};
      border-bottom: 1px solid ${props => props.theme.palette.gray};
      background: ${props => props.theme.palette.gray};
      cursor: no-drop;
    }
  }
  &.outlined {
    border-radius: 5px;
    color: ${props => props.color && props.theme.palette[props.color]
      ? props.theme.palette[props.color]
      : props.color ? props.color : props.theme.mode.contrastText};
    border: 1px solid
      ${props => props.color && props.theme.palette[props.color]
      ? props.theme.palette[props.color]
      : props.color ? props.color : props.theme.mode.contrastText};
    &:hover{
      border: 2px solid
        ${props => props.color && props.theme.palette[props.color]
        ? props.theme.palette[props.color]
        : props.color ? props.color : props.theme.mode.contrastText};
    } 
    &.disabled {
      color: ${props => props.theme.palette.gray};
      border: 1px solid ${props => props.theme.palette.gray};
      cursor: no-drop;
    }         
  }
  @media ${device.desktop} {
    ${LargeStyles}
  }   
  @media ${device.laptop} {
    ${MediumStyles}
  }   
  @media ${device.mobile} {
    ${SmallStyles}
  }   
  &.large {
    ${LargeStyles}
  }   
  &.medium {
    ${MediumStyles}
  }
  &.small {
    ${SmallStyles}
  }
`
export const sharedInputWrapper = css<inputStyleProps>`
  cursor:pointer;
  width: 100%;
  height: auto;
  position: relative;
  &.filled{
    &::after{
      content:"";
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      border-radius: 5px 5px 0 0;
      background-color: ${props => props.color && props.theme.palette[props.color]
        ? props.theme.palette[props.color]
        : props.color ? props.color : props.theme.mode.contrastText};
      opacity: .3;
    }
    &:hover::after{
      opacity: .2;
    }
  }
`
export const InputWrapper = styled.div`
  ${sharedInputWrapper}
`

export const InputStyle = styled.input<inputStyleProps>`
  ${sharedInputStyles}
`  