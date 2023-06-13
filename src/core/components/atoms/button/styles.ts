import { device } from "const/const"
import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

interface ButtonStyleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: string;
    fontSize?: number | string;
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
    padding: 1rem 0.844rem;
    border-radius: 3px;
    font-size:0.938rem;
`


export const ButtonStyle = styled.button<ButtonStyleProps>`
    justify-content: center;
    border: none;
    font-weight: normal;
    cursor: pointer;
    position: relative;
    background: transparent;
    border-radius: 5px;
    display: flex;
    align-items: center;
    column-gap: 7px;
    font-family: "Raleway",sans-serif;

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
        &:hover{}
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
        &.hoverFilled:hover{
            transition: .2s;
            background-color: ${props => (props.color && props.theme.palette[props.color]) ?  props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.black};;
            color:white;
            opacity: 1;
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

    font-size: ${props => props.fontSize ? `${props.fontSize}px !important` : "1rem"};
    
    &.large{
        ${LargeStyles}
    }

    &.medium{
        ${MediumStyles}
    }
    &.small{
        ${SmallStyles}
    }


    
    &.no-padding{
        padding: 0;
    }
    &.bold{
        font-weight: bold;
    }
    &.fit{
        height: max-content;
        width: fit-content;
    }
    &.justify-end{
        justify-self: end;
    }
    &.align-center{
        align-self: center;
    }

    &.displayNone{
        display: none;
    }

`
