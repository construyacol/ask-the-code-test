import { IconContainer, LabelContainer } from './styles'
import { MdContentCopy } from "react-icons/md";
import { copy as copyAction } from "utils";
import { P } from 'core/components/atoms'

const DEFAULT_CTA = "Copiar"

export default function LabelCopy({ data = '', copy = true, size = 30, children }){
    return(
        <LabelContainer>
            { children && <P className="no-margin number" size={14} >{children}</P>}
            {!copy ? null :
                <IconContainer
                    className="tooltip"
                    data-copy={data}
                    onClick={copyAction}    
                    size={size}
                >
                    <MdContentCopy size={(size*.6)} />
                    <span className="tooltiptext fuente">{DEFAULT_CTA}</span>
                </IconContainer>
            }
        </LabelContainer>
    )
}