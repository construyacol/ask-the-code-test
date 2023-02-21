// @ts-nocheck
import { H2 as StyleTag } from './styles'
import { textTypes } from "interfaces/shared"

export default function H2({ 
    children, 
    className,
    ...props
}:textTypes) {
    return(
        <StyleTag 
            className={`${className || ''}`}
            {...props}
        >
            {children}
        </StyleTag>
    )
}
