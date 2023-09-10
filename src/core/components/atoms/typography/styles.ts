import styled, { css } from 'styled-components'
import { device, fontSize } from 'const/const'
import { skeletonBase } from 'styles/global'

export interface typoGraphyProps {
    color?:string,
    skeleton?:boolean,
    size?:number,
    lineHeight?:number,
    maxWidth?:number
}

const skeletonStyles = css`
    width: fit-content;
    border-radius: 3px;
    ${skeletonBase}
`

export const textBaseStyles = css<typoGraphyProps>`

    color: ${props => (props.color && props.theme.palette[props.color]) ?  props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.black};
    font-family: "Raleway", sans-serif;
    font-size: ${props => props.size && `${props.size}px !important`};
    line-height: ${props => props.lineHeight && `${props.lineHeight}px`};


    &.text-center{
      text-align:center;
    }
    &.no-margin-bottom{
      margin-bottom:0;
    }
    &.no-margin-top{
      margin-top:0;
    }
    &.no-margin{
      margin:0;
    }
    &.number{
      font-family: "Tomorrow", sans-serif;
    }
    &.bold{
      font-weight: bold;
    }
    &.uppercase{
      text-transform: uppercase;
    }
    &.capitalize{
      text-transform: capitalize !important;
    }
    &.fit{
      width:fit-content;
    }
    &.ellipsis{
      width: auto;
      max-width: ${props => props.maxWidth ? `${props.maxWidth}px` : '250px'};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ${props => props.skeleton && skeletonStyles}
`

export const H2 = styled.h2<typoGraphyProps>`
    ${textBaseStyles}
`

export const H3 = styled.h3<typoGraphyProps>`
    ${textBaseStyles}
`

export const SPAN = styled.span<typoGraphyProps>`
    ${textBaseStyles}
`


export const Paragraph = styled.p<typoGraphyProps>`
    ${textBaseStyles}
    @media ${device.mobile} {
        font-size:${fontSize.p.mobile};
    }
    @media ${device.laptop} {
        font-size:${fontSize.p.laptop};
    }
    @media ${device.desktop} {
        font-size:${fontSize.p.desktop};
    }
`