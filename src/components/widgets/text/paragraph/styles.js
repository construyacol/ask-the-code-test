import styled from 'styled-components'
import { device, fontSize } from 'const/const'

export const Paragraph = styled.p`
    @media ${device.mobile} {
        font-size:${fontSize.p.mobile}
    }
    @media ${device.laptop} {
        font-size:${fontSize.p.laptop}
    }
    @media ${device.desktop} {
        font-size:${fontSize.p.desktop}
    }
`

export default Paragraph