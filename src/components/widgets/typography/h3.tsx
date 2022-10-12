import { H3 as StyleTag } from './styles'
import { textTypes } from "interfaces/shared"

export default function H3({ 
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

