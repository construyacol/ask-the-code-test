import styled, { css } from 'styled-components'
import { device, fontSize } from 'const/const'
import { skeletonBase } from 'styles/global'

export interface typoGraphyProps {
    color?:string,
    skeleton?:boolean,
    size?:number,
    lineHeight?:number
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

    &.no-margin{
      margin:0;
    }
    &.number{
      font-family: "Tomorrow", sans-serif;
    }
    &.bold{
      font-weight: bold;
    }

    &.capitalize{
      text-transform: capitalize !important;
    }

    &.ellipsis{
      width: auto;
      max-width: 250px;
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