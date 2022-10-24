import styled, { css } from 'styled-components'
import { OnlySkeletonAnimation } from 'components/widgets/loaders/skeleton'

type iconContainerProps = {
    skeleton?:boolean
}

export const skeletonBase = css`
    background: ${props => props.theme.palette.skeleton_color};
    color: ${props => props.theme.palette.skeleton_color} !important;
    ${OnlySkeletonAnimation}
`

export const IconContainer = styled.div<iconContainerProps>`
    ${props => props.skeleton && skeletonBase}
    svg{
        fill:${props => (props.color && props.theme.palette[props.color]) ? props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.text_color};
    }
`