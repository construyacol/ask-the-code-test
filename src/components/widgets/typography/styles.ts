import styled, { css } from 'styled-components'
import { device, fontSize } from 'const/const'

export interface typoGraphyProps {
    color?:string
}

export const textBaseStyles = css<typoGraphyProps>`
    /* color:${props => props.theme.palette.text_color}; */
    color: ${props => (props.color && props.theme.palette[props.color]) ?  props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.black};
    font-family: "Raleway", sans-serif;
    &.bold{
        font-weight: bold;
    }
`

export const H2 = styled.h2<typoGraphyProps>`
    ${textBaseStyles}
`

export const H3 = styled.h3<typoGraphyProps>`
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