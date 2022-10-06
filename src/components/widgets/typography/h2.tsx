import { H2 as H2Style } from './styles'
import { textTypes } from "interfaces/shared"

const H2 =({ 
    children, 
    className,
    style
}:textTypes) => (
    <H2Style 
        className={`${className}`}
        style={style}
    >
        {children}
    </H2Style>
)

export default H2
