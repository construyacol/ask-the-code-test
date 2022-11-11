import { device } from "const/const"
import styled, {css} from 'styled-components'

interface buttonStyleProps {
    color?: string | String;
}

const LargeStyles = css`
    padding: 0.75rem 2.813rem;
    border-radius: 5px;
    font-size:1.125rem;
`

const MediumStyles = css`
    padding: 0.75rem 1.875rem;
    border-radius: 5px;
    font-size:1rem;
`

const SmallStyles = css`
    padding: 1rem 4.844rem;
    border-radius: 3px;
    font-size:0.938rem;
`


export const ButtonStyle = styled.button<buttonStyleProps>`
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    border: none;
    font-weight: normal;
    cursor: pointer;
    position: relative;
    background: transparent;
    border-radius: 5px;
    display: flex;
    align-items: center;
    column-gap: 7px;

    &.bold{
        font-weight: bold;
    }

    &.text{
        color: ${props => (props.color && props.theme.palette[props.color]) ?  props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.black};
        
        &::after{
            content: "";
            position: absolute;
            background: ${props => (props.color && props.theme.palette[props.color]) ?  props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.black};
            opacity: 0;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            transition: .3s;
            border-radius:5px;
        }
    
        &:hover{   
            &::after{
                opacity: .1;
            }
        }

        &.disabled{
            color:${props => props.theme.palette.gray};
            cursor: no-drop;
            &:hover{   
                &::after{
                    opacity: 0;
                }
            }
        }
    }
    
    &.contained{
        background:${props => (props.color && props.theme.palette[props.color]) ?  props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.black};
        color: white; 
        &:hover{   
        }

        &.disabled{
            opacity: 1;
            background:${props => props.theme.palette.skeleton_color};
            cursor: no-drop;
        }
    }

    &.outlined{
        border: 1px solid ${props => (props.color && props.theme.palette[props.color]) ?  props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.black};;
        color: ${props => (props.color && props.theme.palette[props.color]) ?  props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.black};;
        &:hover{
            opacity: 0.6;
        }
        &.disabled{
            opacity: 1;
            color:${props => props.theme.palette.gray};
            border:1px solid ${props => props.theme.palette.gray};
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
    
    &.large{
        ${LargeStyles}
    }

    &.medium{
        ${MediumStyles}
    }
    &.small{
        ${SmallStyles}
    }
`
