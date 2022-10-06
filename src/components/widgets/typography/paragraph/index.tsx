import { Paragraph } from '../styles'
import { textTypes } from "interfaces/shared"

const P =({ 
    children, 
    className,
    style,
    color
}:textTypes) => (
    <Paragraph 
        style={style}
        className={`${className}`}
        color={color}
    >
        {children}
    </Paragraph>
)

export default P
