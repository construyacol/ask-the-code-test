import { LabelContainer } from './styles'
import { ChildrenReactNode } from 'interfaces/utils'

interface labelFlagTypes extends ChildrenReactNode {
    className?:string,
}

function LabelFlag({ children, className = "" }:labelFlagTypes){
    return(
        <LabelContainer className={`${className}`}>
            {children}
        </LabelContainer>
    )
}

export default LabelFlag


