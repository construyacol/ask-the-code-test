import styled from 'styled-components'

export const IconContainer = styled.div`
    svg{
        fill:${props => (props.color && props.theme.palette[props.color]) ? props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.text_color};
    }
`