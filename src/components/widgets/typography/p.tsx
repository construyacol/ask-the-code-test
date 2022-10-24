import { Paragraph as StyleTag } from './styles'
import { textTypes } from "interfaces/shared"

export default function P({ 
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
