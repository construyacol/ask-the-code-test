import Paragraph from './styles'
import { textTypes } from "interfaces/shared"

const P =({ children, className }:textTypes) => (
    <Paragraph className={`${className}`}>
        {children}
    </Paragraph>
)

export default P
