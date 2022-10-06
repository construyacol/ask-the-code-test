import { H3 as H3Style } from '../styles'
import { textTypes } from "interfaces/shared"

const H3 =({ 
    children, 
    className,
    margin
}:textTypes) => (
    <H3Style 
        className={`${className}`}
        margin={margin}
    >
        {children}
    </H3Style>
)

export default H3
