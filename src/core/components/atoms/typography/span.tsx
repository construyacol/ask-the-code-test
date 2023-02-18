import { SPAN as StyleTag } from './styles'
import { textTypes } from "interfaces/shared"

export default function SPAN({ 
    children, 
    className = '',
    variant = 'normal',
    ...props
}:textTypes) {
    return(
        <StyleTag 
            className={`${className} ${variant}`}
            {...props}
        >
            {children}
        </StyleTag>
    )
}
