import styled from 'styled-components'
import { device, fontSize } from 'const/const'
import {typoGraphyProps, textBaseStyles } from '../styles'


export const H3Style = styled.h3<typoGraphyProps>`

    ${textBaseStyles}
    font-family: "Raleway", sans-serif !important;

    /* @media ${device.mobile} {
        font-size:${fontSize.p.mobile}
    }
    @media ${device.laptop} {
        font-size:${fontSize.p.laptop}
    }
    @media ${device.desktop} {
        font-size:${fontSize.p.desktop}
    } */
`

export default H3Style